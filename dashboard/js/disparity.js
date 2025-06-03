// disparity.js - Disparity Module
const DisparityModule = {
  data: {
    items: [
      { id: 1, name: 'Laptop Dell Inspiron', expected: 5, actual: 4, unit: 'unit', supplier: 'PT Tech Solutions', date: '2025-05-29', status: 'Kurang' },
      { id: 2, name: 'Mouse Wireless Logitech', expected: 25, actual: 25, unit: 'unit', supplier: 'CV Elektronik Jaya', date: '2025-05-29', status: 'Sesuai' },
      { id: 3, name: 'Monitor LED 24 inch', expected: 10, actual: 8, unit: 'unit', supplier: 'PT Display Tech', date: '2025-05-28', status: 'Kurang' },
      { id: 4, name: 'Printer LaserJet Pro', expected: 4, actual: 5, unit: 'unit', supplier: 'PT Print Solutions', date: '2025-05-23', status: 'Lebih' },
    ]
  },

  loadContent() {
    const content = this.generateDisparityHTML();
    document.getElementById('content-area').innerHTML = content;
    this.bindEvents();
  },

  generateDisparityHTML() {
    return `
      <div class="glass-effect rounded-2xl p-6 mb-6">
        <h3 class="text-xl font-bold text-white mb-4">Laporan Disparitas</h3>
        <p class="text-white/70 text-sm mb-6">Data perbandingan jumlah barang yang diterima dengan jumlah seharusnya</p>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/20">
                <th class="text-left text-white/70 text-sm font-medium pb-4">ID</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Nama Barang</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Expected</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Actual</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Supplier</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Tanggal</th>
                <th class="text-left text-white/70 text-sm font-medium pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              ${this.generateDisparityRows()}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  generateDisparityRows() {
    return this.data.items.map(item => `
      <tr class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
        <td class="py-4 text-white/80 text-sm">${item.id}</td>
        <td class="py-4 text-white font-medium">${item.name}</td>
        <td class="py-4 text-white/80">${item.expected} ${item.unit}</td>
        <td class="py-4 text-white/80">${item.actual} ${item.unit}</td>
        <td class="py-4 text-white/80">${item.supplier}</td>
        <td class="py-4 text-white/80">${this.formatDate(item.date)}</td>
        <td class="py-4">
          <span class="px-2 py-1 rounded-lg text-xs font-medium ${this.getStatusClass(item.status)}">
            ${item.status}
          </span>
        </td>
      </tr>
    `).join('');
  },

  getStatusClass(status) {
    switch (status) {
      case 'Sesuai':
        return 'bg-green-500/20 text-green-400';
      case 'Kurang':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Lebih':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  bindEvents() {
    // Placeholder untuk fitur tambahan, misalnya filter
  }
};
