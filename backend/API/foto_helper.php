<?php
/**
 * Helper pemrosesan foto untuk endpoint API.
 *
 * Model penyimpanan foto:
 *   - Kolom `foto`      : menyimpan file foto ASLI (tanpa crop).
 *   - Kolom `foto_crop` : menyimpan file foto hasil crop (untuk tampilan).
 *
 * Respons API (GET) selalu menampilkan:
 *   - `foto`          : path foto yang DITAMPILKAN (foto_crop jika ada, jika tidak foto asli).
 *   - `foto_original` : path foto ASLI (untuk keperluan edit / crop ulang di CMS).
 *
 * Alur upload (POST):
 *   - `foto_original` : file foto asli (opsional, dari pilihan file baru di CMS).
 *   - `foto`          : file foto hasil crop.
 *   - Update tanpa `foto_original` berarti hanya crop ulang (foto asli dipertahankan).
 */

// Tambahkan kolom foto_crop, status_verifikasi, dan uploaded_by jika belum ada (migrasi otomatis).
function foto_ensure_column($conn, $table) {
    try {
        $conn->exec("ALTER TABLE `$table` ADD COLUMN foto_crop VARCHAR(255) NULL");
    } catch (Exception $e) {
        // Kolom sudah ada.
    }
    try {
        $conn->exec("ALTER TABLE `$table` ADD COLUMN status_verifikasi VARCHAR(50) DEFAULT 'Verified'");
    } catch (Exception $e) {
        // Kolom sudah ada.
    }
    try {
        $conn->exec("ALTER TABLE `$table` ADD COLUMN uploaded_by INT NULL");
    } catch (Exception $e) {
        // Kolom sudah ada.
    }
    try {
        $conn->exec("UPDATE `$table` SET status_verifikasi = 'Verified' WHERE status_verifikasi IS NULL OR status_verifikasi = ''");
    } catch (Exception $e) {
        // Ignore
    }
    try {
        // Perbaiki baris lama yang korup (nama file foto_crop sama dengan foto karena
        // tabrakan nama saat upload). Kosongkan foto_crop agar foto asli dipertahankan.
        $conn->exec("UPDATE `$table` SET foto_crop = NULL WHERE foto_crop IS NOT NULL AND foto_crop = foto");
    } catch (Exception $e) {
        // Kolom belum tersedia.
    }
}

// Cek dan dapatkan path file yang benar-benar ada di disk (dengan fallback ekstensi webp/jpg/png).
function foto_resolve_existing_path($path) {
    if (empty($path)) return '';
    // Jika URL eksternal, langsung kembalikan
    if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0) {
        return $path;
    }
    $relative = '../' . str_replace('backend/', '', $path);
    if (file_exists($relative)) {
        return $path;
    }
    // Cek jika versi webp ada
    $webpPath = preg_replace('/\.(png|jpe?g)$/i', '.webp', $relative);
    if (file_exists($webpPath)) {
        return str_replace(basename($relative), basename($webpPath), $path);
    }
    // Cek kemungkinan ekstensi lain yang ada di disk
    $baseWithoutExt = preg_replace('/\.[^.]+$/', '', $relative);
    foreach (['.webp', '.jpg', '.jpeg', '.png', '.JPG', '.PNG', '.JPEG'] as $candidateExt) {
        if (file_exists($baseWithoutExt . $candidateExt)) {
            return str_replace(basename($relative), basename($baseWithoutExt . $candidateExt), $path);
        }
    }
    return $path;
}

// Ubah satu baris hasil query: isi `foto` = tampilan, tambahkan `foto_original`.
function foto_map_row(&$row) {
    $original = $row['foto'] ?? '';
    $crop = $row['foto_crop'] ?? '';

    $resolved_original = foto_resolve_existing_path($original);
    $resolved_crop = foto_resolve_existing_path($crop);

    $row['foto_original'] = !empty($resolved_original) ? $resolved_original : $original;

    if (!empty($resolved_crop)) {
        $row['foto'] = $resolved_crop;
    } elseif (!empty($resolved_original)) {
        $row['foto'] = $resolved_original;
    } elseif (!empty($crop)) {
        $row['foto'] = $crop;
    } else {
        $row['foto'] = $original;
    }
}

// Ubah banyak baris hasil query (mengambil referensi langsung).
function foto_map_rows(&$rows) {
    foreach ($rows as &$row) {
        foto_map_row($row);
    }
    unset($row);
}

// Cek apakah field file terunggah dengan benar dan memenuhi validasi (maks 10MB, format gambar).
function foto_has_upload($field) {
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] !== UPLOAD_ERR_OK) {
        return false;
    }
    // Batas 10MB
    if ($_FILES[$field]['size'] > 10 * 1024 * 1024) {
        return false;
    }
    return true;
}

