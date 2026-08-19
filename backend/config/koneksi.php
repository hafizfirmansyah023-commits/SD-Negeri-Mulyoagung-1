<?php
// =============================================================
// PROTEKSI API: Hanya izinkan request dari aplikasi
// =============================================================

// Daftar origin yang diizinkan (tambahkan domain produksi di sini)
$allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost',
    'http://127.0.0.1',
    'http://127.0.0.1:3000',
    // 'https://sdn1mulyoagung.sch.id',  // aktifkan untuk produksi
];

// ---- Cek 1: Tolak navigasi langsung browser ----
// Browser modern mengirim Sec-Fetch-Mode: navigate saat user mengetik URL langsung.
// Request fetch/XHR dari React mengirim Sec-Fetch-Mode: cors / same-origin.
$fetchMode = $_SERVER['HTTP_SEC_FETCH_MODE'] ?? '';
$fetchDest = $_SERVER['HTTP_SEC_FETCH_DEST'] ?? '';

if ($fetchMode === 'navigate' || $fetchDest === 'document') {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => '403 Forbidden: Akses langsung tidak diizinkan.']);
    exit();
}

// ---- Cek 2: CORS — hanya origin yang dikenal ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (!empty($origin)) {
    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Vary: Origin");
    } else {
        // Origin tidak dikenal — tolak tanpa mengirim ACAO header
        // Browser akan otomatis memblokir response (SOP)
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => '403 Forbidden: Origin tidak diizinkan.']);
        exit();
    }
}
// Jika tidak ada Origin header (curl/postman/internal):
// Tetap lanjut — karena require_once juga tidak mengirim Origin.
// Proteksi utama untuk ini ada di layer .htaccess (IP restriction).

header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

// Preflight request (OPTIONS) — jawab dan hentikan
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$host = getenv('DB_HOST') ?: "localhost";
$username = getenv('DB_USER') ?: "root";
$password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : "";
$database = getenv('DB_NAME') ?: "db_sdn1mulyoagung";

try {
    $conn = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $e->getMessage()]);
    exit();
}
?>
