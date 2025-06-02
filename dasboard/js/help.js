// js/help.js - Help module
const HelpModule = {
  loadContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
      <div class="space-y-6">
        <!-- Welcome Card -->
        <div class="glass-effect rounded-2xl p-8 text-center">
          <div class="w-20 h-20 mx-auto mb-6 glass-effect rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-white mb-4">Pusat Bantuan</h2>
          <p class="text-white/70 max-w-2xl mx-auto">
            Temukan panduan lengkap untuk menggunakan sistem inventory dengan efektif. 
            Dari dasar hingga fitur advanced, semua ada di sini.
          </p>
        </div>

        <!-- Quick Links -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button onclick="HelpModule.showSection('getting-started')" class="glass-effect rounded-2xl p-6 hover-scale text-left transition-all duration-300 hover:bg-white/10">
            <div class="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-white font-semibold mb-2">Memulai</h3>
            <p class="text-white/60 text-sm">Panduan dasar menggunakan sistem</p>
          </button>

          <button onclick="HelpModule.showSection('inventory-guide')" class="glass-effect rounded-2xl p-6 hover-scale text-left transition-all duration-300 hover:bg-white/10">
            <div class="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9a1 1 0 112 0 1 1 0 01-2 0zm6 0a1 1 0 112 0 1 1 0 01-2 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-white font-semibold mb-2">Inventory</h3>
            <p class="text-white/60 text-sm">Cara mengelola penerimaan barang</p>
          </button>

          <button onclick="HelpModule.showSection('user-management')" class="glass-effect rounded-2xl p-6 hover-scale text-left transition-all duration-300 hover:bg-white/10">
            <div class="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
              </svg>
            </div>
            <h3 class="text-white font-semibold mb-2">User Management</h3>
            <p class="text-white/60 text-sm">Mengelola data pengguna sistem</p>
          </button>

          <button onclick="HelpModule.showSection('faq')" class="glass-effect rounded-2xl p-6 hover-scale text-left transition-all duration-300 hover:bg-white/10">
            <div class="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-white font-semibold mb-2">FAQ</h3>
            <p class="text-white/60 text-sm">Pertanyaan yang sering diajukan</p>
          </button>
        </div>

        <!-- Content Section -->
        <div id="help-content" class="glass-effect rounded-2xl p-8">
          <div class="text-center py-12">
            <svg class="w-16 h-16 text-white/40 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
            </svg>
            <h3 class="text-xl font-semibold text-white/70 mb-2">Pilih Topik Bantuan</h3>
            <p class="text-white/50">Klik salah satu kategori di atas untuk melihat panduan lengkap</p>
          </div>
        </div>
      </div>
    `;
  },

  showSection(section) {
    const helpContent = document.getElementById('help-content');

    switch (section) {
      case 'getting-started':
        helpContent.innerHTML = `
          <div class="max-w-4xl">
            <div class="flex items-center mb-6">
              <button onclick="HelpModule.loadContent()" class="text-white/60 hover:text-white mr-4 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <h2 class="text-2xl font-bold text-white">Panduan Memulai</h2>
            </div>
            
            <div class="space-y-6">
              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">1. Login ke Sistem</h3>
                <p class="text-white/70 mb-4">Untuk mengakses sistem inventory, Anda perlu login menggunakan akun yang telah diberikan oleh administrator:</p>
                <ul class="text-white/60 space-y-2 ml-4">
                  <li>• Masukkan username dan password Anda</li>
                  <li>• Klik tombol "Login" untuk masuk ke dashboard</li>
                  <li>• Jika lupa password, hubungi administrator sistem</li>
                </ul>
              </div>

              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">2. Navigasi Dashboard</h3>
                <p class="text-white/70 mb-4">Dashboard adalah halaman utama yang menampilkan ringkasan informasi:</p>
                <ul class="text-white/60 space-y-2 ml-4">
                  <li>• <strong>Sidebar kiri:</strong> Menu navigasi untuk mengakses berbagai fitur</li>
                  <li>• <strong>Header:</strong> Judul halaman dan informasi user yang sedang login</li>
                  <li>• <strong>Content area:</strong> Area utama yang menampilkan konten sesuai menu yang dipilih</li>
                </ul>
              </div>

              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">3. Menu Utama</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Dashboard</h4>
                    <p class="text-white/60 text-sm">Ringkasan data dan statistik penerimaan barang</p>
                  </div>
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Data User</h4>
                    <p class="text-white/60 text-sm">Kelola pengguna dan hak akses sistem</p>
                  </div>
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Penerimaan Barang</h4>
                    <p class="text-white/60 text-sm">Input dan kelola data barang masuk</p>
                  </div>
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Pengaturan</h4>
                    <p class="text-white/60 text-sm">Konfigurasi sistem dan preferensi</p>
                  </div>
                </div>
              </div>

              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">4. Tips Awal</h3>
                <div class="space-y-3">
                  <div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-white/60 rounded-full mt-2"></div>
                    <p class="text-white/70">Pastikan browser Anda mendukung JavaScript untuk pengalaman optimal</p>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-white/60 rounded-full mt-2"></div>
                    <p class="text-white/70">Gunakan resolusi layar minimal 1024x768 untuk tampilan terbaik</p>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-2 h-2 bg-white/60 rounded-full mt-2"></div>
                    <p class="text-white/70">Logout setelah selesai menggunakan sistem untuk keamanan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case 'inventory-guide':
        helpContent.innerHTML = `
          <div class="max-w-4xl">
            <div class="flex items-center mb-6">
              <button onclick="HelpModule.loadContent()" class="text-white/60 hover:text-white mr-4 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <h2 class="text-2xl font-bold text-white">Panduan Inventory</h2>
            </div>
            
            <div class="space-y-6">
              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Menambah Barang Masuk</h3>
                <div class="space-y-4">
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">1</div>
                    <div>
                      <h4 class="text-white font-medium">Akses Menu Penerimaan Barang</h4>
                      <p class="text-white/60 text-sm">Klik menu "Penerimaan Barang" di sidebar kiri</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">2</div>
                    <div>
                      <h4 class="text-white font-medium">Klik Tombol Tambah Barang</h4>
                      <p class="text-white/60 text-sm">Klik tombol "Tambah Barang Masuk" di bagian atas halaman</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">3</div>
                    <div>
                      <h4 class="text-white font-medium">Isi Form Data Barang</h4>
                      <p class="text-white/60 text-sm">Lengkapi informasi: nama barang, jumlah, supplier, dan keterangan</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">4</div>
                    <div>
                      <h4 class="text-white font-medium">Simpan Data</h4>
                      <p class="text-white/60 text-sm">Klik tombol "Simpan" untuk menyimpan data barang masuk</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Mengelola Data Barang</h3>
                <div class="space-y-4">
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Edit Data Barang</h4>
                    <p class="text-white/60 text-sm">Klik tombol "Edit" pada baris data yang ingin diubah, lalu ubah informasi sesuai kebutuhan.</p>
                  </div>
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Hapus Data Barang</h4>
                    <p class="text-white/60 text-sm">Klik tombol "Hapus" pada baris data yang ingin dihapus. Konfirmasi penghapusan sebelum data terhapus permanen.</p>
                  </div>
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Pencarian Data</h4>
                    <p class="text-white/60 text-sm">Gunakan kolom pencarian untuk mencari data berdasarkan nama barang atau supplier.</p>
                  </div>
                </div>
              </div>

              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Tips Penggunaan</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-3">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-white/70 text-sm">Pastikan data yang diinput akurat</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-white/70 text-sm">Gunakan nama supplier yang konsisten</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-white/70 text-sm">Backup data secara berkala</span>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-white/70 text-sm">Hindari duplikasi data</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-white/70 text-sm">Periksa kembali sebelum menyimpan</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-white/70 text-sm">Jangan lupa mengisi keterangan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case 'user-management':
        helpContent.innerHTML = `
          <div class="max-w-4xl">
            <div class="flex items-center mb-6">
              <button onclick="HelpModule.loadContent()" class="text-white/60 hover:text-white mr-4 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <h2 class="text-2xl font-bold text-white">Panduan User Management</h2>
            </div>
            
            <div class="space-y-6">
              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Menambah User Baru</h3>
                <div class="space-y-4">
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">1</div>
                    <div>
                      <h4 class="text-white font-medium">Akses Menu Data User</h4>
                      <p class="text-white/60 text-sm">Klik menu "Data User" di sidebar kiri</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">2</div>
                    <div>
                      <h4 class="text-white font-medium">Klik Tombol Tambah User</h4>
                      <p class="text-white/60 text-sm">Klik tombol "Tambah User" di bagian atas halaman</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">3</div>
                    <div>
                      <h4 class="text-white font-medium">Isi Data User</h4>
                      <p class="text-white/60 text-sm">Lengkapi: nama lengkap, username, email, password, dan role</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">4</div>
                    <div>
                      <h4 class="text-white font-medium">Simpan User</h4>
                      <p class="text-white/60 text-sm">Klik tombol "Simpan" untuk menyimpan data user baru</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Role & Hak Akses</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Administrator</h4>
                    <ul class="text-white/60 text-sm space-y-1">
                      <li>• Akses penuh ke semua fitur</li>
                      <li>• Kelola user dan hak akses</li>
                      <li>• Konfigurasi sistem</li>
                      <li>• Backup dan restore data</li>
                    </ul>
                  </div>
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Staff</h4>
                    <ul class="text-white/60 text-sm space-y-1">
                      <li>• Akses dashboard dan inventory</li>
                      <li>• Input data penerimaan barang</li>
                      <li>• Edit data yang dibuat sendiri</li>
                      <li>• View laporan terbatas</li>
                    </ul>
                  </div>
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Supervisor</h4>
                    <ul class="text-white/60 text-sm space-y-1">
                      <li>• Akses semua data inventory</li>
                      <li>• Approve pengajuan stock</li>
                      <li>• Manage data semua staff</li>
                      <li>• View semua laporan</li>
                    </ul>
                  </div>
                  <div class="glass-effect rounded-lg p-4">
                    <h4 class="font-semibold text-white mb-2">Viewer</h4>
                    <ul class="text-white/60 text-sm space-y-1">
                      <li>• View dashboard dan data</li>
                      <li>• Export laporan sederhana</li>
                      <li>• Tidak dapat edit/hapus</li>
                      <li>• Akses read-only</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Edit User</h3>
                <div class="space-y-4">
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">1</div>
                    <div>
                      <h4 class="text-white font-medium">Pilih User</h4>
                      <p class="text-white/60 text-sm">Dari tabel user, klik tombol "Edit" pada user yang ingin diubah</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">2</div>
                    <div>
                      <h4 class="text-white font-medium">Update Data</h4>
                      <p class="text-white/60 text-sm">Ubah informasi yang diperlukan (nama, email, role, status aktif)</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">3</div>
                    <div>
                      <h4 class="text-white font-medium">Reset Password</h4>
                      <p class="text-white/60 text-sm">Opsional: centang "Reset Password" untuk memberikan password baru</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">4</div>
                    <div>
                      <h4 class="text-white font-medium">Simpan Perubahan</h4>
                      <p class="text-white/60 text-sm">Klik "Update" untuk menyimpan perubahan data user</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Hapus User</h3>
                <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <div class="flex items-center mb-2">
                    <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <h4 class="font-semibold text-red-400">Peringatan!</h4>
                  </div>
                  <p class="text-red-300 text-sm">Penghapusan user bersifat permanen dan tidak dapat dibatalkan. Pastikan data backup tersedia.</p>
                </div>
                <div class="space-y-4">
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">1</div>
                    <div>
                      <h4 class="text-white font-medium">Nonaktifkan User (Disarankan)</h4>
                      <p class="text-white/60 text-sm">Ubah status user menjadi "Tidak Aktif" untuk menjaga data historis</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 glass-effect rounded-full flex items-center justify-center text-xs text-white font-bold mt-1">2</div>
                    <div>
                      <h4 class="text-white font-medium">Hapus Permanen</h4>
                      <p class="text-white/60 text-sm">Klik tombol "Hapus" dan konfirmasi untuk menghapus user secara permanen</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Tips & Praktek Terbaik</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-3">
                    <h4 class="font-semibold text-white">Keamanan Password</h4>
                    <ul class="text-white/60 text-sm space-y-1">
                      <li>• Minimal 8 karakter</li>
                      <li>• Kombinasi huruf, angka, simbol</li>
                      <li>• Wajib ganti password default</li>
                      <li>• Update berkala setiap 3 bulan</li>
                    </ul>
                  </div>
                  <div class="space-y-3">
                    <h4 class="font-semibold text-white">Manajemen Role</h4>
                    <ul class="text-white/60 text-sm space-y-1">
                      <li>• Berikan akses minimal yang dibutuhkan</li>
                      <li>• Review hak akses secara berkala</li>
                      <li>• Dokumentasi perubahan role</li>
                      <li>• Backup sebelum perubahan besar</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Troubleshooting</h3>
                <div class="space-y-4">
                  <div class="border-l-4 border-blue-500 pl-4">
                    <h4 class="font-semibold text-white">User tidak bisa login?</h4>
                    <p class="text-white/60 text-sm">Periksa status aktif user, reset password, atau cek koneksi database</p>
                  </div>
                  <div class="border-l-4 border-yellow-500 pl-4">
                    <h4 class="font-semibold text-white">User tidak punya akses fitur tertentu?</h4>
                    <p class="text-white/60 text-sm">Verifikasi role user dan konfigurasi hak akses pada menu sistem</p>
                  </div>
                  <div class="border-l-4 border-green-500 pl-4">
                    <h4 class="font-semibold text-white">Lupa password admin?</h4>
                    <p class="text-white/60 text-sm">Gunakan fitur recovery atau akses langsung ke database untuk reset</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case 'faq':
        helpContent.innerHTML = `
        <div class="max-w-4xl">
          <div class="flex items-center mb-6">
            <button onclick="HelpModule.loadContent()" class="text-white/60 hover:text-white mr-4 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
            <h2 class="text-2xl font-bold text-white">FAQ (Frequently Asked Questions)</h2>
          </div>
          
          <div class="space-y-6">
            <div class="glass-effect rounded-xl p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Aplikasi Umum</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-blue-500 pl-4">
                  <h4 class="font-semibold text-white">Bagaimana cara reset password saya?</h4>
                  <p class="text-white/60 text-sm">Klik tombol "Lupa Password" di halaman login dan ikuti langkah-langkah yang diberikan melalui email terdaftar Anda.</p>
                </div>
                <div class="border-l-4 border-green-500 pl-4">
                  <h4 class="font-semibold text-white">Apakah saya bisa mengakses aplikasi di perangkat mobile?</h4>
                  <p class="text-white/60 text-sm">Ya, aplikasi mendukung akses melalui browser di perangkat mobile seperti Android dan iOS.</p>
                </div>
                <div class="border-l-4 border-yellow-500 pl-4">
                  <h4 class="font-semibold text-white">Apakah data saya aman di aplikasi ini?</h4>
                  <p class="text-white/60 text-sm">Kami menggunakan enkripsi dan protokol keamanan standar industri untuk melindungi data Anda. Selain itu, kami rutin melakukan backup data secara berkala.</p>
                </div>
                <div class="border-l-4 border-red-500 pl-4">
                  <h4 class="font-semibold text-white">Mengapa saya tidak dapat login setelah mendaftar?</h4>
                  <p class="text-white/60 text-sm">Pastikan email Anda telah terverifikasi. Cek kotak masuk email untuk link verifikasi atau hubungi admin jika mengalami masalah.</p>
                </div>
              </div>
            </div>

            <div class="glass-effect rounded-xl p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Fitur Khusus</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-indigo-500 pl-4">
                  <h4 class="font-semibold text-white">Bagaimana cara menggunakan fitur scan QR code?</h4>
                  <p class="text-white/60 text-sm">Masuk ke halaman "Scanner" pada menu utama, arahkan kamera ke QR code, dan aplikasi akan otomatis memproses data yang terbaca.</p>
                </div>
                <div class="border-l-4 border-pink-500 pl-4">
                  <h4 class="font-semibold text-white">Apakah saya bisa mendownload laporan?</h4>
                  <p class="text-white/60 text-sm">Ya, Anda bisa mendownload laporan dalam format PDF atau Excel dari menu "Laporan" setelah memilih rentang tanggal yang diinginkan.</p>
                </div>
                <div class="border-l-4 border-emerald-500 pl-4">
                  <h4 class="font-semibold text-white">Bagaimana cara mengaktifkan dark mode?</h4>
                  <p class="text-white/60 text-sm">Pergi ke menu "Pengaturan", aktifkan opsi "Dark Mode" pada bagian tampilan, lalu simpan perubahan.</p>
                </div>
              </div>
            </div>

            <div class="glass-effect rounded-xl p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Masalah Umum</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-blue-400 pl-4">
                  <h4 class="font-semibold text-white">Aplikasi terasa lambat, apa yang harus saya lakukan?</h4>
                  <p class="text-white/60 text-sm">Coba refresh halaman, bersihkan cache browser, atau gunakan jaringan internet yang lebih stabil.</p>
                </div>
                <div class="border-l-4 border-yellow-400 pl-4">
                  <h4 class="font-semibold text-white">Mengapa data saya tidak tersimpan?</h4>
                  <p class="text-white/60 text-sm">Pastikan semua kolom sudah terisi dengan benar sebelum menyimpan. Jika masalah berlanjut, hubungi admin support.</p>
                </div>
                <div class="border-l-4 border-rose-400 pl-4">
                  <h4 class="font-semibold text-white">Bagaimana cara menghubungi tim support?</h4>
                  <p class="text-white/60 text-sm">Anda bisa menghubungi kami melalui email support@example.com atau WhatsApp di nomor 08XXXXXXXXXX.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
}