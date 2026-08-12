<?php
require_once '../config/koneksi.php';
require_once 'foto_helper.php';

header("Content-Type: application/json");

foto_ensure_column($conn, 'sambutan_kepsek');

// Ensure upload directory exists
$upload_dir = '../uploads/sambutan/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM sambutan_kepsek WHERE id = 1");
        $data = $stmt->fetch();
        if ($data) {
            foto_map_row($data);
            echo json_encode(["status" => "success", "data" => $data]);
        } else {
            // Fallback if empty database
            echo json_encode(["status" => "error", "message" => "Data tidak ditemukan"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $nama = isset($_POST['nama']) ? trim($_POST['nama']) : '';
    $sambutan = isset($_POST['sambutan']) ? trim($_POST['sambutan']) : '';

    if (empty($nama) || empty($sambutan)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Nama dan isi sambutan tidak boleh kosong."]);
        exit();
    }

    // Fetch existing record to check for old photo
    $stmt = $conn->query("SELECT foto, foto_crop FROM sambutan_kepsek WHERE id = 1");
    $existing = $stmt->fetch();
    $foto_path = $existing ? $existing['foto'] : '';
    $foto_crop_path = $existing ? ($existing['foto_crop'] ?? '') : '';

    // Handle file upload
    if (foto_has_upload('foto_original')) {
        foto_unlink($foto_path);
        foto_unlink($foto_crop_path);
        $foto_path = foto_save_file('foto_original', $upload_dir, 'backend/uploads/sambutan/');
        $foto_crop_path = foto_save_file('foto', $upload_dir, 'backend/uploads/sambutan/');
    } elseif (foto_has_upload('foto')) {
        foto_unlink($foto_crop_path);
        $foto_crop_path = foto_save_file('foto', $upload_dir, 'backend/uploads/sambutan/');
    }

    try {
        if ($existing) {
            $stmt = $conn->prepare("UPDATE sambutan_kepsek SET nama = ?, sambutan = ?, foto = ?, foto_crop = ? WHERE id = 1");
            $stmt->execute([$nama, $sambutan, $foto_path, $foto_crop_path]);
        } else {
            $stmt = $conn->prepare("INSERT INTO sambutan_kepsek (id, nama, sambutan, foto, foto_crop) VALUES (1, ?, ?, ?, ?)");
            $stmt->execute([$nama, $sambutan, $foto_path, $foto_crop_path]);
        }
        echo json_encode(["status" => "success", "message" => "Sambutan Kepala Sekolah berhasil diperbarui."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode request tidak diizinkan."]);
}
?>
