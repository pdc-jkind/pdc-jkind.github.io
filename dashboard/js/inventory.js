// inventory.js - Inventory Management Module (Continued)
const InventoryModule = {
  data: {
    items: [
      { id: 1, name: 'Laptop Dell Inspiron', quantity: 5, unit: 'unit', supplier: 'PT Tech Solutions', date: '2025-05-29', description: 'Laptop untuk divisi IT', status: 'Diterima' },
      { id: 2, name: 'Mouse Wireless Logitech', quantity: 25, unit: 'unit', supplier: 'CV Elektronik Jaya', date: '2025-05-29', description: 'Mouse untuk semua karyawan', status: 'Diterima' },
      { id: 3, name: 'Keyboard Mechanical RGB', quantity: 10, unit: 'unit', supplier: 'Toko Gaming Pro', date: '2025-05-28', description: 'Keyboard gaming untuk tim development', status: 'Diterima' },
      { id: 4, name: 'Monitor LED 24 inch', quantity: 8, unit: 'unit', supplier: 'PT Display Tech', date: '2025-05-28', description: 'Monitor tambahan untuk workstation', status: 'Pending' },
      { id: 5, name: 'Webcam HD 1080p', quantity: 15, unit: 'unit', supplier: 'CV Multi Elektronik', date: '2025-05-27', description: 'Webcam untuk meeting online', status: 'Diterima' },
      { id: 6, name: 'Hard Drive External 1TB', quantity: 12, unit: 'unit', supplier: 'PT Storage Pro', date: '2025-05-26', description: 'Storage backup data', status: 'Diterima' },
      { id: 7, name: 'Router WiFi 6', quantity: 3, unit: 'unit', supplier: 'Network Solutions', date: '2025-05-25', description: 'Upgrade jaringan kantor', status: 'Diterima' },
      { id: 8, name: 'UPS 1000VA', quantity: 6, unit: 'unit', supplier: 'Power Systems Ltd', date: '2025-05-24', description: 'Backup power untuk server', status: 'Diterima' },
      { id: 9, name: 'Printer LaserJet Pro', quantity: 4, unit: 'unit', supplier: 'PT Print Solutions', date: '2025-05-23', description: 'Printer untuk divisi administrasi', status: 'Diterima' },
      { id: 10, name: 'Scanner Dokumen A3', quantity: 2, unit: 'unit', supplier: 'Office Supplies Co.', date: '2025-05-22', description: 'Scanner untuk arsip dokumen', status: 'Pending' },
      { id: 11, name: 'Kabel LAN Cat6 50m', quantity: 20, unit: 'roll', supplier: 'Network Solutions', date: '2025-05-21', description: 'Kabel jaringan untuk instalasi baru', status: 'Diterima' },
      { id: 12, name: 'Proyektor Full HD', quantity: 3, unit: 'unit', supplier: 'AV Tech Indo', date: '2025-05-20', description: 'Proyektor untuk ruang meeting', status: 'Diterima' },
      { id: 13, name: 'Speaker Bluetooth', quantity: 10, unit: 'unit', supplier: 'Sound Solutions', date: '2025-05-19', description: 'Speaker untuk ruang santai', status: 'Diterima' },
      { id: 14, name: 'Kursi Kantor Ergonomis', quantity: 15, unit: 'unit', supplier: 'PT Furniture Office', date: '2025-05-18', description: 'Kursi untuk karyawan', status: 'Diterima' },
      { id: 15, name: 'Meja Kantor Modular', quantity: 10, unit: 'unit', supplier: 'PT Furniture Office', date: '2025-05-17', description: 'Meja kerja untuk kantor baru', status: 'Pending' },
      { id: 16, name: 'Rak Server 42U', quantity: 1, unit: 'unit', supplier: 'Data Center Supplies', date: '2025-05-16', description: 'Rak untuk server utama', status: 'Diterima' },
      { id: 17, name: 'Kipas Angin Meja', quantity: 20, unit: 'unit', supplier: 'CV Elektronik Jaya', date: '2025-05-15', description: 'Kipas untuk ruangan kantor', status: 'Diterima' },
      { id: 18, name: 'AC Split 1 PK', quantity: 5, unit: 'unit', supplier: 'PT Cooling System', date: '2025-05-14', description: 'AC untuk ruangan meeting', status: 'Diterima' },
      { id: 19, name: 'Whiteboard 2x1 Meter', quantity: 3, unit: 'unit', supplier: 'Office Supplies Co.', date: '2025-05-13', description: 'Whiteboard untuk ruang meeting', status: 'Diterima' },
      { id: 20, name: 'Kabel HDMI 5 Meter', quantity: 10, unit: 'unit', supplier: 'AV Tech Indo', date: '2025-05-12', description: 'Kabel untuk proyektor dan monitor', status: 'Diterima' },
      { id: 21, name: 'Laptop MacBook Pro M2', quantity: 2, unit: 'unit', supplier: 'Apple Distributor', date: '2025-05-11', description: 'Laptop untuk divisi desain', status: 'Diterima' },
      { id: 22, name: 'Headset Noise Cancelling', quantity: 7, unit: 'unit', supplier: 'PT AudioPro', date: '2025-05-10', description: 'Headset untuk meeting online', status: 'Diterima' },
      { id: 23, name: 'Flashdisk 64GB', quantity: 50, unit: 'unit', supplier: 'PT Memory Tech', date: '2025-05-09', description: 'Flashdisk untuk backup data', status: 'Diterima' },
      { id: 24, name: 'Toner Printer HP', quantity: 15, unit: 'unit', supplier: 'PT Print Solutions', date: '2025-05-08', description: 'Toner untuk printer HP', status: 'Diterima' },
      { id: 25, name: 'Smart TV 55 inch', quantity: 1, unit: 'unit', supplier: 'AV Tech Indo', date: '2025-05-07', description: 'TV untuk ruang tamu kantor', status: 'Diterima' },
      { id: 26, name: 'Kabel Power 3m', quantity: 30, unit: 'unit', supplier: 'Electrical Supplies', date: '2025-05-06', description: 'Kabel power untuk perangkat kantor', status: 'Diterima' },
      { id: 27, name: 'Stapler Heavy Duty', quantity: 10, unit: 'unit', supplier: 'Office Supplies Co.', date: '2025-05-05', description: 'Stapler untuk dokumen tebal', status: 'Diterima' },
      { id: 28, name: 'Alat Tulis Kantor (ATK)', quantity: 100, unit: 'paket', supplier: 'CV ATK Jaya', date: '2025-05-04', description: 'Kebutuhan alat tulis kantor', status: 'Diterima' },
      { id: 29, name: 'Projector Screen', quantity: 2, unit: 'unit', supplier: 'AV Tech Indo', date: '2025-05-03', description: 'Layar projector untuk presentasi', status: 'Diterima' },
      { id: 30, name: 'Mousepad XXL', quantity: 15, unit: 'unit', supplier: 'Gaming Gear Store', date: '2025-05-02', description: 'Mousepad untuk workstation', status: 'Diterima' },
      { id: 31, name: 'Meja Meeting Oval', quantity: 1, unit: 'unit', supplier: 'PT Furniture Office', date: '2025-05-01', description: 'Meja untuk ruang rapat', status: 'Diterima' },
      { id: 32, name: 'Kursi Lipat', quantity: 20, unit: 'unit', supplier: 'PT Furniture Office', date: '2025-04-30', description: 'Kursi untuk event kantor', status: 'Diterima' },
      { id: 33, name: 'Extention Cable 5m', quantity: 10, unit: 'unit', supplier: 'Electrical Supplies', date: '2025-04-29', description: 'Kabel ekstensi untuk workstation', status: 'Diterima' },
      { id: 34, name: 'Label Barcode 100x50', quantity: 500, unit: 'lembar', supplier: 'Barcode Supplies Co.', date: '2025-04-28', description: 'Label untuk inventaris', status: 'Diterima' },
      { id: 35, name: 'Scanner Barcode', quantity: 5, unit: 'unit', supplier: 'Barcode Supplies Co.', date: '2025-04-27', description: 'Alat scan barcode', status: 'Diterima' },
      { id: 36, name: 'CCTV Dome 4K', quantity: 6, unit: 'unit', supplier: 'Security Solutions', date: '2025-04-26', description: 'Kamera CCTV untuk keamanan', status: 'Diterima' },
      { id: 37, name: 'Switch Hub 24 Port', quantity: 2, unit: 'unit', supplier: 'Network Solutions', date: '2025-04-25', description: 'Switch hub untuk jaringan', status: 'Diterima' },
      { id: 38, name: 'Kabel Fiber Optik 100m', quantity: 1, unit: 'roll', supplier: 'Network Solutions', date: '2025-04-24', description: 'Kabel untuk jaringan backbone', status: 'Diterima' },
      { id: 39, name: 'Microphone Wireless', quantity: 4, unit: 'unit', supplier: 'AV Tech Indo', date: '2025-04-23', description: 'Mic wireless untuk presentasi', status: 'Diterima' },
      { id: 40, name: 'Genset 5000W', quantity: 1, unit: 'unit', supplier: 'PT Power Supply', date: '2025-04-22', description: 'Genset untuk cadangan listrik', status: 'Diterima' },
      { id: 41, name: 'Tangga Lipat Aluminium', quantity: 2, unit: 'unit', supplier: 'PT Alat Teknik', date: '2025-04-21', description: 'Tangga untuk perawatan gedung', status: 'Diterima' },
      { id: 42, name: 'Box Arsip', quantity: 50, unit: 'unit', supplier: 'CV ATK Jaya', date: '2025-04-20', description: 'Box untuk penyimpanan dokumen', status: 'Diterima' },
      { id: 43, name: 'Vacuum Cleaner', quantity: 2, unit: 'unit', supplier: 'PT CleanTech', date: '2025-04-19', description: 'Vacuum untuk kebersihan kantor', status: 'Diterima' },
      { id: 44, name: 'Kamera DSLR Canon', quantity: 1, unit: 'unit', supplier: 'Toko Kamera Pro', date: '2025-04-18', description: 'Kamera untuk dokumentasi', status: 'Diterima' },
      { id: 45, name: 'Tripod Kamera', quantity: 3, unit: 'unit', supplier: 'Toko Kamera Pro', date: '2025-04-17', description: 'Tripod untuk kamera DSLR', status: 'Diterima' },
      { id: 46, name: 'Alat Pengepres Kertas', quantity: 1, unit: 'unit', supplier: 'PT Mesin Kantor', date: '2025-04-16', description: 'Mesin pres untuk dokumen', status: 'Diterima' },
      { id: 47, name: 'Laptop Lenovo ThinkPad', quantity: 4, unit: 'unit', supplier: 'PT Tech Solutions', date: '2025-04-15', description: 'Laptop untuk staf administrasi', status: 'Diterima' },
      { id: 48, name: 'Kamera Mirrorless Sony', quantity: 1, unit: 'unit', supplier: 'Toko Kamera Pro', date: '2025-04-14', description: 'Kamera untuk konten media', status: 'Diterima' },
      { id: 49, name: 'Lemari Arsip Besi', quantity: 3, unit: 'unit', supplier: 'PT Furniture Office', date: '2025-04-13', description: 'Lemari penyimpanan dokumen', status: 'Diterima' },
      { id: 50, name: 'Jam Dinding Quartz', quantity: 10, unit: 'unit', supplier: 'CV Elektronik Jaya', date: '2025-04-12', description: 'Jam dinding untuk ruang kerja', status: 'Diterima' },
    ],

    suppliers: ['PT Tech Solutions', 'CV Elektronik Jaya', 'Toko Gaming Pro', 'PT Display Tech', 'CV Multi Elektronik', 'PT Storage Pro', 'Network Solutions', 'Power Systems Ltd'],
    units: ['unit', 'box', 'pack', 'set', 'kg', 'liter'],
    editingItem: null,
    currentPage: 1,
    itemsPerPage: 10,
    filteredItems: []
  },

  loadContent() {
    const content = this.generateInventoryHTML();
    document.getElementById('content-area').innerHTML = content;
    this.bindEvents();
    this.updatePagination();
    this.applyFilters();
  },

  generateInventoryHTML() {
    return `
      <div class="glass-effect rounded-2xl p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-white">Daftar Penerimaan Barang</h3>
            <p class="text-white/70 text-sm mt-1">Kelola data penerimaan barang masuk</p>
          </div>
          <button 
            onclick="InventoryModule.showAddItemModal()"
            class="px-6 py-3 bg-white text-gray-800 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
            </svg>
            <span>Tambah Barang Masuk</span>
          </button>
        </div>

        <!-- Search and Filter -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <input type="text" id="searchInput" placeholder="Cari nama barang..." class="w-full px-4 py-3 rounded-xl glass-effect border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40">
          </div>
          <div>
            <select id="supplierFilter" class="w-full px-4 py-3 rounded-xl glass-effect border border-white/20 text-white focus:outline-none focus:border-white/40">
              <option value="">Semua Supplier</option>
              ${this.data.suppliers.map(supplier => `<option value="${supplier}">${supplier}</option>`).join('')}
            </select>
          </div>
          <div>
            <select id="statusFilter" class="w-full px-4 py-3 rounded-xl glass-effect border border-white/20 text-white focus:outline-none focus:border-white/40">
              <option value="">Semua Status</option>
              <option value="Diterima">Diterima</option>
              <option value="Pending">Pending</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        <!-- Items Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/20">
                <th class="text-left text-white/70 text-sm font-medium pb-4">ID</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Nama Barang</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Jumlah</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Supplier</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Tanggal</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Status</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Aksi</th>
              </tr>
            </thead>
            <tbody id="inventoryTableBody">
              ${this.generateInventoryRows()}
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-6">
          <div class="text-white/70 text-sm">
            Menampilkan <span id="showingInfo"></span>
          </div>
          <div class="flex space-x-2" id="paginationContainer">
            <!-- Pagination buttons will be generated here -->
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="glass-effect rounded-2xl p-6 text-center">
          <div class="w-12 h-12 bg-green-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <p class="text-2xl font-bold text-white">${this.data.items.length}</p>
          <p class="text-white/70 text-sm">Total Item</p>
        </div>

        <div class="glass-effect rounded-2xl p-6 text-center">
          <div class="w-12 h-12 bg-blue-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <p class="text-2xl font-bold text-white">${this.data.items.filter(item => item.status === 'Diterima').length}</p>
          <p class="text-white/70 text-sm">Diterima</p>
        </div>

        <div class="glass-effect rounded-2xl p-6 text-center">
          <div class="w-12 h-12 bg-yellow-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <p class="text-2xl font-bold text-white">${this.data.items.filter(item => item.status === 'Pending').length}</p>
          <p class="text-white/70 text-sm">Pending</p>
        </div>

        <div class="glass-effect rounded-2xl p-6 text-center">
          <div class="w-12 h-12 bg-red-500/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <p class="text-2xl font-bold text-white">${this.data.items.filter(item => item.status === 'Ditolak').length}</p>
          <p class="text-white/70 text-sm">Ditolak</p>
        </div>
      </div>
    `;
  },

  generateInventoryRows() {
    const startIndex = (this.data.currentPage - 1) * this.data.itemsPerPage;
    const endIndex = startIndex + this.data.itemsPerPage;
    const itemsToShow = this.getFilteredItems().slice(startIndex, endIndex);

    return itemsToShow.map(item => `
      <tr class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
        <td class="py-4 text-white/80 text-sm">${item.id}</td>
        <td class="py-4 text-white font-medium">${item.name}</td>
        <td class="py-4 text-white/80">${item.quantity} ${item.unit}</td>
        <td class="py-4 text-white/80">${item.supplier}</td>
        <td class="py-4 text-white/80">${this.formatDate(item.date)}</td>
        <td class="py-4">
          <span class="px-2 py-1 rounded-lg text-xs font-medium ${this.getStatusClass(item.status)}">
            ${item.status}
          </span>
        </td>
        <td class="py-4">
          <div class="flex space-x-2">
            <button 
              onclick="InventoryModule.editItem(${item.id})"
              class="p-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
              title="Edit">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
            </button>
            <button 
              onclick="InventoryModule.deleteItem(${item.id})"
              class="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
              title="Hapus">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  getFilteredItems() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const supplierFilter = document.getElementById('supplierFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    return this.data.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm);
      const matchesSupplier = !supplierFilter || item.supplier === supplierFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesSearch && matchesSupplier && matchesStatus;
    });
  },

  applyFilters() {
    this.data.currentPage = 1;
    this.updateTable();
    this.updatePagination();
  },

  updateTable() {
    const tableBody = document.getElementById('inventoryTableBody');
    if (tableBody) {
      tableBody.innerHTML = this.generateInventoryRows();
    }
  },

  updatePagination() {
    const filteredItems = this.getFilteredItems();
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / this.data.itemsPerPage);
    const startItem = (this.data.currentPage - 1) * this.data.itemsPerPage + 1;
    const endItem = Math.min(this.data.currentPage * this.data.itemsPerPage, totalItems);

    // Update showing info
    const showingInfo = document.getElementById('showingInfo');
    if (showingInfo) {
      showingInfo.textContent = `${startItem}-${endItem} dari ${totalItems} item`;
    }

    // Update pagination buttons
    const paginationContainer = document.getElementById('paginationContainer');
    if (paginationContainer && totalPages > 1) {
      let paginationHTML = '';

      // Previous button
      if (this.data.currentPage > 1) {
        paginationHTML += `
          <button onclick="InventoryModule.changePage(${this.data.currentPage - 1})" 
                  class="px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </button>
        `;
      }

      // Page numbers
      for (let i = 1; i <= totalPages; i++) {
        if (i === this.data.currentPage) {
          paginationHTML += `
            <button class="px-3 py-2 bg-white text-gray-800 rounded-lg font-medium">
              ${i}
            </button>
          `;
        } else {
          paginationHTML += `
            <button onclick="InventoryModule.changePage(${i})" 
                    class="px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              ${i}
            </button>
          `;
        }
      }

      // Next button
      if (this.data.currentPage < totalPages) {
        paginationHTML += `
          <button onclick="InventoryModule.changePage(${this.data.currentPage + 1})" 
                  class="px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
          </button>
        `;
      }

      paginationContainer.innerHTML = paginationHTML;
    }
  },

  changePage(page) {
    this.data.currentPage = page;
    this.updateTable();
    this.updatePagination();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.applyFilters();
      });
    }

    // Filter dropdowns
    const supplierFilter = document.getElementById('supplierFilter');
    if (supplierFilter) {
      supplierFilter.addEventListener('change', () => {
        this.applyFilters();
      });
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        this.applyFilters();
      });
    }

    // Add item form
    const addItemForm = document.getElementById('addItemForm');
    if (addItemForm) {
      addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveItem();
      });
    }
  },

  showAddItemModal() {
    this.data.editingItem = null;
    document.getElementById('addItemModal').classList.remove('hidden');
    document.getElementById('addItemModal').classList.add('flex');

    // Reset form
    document.getElementById('addItemForm').reset();
    document.querySelector('#addItemModal h3').textContent = 'Tambah Barang Masuk';
  },

  closeAddItemModal() {
    document.getElementById('addItemModal').classList.add('hidden');
    document.getElementById('addItemModal').classList.remove('flex');
    this.data.editingItem = null;
  },

  editItem(id) {
    const item = this.data.items.find(item => item.id === id);
    if (item) {
      this.data.editingItem = item;

      // Fill form with existing data
      document.getElementById('itemName').value = item.name;
      document.getElementById('itemQuantity').value = item.quantity;
      document.getElementById('itemSupplier').value = item.supplier;
      document.getElementById('itemDescription').value = item.description;

      // Show modal
      document.getElementById('addItemModal').classList.remove('hidden');
      document.getElementById('addItemModal').classList.add('flex');
      document.querySelector('#addItemModal h3').textContent = 'Edit Barang';
    }
  },

  deleteItem(id) {
    showConfirmationModal({
      title: 'Konfirmasi Hapus Item',
      message: 'Apakah Anda yakin ingin menghapus item ini?',
      onConfirm: () => {
        this.data.items = this.data.items.filter(item => item.id !== id);
        this.updateTable();
        this.updatePagination();
        this.loadContent(); // Refresh statistics
      }
    });
  },

  saveItem() {
    const name = document.getElementById('itemName').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const supplier = document.getElementById('itemSupplier').value;
    const description = document.getElementById('itemDescription').value;

    if (this.data.editingItem) {
      // Update existing item
      const index = this.data.items.findIndex(item => item.id === this.data.editingItem.id);
      if (index !== -1) {
        this.data.items[index] = {
          ...this.data.items[index],
          name,
          quantity,
          supplier,
          description
        };
      }
    } else {
      // Add new item
      const newItem = {
        id: Math.max(...this.data.items.map(item => item.id)) + 1,
        name,
        quantity,
        unit: 'unit',
        supplier,
        date: new Date().toISOString().split('T')[0],
        description,
        status: 'Pending'
      };
      this.data.items.push(newItem);

      // Add supplier to list if not exists
      if (!this.data.suppliers.includes(supplier)) {
        this.data.suppliers.push(supplier);
      }
    }

    this.closeAddItemModal();
    this.loadContent(); // Refresh entire content
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  getStatusClass(status) {
    switch (status) {
      case 'Diterima':
        return 'bg-green-500/20 text-green-400';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Ditolak':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  }
};

// Global functions for HTML onclick events
function closeAddItemModal() {
  InventoryModule.closeAddItemModal();
}

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