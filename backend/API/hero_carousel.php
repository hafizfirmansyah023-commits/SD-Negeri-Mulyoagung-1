<?php
require_once '../config/koneksi.php';

header("Content-Type: application/json");

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
            $stmt = $conn->prepare("SELECT foto FROM hero_carousel WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();
            if ($existing && !empty($existing['foto'])) {
                if (strpos($existing['foto'], 'backend/') === 0) {
                    $relative_photo = '../' . str_replace('backend/', '', $existing['foto']);
                    if (file_exists($relative_photo)) {
                        @unlink($relative_photo);
                    }
                }
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
    if ($id > 0) {
        $stmt = $conn->prepare("SELECT foto FROM hero_carousel WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();
        if ($existing) {
            $foto_path = $existing['foto'];
        }
    }

    // Handle uploaded file
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        if (!empty($foto_path) && strpos($foto_path, 'backend/') === 0) {
            $relative_photo = '../' . str_replace('backend/', '', $foto_path);
            if (file_exists($relative_photo)) {
                @unlink($relative_photo);
            }
        }
        $file_tmp = $_FILES['foto']['tmp_name'];
        $file_name = time() . '_' . basename($_FILES['foto']['name']);
        $target_file = $upload_dir . $file_name;
        if (move_uploaded_file($file_tmp, $target_file)) {
            $foto_path = 'backend/uploads/hero/' . $file_name;
        }
    }

    if (empty($foto_path)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "File foto harus diunggah."]);
        exit();
    }

    try {
        if ($id > 0) {
            $stmt = $conn->prepare("UPDATE hero_carousel SET foto = ?, caption = ?, tag = ?, urutan = ? WHERE id = ?");
            $stmt->execute([$foto_path, $caption, $tag, $urutan, $id]);
            echo json_encode(["status" => "success", "message" => "Foto carousel hero berhasil diperbarui."]);
        } else {
            $stmt = $conn->prepare("INSERT INTO hero_carousel (foto, caption, tag, urutan) VALUES (?, ?, ?, ?)");
            $stmt->execute([$foto_path, $caption, $tag, $urutan]);
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
