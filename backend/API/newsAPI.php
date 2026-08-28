<?php
require_once '../config/koneksi.php';
require_once 'foto_helper.php';

header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

foto_ensure_column($conn, 'berita');

$upload_dir = '../uploads/berita/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // If 'status' is 'all', fetch everything (for dashboard/admin)
    // Otherwise, fetch only Verified (for public frontend)
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'verified_only';

    try {
        if ($status_filter === 'all') {
            $stmt = $conn->query("SELECT b.*, u.nama_penanggung_jawab as uploader FROM berita b LEFT JOIN users u ON b.uploaded_by = u.id ORDER BY b.tanggal DESC, b.id DESC");
        } else {
            $stmt = $conn->query("SELECT b.*, u.nama_penanggung_jawab as uploader FROM berita b LEFT JOIN users u ON b.uploaded_by = u.id WHERE b.status_verifikasi = 'Verified' ORDER BY b.tanggal DESC, b.id DESC");
        }
        $articles = $stmt->fetchAll();
        foto_map_rows($articles);
        echo json_encode(["status" => "success", "data" => $articles]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    if ($action === 'create') {
        $judul = isset($_POST['judul']) ? trim($_POST['judul']) : '';
        $isi = isset($_POST['isi']) ? trim($_POST['isi']) : '';
        $kategori = isset($_POST['kategori']) ? trim($_POST['kategori']) : '';
        $tanggal = isset($_POST['tanggal']) ? trim($_POST['tanggal']) : '';
        $uploaded_by = (isset($_POST['uploaded_by']) && intval($_POST['uploaded_by']) > 0) ? intval($_POST['uploaded_by']) : null;
        $role = isset($_POST['role']) ? trim($_POST['role']) : 'TIM';

        if (empty($judul) || empty($isi) || empty($kategori) || empty($tanggal)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Kolom judul, isi, kategori, dan tanggal wajib diisi."]);
            exit();
        }

        // Handle file upload
        $has_original = isset($_FILES['foto_original']) && $_FILES['foto_original']['error'] === UPLOAD_ERR_OK;
        $has_crop = isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK;
        if (!$has_original && !$has_crop) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "File foto wajib diunggah."]);
            exit();
        }

        [$foto_path, $foto_crop_path] = foto_handle_create($upload_dir, 'backend/uploads/berita/');

        // Verification status based on role
        $status_verifikasi = ($role === 'ADMIN') ? 'Verified' : 'Pending';

        try {
            $stmt = $conn->prepare("INSERT INTO berita (judul, isi, foto, foto_crop, kategori, tanggal, status_verifikasi, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$judul, $isi, $foto_path, $foto_crop_path, $kategori, $tanggal, $status_verifikasi, $uploaded_by]);
            echo json_encode(["status" => "success", "message" => "Berita berhasil ditambahkan" . ($status_verifikasi === 'Pending' ? " dan menunggu verifikasi admin." : ".")]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } 
    elseif ($action === 'update') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $judul = isset($_POST['judul']) ? trim($_POST['judul']) : '';
        $isi = isset($_POST['isi']) ? trim($_POST['isi']) : '';
        $kategori = isset($_POST['kategori']) ? trim($_POST['kategori']) : '';
        $tanggal = isset($_POST['tanggal']) ? trim($_POST['tanggal']) : '';
        $role = isset($_POST['role']) ? trim($_POST['role']) : 'TIM';

        if ($id === 0 || empty($judul) || empty($isi) || empty($kategori) || empty($tanggal)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap untuk pembaruan."]);
            exit();
        }

        $stmt = $conn->prepare("SELECT foto, foto_crop, status_verifikasi FROM berita WHERE id = ?");
        $stmt->execute([$id]);
        $article = $stmt->fetch();
        if (!$article) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Berita tidak ditemukan."]);
            exit();
        }

        [$foto_path, $foto_crop_path] = foto_handle_update($upload_dir, 'backend/uploads/berita/', $article['foto'], $article['foto_crop'] ?? '');

        // If updated by TIM, revert back to Pending verification
        $status_verifikasi = ($role === 'ADMIN') ? $article['status_verifikasi'] : 'Pending';

        try {
            $stmt = $conn->prepare("UPDATE berita SET judul = ?, isi = ?, foto = ?, foto_crop = ?, kategori = ?, tanggal = ?, status_verifikasi = ? WHERE id = ?");
            $stmt->execute([$judul, $isi, $foto_path, $foto_crop_path, $kategori, $tanggal, $status_verifikasi, $id]);
            echo json_encode(["status" => "success", "message" => "Berita berhasil diperbarui" . ($status_verifikasi === 'Pending' ? " dan menunggu verifikasi admin." : ".")]);
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
            $stmt = $conn->prepare("SELECT foto, foto_crop FROM berita WHERE id = ?");
            $stmt->execute([$id]);
            $article = $stmt->fetch();
            if ($article) {
                foto_unlink($article['foto']);
                foto_unlink($article['foto_crop'] ?? '');
            }

            $stmt = $conn->prepare("DELETE FROM berita WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Berita berhasil dihapus."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } 
    elseif ($action === 'verify') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $status_verifikasi = isset($_POST['status_verifikasi']) ? trim($_POST['status_verifikasi']) : ''; // Verified or Rejected

        if ($id === 0 || !in_array($status_verifikasi, ['Verified', 'Rejected'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Input verifikasi tidak valid."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("UPDATE berita SET status_verifikasi = ? WHERE id = ?");
            $stmt->execute([$status_verifikasi, $id]);
            echo json_encode(["status" => "success", "message" => "Status verifikasi berita berhasil diperbarui menjadi $status_verifikasi."]);
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