// Simpan satu file dari form ke direktori upload, kembalikan path DB (atau '').
function foto_save_file($field, $upload_dir, $prefix) {
    if (!foto_has_upload($field)) return '';
    if (!file_exists($upload_dir)) {
        @mkdir($upload_dir, 0777, true);
    }
    // Nama unik: timestamp + acak, mencegah tabrakan nama (mis. foto asli vs foto crop
    // yang diunggah dalam detik yang sama dengan nama dasar identik).
    $base = preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($_FILES[$field]['name']));
    $name = time() . '_' . bin2hex(random_bytes(4)) . '_' . $base;
    if (!move_uploaded_file($_FILES[$field]['tmp_name'], $upload_dir . $name)) return '';
    return $prefix . $name;
}

// Hapus file lokal dari path DB (abaikan URL eksternal).
function foto_unlink($path) {
    if (empty($path) || strpos($path, 'backend/') !== 0) return;
    $relative = '../' . str_replace('backend/', '', $path);
    if (file_exists($relative)) {
        @unlink($relative);
    }
}

// Konversi PNG / JPG ke WebP (runtime optimization).
function foto_convert_to_webp($filepath) {
    if (empty($filepath)) return $filepath;

    // Pengecekan modul & fungsi GD agar tidak menyebabkan Fatal Error jika GD mati
    if (!extension_loaded('gd') || !function_exists('imagewebp')) {
        return $filepath;
    }

    $ext = strtolower(pathinfo($filepath, PATHINFO_EXTENSION));
    if ($ext !== 'png' && $ext !== 'jpg' && $ext !== 'jpeg') return $filepath;
    
    $fullpath = '../' . str_replace('backend/', '', $filepath);
    if (!file_exists($fullpath)) return $filepath;
    
    try {
        $img = null;
        if ($ext === 'png' && function_exists('imagecreatefrompng')) {
            $img = @imagecreatefrompng($fullpath);
            if ($img) {
                if (function_exists('imagepalettetotruecolor')) {
                    @imagepalettetotruecolor($img);
                }
                @imagealphablending($img, true);
                @imagesavealpha($img, true);
            }
        } elseif (($ext === 'jpg' || $ext === 'jpeg') && function_exists('imagecreatefromjpeg')) {
            $img = @imagecreatefromjpeg($fullpath);
        }
        
        if (!$img) return $filepath;
        
        $webpPath = preg_replace('/\.(png|jpe?g)$/i', '.webp', $fullpath);
        $saved = @imagewebp($img, $webpPath, 85);
        if (function_exists('imagedestroy')) {
            @imagedestroy($img);
        }
        
        if ($saved && file_exists($webpPath) && filesize($webpPath) > 0) {
            @unlink($fullpath);
            return str_replace(basename($filepath), basename($webpPath), $filepath);
        }
    } catch (Throwable $e) {
        // Ignore conversion errors, keep original
    }
    
    return $filepath;
}

// Upload untuk CREATE: kembalikan [foto_asli, foto_crop].
// Jika tidak ada `foto_original`, fallback kompatibilitas: `foto` disimpan sebagai asli.
function foto_handle_create($upload_dir, $prefix) {
    if (foto_has_upload('foto_original')) {
        $original = foto_save_file('foto_original', $upload_dir, $prefix);
        $original = foto_convert_to_webp($original);
        $crop = foto_save_file('foto', $upload_dir, $prefix);
        $crop = foto_convert_to_webp($crop);
        return [$original, $crop];
    }
    $legacy = foto_save_file('foto', $upload_dir, $prefix);
    return [foto_convert_to_webp($legacy), ''];
}

// Upload untuk UPDATE: kembalikan [foto_asli, foto_crop] terbaru.
// - Ada `foto_original` : ganti foto asli + foto crop (hapus file lama).
// - Hanya `foto`        : ganti foto crop saja (crop ulang, foto asli dipertahankan).
// - Tanpa file          : pertahankan keduanya.
function foto_handle_update($upload_dir, $prefix, $old_original, $old_crop) {
    if (foto_has_upload('foto_original')) {
        foto_unlink($old_original);
        foto_unlink($old_crop);
        $original = foto_save_file('foto_original', $upload_dir, $prefix);
        $original = foto_convert_to_webp($original);
        $crop = foto_save_file('foto', $upload_dir, $prefix);
        $crop = foto_convert_to_webp($crop);
        return [$original, $crop];
    }
    if (foto_has_upload('foto')) {
        foto_unlink($old_crop);
        $crop = foto_save_file('foto', $upload_dir, $prefix);
        return [$old_original, foto_convert_to_webp($crop)];
    }
    return [$old_original, $old_crop];
}
?>