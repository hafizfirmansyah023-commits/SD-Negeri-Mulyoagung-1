<?php
require_once '../config/koneksi.php';

header("Content-Type: application/json");

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
    $stmt = $conn->query("SELECT foto FROM sambutan_kepsek WHERE id = 1");
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
            $foto_path = 'backend/uploads/sambutan/' . $file_name;
        }
    }

    try {
        if ($existing) {
            $stmt = $conn->prepare("UPDATE sambutan_kepsek SET nama = ?, sambutan = ?, foto = ? WHERE id = 1");
            $stmt->execute([$nama, $sambutan, $foto_path]);
        } else {
            $stmt = $conn->prepare("INSERT INTO sambutan_kepsek (id, nama, sambutan, foto) VALUES (1, ?, ?, ?)");
            $stmt->execute([$nama, $sambutan, $foto_path]);
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
