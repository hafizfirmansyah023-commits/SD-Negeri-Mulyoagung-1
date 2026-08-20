<?php
/**
 * Rate Limiter untuk Login CMS
 *
 * - Maks 5 percobaan login gagal dalam 10 menit per IP
 * - Setelah itu diblokir selama 5 menit
 * - Percobaan sukses mereset hitungan
 */

class RateLimiter
{
    private PDO $conn;
    private int $maxAttempts;
    private int $windowSeconds;
    private int $lockSeconds;

    public function __construct(PDO $conn, int $maxAttempts = 5, int $windowMinutes = 5, int $lockMinutes = 10)
    {
        $this->conn          = $conn;
        $this->maxAttempts   = $maxAttempts;
        $this->windowSeconds = $windowMinutes * 60;
        $this->lockSeconds   = $lockMinutes * 60;

        $this->ensureTable();
        $this->cleanOldRecords();
    }

    private function ensureTable(): void
    {
        $this->conn->exec("
            CREATE TABLE IF NOT EXISTS login_attempts (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                ip_address  VARCHAR(45)  NOT NULL,
                username    VARCHAR(100) NOT NULL DEFAULT '',
                attempted_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_ip_time (ip_address, attempted_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");
    }

    private function cleanOldRecords(): void
    {
        $cutoff = date('Y-m-d H:i:s', time() - max($this->windowSeconds, $this->lockSeconds));
        $stmt   = $this->conn->prepare("DELETE FROM login_attempts WHERE attempted_at < ?");
        $stmt->execute([$cutoff]);
    }

    public static function getClientIp(): string
    {
        foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'] as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = trim(explode(',', $_SERVER[$key])[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }
        return '0.0.0.0';
    }

    public function check(string $ip): array
{
    $windowStart = date('Y-m-d H:i:s', time() - $this->windowSeconds);
    
    // Menggunakan MAX(attempted_at) untuk mengambil waktu percobaan terbaru
    $stmt = $this->conn->prepare(
        "SELECT COUNT(*) AS cnt, MAX(attempted_at) AS latest FROM login_attempts WHERE ip_address = ? AND attempted_at >= ?"
    );
    $stmt->execute([$ip, $windowStart]);
    $row = $stmt->fetch();
    $attempts = (int) $row['cnt'];

    if ($attempts >= $this->maxAttempts) {
        $latestTs     = strtotime($row['latest']);
        $blockedUntil = $latestTs + $this->lockSeconds;
        $retryAfter   = max(0, $blockedUntil - time());

        // Jika sisa waktu tunggu masih ada, kembalikan status terblokir
        if ($retryAfter > 0) {
            return ['blocked' => true, 'retry_after' => $retryAfter, 'attempts' => $attempts];
        }
    }

    return ['blocked' => false, 'retry_after' => 0, 'attempts' => $attempts];
}

    public function recordFailure(string $ip, string $username = ''): void
    {
        $now = date('Y-m-d H:i:s');
        $stmt = $this->conn->prepare(
            "INSERT INTO login_attempts (ip_address, username, attempted_at) VALUES (?, ?, ?)"
        );
        $stmt->execute([$ip, $username, $now]);
    }

    public function resetOnSuccess(string $ip): void
    {
        $stmt = $this->conn->prepare("DELETE FROM login_attempts WHERE ip_address = ?");
        $stmt->execute([$ip]);
    }

    public static function formatRetry(int $seconds): string
    {
        if ($seconds >= 60) {
            $min = ceil($seconds / 60);
            return "{$min} menit";
        }
        return "{$seconds} detik";
    }
}
?>
