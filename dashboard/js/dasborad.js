// dashboard.js - Dashboard Module
const DashboardModule = {
  data: {
    todayItems: 24,
    monthlyItems: 642,
    activeSuppliers: 18,
    dailyAverage: 21,
    recentItems: [
      { name: 'Laptop Dell Inspiron', quantity: '5 unit', supplier: 'PT Tech Solutions', date: '2025-05-29' },
      { name: 'Mouse Wireless Logitech', quantity: '25 unit', supplier: 'CV Elektronik Jaya', date: '2025-05-29' },
      { name: 'Keyboard Mechanical RGB', quantity: '10 unit', supplier: 'Toko Gaming Pro', date: '2025-05-28' },
      { name: 'Monitor LED 24 inch', quantity: '8 unit', supplier: 'PT Display Tech', date: '2025-05-28' },
      { name: 'Webcam HD 1080p', quantity: '15 unit', supplier: 'CV Multi Elektronik', date: '2025-05-27' }
    ],
    chartData: {
      labels: ['23 Mei', '24 Mei', '25 Mei', '26 Mei', '27 Mei', '28 Mei', '29 Mei'],
      data: [18, 22, 16, 28, 24, 19, 24]
    }
  },

  chart: null,

  loadContent(data) {
    const content = this.generateDashboardHTML();
    document.getElementById('content-area').innerHTML = content;

    console.log(data)

    // Initialize chart after content is loaded
    setTimeout(() => {
      this.initChart();
      this.updateStats();
    }, 100);
  },

  generateDashboardHTML() {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Stats Cards -->
        <div class="glass-effect rounded-2xl p-6 hover-scale">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white/70 text-sm">Barang Masuk Hari Ini</p>
              <p class="text-3xl font-bold text-white mt-1" id="todayItems">${this.data.todayItems}</p>
            </div>
            <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-400">+12%</span>
            <span class="text-white/60 ml-1">dari kemarin</span>
          </div>
        </div>

        <div class="glass-effect rounded-2xl p-6 hover-scale">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white/70 text-sm">Total Barang Bulan Ini</p>
              <p class="text-3xl font-bold text-white mt-1" id="monthlyItems">${this.data.monthlyItems}</p>
            </div>
            <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-blue-400">+8%</span>
            <span class="text-white/60 ml-1">dari bulan lalu</span>
          </div>
        </div>

        <div class="glass-effect rounded-2xl p-6 hover-scale">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white/70 text-sm">Supplier Aktif</p>
              <p class="text-3xl font-bold text-white mt-1" id="activeSuppliers">${this.data.activeSuppliers}</p>
            </div>
            <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-purple-400">+3</span>
            <span class="text-white/60 ml-1">baru bergabung</span>
          </div>
        </div>

        <div class="glass-effect rounded-2xl p-6 hover-scale">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white/70 text-sm">Rata-rata Harian</p>
              <p class="text-3xl font-bold text-white mt-1" id="dailyAverage">${this.data.dailyAverage}</p>
            </div>
            <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-orange-400">Normal</span>
            <span class="text-white/60 ml-1">trend baik</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Chart -->
        <div class="glass-effect rounded-2xl p-6">
          <h3 class="text-xl font-bold text-white mb-4">Trend Penerimaan Barang (7 Hari Terakhir)</h3>
          <div class="chart-container">
            <canvas id="receptionChart"></canvas>
          </div>
        </div>

        <!-- Recent Items Table -->
        <div class="glass-effect rounded-2xl p-6">
          <h3 class="text-xl font-bold text-white mb-4">Barang Masuk Terbaru (5 Terakhir)</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/20">
                  <th class="text-left text-white/70 text-sm font-medium pb-3">Nama Barang</th>
                  <th class="text-left text-white/70 text-sm font-medium pb-3">Jumlah</th>
                  <th class="text-left text-white/70 text-sm font-medium pb-3">Supplier</th>
                  <th class="text-left text-white/70 text-sm font-medium pb-3">Tanggal</th>
                </tr>
              </thead>
              <tbody id="recentItemsTable">
                ${this.generateRecentItemsRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Trend Analysis -->
      <div class="glass-effect rounded-2xl p-6">
        <h3 class="text-xl font-bold text-white mb-4">Analisis Trend Barang Masuk</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg class="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h4 class="text-white font-semibold">Trend Positif</h4>
            <p class="text-white/70 text-sm mt-1">Peningkatan 12% dari minggu lalu</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
            </div>
            <h4 class="text-white font-semibold">Kategori Tertinggi</h4>
            <p class="text-white/70 text-sm mt-1">Elektronik & IT Equipment</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg class="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h4 class="text-white font-semibold">Supplier Terpercaya</h4>
            <p class="text-white/70 text-sm mt-1">PT Tech Solutions (35% kontribusi)</p>
          </div>
        </div>
      </div>
    `;
  },

  generateRecentItemsRows() {
    return this.data.recentItems.map(item => `
      <tr class="border-b border-white/10">
        <td class="py-3 text-white text-sm">${item.name}</td>
        <td class="py-3 text-white/80 text-sm">${item.quantity}</td>
        <td class="py-3 text-white/80 text-sm">${item.supplier}</td>
        <td class="py-3 text-white/80 text-sm">${this.formatDate(item.date)}</td>
      </tr>
    `).join('');
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('id-ID', options);
  },

  initChart() {
    const ctx = document.getElementById('receptionChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.data.chartData.labels,
        datasets: [{
          label: 'Barang Masuk',
          data: this.data.chartData.data,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(255, 255, 255, 1)',
          pointBorderColor: 'rgba(255, 255, 255, 1)',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: { size: 14 }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: { size: 12 }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: { size: 12 }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  },

  updateStats() {
    // Simulate real-time updates (optional)
    document.getElementById('todayItems').textContent = this.data.todayItems;
    document.getElementById('monthlyItems').textContent = this.data.monthlyItems;
    document.getElementById('activeSuppliers').textContent = this.data.activeSuppliers;
    document.getElementById('dailyAverage').textContent = this.data.dailyAverage;
  }
};