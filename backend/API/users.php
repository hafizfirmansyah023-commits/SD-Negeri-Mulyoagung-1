<?php
require_once '../config/koneksi.php';

header("Content-Type: application/json");

$upload_dir = '../uploads/profile/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT id, username, role, nama_penanggung_jawab, foto FROM users ORDER BY id DESC");
        $users = $stmt->fetchAll();
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
        $role = isset($_POST['role']) ? trim($_POST['role']) : 'TIM';
        $nama = isset($_POST['nama_penanggung_jawab']) ? trim($_POST['nama_penanggung_jawab']) : '';

        if (empty($username) || empty($password) || empty($nama)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Username, password, dan nama penanggung jawab harus diisi."]);
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
        $foto_path = '';
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            $file_name = time() . '_' . basename($_FILES['foto']['name']);
            if (move_uploaded_file($_FILES['foto']['tmp_name'], $upload_dir . $file_name)) {
                $foto_path = 'backend/uploads/profile/' . $file_name;
            }
        }

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        try {
            $stmt = $conn->prepare("INSERT INTO users (username, password, role, nama_penanggung_jawab, foto) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$username, $hashed_password, $role, $nama, $foto_path]);
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

        // Check if username unique to others
        $stmt = $conn->prepare("SELECT id, password, foto, role FROM users WHERE id = ?");
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

        $foto_path = $existing_user['foto'];
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            if (!empty($foto_path) && file_exists('../' . str_replace('backend/', '', $foto_path))) {
                @unlink('../' . str_replace('backend/', '', $foto_path));
            }
            $file_name = time() . '_' . basename($_FILES['foto']['name']);
            if (move_uploaded_file($_FILES['foto']['tmp_name'], $upload_dir . $file_name)) {
                $foto_path = 'backend/uploads/profile/' . $file_name;
            }
        }

        $final_role = empty($role) ? $existing_user['role'] : $role;
        
        try {
            if (!empty($password)) {
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("UPDATE users SET username = ?, password = ?, nama_penanggung_jawab = ?, role = ?, foto = ? WHERE id = ?");
                $stmt->execute([$username, $hashed_password, $nama, $final_role, $foto_path, $id]);
            } else {
                $stmt = $conn->prepare("UPDATE users SET username = ?, nama_penanggung_jawab = ?, role = ?, foto = ? WHERE id = ?");
                $stmt->execute([$username, $nama, $final_role, $foto_path, $id]);
            }

            echo json_encode([
                "status" => "success",
                "message" => "Profil berhasil diperbarui.",
                "user" => [
                    "id" => $id,
                    "username" => $username,
                    "role" => $final_role,
                    "nama_penanggung_jawab" => $nama,
                    "foto" => $foto_path
                ]
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
            $stmt = $conn->prepare("SELECT foto FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch();
            if ($user && !empty($user['foto'])) {
                $relative_photo = '../' . str_replace('backend/', '', $user['foto']);
                if (file_exists($relative_photo)) {
                    @unlink($relative_photo);
                }
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
