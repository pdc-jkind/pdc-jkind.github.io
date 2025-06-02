// Contact Developer function
function contactDeveloper() {
  const button = event.target.closest('button');
  const originalText = button.innerHTML;

  // Loading state
  button.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Menghubungkan...
    `;
  button.disabled = true;
  button.classList.add('loading');

  // Simulate opening email client
  setTimeout(() => {
    // Open email client with pre-filled subject
    const subject = encodeURIComponent('Request Access - Aplikasi JKIND');
    const body = encodeURIComponent(`Halo Developer,

Saya ingin mengajukan permintaan akses untuk aplikasi JKIND.

Detail Informasi:
- Nama: [Nama Anda]
- Email: [Email Anda]
- Keperluan: [Jelaskan keperluan penggunaan aplikasi]
- Tanggal Request: ${new Date().toLocaleDateString('id-ID')}

Mohon diproses untuk pemberian akses.

Terima kasih.`);

    window.location.href = `mailto:developer@jkind.com?subject=${subject}&body=${body}`;

    // Show success notification
    showNotification('Email client dibuka! Silahkan kirim email untuk request akses.', 'success');

    // Reset button
    button.innerHTML = originalText;
    button.disabled = false;
    button.classList.remove('loading');

  }, 1500);
}

// Contact WhatsApp function
function contactWhatsApp() {
  const button = event.target.closest('button');
  const originalText = button.innerHTML;

  // Loading state
  button.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Membuka WhatsApp...
    `;
  button.disabled = true;
  button.classList.add('loading');

  // Simulate opening WhatsApp
  setTimeout(() => {
    // WhatsApp number (ganti dengan nomor developer yang sebenarnya)
    const phoneNumber = '6281234567890'; // Format: country code + number (tanpa +)
    const message = encodeURIComponent(`Halo Developer JKIND,

Saya ingin mengajukan request akses untuk aplikasi JKIND.

Detail:
- Tanggal: ${new Date().toLocaleDateString('id-ID')}
- Waktu: ${new Date().toLocaleTimeString('id-ID')}

Mohon bantuan untuk diproses. Terima kasih! 🙏`);

    // Open WhatsApp Web or App
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Show success notification
    showNotification('WhatsApp dibuka! Silahkan kirim pesan untuk request akses.', 'success');

    // Reset button
    button.innerHTML = originalText;
    button.disabled = false;
    button.classList.remove('loading');

  }, 1500);
}

// Back to Login function
function backToLogin() {
  const button = event.target.closest('button');

  // Add loading effect
  button.classList.add('loading');
  showNotification('Kembali ke halaman login...', 'info');

  // Simulate redirect to login page
  setTimeout(() => {
    localStorage.clear("userRole");
    localStorage.clear("sessionToken");
    // Ganti dengan URL halaman login yang sebenarnya
    window.location.href = '../';
    // atau gunakan: window.history.back();
  }, 1000);
}

// Show notification function - COMPLETED
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 glass-effect px-6 py-4 rounded-2xl text-white font-medium transform translate-x-full transition-transform duration-300`;

  // Add type-specific styling
  if (type === 'success') {
    notification.classList.add('notification-success');
  } else if (type === 'error') {
    notification.classList.add('notification-error');
  } else {
    notification.classList.add('notification-info');
  }

  // Add icon based on type
  let icon = '';
  if (type === 'success') {
    icon = `<svg class="w-5 h-5 text-green-200" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`;
  } else if (type === 'error') {
    icon = `<svg class="w-5 h-5 text-red-200" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`;
  } else {
    icon = `<svg class="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>`;
  }

  // Set notification content
  notification.innerHTML = `
        <div class="flex items-center space-x-3">
            ${icon}
            <span>${message}</span>
        </div>
    `;

  // Add to DOM
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);

  // Auto hide after 4 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);

  // Allow manual close on click
  notification.addEventListener('click', () => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  });
}

// Add shake animation to main card when access denied
function shakeCard() {
  const card = document.querySelector('.glass-effect');
  card.classList.add('shake-animation');
  setTimeout(() => {
    card.classList.remove('shake-animation');
  }, 500);
}

// Initialize page functions
document.addEventListener('DOMContentLoaded', function () {
  // Add hover effects to floating bubbles
  const bubbles = document.querySelectorAll('.floating-animation');
  bubbles.forEach(bubble => {
    bubble.addEventListener('mouseenter', function () {
      this.style.animationPlayState = 'paused';
      this.style.transform = 'scale(1.1)';
    });

    bubble.addEventListener('mouseleave', function () {
      this.style.animationPlayState = 'running';
      this.style.transform = 'scale(1)';
    });
  });

  // Add click animation to lock icon
  const lockIcon = document.querySelector('.pulse-animation');
  if (lockIcon) {
    lockIcon.addEventListener('click', function () {
      shakeCard();
      showNotification('Akses masih ditolak! Hubungi developer untuk mendapatkan akses.', 'error');
    });
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // ESC key to go back to login
    if (e.key === 'Escape') {
      backToLogin();
    }
    // Ctrl/Cmd + E for email
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      contactDeveloper();
    }
    // Ctrl/Cmd + W for WhatsApp
    if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
      e.preventDefault();
      contactWhatsApp();
    }
  });

  // Show welcome message with keyboard shortcuts
  setTimeout(() => {
    showNotification('Gunakan ESC untuk kembali, Ctrl+E untuk email, Ctrl+W untuk WhatsApp', 'info');
  }, 2000);

  // Add focus trap for accessibility
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const modal = document.querySelector('.glass-effect');
  const focusableContent = modal.querySelectorAll(focusableElements);
  const firstFocusableElement = focusableContent[0];
  const lastFocusableElement = focusableContent[focusableContent.length - 1];

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Focus first button for accessibility
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }
});

// Add console warning for security
console.warn('🚨 PERINGATAN KEAMANAN: Jangan masukkan kode JavaScript yang tidak dikenal di console browser ini. Ini bisa membahayakan keamanan akun Anda.');

// Add error handling for network issues
window.addEventListener('offline', function () {
  showNotification('Koneksi internet terputus. Beberapa fitur mungkin tidak bekerja.', 'error');
});

window.addEventListener('online', function () {
  showNotification('Koneksi internet kembali normal.', 'success');
});

// Add performance monitoring
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.loadEventEnd - entry.navigationStart > 3000) {
      console.warn('Halaman membutuhkan waktu lebih dari 3 detik untuk dimuat.');
    }
  }
});

if ('PerformanceObserver' in window) {
  observer.observe({ entryTypes: ['navigation'] });
}