<?php
require_once '../config/koneksi.php';
require_once 'foto_helper.php';

header("Content-Type: application/json");

foto_ensure_column($conn, 'pengumuman_penting');

// Ensure upload directory exists
$upload_dir = '../uploads/pengumuman/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

// Auto-migrate database table columns for date limits
try {
    $conn->exec("ALTER TABLE pengumuman_penting ADD COLUMN tanggal_mulai DATE NULL");
} catch (Exception $e) {}

try {
    $conn->exec("ALTER TABLE pengumuman_penting ADD COLUMN tanggal_selesai DATE NULL");
} catch (Exception $e) {}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM pengumuman_penting WHERE id = 1");
        $data = $stmt->fetch();
        if ($data) {
            $today = date('Y-m-d');
            $is_expired = false;

            // Check expiration if tanggal_selesai is set
            if (!empty($data['tanggal_selesai']) && $today > $data['tanggal_selesai']) {
                $is_expired = true;
            }

            // For public consumption, if expired, treat is_active as 0
            $data['is_expired'] = $is_expired;
            if ($is_expired) {
                $data['public_active'] = 0;
            } else {
                $data['public_active'] = intval($data['is_active']);
            }

            foto_map_row($data);
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
    
    $tanggal_mulai = !empty($_POST['tanggal_mulai']) ? $_POST['tanggal_mulai'] : NULL;
    $tanggal_selesai = !empty($_POST['tanggal_selesai']) ? $_POST['tanggal_selesai'] : NULL;

    if (empty($judul) || empty($isi)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Judul dan isi pengumuman tidak boleh kosong."]);
        exit();
    }

    // Fetch existing record to check for old photo
    $stmt = $conn->query("SELECT foto, foto_crop FROM pengumuman_penting WHERE id = 1");
    $existing = $stmt->fetch();
    $foto_path = $existing ? $existing['foto'] : '';
    $foto_crop_path = $existing ? ($existing['foto_crop'] ?? '') : '';

    // Handle file upload
    if (foto_has_upload('foto_original')) {
        foto_unlink($foto_path);
        foto_unlink($foto_crop_path);
        $foto_path = foto_save_file('foto_original', $upload_dir, 'backend/uploads/pengumuman/');
        $foto_crop_path = foto_save_file('foto', $upload_dir, 'backend/uploads/pengumuman/');
    } elseif (foto_has_upload('foto')) {
        foto_unlink($foto_crop_path);
        $foto_crop_path = foto_save_file('foto', $upload_dir, 'backend/uploads/pengumuman/');
    }

    try {
        if ($existing) {
            $stmt = $conn->prepare("UPDATE pengumuman_penting SET judul = ?, isi = ?, running_text = ?, show_popup = ?, show_button = ?, button_text = ?, button_link = ?, show_photo = ?, foto = ?, foto_crop = ?, photo_link = ?, is_active = ?, tanggal_mulai = ?, tanggal_selesai = ? WHERE id = 1");
            $stmt->execute([$judul, $isi, $running_text, $show_popup, $show_button, $button_text, $button_link, $show_photo, $foto_path, $foto_crop_path, $photo_link, $is_active, $tanggal_mulai, $tanggal_selesai]);
        } else {
            $stmt = $conn->prepare("INSERT INTO pengumuman_penting (id, judul, isi, running_text, show_popup, show_button, button_text, button_link, show_photo, foto, foto_crop, photo_link, is_active, tanggal_mulai, tanggal_selesai) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$judul, $isi, $running_text, $show_popup, $show_button, $button_text, $button_link, $show_photo, $foto_path, $foto_crop_path, $photo_link, $is_active, $tanggal_mulai, $tanggal_selesai]);
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
