<?php
require_once '../config/koneksi.php';
require_once 'foto_helper.php';

header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode request tidak diizinkan."]);
    exit();
}

$query = isset($_GET['q']) ? trim($_GET['q']) : '';
$is_cms = (isset($_GET['status']) && $_GET['status'] === 'all') || (isset($_GET['cms']) && $_GET['cms'] === '1');

if (empty($query)) {
    echo json_encode([
        "status" => "success",
        "data" => [
            "berita" => [],
            "galeri" => [],
            "modul" => [],
            "guru" => [],
            "inovasi" => [],
            "akademik" => [],
            "fasilitas" => [],
            "users" => [],
            "pengumuman" => []
        ]
    ]);
    exit();
}

$param = '%' . $query . '%';
$limit = $is_cms ? 15 : 10;

$results = [
    "berita" => [],
    "galeri" => [],
    "modul" => [],
    "guru" => [],
    "inovasi" => [],
    "akademik" => [],
    "fasilitas" => [],
    "users" => [],
    "pengumuman" => []
];

try {
    // 1. Berita
    if ($is_cms) {
        $stmt = $conn->prepare("SELECT id, judul, isi, foto, foto_crop, kategori, tanggal, uploader, status_verifikasi FROM berita WHERE (judul LIKE ? OR isi LIKE ? OR kategori LIKE ? OR uploader LIKE ?) ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param, $param]);
    } else {
        $stmt = $conn->prepare("SELECT id, judul, isi, foto, foto_crop, kategori, tanggal, uploader FROM berita WHERE status_verifikasi = 'Verified' AND (judul LIKE ? OR isi LIKE ? OR kategori LIKE ? OR uploader LIKE ?) ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param, $param]);
    }
    $beritaList = $stmt->fetchAll();
    foto_map_rows($beritaList);
    $results['berita'] = $beritaList;
} catch (Exception $e) {}

try {
    // 2. Galeri
    if ($is_cms) {
        $stmt = $conn->prepare("SELECT id, judul, deskripsi, foto, foto_crop, kategori, tanggal, status_verifikasi FROM galeri WHERE (judul LIKE ? OR deskripsi LIKE ? OR kategori LIKE ?) ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param]);
    } else {
        $stmt = $conn->prepare("SELECT id, judul, deskripsi, foto, foto_crop, kategori, tanggal FROM galeri WHERE status_verifikasi = 'Verified' AND (judul LIKE ? OR deskripsi LIKE ? OR kategori LIKE ?) ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param]);
    }
    $galeriList = $stmt->fetchAll();
    foto_map_rows($galeriList);
    $results['galeri'] = $galeriList;
} catch (Exception $e) {}

try {
    // 3. Modul Pembelajaran
    if ($is_cms) {
        $stmt = $conn->prepare("SELECT id, judul, deskripsi, mata_pelajaran, kelas, semester, kategori, sumber_tipe, file_pdf, link_gdrive, foto_cover, foto_cover_crop, uploader, status, status_verifikasi FROM modul_pembelajaran WHERE (judul LIKE ? OR deskripsi LIKE ? OR mata_pelajaran LIKE ? OR kelas LIKE ? OR kategori LIKE ? OR uploader LIKE ?) ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param, $param, $param, $param]);
    } else {
        $stmt = $conn->prepare("SELECT id, judul, deskripsi, mata_pelajaran, kelas, semester, kategori, sumber_tipe, file_pdf, link_gdrive, foto_cover, foto_cover_crop, uploader FROM modul_pembelajaran WHERE status_verifikasi = 'Verified' AND status = 'Published' AND (judul LIKE ? OR deskripsi LIKE ? OR mata_pelajaran LIKE ? OR kelas LIKE ? OR kategori LIKE ? OR uploader LIKE ?) ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param, $param, $param, $param]);
    }
    $modulList = $stmt->fetchAll();
    foreach ($modulList as &$mod) {
        $mod['foto'] = !empty($mod['foto_cover_crop']) ? $mod['foto_cover_crop'] : ($mod['foto_cover'] ?? null);
    }
    $results['modul'] = $modulList;
} catch (Exception $e) {}

try {
    // 4. Guru & Tendik
    $stmt = $conn->prepare("SELECT id, nama, jabatan, tugas, nip, foto, foto_crop, riwayat_pendidikan, motto, jenis_kelamin, status FROM guru_tendik WHERE nama LIKE ? OR jabatan LIKE ? OR tugas LIKE ? OR nip LIKE ? ORDER BY id ASC LIMIT $limit");
    $stmt->execute([$param, $param, $param, $param]);
    $guruList = $stmt->fetchAll();
    foto_map_rows($guruList);
    $results['guru'] = $guruList;
} catch (Exception $e) {}

try {
    // 5. Inovasi
    if ($is_cms) {
        $stmt = $conn->prepare("SELECT i.id, i.judul, i.kategori, i.inovator, i.deskripsi, i.link_drive, i.foto_cover, i.foto_cover_crop, i.status, i.status_verifikasi, i.created_at, u.nama_penanggung_jawab as uploader FROM inovasi i LEFT JOIN users u ON i.uploaded_by = u.id WHERE (i.judul LIKE ? OR i.deskripsi LIKE ? OR i.kategori LIKE ? OR i.inovator LIKE ?) ORDER BY i.id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param, $param]);
    } else {
        $stmt = $conn->prepare("SELECT i.id, i.judul, i.kategori, i.inovator, i.deskripsi, i.link_drive, i.foto_cover, i.foto_cover_crop, i.created_at, u.nama_penanggung_jawab as uploader FROM inovasi i LEFT JOIN users u ON i.uploaded_by = u.id WHERE i.status_verifikasi = 'Verified' AND i.status = 'Published' AND (i.judul LIKE ? OR i.deskripsi LIKE ? OR i.kategori LIKE ? OR i.inovator LIKE ?) ORDER BY i.id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param, $param]);
    }
    $inovasiList = $stmt->fetchAll();
    foreach ($inovasiList as &$inov) {
        $inov['foto'] = !empty($inov['foto_cover_crop']) ? $inov['foto_cover_crop'] : ($inov['foto_cover'] ?? null);
    }
    $results['inovasi'] = $inovasiList;
} catch (Exception $e) {}

try {
    // 6. Akademik Menu
    if ($is_cms) {
        $stmt = $conn->prepare("SELECT m.id, m.label, m.deskripsi, m.parent_id, m.link_gdrive, m.is_modul, m.aktif, p.label as parent_label FROM akademik_menu m LEFT JOIN akademik_menu p ON m.parent_id = p.id WHERE (m.label LIKE ? OR m.deskripsi LIKE ? OR p.label LIKE ?) ORDER BY COALESCE(m.parent_id, 0), m.urutan ASC LIMIT $limit");
        $stmt->execute([$param, $param, $param]);
    } else {
        $stmt = $conn->prepare("SELECT m.id, m.label, m.deskripsi, m.parent_id, m.link_gdrive, m.is_modul, p.label as parent_label FROM akademik_menu m LEFT JOIN akademik_menu p ON m.parent_id = p.id WHERE m.aktif = 1 AND (m.label LIKE ? OR m.deskripsi LIKE ? OR p.label LIKE ?) ORDER BY COALESCE(m.parent_id, 0), m.urutan ASC LIMIT $limit");
        $stmt->execute([$param, $param, $param]);
    }
    $results['akademik'] = $stmt->fetchAll();
} catch (Exception $e) {}

try {
    // 7. Fasilitas
    $stmt = $conn->prepare("SELECT id, judul, deskripsi, foto, foto_crop FROM fasilitas WHERE judul LIKE ? OR deskripsi LIKE ? ORDER BY id DESC LIMIT $limit");
    $stmt->execute([$param, $param]);
    $fasilitasList = $stmt->fetchAll();
    foto_map_rows($fasilitasList);
    $results['fasilitas'] = $fasilitasList;
} catch (Exception $e) {}

if ($is_cms) {
    try {
        // 8. Users (CMS only)
        $stmt = $conn->prepare("SELECT id, nama_penanggung_jawab, username, email, role, status FROM users WHERE nama_penanggung_jawab LIKE ? OR username LIKE ? OR email LIKE ? OR role LIKE ? ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param, $param]);
        $results['users'] = $stmt->fetchAll();
    } catch (Exception $e) {}

    try {
        // 9. Pengumuman (CMS only)
        $stmt = $conn->prepare("SELECT id, judul, isi, tanggal, status FROM pengumuman_penting WHERE judul LIKE ? OR isi LIKE ? LIMIT $limit");
        $stmt->execute([$param, $param]);
        $results['pengumuman'] = $stmt->fetchAll();
    } catch (Exception $e) {}
}

echo json_encode(["status" => "success", "data" => $results]);
?>
