<?php
require_once '../config/koneksi.php';
require_once 'foto_helper.php';

header("Content-Type: application/json");

foto_ensure_column($conn, 'hero_carousel');

// Ensure upload directory exists for hero carousel
$upload_dir = '../uploads/hero/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

// Auto-migrate database table for hero carousel
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS hero_carousel (
        id INT AUTO_INCREMENT PRIMARY KEY,
        foto VARCHAR(255) NOT NULL,
        foto_crop VARCHAR(255) NULL,
        caption VARCHAR(255) NOT NULL,
        tag VARCHAR(100) DEFAULT 'Kegiatan Utama',
        urutan INT DEFAULT 0,
        is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
} catch (Exception $e) {}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM hero_carousel WHERE is_active = 1 ORDER BY urutan ASC, id DESC");
        $data = $stmt->fetchAll();
        foto_map_rows($data);
        echo json_encode(["status" => "success", "data" => $data]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $caption = isset($_POST['caption']) ? trim($_POST['caption']) : '';
    $tag = isset($_POST['tag']) ? trim($_POST['tag']) : 'Kegiatan Utama';
    $urutan = isset($_POST['urutan']) ? intval($_POST['urutan']) : 0;
    $action = isset($_POST['action']) ? $_POST['action'] : 'save';

    if ($action === 'reorder') {
        $rawItems = isset($_POST['items']) ? $_POST['items'] : '';
        $items = json_decode($rawItems, true);
        if (is_array($items)) {
            try {
                $stmt = $conn->prepare("UPDATE hero_carousel SET urutan = ? WHERE id = ?");
                foreach ($items as $index => $item) {
                    if (isset($item['id'])) {
                        $newOrder = isset($item['urutan']) ? intval($item['urutan']) : ($index + 1);
                        $stmt->execute([$newOrder, intval($item['id'])]);
                    }
                }
                echo json_encode(["status" => "success", "message" => "Urutan foto carousel berhasil diperbarui."]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
            exit();
        }
    }

    if ($action === 'delete') {
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID tidak valid."]);
            exit();
        }
        try {
            $stmt = $conn->prepare("SELECT foto, foto_crop FROM hero_carousel WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();
            if ($existing) {
                if (strpos($existing['foto'], 'backend/') === 0) foto_unlink($existing['foto']);
                if (strpos($existing['foto_crop'] ?? '', 'backend/') === 0) foto_unlink($existing['foto_crop']);
            }
            $delStmt = $conn->prepare("DELETE FROM hero_carousel WHERE id = ?");
            $delStmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Foto carousel hero berhasil dihapus."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        exit();
    }

    if (empty($caption)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Caption foto tidak boleh kosong."]);
        exit();
    }

    // Handle existing photo
    $foto_path = '';
    $foto_crop_path = '';
    if ($id > 0) {
        $stmt = $conn->prepare("SELECT foto, foto_crop FROM hero_carousel WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();
        if ($existing) {
            $foto_path = $existing['foto'];
            $foto_crop_path = $existing['foto_crop'] ?? '';
        }
    }

    $has_original = foto_has_upload('foto_original');
    $has_crop = foto_has_upload('foto');
    if ($has_original || $has_crop) {
        if ($id > 0) {
            [$foto_path, $foto_crop_path] = foto_handle_update($upload_dir, 'backend/uploads/hero/', $foto_path, $foto_crop_path);
        } else {
            [$foto_path, $foto_crop_path] = foto_handle_create($upload_dir, 'backend/uploads/hero/');
        }
    }

    if (empty($foto_path) && empty($foto_crop_path)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "File foto harus diunggah."]);
        exit();
    }

    try {
        if ($id > 0) {
            $stmt = $conn->prepare("UPDATE hero_carousel SET foto = ?, foto_crop = ?, caption = ?, tag = ?, urutan = ? WHERE id = ?");
            $stmt->execute([$foto_path, $foto_crop_path, $caption, $tag, $urutan, $id]);
            echo json_encode(["status" => "success", "message" => "Foto carousel hero berhasil diperbarui."]);
        } else {
            $stmt = $conn->prepare("INSERT INTO hero_carousel (foto, foto_crop, caption, tag, urutan) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$foto_path, $foto_crop_path, $caption, $tag, $urutan]);
            echo json_encode(["status" => "success", "message" => "Foto carousel hero baru berhasil ditambahkan."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode request tidak diizinkan."]);
}
?>
