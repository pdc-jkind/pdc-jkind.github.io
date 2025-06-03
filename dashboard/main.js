// main.js - Main navigation controller
class MainController {
  constructor() {
    this.currentSection = 'dashboard';
    this.init();
  }

  init() {
    // Load dashboard by default
    this.showContent('dashboard');
  }

  showContent(section) {
    // Update active sidebar item
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('sidebar-active');
    });
    document.getElementById(`nav-${section}`).classList.add('sidebar-active');

    // Update page title
    const titles = {
      dashboard: { title: 'Dashboard', subtitle: 'Selamat datang di sistem inventory' },
      users: { title: 'Data User', subtitle: 'Kelola data pengguna sistem' },
      inventory: { title: 'Penerimaan Barang', subtitle: 'Kelola data penerimaan barang' },
      disparity: { title: 'Laporan disparitas', subtitle: 'pantau selisih penerimaan barang' },
      settings: { title: 'Pengaturan', subtitle: 'Konfigurasi sistem' },
      help: { title: 'Bantuan', subtitle: 'Panduan penggunaan sistem' }
    };

    document.getElementById('page-title').textContent = titles[section].title;
    document.getElementById('page-subtitle').textContent = titles[section].subtitle;

    // Load content based on section
    const contentArea = document.getElementById('content-area');
    contentArea.className = 'fade-in';

    this.currentSection = section;

    switch (section) {
      case 'dashboard':
        if (typeof DashboardModule !== 'undefined') {
          EnhancedDashboardModule.loadContent();
          // DashboardModule.loadContent();
        }
        break;
      case 'users':
        if (typeof UsersModule !== 'undefined') {
          UsersModule.loadContent();
        }
        break;
      case 'inventory':
        if (typeof InventoryModule !== 'undefined') {
          InventoryModule.loadContent();
        }
        break;
      case 'disparity':
        if (typeof DisparityModule !== 'undefined') {
          DisparityModule.loadContent();
        }
        break;
      case 'settings':
        if (typeof SettingsModule !== 'undefined') {
          SettingsModule.loadContent();
        }
        break;
      case 'help':
        if (typeof HelpModule !== 'undefined') {
          HelpModule.loadContent();
        }
        break;
    }
  }
}

// Global functions for HTML onclick events
function showContent(section) {
  if (window.mainController) {
    window.mainController.showContent(section);
  }
}

// Initialize main controller when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  window.mainController = new MainController();
  showProfileInfo();
});

function showProfileInfo() {
  const userName = localStorage.getItem("userName");
  const userPhoto = localStorage.getItem("userPhoto");
  const userRole = localStorage.getItem("userRole");

  // Ganti value di elemen HTML jika ada
  if (userName) {
    document.getElementById("username").innerText = userName;
  }

  if (userRole) {
    const formattedRole = userRole
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize setiap kata

    document.getElementById("role").innerText = formattedRole;
  }

  if (userPhoto) {
    // Ambil elemen pembungkus ikon (yang saat ini berbentuk lingkaran dengan svg)
    const avatarContainer = document.querySelector(
      '.w-10.h-10.bg-white\\/20.rounded-full'
    );

    if (avatarContainer) {
      avatarContainer.innerHTML = `<img src="${userPhoto}" alt="${userName}" class="w-10 h-10 rounded-full object-cover" />`;
    }
  }
}

const buttonLogout = document.getElementById("logout");

buttonLogout.addEventListener('click', function () {
  showConfirmationModal({
    title: 'Konfirmasi Logout',
    message: 'Apakah kamu yakin ingin logout?',
    onConfirm: () => {
      localStorage.removeItem("userRole");
      localStorage.removeItem("sessionToken");
      // Redirect pengguna ke halaman login
      window.location.href = "../";
    }
  });
});

function showConfirmationModal({ title = 'Konfirmasi', message = 'Apakah Anda yakin?', onConfirm }) {
  const modal = document.getElementById('modalConfirmation');
  const titleElement = modal.querySelector('h2');
  const messageElement = modal.querySelector('p');
  const confirmButton = modal.querySelector('#confirmLogout');
  const cancelButton = modal.querySelector('#cancelLogout');

  // Update isi modal
  titleElement.textContent = title;
  messageElement.textContent = message;

  // Tampilkan modal
  modal.classList.remove('hidden');

  // Bersihkan event listener sebelumnya
  const newConfirmButton = confirmButton.cloneNode(true);
  confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

  // Pasang event baru
  newConfirmButton.addEventListener('click', () => {
    onConfirm();
    modal.classList.add('hidden');
  });

  cancelButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
}

document.querySelectorAll('[data-role]').forEach(el => {
  const allowedRoles = el.getAttribute('data-role').split(',').map(role => role.trim());
  const currentUserRole = localStorage.getItem("userRole");

  if (!allowedRoles.includes(currentUserRole)) {
    el.style.display = 'none';
  }
});
