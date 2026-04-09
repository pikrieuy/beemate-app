# 🐝 BeeMate Master Plan & Backend Roadmap

Dokumen ini adalah rekapan detail seluruh komponen sistem yang akan kita kembangkan untuk BeeMate. Dokumen ini dibuat berdasarkan persetujuan agar BeeMate dapat berjalan secara dinamis dan "real" dengan performa tinggi.

## 🏗️ 1. Arsitektur & Teknologi Terpilih
Berdasarkan diskusi kita, ini adalah arsitektur yang akan kita gunakan (sangat direkomendasikan untuk pengembangan sistem berskala besar):

*   **Framework Utama:** Next.js (App Router) + Tailwind CSS
*   **Database Hosting:** **Supabase (PostgreSQL)**. 
    *   *Kenapa Supabase?* Karena Supabase menggunakan PostgreSQL murni yang sangat kuat untuk relasi yang kompleks (seperti fitur Networking & Tim di BeeMate). Supabase juga sangat disukai perusahaan besar untuk skalabilitas, memiliki *Connection Pooling* bawaan (wajib untuk Next.js Serverless), dan dashboard-nya sangat mudah digunakan (user-friendly).
*   **ORM (Penghubung Next.js & DB):** **Prisma**. Memastikan kode kita aman dari error saat mengambil atau mengubah data di database.
*   **Authentication (Sistem Login):** **Auth.js (NextAuth v5)**.
    *   *Keputusan:* Kita HANYA akan menggunakan **Google Login (OAuth)**. Ini mempercepat proses registrasi user, mengamankan aplikasi dari serangan brute-force password, dan menjamin email yang digunakan adalah email valid (tidak ada akun spam).
*   **Role & Akses:** Sistem akan memiliki tingkat akses (Role-Based Access Control) dengan peran `USER` (pengguna biasa) dan `ADMIN` (pengelola).

---

## 🗄️ 2. Arsitektur Database (Schema)
Berikut adalah daftar entitas (Tabel) yang akan hidup di dalam database kita beserta penjelasannya:

1.  **`User`**
    *   *Fungsi:* Menyimpan profil individu pengguna.
    *   *Data:* `id`, `name`, `email`, `image` (foto profil google), `role` (`USER` / `ADMIN`), `bio`, `skills` (array of string), `title` (Hacker/Hustler/Hipster), `portfolioUrl`.
2.  **`Team`**
    *   *Fungsi:* Mewakili grup / kelompok yang terbentuk di BeeMate.
    *   *Data:* `id`, `name`, `description`, `leaderId` (User pencipta tim), `createdAt`.
3.  **`TeamMember`**
    *   *Fungsi:* Menghubungkan (relasi) antara `User` dan `Team`.
    *   *Data:* `id`, `teamId`, `userId`, `role` (Admin Tim atau Member Tiasa), `joinStatus` (`PENDING`, `ACCEPTED`, `REJECTED`).
4.  **`Competition` / `Project`**
    *   *Fungsi:* Tempat data lomba / event yang muncul di halaman Explore & Competitions.
    *   *Data:* `id`, `title`, `description`, `imageUrl`, `registrationLink`, `deadline`, `authorId` (Admin yang memposting).
    *   *Aturan:* HANYA user dengan role `ADMIN` yang bisa membuat atau mengedit data ini.
5.  **`Notification`**
    *   *Fungsi:* Catatan interaksi (misal: "Budi mengundang Anda masuk ke tim Alpha").
    *   *Data:* `id`, `recipientId`, `senderId`, `type` (INVITE, ACCEPT, ALERT), `message`, `isRead`.

---

## 🚀 3. Langkah-Langkah Pengerjaan (Step-by-Step)
Kita akan mengerjakan sistem ini tahap demi tahap secara modular. Di setiap awal tahap, aku akan membimbingmu secara logis mengenai apa yang kita kerjakan.

*   `[ ]` **Tahap 1: Inisialisasi Database (Setup Supabase & Prisma)**
    *   Konfigurasi project Supabase baru.
    *   Menyambungkan Next.js ke database melalui URI.
    *   Menerjemahkan Skema di atas menjadi `schema.prisma` dan mendorong (*push*) strukturnya ke Supabase.
*   `[ ]` **Tahap 2: Google Authentication**
    *   Mendaftarkan aplikasi BeeMate ke Google Cloud Console untuk mendapatkan kredensial (Client ID).
    *   Setup `NextAuth` di aplikasi.
    *   Membuat tombol "Login with Google" dan mengunci rute aplikasi (hanya bisa diakses kalau sudah login).
*   `[ ]` **Tahap 3: Halaman Profile (Create, Read, Update)**
    *   Menampilkan data user di UI Profile `/profile`.
    *   Membuat *Server Action* (logika backend) agar user bisa mengedit Bio, Skills, dan Title mereka dan tersimpan di DB.
*   `[ ]` **Tahap 4: Direktori People & Pencarian**
    *   Menghubungkan halaman `/people` untuk melakukan *fetch* (pengambilan data) semua User di database.
    *   Menerapkan filter pencarian.
*   `[ ]` **Tahap 5: Fitur Tim (The Core dari BeeMate)**
    *   Mengamankan API dan UI fitur *"Create Team"*.
    *   Melakukan interaksi *Invite User* ke dalam Team.
    *   Menampilkan UI untuk menyetujui (Accept) atau menolak (Decline) invite.
*   `[ ]` **Tahap 6: Sistem Admin & Kompetisi**
    *   Membuat *Admin Dashboard* sederhana (atau hak khusus di UI) agar akun Admin bisa posting Kompetisi.
    *   Merender (menampilkan) data lomba tersebut di `/competitions` & `/explore`.
*   `[ ]` **Tahap 7: Poles Akhir & Deployment**
    *   Mengatur Upload foto (Uploadthing).
    *   Testing menyeluruh.
    *   Deploy / rilis versi final ke **Vercel**!

> Dokumen ini bisa kamu jadikan acuan. Kapan pun kamu merasa tersesat, kita bisa melihat kembali struktur Master Plan ini.
