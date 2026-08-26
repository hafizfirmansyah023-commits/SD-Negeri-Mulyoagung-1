export const WHATSAPP_NUMBER = '6289513301256';

export const SCHOOL_CONTACT_INFO = {
  alamat: 'JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur',
  email: 'sdnmulyoagung01@gmail.com',
  telepon: '(0341) 466-730',
  whatsappDisplay: '089513301256',
  jamPelayanan: 'Senin - Jumat: 07.00 - 14.15 WIB',
};

export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/4ekhNxNWhTuH1VEV6';

export const GOOGLE_MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.527376383637!2d112.58555027588324!3d-7.917209398863617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78818ec3f74a4f%3A0x5b041b813175a4e6!2sSDN%20Mulyoagung%2001!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid';

export const KATEGORI_PENGADUAN = [
  'Saran & Kritik',
  'Layanan Sekolah',
  'Sarana & Prasarana',
  'PPDB & Informasi',
  'Lainnya',
];

export interface ComplaintFormData {
  nama: string;
  noHp: string;
  kategori: string;
  pesan: string;
}

export const DEFAULT_COMPLAINT_FORM: ComplaintFormData = {
  nama: '',
  noHp: '',
  kategori: KATEGORI_PENGADUAN[0],
  pesan: '',
};

// Susun teks pesan pengaduan terformat untuk dikirim via WhatsApp
export const buildComplaintMessage = (formData: ComplaintFormData): string => {
  return (
    `*FORM PENGADUAN MASYARAKAT*\n` +
    `*SD NEGERI 1 MULYOAGUNG*\n\n` +
    `Nama Pelapor : ${formData.nama.trim()}\n` +
    `Nomor HP/WhatsApp : ${formData.noHp.trim() || '-'}\n` +
    `Kategori Pengaduan : ${formData.kategori}\n` +
    `Isi Pengaduan :\n${formData.pesan.trim()}`
  );
};

// Format nomor WhatsApp agar valid untuk URL wa.me (mengubah 08... menjadi 628...)
export const formatWaNumber = (number: string): string => {
  if (!number) return WHATSAPP_NUMBER;
  let clean = number.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  }
  return clean || WHATSAPP_NUMBER;
};

// Bangun URL wa.me lengkap dengan pesan yang sudah di-encode
export const buildWhatsAppUrl = (formData: ComplaintFormData, targetNumber?: string): string => {
  const text = buildComplaintMessage(formData);
  const waNum = targetNumber ? formatWaNumber(targetNumber) : WHATSAPP_NUMBER;
  return `https://wa.me/${waNum}?text=${encodeURIComponent(text)}`;
};
