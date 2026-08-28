export interface FileValidationError {
  title: string;
  message: string;
}

type ErrorListener = (error: FileValidationError) => void;
let globalErrorListener: ErrorListener | null = null;

export function setFileValidationErrorListener(listener: ErrorListener | null) {
  globalErrorListener = listener;
}

/**
 * Validates selected image file for format (image/*) and size (max 10MB).
 * Displays a custom alert modal if validation fails and clears the input element.
 */
export function validateImageFile(
  file: File | null,
  inputElement?: HTMLInputElement | null,
  customOnError?: ErrorListener
): File | null {
  if (!file) return null;

  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  // Check file type
  if (!file.type.startsWith('image/')) {
    const error: FileValidationError = {
      title: 'Format File Tidak Sesuai',
      message: `File "${file.name}" bukan merupakan file gambar. Harap unggah foto dengan format JPG, PNG, WEBP, atau GIF.`
    };
    if (inputElement) {
      inputElement.value = '';
    }
    if (customOnError) {
      customOnError(error);
    } else if (globalErrorListener) {
      globalErrorListener(error);
    }
    return null;
  }

  // Check file size
  if (file.size > MAX_SIZE_BYTES) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const error: FileValidationError = {
      title: 'Ukuran Foto Melebihi Batas',
      message: `File "${file.name}" berukuran ${fileSizeMB} MB. Ukuran maksimum foto yang diperbolehkan adalah ${MAX_SIZE_MB}MB.`
    };
    if (inputElement) {
      inputElement.value = '';
    }
    if (customOnError) {
      customOnError(error);
    } else if (globalErrorListener) {
      globalErrorListener(error);
    }
    return null;
  }

  return file;
}
