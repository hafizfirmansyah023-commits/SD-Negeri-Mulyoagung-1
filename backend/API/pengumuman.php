<?php
require_once '../config/koneksi.php';

header("Content-Type: application/json");

// Ensure upload directory exists
$upload_dir = '../uploads/pengumuman/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM pengumuman_penting WHERE id = 1");
        $data = $stmt->fetch();
        if ($data) {
            echo json_encode(["status" => "success", "data" => $data]);
        } else {
            echo json_encode(["status" => "error", "message" => "Data pengumuman tidak ditemukan."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $judul = isset($_POST['judul']) ? trim($_POST['judul']) : '';
    $isi = isset($_POST['isi']) ? trim($_POST['isi']) : '';
    $running_text = isset($_POST['running_text']) ? trim($_POST['running_text']) : '';
    
    $show_popup = isset($_POST['show_popup']) ? intval($_POST['show_popup']) : 0;
    $show_button = isset($_POST['show_button']) ? intval($_POST['show_button']) : 0;
    $button_text = isset($_POST['button_text']) ? trim($_POST['button_text']) : '';
    $button_link = isset($_POST['button_link']) ? trim($_POST['button_link']) : '';
    
    $show_photo = isset($_POST['show_photo']) ? intval($_POST['show_photo']) : 0;
    $photo_link = isset($_POST['photo_link']) ? trim($_POST['photo_link']) : '';
    
    $is_active = isset($_POST['is_active']) ? intval($_POST['is_active']) : 0;

    if (empty($judul) || empty($isi)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Judul dan isi pengumuman tidak boleh kosong."]);
        exit();
    }

    // Fetch existing record to check for old photo
    $stmt = $conn->query("SELECT foto FROM pengumuman_penting WHERE id = 1");
    $existing = $stmt->fetch();
    $foto_path = $existing ? $existing['foto'] : '';

    // Handle file upload
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        // Delete old photo if it is a local file (starts with backend/)
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
            $foto_path = 'backend/uploads/pengumuman/' . $file_name;
        }
    }

    try {
        if ($existing) {
            $stmt = $conn->prepare("UPDATE pengumuman_penting SET judul = ?, isi = ?, running_text = ?, show_popup = ?, show_button = ?, button_text = ?, button_link = ?, show_photo = ?, foto = ?, photo_link = ?, is_active = ? WHERE id = 1");
            $stmt->execute([$judul, $isi, $running_text, $show_popup, $show_button, $button_text, $button_link, $show_photo, $foto_path, $photo_link, $is_active]);
        } else {
            $stmt = $conn->prepare("INSERT INTO pengumuman_penting (id, judul, isi, running_text, show_popup, show_button, button_text, button_link, show_photo, foto, photo_link, is_active) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$judul, $isi, $running_text, $show_popup, $show_button, $button_text, $button_link, $show_photo, $foto_path, $photo_link, $is_active]);
        }
        echo json_encode(["status" => "success", "message" => "Pengumuman Penting berhasil diperbarui."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode request tidak diizinkan."]);
}
?>
