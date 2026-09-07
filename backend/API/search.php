<?php
require_once __DIR__ . '/../config/koneksi.php';
require_once __DIR__ . '/foto_helper.php';

header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

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
$limit = $is_cms ? 20 : 12;

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

// 1. Berita
try {
    $where = $is_cms
        ? "(b.judul LIKE ? OR b.isi LIKE ? OR b.kategori LIKE ? OR u.nama_penanggung_jawab LIKE ?)"
        : "b.status_verifikasi = 'Verified' AND (b.judul LIKE ? OR b.isi LIKE ? OR b.kategori LIKE ? OR u.nama_penanggung_jawab LIKE ?)";

    $stmt = $conn->prepare("SELECT b.id, b.judul, b.isi, b.foto, b.foto_crop, b.kategori, b.tanggal, b.status_verifikasi, u.nama_penanggung_jawab as uploader FROM berita b LEFT JOIN users u ON b.uploaded_by = u.id WHERE $where ORDER BY b.tanggal DESC, b.id DESC LIMIT $limit");
    $stmt->execute([$param, $param, $param, $param]);
    $beritaList = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foto_map_rows($beritaList);
    $results['berita'] = $beritaList;
} catch (Exception $e) {
    // Fallback simple query without join
    try {
        $stmt = $conn->prepare("SELECT id, judul, isi, foto, foto_crop, kategori, tanggal, status_verifikasi FROM berita WHERE judul LIKE ? OR isi LIKE ? OR kategori LIKE ? ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param]);
        $beritaList = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foto_map_rows($beritaList);
        $results['berita'] = $beritaList;
    } catch (Exception $e2) {}
}

// 2. Galeri
try {
    $where = $is_cms
        ? "(g.judul LIKE ? OR g.deskripsi LIKE ? OR g.kategori LIKE ? OR u.nama_penanggung_jawab LIKE ?)"
        : "g.status_verifikasi = 'Verified' AND (g.judul LIKE ? OR g.deskripsi LIKE ? OR g.kategori LIKE ? OR u.nama_penanggung_jawab LIKE ?)";

    $stmt = $conn->prepare("SELECT g.id, g.judul, g.deskripsi, g.foto, g.foto_crop, g.kategori, g.tanggal, g.status_verifikasi, u.nama_penanggung_jawab as uploader FROM galeri g LEFT JOIN users u ON g.uploaded_by = u.id WHERE $where ORDER BY g.tanggal DESC, g.id DESC LIMIT $limit");
    $stmt->execute([$param, $param, $param, $param]);
    $galeriList = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foto_map_rows($galeriList);
    $results['galeri'] = $galeriList;
} catch (Exception $e) {
    try {
        $stmt = $conn->prepare("SELECT id, judul, deskripsi, foto, foto_crop, kategori, tanggal, status_verifikasi FROM galeri WHERE judul LIKE ? OR deskripsi LIKE ? OR kategori LIKE ? ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param]);
        $galeriList = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foto_map_rows($galeriList);
        $results['galeri'] = $galeriList;
    } catch (Exception $e2) {}
}

// 3. Modul Pembelajaran
try {
    $modul_gate = $is_cms ? "" : "EXISTS (SELECT 1 FROM akademik_menu am WHERE am.is_modul = 1 AND am.aktif = 1) AND ";
    $where = $is_cms
        ? "(m.judul LIKE ? OR m.deskripsi LIKE ? OR m.mata_pelajaran LIKE ? OR m.kelas LIKE ? OR m.kategori LIKE ? OR m.semester LIKE ? OR m.tahun_ajaran LIKE ? OR u.nama_penanggung_jawab LIKE ?)"
        : "m.status_verifikasi = 'Verified' AND m.status = 'Published' AND {$modul_gate}(m.judul LIKE ? OR m.deskripsi LIKE ? OR m.mata_pelajaran LIKE ? OR m.kelas LIKE ? OR m.kategori LIKE ? OR m.semester LIKE ? OR m.tahun_ajaran LIKE ? OR u.nama_penanggung_jawab LIKE ?)";

    $stmt = $conn->prepare("SELECT m.id, m.judul, m.deskripsi, m.mata_pelajaran, m.kelas, m.semester, m.tahun_ajaran, m.kategori, m.sumber_tipe, m.file_pdf, m.link_gdrive, m.foto_cover, m.foto_cover_crop, m.status, m.status_verifikasi, u.nama_penanggung_jawab as uploader FROM modul_pembelajaran m LEFT JOIN users u ON m.uploaded_by = u.id WHERE $where ORDER BY m.id DESC LIMIT $limit");
    $stmt->execute([$param, $param, $param, $param, $param, $param, $param, $param]);
    $modulList = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($modulList as &$mod) {
        $mod['foto'] = !empty($mod['foto_cover_crop']) ? $mod['foto_cover_crop'] : ($mod['foto_cover'] ?? null);
    }
    $results['modul'] = $modulList;
} catch (Exception $e) {
    try {
        $stmt = $conn->prepare("SELECT id, judul, deskripsi, mata_pelajaran, kelas, semester, tahun_ajaran, kategori, sumber_tipe, file_pdf, link_gdrive, foto_cover, foto_cover_crop, status, status_verifikasi FROM modul_pembelajaran WHERE judul LIKE ? OR deskripsi LIKE ? OR mata_pelajaran LIKE ? OR kelas LIKE ? OR kategori LIKE ? ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param, $param, $param]);
        $modulList = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($modulList as &$mod) {
            $mod['foto'] = !empty($mod['foto_cover_crop']) ? $mod['foto_cover_crop'] : ($mod['foto_cover'] ?? null);
        }
        $results['modul'] = $modulList;
    } catch (Exception $e2) {}
}

// 4. Guru & Tendik
try {
    $stmt = $conn->prepare("SELECT id, nama, jabatan, tugas, nip, foto, foto_crop, riwayat_pendidikan, motto, jenis_kelamin, status FROM guru_tendik WHERE nama LIKE ? OR jabatan LIKE ? OR tugas LIKE ? OR nip LIKE ? ORDER BY id ASC LIMIT $limit");
    $stmt->execute([$param, $param, $param, $param]);
    $guruList = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foto_map_rows($guruList);
    $results['guru'] = $guruList;
} catch (Exception $e) {}

// 5. Inovasi
try {
    $where = $is_cms
        ? "(i.judul LIKE ? OR i.deskripsi LIKE ? OR i.kategori LIKE ? OR i.inovator LIKE ? OR u.nama_penanggung_jawab LIKE ?)"
        : "i.status_verifikasi = 'Verified' AND i.status = 'Published' AND (i.judul LIKE ? OR i.deskripsi LIKE ? OR i.kategori LIKE ? OR i.inovator LIKE ? OR u.nama_penanggung_jawab LIKE ?)";

    $stmt = $conn->prepare("SELECT i.id, i.judul, i.kategori, i.inovator, i.deskripsi, i.link_drive, i.foto_cover, i.foto_cover_crop, i.status, i.status_verifikasi, i.created_at, u.nama_penanggung_jawab as uploader FROM inovasi i LEFT JOIN users u ON i.uploaded_by = u.id WHERE $where ORDER BY i.id DESC LIMIT $limit");
    $stmt->execute([$param, $param, $param, $param, $param]);
    $inovasiList = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($inovasiList as &$inov) {
        $inov['foto'] = !empty($inov['foto_cover_crop']) ? $inov['foto_cover_crop'] : ($inov['foto_cover'] ?? null);
    }
    $results['inovasi'] = $inovasiList;
} catch (Exception $e) {}

// 6. Akademik Menu
try {
    $where = $is_cms
        ? "(m.label LIKE ? OR m.deskripsi LIKE ? OR p.label LIKE ?)"
        : "m.aktif = 1 AND (m.label LIKE ? OR m.deskripsi LIKE ? OR p.label LIKE ?)";

    $stmt = $conn->prepare("SELECT m.id, m.label, m.deskripsi, m.parent_id, m.link_gdrive, m.is_modul, m.aktif, p.label as parent_label FROM akademik_menu m LEFT JOIN akademik_menu p ON m.parent_id = p.id WHERE $where ORDER BY COALESCE(m.parent_id, 0), m.urutan ASC LIMIT $limit");
    $stmt->execute([$param, $param, $param]);
    $results['akademik'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {}

// 7. Fasilitas
try {
    $stmt = $conn->prepare("SELECT id, judul, deskripsi, foto, foto_crop FROM fasilitas WHERE judul LIKE ? OR deskripsi LIKE ? ORDER BY id DESC LIMIT $limit");
    $stmt->execute([$param, $param]);
    $fasilitasList = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foto_map_rows($fasilitasList);
    $results['fasilitas'] = $fasilitasList;
} catch (Exception $e) {}

if ($is_cms) {
    try {
        // 8. Users
        $stmt = $conn->prepare("SELECT id, nama_penanggung_jawab, username, email, role, status FROM users WHERE nama_penanggung_jawab LIKE ? OR username LIKE ? OR email LIKE ? OR role LIKE ? ORDER BY id DESC LIMIT $limit");
        $stmt->execute([$param, $param, $param, $param]);
        $results['users'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {}

    try {
        // 9. Pengumuman
        $stmt = $conn->prepare("SELECT id, judul, isi, tanggal, status FROM pengumuman_penting WHERE judul LIKE ? OR isi LIKE ? LIMIT $limit");
        $stmt->execute([$param, $param]);
        $results['pengumuman'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {}
}

echo json_encode(["status" => "success", "data" => $results]);
?>
