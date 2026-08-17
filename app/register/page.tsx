// ============================================================
//  PENDAFTARAN PUBLIK DINONAKTIFKAN
//  Akun hanya dibuat oleh Super Admin lewat menu Pengaturan.
//
//  Untuk MENGAKTIFKAN KEMBALI pendaftaran publik:
//    Timpa file ini dengan isi dari "page.tsx.bak" di folder yang sama,
//    lalu aktifkan lagi tautan "Daftar" di app/login/page.tsx.
// ============================================================

import { redirect } from 'next/navigation'

export default function RegisterPage() {
  // Alihkan siapa pun yang membuka /register ke halaman login
  redirect('/login')
}
