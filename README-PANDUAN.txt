RUANG LITERASI — WEBSITE + ADMIN ARTIKEL
========================================

APA YANG BARU?
- Halaman admin /admin/ untuk tambah, edit, hapus artikel, unggah gambar.
- Penyimpanan permanen di repositori GitHub; Netlify deploy otomatis.
- Artikel dipisahkan ke content/posts/*.json dan digabung saat build.
- Nama blog Ruang Literasi dan nama penulis Penulis Blog tetap digunakan.

PENTING: ADMIN TIDAK BERFUNGSI HANYA DENGAN UPLOAD DRAG-AND-DROP.
Admin memerlukan GitHub, site Netlify yang TERHUBUNG dengan GitHub,
Netlify Identity, dan Git Gateway. Tidak perlu database/hosting berbayar.

LANGKAH AWAL
1. Ekstrak file ZIP ini.
2. Daftar/login di github.com, buat repositori baru, misalnya ruang-literasi.
3. Upload SELURUH ISI folder ruang-literasi-netlify ke ROOT repo GitHub
   (file index.html harus berada di root repo, bukan folder tambahan).
4. Buka app.netlify.com > Add new project > Import an existing project.
   Hubungkan GitHub dan pilih repositori tadi, branch main.
   Netlify membaca netlify.toml: build command node build-content.js,
   publish directory . (titik). Deploy.
5. Di dashboard Netlify project, aktifkan Identity.
   Disarankan Registration: Invite only (hanya yang diundang).
   Undang email diri sendiri dan selesaikan konfirmasi/invite.
   Link undangan dapat membuka homepage; ikuti form konfirmasi, kemudian
   browser akan dialihkan ke /admin/.
6. Pada pengaturan Identity > Services, aktifkan Git Gateway.
   Pastikan Gateway terhubung ke GitHub repo yang sama.
7. Buka https://ALAMAT-SITUS.netlify.app/admin/
   Login dengan akun Identity yang diundang. Di menu Artikel:
   - New Artikel: tulis artikel, lalu Publish
   - Klik artikel lama: edit, lalu Publish
   - Klik artikel lama: Delete untuk menghapus
8. Tunggu proses deploy selesai; halaman publik terbarui otomatis.

CATATAN PENTING
- JANGAN membuka pendaftaran Identity publik untuk blog pribadi.
- Jangan menaruh password, token GitHub, atau data rahasia di file website.
- Gambar unggahan diletakkan di assets/uploads di GitHub.
- Hapus artikel akan menghapus file artikel dari repo; commit GitHub bisa
  digunakan memulihkan perubahan jika perlu.
- Artikel bertanda 'Terbitkan artikel? = false' tidak muncul di situs publik,
  tetapi file artikel tetap ada di repositori GitHub (bukan penyimpanan privat).
- Ganti alamat halo@example.com pada script.js dengan email Anda.
- Decap CMS dimuat dari internet di /admin/. Pengeditan memerlukan koneksi.
- Jika site sebelumnya diupload lewat Netlify Drop, buat deploy baru yang
  terhubung GitHub atau hubungkan site yang sudah ada ke repository.
- Untuk preview tanpa Netlify, jalankan node build-content.js kemudian
  buka website lewat local HTTP server (misalnya python -m http.server).
- File content/posts.json disertakan supaya website bisa dibuka langsung
  setelah Netlify Drop, tetapi admin hanya berfungsi setelah setup Git.

STRUKTUR
index.html              Website publik
style.css               Desain
script.js               Logika publik, mengambil posts.json
admin/index.html        Panel Decap CMS
admin/config.yml        Pengaturan CMS
content/posts/*.json    Satu file per artikel
content/posts.json      Daftar artikel publik hasil build
build-content.js        Script pembangun otomatis
netlify.toml            Build Netlify
assets/                 Gambar awal + unggahan

Dokumentasi:
https://decapcms.org/docs/git-gateway-backend/
https://docs.netlify.com/manage/security/secure-access-to-sites/identity/get-started/
https://docs.netlify.com/start/quickstarts/deploy-from-repository/
