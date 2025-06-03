// js/settings.js - Settings module
const SettingsModule = {
  loadContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
      <div class="space-y-6">
        <!-- Coming Soon Card -->
        <div class="glass-effect rounded-2xl p-8 text-center hover-scale">
          <div class="w-24 h-24 mx-auto mb-6 glass-effect rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-white/60" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-4">Pengaturan Sistem</h3>
          <div class="max-w-md mx-auto">
            <p class="text-white/70 mb-6">
              Halaman pengaturan sistem sedang dalam tahap pengembangan. 
              Fitur-fitur konfigurasi akan segera tersedia untuk membantu Anda mengelola sistem inventory.
            </p>
            <div class="inline-flex items-center px-4 py-2 glass-effect rounded-full text-white/60 text-sm">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
              </svg>
              Segera Hadir
            </div>
          </div>
        </div>

        <!-- Preview Features -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="glass-effect rounded-2xl p-6 hover-scale">
            <div class="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h4 class="text-white font-semibold mb-2">Manajemen User</h4>
            <p class="text-white/60 text-sm">Kelola hak akses dan role pengguna sistem</p>
          </div>

          <div class="glass-effect rounded-2xl p-6 hover-scale">
            <div class="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h4 class="text-white font-semibold mb-2">Konfigurasi Sistem</h4>
            <p class="text-white/60 text-sm">Atur parameter dan preferensi sistem</p>
          </div>

          <div class="glass-effect rounded-2xl p-6 hover-scale">
            <div class="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 8A8 8 0 11-2 8a8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h4 class="text-white font-semibold mb-2">Backup & Restore</h4>
            <p class="text-white/60 text-sm">Kelola data backup dan pemulihan sistem</p>
          </div>

          <div class="glass-effect rounded-2xl p-6 hover-scale">
            <div class="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h4 class="text-white font-semibold mb-2">API Settings</h4>
            <p class="text-white/60 text-sm">Konfigurasi integrasi dan API endpoints</p>
          </div>

          <div class="glass-effect rounded-2xl p-6 hover-scale">
            <div class="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13V12a1 1 0 011-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h4 class="text-white font-semibold mb-2">Theme & Layout</h4>
            <p class="text-white/60 text-sm">Personalisasi tampilan dan tema aplikasi</p>
          </div>

          <div class="glass-effect rounded-2xl p-6 hover-scale">
            <div class="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9a1 1 0 112 0 1 1 0 01-2 0zm6 0a1 1 0 112 0 1 1 0 01-2 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h4 class="text-white font-semibold mb-2">Notifikasi</h4>
            <p class="text-white/60 text-sm">Atur preferensi notifikasi dan peringatan</p>
          </div>
        </div>
      </div>
    `;
  }
};