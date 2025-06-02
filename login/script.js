// Import dan initialize
import FirebaseAuthHandler from '../firebase/firebaseAuth.js';

const authHandler = new FirebaseAuthHandler();

async function loginWithGoogle() {
  // Get the button element
  const button = event.target.closest('button');
  const originalText = button.innerHTML;

  // Loading state
  button.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Connecting to Google...
  `;
  button.disabled = true;
  button.classList.add('loading');

  try {
    // Actual Firebase Google login
    const result = await authHandler.loginWithGmail();

    if (result.success) {
      // Get user role from Firestore
      const roleResult = await authHandler.getUserRole(result.user.uid);
      const userRole = roleResult.success ? roleResult.role : 'user';

      // Success message
      showNotification('Login dengan Google berhasil!', 'success');

      // Store user data (Note: Consider using secure storage in production)
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("sessionToken", result.user.uid); // Using UID as session token
      localStorage.setItem("userEmail", result.user.email);
      localStorage.setItem("userName", result.user.displayName || '');
      localStorage.setItem("userPhoto", result.user.photoURL || '');

      // Reset button
      button.innerHTML = originalText;
      button.disabled = false;
      button.classList.remove('loading');


      console.log("userRole", userRole);
      console.log("sessionToken", result.user.uid); // Using UID as session token
      console.log("userEmail", result.user.email);
      console.log("userName", result.user.displayName || '');
      console.log("userPhoto", result.user.photoURL || '');

      // Redirect to dashboard
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        window.location.href = '../';
      }, 1500);

    } else {
      // Handle login failure
      throw new Error(result.message || 'Login gagal');
    }

  } catch (error) {
    console.error('Error during Google login:', error);

    // Show error notification
    showNotification(error.message || 'Terjadi kesalahan saat login dengan Google', 'error');

    // Reset button
    button.innerHTML = originalText;
    button.disabled = false;
    button.classList.remove('loading');
  }
}

// Show notification function
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 glass-effect px-6 py-4 rounded-2xl text-white font-medium transform translate-x-full transition-transform duration-300`;

  // Add icon based on type
  let icon = '';
  if (type === 'success') {
    icon = `<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>`;
  } else if (type === 'error') {
    icon = `<svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>`;
  }

  notification.innerHTML = `
        <div class="flex items-center space-x-3">
            ${icon}
            <span>${message}</span>
        </div>
    `;

  // Add to DOM
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add parallax effect to background elements
function initParallaxEffect() {
  document.addEventListener('mousemove', function (e) {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = (e.clientY / window.innerHeight) * 2 - 1;

    const elements = document.querySelectorAll('.floating-animation');
    elements.forEach((el, index) => {
      const speed = (index % 3 + 1) * 0.8;
      const x = mouseX * speed;
      const y = mouseY * speed;

      el.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// Initialize hover effects for alternative login buttons
function initAlternativeButtons() {
  const altButtons = document.querySelectorAll('.glass-effect button');

  altButtons.forEach(button => {
    button.addEventListener('click', function () {
      if (this.querySelector('span')) {
        const platform = this.querySelector('span').textContent;
        showNotification(`${platform} login coming soon!`, 'info');
      }
    });
  });
}

// Add smooth scroll behavior
function initSmoothInteractions() {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('button');

  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Add CSS for ripple effect dynamically
function addRippleStyles() {
  const style = document.createElement('style');
  style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        button {
            position: relative;
            overflow: hidden;
        }
    `;
  document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize all interactive features
  initParallaxEffect();
  initAlternativeButtons();
  initSmoothInteractions();
  addRippleStyles();

  // Add loading animation to page
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(20px)';
  document.body.style.transition = 'all 0.6s ease';

  setTimeout(() => {
    document.body.style.opacity = '1';
    document.body.style.transform = 'translateY(0)';
  }, 100);

  // Console welcome message
  console.log('%c🎉 Welcome to PDC JKIND Login Page!', 'color: #667eea; font-size: 16px; font-weight: bold;');
  console.log('%cBuilt with ❤️ by Ryan Dev', 'color: #764ba2; font-size: 12px;');
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', function () {
  // Adjust animations for mobile
  const isMobile = window.innerWidth < 768;
  const bubbles = document.querySelectorAll('.floating-animation');

  bubbles.forEach(bubble => {
    if (isMobile) {
      bubble.style.animationDuration = '8s';
    } else {
      bubble.style.animationDuration = '6s';
    }
  });
});

document.querySelector('.google-btn').addEventListener('click', loginWithGoogle);
