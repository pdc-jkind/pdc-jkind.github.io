// users.js - Enhanced Users Management Module with Firebase Integration
import FirebaseAuthHandler from '../../firebase/firebaseAuth.js';

const firebaseAuth = new FirebaseAuthHandler();

const UsersModule = {
  data: {
    users: [],
    roles: ['user', 'admin', 'contributor', 'monitor'],
    editingUser: null,
    isLoading: false,
    isInitialized: false,
    firebaseAuth: null
  },

  // Initialize Firebase Auth Handler
  init(firebaseAuthInstance) {
    this.data.firebaseAuth = firebaseAuthInstance || firebaseAuth;
    this.data.isInitialized = true;
  },

  // Main loadContent method called by MainController
  async loadContent() {
    try {
      // First, render the HTML structure with skeleton loading
      this.renderInitialHTML();

      // Bind events immediately after HTML is rendered
      this.bindEvents();

      // Then load the actual data
      await this.loadUsers();

    } catch (error) {
      console.error('Error in loadContent:', error);
      this.showError('Gagal memuat halaman pengguna');
    }
  },

  // Render initial HTML structure
  renderInitialHTML() {
    const content = this.generateUsersHTML();
    document.getElementById('content-area').innerHTML = content;

    // Show loading state immediately
    this.setLoadingState(true);
  },

  // Load users from Firebase with proper loading states
  async loadUsers() {
    if (!this.data.firebaseAuth) {
      console.error('Firebase Auth Handler not initialized');
      this.showError('Firebase tidak tersedia');
      return;
    }

    this.setLoadingState(true);

    try {
      const result = await this.data.firebaseAuth.getAllRegisteredEmails(100);

      // Simulate minimum loading time for better UX (optional)
      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.success) {
        this.data.users = result.users || [];
        this.updateUI();
        this.showSuccess(`Berhasil memuat ${this.data.users.length} pengguna`);
      } else {
        this.showError('Gagal memuat data pengguna: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.showError('Terjadi kesalahan saat memuat data pengguna');
    } finally {
      this.setLoadingState(false);
    }
  },

  // Set loading state and update UI accordingly
  setLoadingState(isLoading) {
    this.data.isLoading = isLoading;

    const loadingOverlay = document.getElementById('loadingOverlay');
    const refreshBtn = document.querySelector('[onclick="UsersModule.refreshUsers()"]');

    if (loadingOverlay) {
      if (isLoading) {
        loadingOverlay.classList.remove('hidden');
        loadingOverlay.classList.add('flex');
      } else {
        loadingOverlay.classList.add('hidden');
        loadingOverlay.classList.remove('flex');
      }
    }

    // Disable refresh button during loading
    if (refreshBtn) {
      refreshBtn.disabled = isLoading;
      refreshBtn.classList.toggle('opacity-50', isLoading);
    }

    // Update table and stats with skeleton or real data
    this.updateUsersTable();
    this.updateStatistics();
  },

  // Update all UI components
  updateUI() {
    this.updateUsersTable();
    this.updateStatistics();
  },

  // Generate main HTML structure
  generateUsersHTML() {
    return `
      <div class="glass-effect rounded-2xl p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-white">Daftar Pengguna</h3>
            <p class="text-white/70 text-sm mt-1">Kelola akses dan peran pengguna sistem</p>
          </div>
          <button onclick="UsersModule.refreshUsers()" class="px-4 py-2 rounded-xl glass-effect border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>

        <!-- Users Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/20">
                <th class="text-left text-white/70 text-sm font-medium pb-4">UID</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Nama</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Email</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Role</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Status</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Login Terakhir</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Aksi</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
              <!-- Content will be populated by updateUsersTable() -->
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div id="emptyState" class="hidden text-center py-12">
          <svg class="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-white/70 mb-2">Tidak ada pengguna</h3>
          <p class="text-white/50 text-sm">Belum ada data pengguna yang tersedia</p>
        </div>

        <!-- Error Message -->
        <div id="errorMessage" class="hidden mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span id="errorText" class="text-red-400 text-sm"></span>
          </div>
        </div>

        <!-- Success Message -->
        <div id="successMessage" class="hidden mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span id="successText" class="text-green-400 text-sm"></span>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div id="statsContainer" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Content will be populated by updateStatistics() -->
      </div>

      <!-- Edit User Modal -->
      <div id="userModal" class="fixed inset-0 modal-backdrop hidden items-center justify-center z-50">
        <div class="glass-effect rounded-2xl p-6 w-full max-w-md mx-4">
          <div class="flex items-center justify-between mb-4">
            <h3 id="userModalTitle" class="text-xl font-bold text-white">Edit User</h3>
            <button onclick="UsersModule.closeUserModal()" class="text-white/60 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <form id="userForm" class="space-y-4">
            <div>
              <label class="block text-white/80 text-sm font-medium mb-2">Nama Lengkap</label>
              <input type="text" id="userName" class="w-full px-4 py-3 rounded-xl glass-effect border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40" placeholder="Masukkan nama lengkap" />
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-2">Email</label>
              <input type="email" id="userEmail" class="w-full px-4 py-3 rounded-xl glass-effect border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40" placeholder="Masukkan email" readonly />
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-2">Role</label>
              <select id="userRole" class="w-full px-4 py-3 rounded-xl glass-effect border border-white/20 text-white focus:outline-none focus:border-white/40" required>
                ${this.data.roles.map(role => `<option value="${role}">${role.charAt(0).toUpperCase() + role.slice(1)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-white/80 text-sm font-medium mb-2">Status</label>
              <select id="userStatus" class="w-full px-4 py-3 rounded-xl glass-effect border border-white/20 text-white focus:outline-none focus:border-white/40" required>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
            <div class="flex space-x-3 pt-4">
              <button type="button" onclick="UsersModule.closeUserModal()" class="flex-1 px-4 py-3 rounded-xl glass-effect border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                Batal
              </button>
              <button type="submit" id="saveUserBtn" class="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-all duration-300">
                <span class="save-text">Simpan</span>
                <span class="loading-text hidden">
                  <svg class="animate-spin h-4 w-4 inline mr-2" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div id="loadingOverlay" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-40">
        <div class="glass-effect rounded-2xl p-6 text-center">
          <svg class="animate-spin h-8 w-8 text-white mx-auto mb-4" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-white">Memuat data pengguna...</p>
        </div>
      </div>
    `;
  },

  // Generate skeleton loading rows
  generateSkeletonRows() {
    const skeletonRow = `
      <tr class="border-b border-white/10">
        <td class="py-4"><div class="h-4 bg-white/10 rounded animate-pulse w-20"></div></td>
        <td class="py-4"><div class="h-4 bg-white/10 rounded animate-pulse w-32"></div></td>
        <td class="py-4"><div class="h-4 bg-white/10 rounded animate-pulse w-48"></div></td>
        <td class="py-4"><div class="h-6 bg-white/10 rounded-full animate-pulse w-20"></div></td>
        <td class="py-4"><div class="h-6 bg-white/10 rounded-full animate-pulse w-16"></div></td>
        <td class="py-4"><div class="h-4 bg-white/10 rounded animate-pulse w-28"></div></td>
        <td class="py-4">
          <div class="flex space-x-2">
            <div class="w-8 h-8 bg-white/10 rounded-lg animate-pulse"></div>
          </div>
        </td>
      </tr>
    `;
    return Array(5).fill(skeletonRow).join('');
  },

  // Generate skeleton loading stats
  generateSkeletonStats() {
    const skeletonCard = `
      <div class="glass-effect rounded-2xl p-6 text-center">
        <div class="w-12 h-12 bg-white/10 rounded-xl mx-auto mb-3 animate-pulse"></div>
        <div class="h-8 bg-white/10 rounded animate-pulse mb-2 w-16 mx-auto"></div>
        <div class="h-4 bg-white/10 rounded animate-pulse w-20 mx-auto"></div>
      </div>
    `;
    return Array(4).fill(skeletonCard).join('');
  },

  // Generate users table rows
  generateUsersRows() {
    if (this.data.isLoading) {
      return this.generateSkeletonRows();
    }

    if (this.data.users.length === 0) {
      return `
        <tr>
          <td colspan="7" class="py-8 text-center">
            <div class="text-white/50">Tidak ada data pengguna</div>
          </td>
        </tr>
      `;
    }

    return this.data.users.map(user => `
      <tr class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
        <td class="py-4 text-white text-sm font-mono">${(user.uid || '').substring(0, 8)}...</td>
        <td class="py-4 text-white text-sm font-medium">${user.displayName || 'N/A'}</td>
        <td class="py-4 text-white/80 text-sm">${user.email || 'N/A'}</td>
        <td class="py-4 text-white/80 text-sm">
          <span class="px-3 py-1 rounded-full text-xs font-medium ${this.getRoleBadgeClass(user.role || 'user')}">${(user.role || 'user').charAt(0).toUpperCase() + (user.role || 'user').slice(1)}</span>
        </td>
        <td class="py-4 text-white/80 text-sm">
          <span class="px-3 py-1 rounded-full text-xs font-medium ${(user.isActive !== false) ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">${(user.isActive !== false) ? 'Aktif' : 'Nonaktif'}</span>
        </td>
        <td class="py-4 text-white/80 text-sm">${this.formatDateTime(user.lastLogin)}</td>
        <td class="py-4">
          <div class="flex space-x-2">
            <button onclick="UsersModule.editUser('${user.uid}')" class="p-2 rounded-lg glass-effect text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300" title="Edit">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  // Generate statistics cards
  generateStatsCards() {
    if (this.data.isLoading) {
      return this.generateSkeletonStats();
    }

    const totalUsers = this.data.users.length;
    const activeUsers = this.data.users.filter(u => u.isActive !== false).length;
    const adminUsers = this.data.users.filter(u => u.role === 'admin').length;
    const contributorUsers = this.data.users.filter(u => u.role === 'contributor').length;

    return `
      <div class="glass-effect rounded-2xl p-6 text-center hover:bg-white/5 transition-colors duration-300">
        <div class="w-12 h-12 bg-blue-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
          </svg>
        </div>
        <p class="text-2xl font-bold text-white">${totalUsers}</p>
        <p class="text-white/70 text-sm">Total User</p>
      </div>

      <div class="glass-effect rounded-2xl p-6 text-center hover:bg-white/5 transition-colors duration-300">
        <div class="w-12 h-12 bg-green-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
          <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <p class="text-2xl font-bold text-white">${activeUsers}</p>
        <p class="text-white/70 text-sm">User Aktif</p>
      </div>

      <div class="glass-effect rounded-2xl p-6 text-center hover:bg-white/5 transition-colors duration-300">
        <div class="w-12 h-12 bg-purple-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-2.257-.257A6 6 0 1118 8zM2 8a8 8 0 1016 0 8 8 0 00-16 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <p class="text-2xl font-bold text-white">${adminUsers}</p>
        <p class="text-white/70 text-sm">Administrator</p>
      </div>

      <div class="glass-effect rounded-2xl p-6 text-center hover:bg-white/5 transition-colors duration-300">
        <div class="w-12 h-12 bg-orange-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
          <svg class="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <p class="text-2xl font-bold text-white">${contributorUsers}</p>
        <p class="text-white/70 text-sm">Contributor</p>
      </div>
    `;
  },

  // Update users table
  updateUsersTable() {
    const tableBody = document.querySelector('#usersTableBody');
    const emptyState = document.getElementById('emptyState');

    if (tableBody) {
      tableBody.innerHTML = this.generateUsersRows();
    }

    // Show/hide empty state
    if (emptyState) {
      if (!this.data.isLoading && this.data.users.length === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }
  },

  // Update statistics cards
  updateStatistics() {
    const statsContainer = document.querySelector('#statsContainer');
    if (statsContainer) {
      statsContainer.innerHTML = this.generateStatsCards();
    }
  },

  // Public method for refresh button
  async refreshUsers() {
    await this.loadUsers();
  },

  // Helper methods
  getRoleBadgeClass(role) {
    const classes = {
      'admin': 'bg-purple-500/20 text-purple-400',
      'contributor': 'bg-blue-500/20 text-blue-400',
      'monitor': 'bg-green-500/20 text-green-400',
      'user': 'bg-gray-500/20 text-gray-400'
    };
    return classes[role] || 'bg-gray-500/20 text-gray-400';
  },

  formatDateTime(timestamp) {
    if (!timestamp) return 'N/A';

    try {
      let date;
      if (timestamp && timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (timestamp) {
        date = new Date(timestamp);
      } else {
        return 'N/A';
      }

      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  },

  // Event binding
  bindEvents() {
    const userForm = document.getElementById('userForm');
    if (userForm) {
      userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveUser();
      });
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeUserModal();
      }
    });
  },

  // User management methods
  async editUser(uid) {
    const user = this.data.users.find(u => u.uid === uid);
    if (!user) {
      this.showError('Pengguna tidak ditemukan');
      return;
    }

    this.data.editingUser = user;
    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userName').value = user.displayName || '';
    document.getElementById('userEmail').value = user.email || '';
    document.getElementById('userRole').value = user.role || 'user';
    document.getElementById('userStatus').value = (user.isActive !== false).toString();

    const modal = document.getElementById('userModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Focus first input
    setTimeout(() => {
      document.getElementById('userName').focus();
    }, 100);
  },

  async saveUser() {
    if (!this.data.firebaseAuth || !this.data.editingUser) {
      this.showError('Data tidak tersedia');
      return;
    }

    const role = document.getElementById('userRole').value;
    const isActive = document.getElementById('userStatus').value === 'true';

    const saveBtn = document.getElementById('saveUserBtn');
    const saveText = saveBtn.querySelector('.save-text');
    const loadingText = saveBtn.querySelector('.loading-text');

    // Show loading state
    saveText.classList.add('hidden');
    loadingText.classList.remove('hidden');
    saveBtn.disabled = true;

    try {
      const roleResult = await this.data.firebaseAuth.setUserRole(
        this.data.editingUser.uid,
        role,
        this.data.firebaseAuth.getCurrentUser()?.uid
      );

      if (roleResult.success) {
        // Update local data
        const userIndex = this.data.users.findIndex(u => u.uid === this.data.editingUser.uid);
        if (userIndex !== -1) {
          this.data.users[userIndex] = {
            ...this.data.users[userIndex],
            role: role,
            isActive: isActive
          };
        }

        this.showSuccess('User berhasil diupdate');
        this.closeUserModal();
        this.updateUI();
      } else {
        this.showError('Gagal mengupdate user: ' + (roleResult.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      this.showError('Terjadi kesalahan saat mengupdate user');
    } finally {
      // Hide loading state
      saveText.classList.remove('hidden');
      loadingText.classList.add('hidden');
      saveBtn.disabled = false;
    }
  },

  closeUserModal() {
    const modal = document.getElementById('userModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    this.data.editingUser = null;

    // Reset form
    const form = document.getElementById('userForm');
    if (form) {
      form.reset();
    }
  },

  // Notification methods
  showError(message) {
    this.hideAllMessages();
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    if (errorDiv && errorText) {
      errorText.textContent = message;
      errorDiv.classList.remove('hidden');

      // Auto hide after 5 seconds
      setTimeout(() => {
        errorDiv.classList.add('hidden');
      }, 5000);
    }

    console.error('UsersModule Error:', message);
  },

  showSuccess(message) {
    this.hideAllMessages();
    const successDiv = document.getElementById('successMessage');
    const successText = document.getElementById('successText');

    if (successDiv && successText) {
      successText.textContent = message;
      successDiv.classList.remove('hidden');

      // Auto hide after 3 seconds
      setTimeout(() => {
        successDiv.classList.add('hidden');
      }, 3000);
    }

    console.log('UsersModule Success:', message);
  },

  hideAllMessages() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');

    if (errorDiv) errorDiv.classList.add('hidden');
    if (successDiv) successDiv.classList.add('hidden');
  },

  // Search and filter functionality
  initSearchAndFilter() {
    // Add search input to header if needed
    const headerDiv = document.querySelector('.glass-effect .flex.items-center.justify-between');
    if (headerDiv && !document.getElementById('userSearch')) {
      const searchHTML = `
        <div class="flex items-center space-x-3">
          <div class="relative">
            <input 
              type="text" 
              id="userSearch" 
              placeholder="Cari pengguna..." 
              class="pl-10 pr-4 py-2 rounded-xl glass-effect border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 w-64"
            />
            <svg class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <select id="roleFilter" class="px-3 py-2 rounded-xl glass-effect border border-white/20 text-white focus:outline-none focus:border-white/40">
            <option value="">Semua Role</option>
            ${this.data.roles.map(role => `<option value="${role}">${role.charAt(0).toUpperCase() + role.slice(1)}</option>`).join('')}
          </select>
          <button onclick="UsersModule.refreshUsers()" class="px-4 py-2 rounded-xl glass-effect border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      `;

      // Replace the existing refresh button with the new search section
      const existingButton = headerDiv.querySelector('button');
      if (existingButton) {
        existingButton.remove();
        headerDiv.insertAdjacentHTML('beforeend', searchHTML);
      }
    }

    // Bind search and filter events
    this.bindSearchEvents();
  },

  bindSearchEvents() {
    const searchInput = document.getElementById('userSearch');
    const roleFilter = document.getElementById('roleFilter');

    if (searchInput) {
      searchInput.addEventListener('input', debounce(() => {
        this.filterUsers();
      }, 300));
    }

    if (roleFilter) {
      roleFilter.addEventListener('change', () => {
        this.filterUsers();
      });
    }
  },

  filterUsers() {
    const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('roleFilter')?.value || '';

    const filteredUsers = this.data.users.filter(user => {
      const matchesSearch = !searchTerm ||
        (user.displayName || '').toLowerCase().includes(searchTerm) ||
        (user.email || '').toLowerCase().includes(searchTerm) ||
        (user.uid || '').toLowerCase().includes(searchTerm);

      const matchesRole = !roleFilter || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    // Temporarily update data for rendering
    const originalUsers = this.data.users;
    this.data.users = filteredUsers;
    this.updateUsersTable();
    this.data.users = originalUsers; // Restore original data
  },

  // Bulk operations
  initBulkOperations() {
    // Add bulk selection checkboxes and actions
    // This would require modifying the table structure
    // For now, we'll keep it simple
  },

  // Export functionality
  exportUsers() {
    try {
      const csvContent = this.generateCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showSuccess('Data pengguna berhasil diekspor');
      }
    } catch (error) {
      console.error('Export error:', error);
      this.showError('Gagal mengekspor data pengguna');
    }
  },

  generateCSV() {
    const headers = ['UID', 'Nama', 'Email', 'Role', 'Status', 'Login Terakhir'];
    const rows = this.data.users.map(user => [
      user.uid || '',
      user.displayName || '',
      user.email || '',
      user.role || 'user',
      (user.isActive !== false) ? 'Aktif' : 'Nonaktif',
      this.formatDateTime(user.lastLogin)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    return csvContent;
  },

  // Validation methods
  validateUserData(userData) {
    const errors = [];

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Email tidak valid');
    }

    if (!userData.role || !this.data.roles.includes(userData.role)) {
      errors.push('Role tidak valid');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Cleanup and destroy
  destroy() {
    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeydown);

    // Clear data
    this.data.users = [];
    this.data.editingUser = null;
    this.data.isLoading = false;

    // Hide modals
    this.closeUserModal();
    this.setLoadingState(false);
  },

  // Keyboard event handler
  handleKeydown(e) {
    if (e.key === 'Escape') {
      UsersModule.closeUserModal();
    }
  },

  // Utility method to check if module is ready
  isReady() {
    return this.data.isInitialized && this.data.firebaseAuth !== null;
  },

  // Get current user data
  getCurrentUserData() {
    return {
      totalUsers: this.data.users.length,
      activeUsers: this.data.users.filter(u => u.isActive !== false).length,
      roles: this.data.roles,
      isLoading: this.data.isLoading
    };
  }
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize the module
UsersModule.init(firebaseAuth);

// Export for global access
window.UsersModule = UsersModule;

export default UsersModule;