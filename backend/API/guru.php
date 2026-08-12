<?php
require_once '../config/koneksi.php';
require_once 'foto_helper.php';

header("Content-Type: application/json");

foto_ensure_column($conn, 'guru_tendik');

$upload_dir = '../uploads/guru/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {

    try {
        $stmt = $conn->query("SELECT * FROM guru_tendik ORDER BY id DESC");
        $teachers = $stmt->fetchAll();
        foto_map_rows($teachers);

        $roleOrder = [
            'Kepala Sekolah'       => 1,
            'Komite Sekolah'       => 2,
            'Tata Usaha'           => 3,
            'Guru Wali Kelas'      => 4,
            'Guru Mata Pelajaran'  => 5,
            'Tenaga Kependidikan'  => 6,
        ];

        // Fungsi untuk ekstrak nomor & huruf kelas dari field "tugas"
        // Contoh: "Kelas 3A" -> [3, 'A'], "Wali Kelas 6B" -> [6, 'B']
        $extractKelas = function ($tugas) {
            if (preg_match('/kelas\s*(\d+)\s*([a-zA-Z]?)/i', (string) $tugas, $m)) {
                return [(int) $m[1], strtoupper($m[2] ?? '')];
            }
            return [999, ''];
        };

        usort($teachers, function ($a, $b) use ($roleOrder, $extractKelas) {
            $jabatanA = $a['jabatan'] ?? '';
            $jabatanB = $b['jabatan'] ?? '';

            $orderA = $roleOrder[$jabatanA] ?? 99;
            $orderB = $roleOrder[$jabatanB] ?? 99;

            if ($orderA !== $orderB) {
                return $orderA <=> $orderB;
            }

            // Khusus Guru Wali Kelas: urutkan dari kelas terendah ke tertinggi (1A, 1B, 2A, 2B, ...)
            if ($jabatanA === 'Guru Wali Kelas' && $jabatanB === 'Guru Wali Kelas') {
                [$numA, $letA] = $extractKelas($a['tugas']);
                [$numB, $letB] = $extractKelas($b['tugas']);

                if ($numA !== $numB) {
                    return $numA <=> $numB;
                }
                return strcmp($letA, $letB);
            }

            // Jabatan/kategori lain diurutkan berdasarkan nama
            return strcmp($a['nama'] ?? '', $b['nama'] ?? '');
        });

        echo json_encode(["status" => "success", "data" => array_values($teachers)]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    if ($action === 'create') {
        $nama = isset($_POST['nama']) ? trim($_POST['nama']) : '';
        $nip = isset($_POST['nip']) ? trim($_POST['nip']) : '';
        $jabatan = isset($_POST['jabatan']) ? trim($_POST['jabatan']) : '';
        $tugas = isset($_POST['tugas']) ? trim($_POST['tugas']) : '';
        $riwayat_pendidikan = isset($_POST['riwayat_pendidikan']) ? trim($_POST['riwayat_pendidikan']) : '';
        $jenis_kelamin = isset($_POST['jenis_kelamin']) ? trim($_POST['jenis_kelamin']) : '';
        $status = isset($_POST['status']) ? trim($_POST['status']) : '';
        $motto = isset($_POST['motto']) ? trim($_POST['motto']) : '';

        if (empty($nama) || empty($jabatan) || empty($tugas) || empty($riwayat_pendidikan) || empty($jenis_kelamin) || empty($status)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Semua kolom data guru harus diisi."]);
            exit();
        }

        
        $nip = !empty($_POST['nip']) ? trim($_POST['nip']) : null;

        
        [$foto_path, $foto_crop_path] = foto_handle_create($upload_dir, 'backend/uploads/guru/');

        try {
            $stmt = $conn->prepare("INSERT INTO guru_tendik (nama, nip, jabatan, tugas, foto, foto_crop, riwayat_pendidikan, jenis_kelamin, status, motto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$nama, $nip, $jabatan, $tugas, $foto_path, $foto_crop_path, $riwayat_pendidikan, $jenis_kelamin, $status, $motto]);
            echo json_encode(["status" => "success", "message" => "Guru/Staff berhasil ditambahkan."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } 
    elseif ($action === 'update') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $nama = isset($_POST['nama']) ? trim($_POST['nama']) : '';
        $nip = isset($_POST['nip']) ? trim($_POST['nip']) : '';
        $jabatan = isset($_POST['jabatan']) ? trim($_POST['jabatan']) : '';
        $tugas = isset($_POST['tugas']) ? trim($_POST['tugas']) : '';
        $riwayat_pendidikan = isset($_POST['riwayat_pendidikan']) ? trim($_POST['riwayat_pendidikan']) : '';
        $jenis_kelamin = isset($_POST['jenis_kelamin']) ? trim($_POST['jenis_kelamin']) : '';
        $status = isset($_POST['status']) ? trim($_POST['status']) : '';
        $motto = isset($_POST['motto']) ? trim($_POST['motto']) : '';

        if ($id === 0 || empty($nama) || empty($jabatan) || empty($tugas) || empty($riwayat_pendidikan) || empty($jenis_kelamin) || empty($status)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap untuk pembaruan."]);
            exit();
        }

        $nip = !empty($_POST['nip']) ? trim($_POST['nip']) : null;

        
        $stmt = $conn->prepare("SELECT foto, foto_crop FROM guru_tendik WHERE id = ?");
        $stmt->execute([$id]);
        $teacher = $stmt->fetch();
        if (!$teacher) {
            http_response_code(444);
            echo json_encode(["status" => "error", "message" => "Guru tidak ditemukan."]);
            exit();
        }

        [$foto_path, $foto_crop_path] = foto_handle_update($upload_dir, 'backend/uploads/guru/', $teacher['foto'], $teacher['foto_crop'] ?? '');

        try {
            $stmt = $conn->prepare("UPDATE guru_tendik SET nama = ?, nip = ?, jabatan = ?, tugas = ?, foto = ?, foto_crop = ?, riwayat_pendidikan = ?, jenis_kelamin = ?, status = ?, motto = ? WHERE id = ?");
            $stmt->execute([$nama, $nip, $jabatan, $tugas, $foto_path, $foto_crop_path, $riwayat_pendidikan, $jenis_kelamin, $status, $motto, $id]);
            echo json_encode(["status" => "success", "message" => "Data Guru/Staff berhasil diperbarui."]);
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
            
            $stmt = $conn->prepare("SELECT foto, foto_crop FROM guru_tendik WHERE id = ?");
            $stmt->execute([$id]);
            $teacher = $stmt->fetch();
            if ($teacher) {
                foto_unlink($teacher['foto']);
                foto_unlink($teacher['foto_crop'] ?? '');
            }

            $stmt = $conn->prepare("DELETE FROM guru_tendik WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Guru/Staff berhasil dihapus."]);
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