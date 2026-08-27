<?php
require_once '../config/koneksi.php';
require_once 'foto_helper.php';

header("Content-Type: application/json");

foto_ensure_column($conn, 'users');

try {
    $conn->exec("ALTER TABLE users DROP COLUMN password_plain");
} catch (Exception $e) {}

$upload_dir = '../uploads/profile/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT id, username, password, role, nama_penanggung_jawab, foto, foto_crop FROM users ORDER BY id DESC");
        $users = $stmt->fetchAll();
        foreach ($users as &$u) {
            $u['password_plain'] = (strpos($u['password'], '$2y$') === 0) ? '(Ter-hash, harap login dulu untuk migrasi atau reset)' : $u['password'];
            unset($u['password']);
        }
        foto_map_rows($users);
        echo json_encode(["status" => "success", "data" => $users]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} 
elseif ($method === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    if ($action === 'create') {
        $username = isset($_POST['username']) ? trim($_POST['username']) : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';
        $role = isset($_POST['role']) ? trim($_POST['role']) : 'GURU';
        $nama = isset($_POST['nama_penanggung_jawab']) ? trim($_POST['nama_penanggung_jawab']) : '';

        if (empty($username) || empty($password) || empty($nama)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Username, password, dan nama penanggung jawab harus diisi."]);
            exit();
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Password harus memiliki minimal 6 karakter."]);
            exit();
        }

        // Check unique username
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(["status" => "error", "message" => "Username sudah digunakan."]);
            exit();
        }

        // Handle photo upload
        [$foto_path, $foto_crop_path] = foto_handle_create($upload_dir, 'backend/uploads/profile/');

        try {
            $stmt = $conn->prepare("INSERT INTO users (username, password, role, nama_penanggung_jawab, foto, foto_crop) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$username, $password, $role, $nama, $foto_path, $foto_crop_path]);
            echo json_encode(["status" => "success", "message" => "User berhasil ditambahkan."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } 
    elseif ($action === 'update') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $username = isset($_POST['username']) ? trim($_POST['username']) : '';
        $nama = isset($_POST['nama_penanggung_jawab']) ? trim($_POST['nama_penanggung_jawab']) : '';
        $role = isset($_POST['role']) ? trim($_POST['role']) : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';

        if ($id === 0 || empty($username) || empty($nama)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
            exit();
        }

        if (!empty($password) && strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Password baru harus memiliki minimal 6 karakter."]);
            exit();
        }

        // Check if username unique to others
        $stmt = $conn->prepare("SELECT id, password, foto, foto_crop, role FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $existing_user = $stmt->fetch();
        if (!$existing_user) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "User tidak ditemukan."]);
            exit();
        }

        // Check uniqueness of username
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $stmt->execute([$username, $id]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(["status" => "error", "message" => "Username sudah digunakan oleh user lain."]);
            exit();
        }

        [$foto_path, $foto_crop_path] = foto_handle_update($upload_dir, 'backend/uploads/profile/', $existing_user['foto'], $existing_user['foto_crop'] ?? '');

        $final_role = empty($role) ? $existing_user['role'] : $role;
        
        try {
            if (!empty($password)) {
                $stmt = $conn->prepare("UPDATE users SET username = ?, password = ?, nama_penanggung_jawab = ?, role = ?, foto = ?, foto_crop = ? WHERE id = ?");
                $stmt->execute([$username, $password, $nama, $final_role, $foto_path, $foto_crop_path, $id]);
            } else {
                $stmt = $conn->prepare("UPDATE users SET username = ?, nama_penanggung_jawab = ?, role = ?, foto = ?, foto_crop = ? WHERE id = ?");
                $stmt->execute([$username, $nama, $final_role, $foto_path, $foto_crop_path, $id]);
            }

            $foto_tampil = !empty($foto_crop_path) ? $foto_crop_path : $foto_path;
            echo json_encode([
                "status" => "success",
                "message" => "Profil berhasil diperbarui.",
                "user" => [
                    "id" => $id,
                    "username" => $username,
                    "role" => $final_role,
                    "nama_penanggung_jawab" => $nama,
                    "foto" => $foto_tampil,
                    "foto_original" => $foto_path
                ]
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } 
    elseif ($action === 'reset_password') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        if ($id === 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID user tidak valid."]);
            exit();
        }

        $stmt = $conn->prepare("SELECT id, username, nama_penanggung_jawab FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $target_user = $stmt->fetch();

        if (!$target_user) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "User tidak ditemukan."]);
            exit();
        }

        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
        $new_password = '';
        $max = strlen($chars) - 1;
        for ($i = 0; $i < 10; $i++) {
            $new_password .= $chars[random_int(0, $max)];
        }

        try {
            $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->execute([$new_password, $id]);
            echo json_encode([
                "status" => "success",
                "message" => "Password berhasil di-reset.",
                "new_password" => $new_password,
                "user" => $target_user
            ]);
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
            // Delete profile photo
            $stmt = $conn->prepare("SELECT foto, foto_crop FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch();
            if ($user) {
                foto_unlink($user['foto']);
                foto_unlink($user['foto_crop'] ?? '');
            }

            $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "User berhasil dihapus."]);
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
