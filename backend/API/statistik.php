<?php
require_once '../config/koneksi.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get all statistik
    try {
        $stmt = $conn->query("SELECT * FROM statistik_sekolah ORDER BY id ASC");
        $statistik = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $statistik]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
elseif ($method === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    if ($action === 'create') {
        $judul = isset($_POST['judul']) ? trim($_POST['judul']) : '';
        $jumlah = isset($_POST['jumlah']) ? trim($_POST['jumlah']) : '';
        $label = isset($_POST['label']) ? trim($_POST['label']) : '';

        if (empty($judul) || empty($jumlah) || empty($label)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Kolom judul, jumlah, dan label wajib diisi."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("INSERT INTO statistik_sekolah (judul, jumlah, label) VALUES (?, ?, ?)");
            $stmt->execute([$judul, $jumlah, $label]);
            echo json_encode(["status" => "success", "message" => "Statistik berhasil ditambahkan."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    elseif ($action === 'update') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $judul = isset($_POST['judul']) ? trim($_POST['judul']) : '';
        $jumlah = isset($_POST['jumlah']) ? trim($_POST['jumlah']) : '';
        $label = isset($_POST['label']) ? trim($_POST['label']) : '';

        if ($id === 0 || empty($judul) || empty($jumlah) || empty($label)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap untuk pembaruan."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("SELECT id FROM statistik_sekolah WHERE id = ?");
            $stmt->execute([$id]);
            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Data statistik tidak ditemukan."]);
                exit();
            }

            $stmt = $conn->prepare("UPDATE statistik_sekolah SET judul = ?, jumlah = ?, label = ? WHERE id = ?");
            $stmt->execute([$judul, $jumlah, $label, $id]);
            echo json_encode(["status" => "success", "message" => "Data statistik berhasil diperbarui."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    elseif ($action === 'delete') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

        if ($id === 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID tidak valid."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("DELETE FROM statistik_sekolah WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Data statistik berhasil dihapus."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Aksi tidak dikenal."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode request tidak diizinkan."]);
}
?>