// dashboard-skeleton.js - Loading Skeleton for Dashboard Module
const DashboardSkeleton = {

  showSkeleton() {
    const content = this.generateSkeletonHTML();
    document.getElementById('content-area').innerHTML = content;
    this.animateSkeleton();
  },

  generateSkeletonHTML() {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Stats Cards Skeleton -->
        ${this.generateStatsCardSkeleton().repeat(4)}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Chart Skeleton -->
        <div class="glass-effect rounded-2xl p-6">
          <div class="skeleton-item h-6 w-64 mb-4 rounded"></div>
          <div class="chart-container h-64 skeleton-item rounded-lg"></div>
        </div>

        <!-- Recent Items Table Skeleton -->
        <div class="glass-effect rounded-2xl p-6">
          <div class="skeleton-item h-6 w-48 mb-4 rounded"></div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/20">
                  <th class="text-left pb-3">
                    <div class="skeleton-item h-4 w-20 rounded"></div>
                  </th>
                  <th class="text-left pb-3">
                    <div class="skeleton-item h-4 w-16 rounded"></div>
                  </th>
                  <th class="text-left pb-3">
                    <div class="skeleton-item h-4 w-16 rounded"></div>
                  </th>
                  <th class="text-left pb-3">
                    <div class="skeleton-item h-4 w-16 rounded"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                ${this.generateTableRowSkeleton().repeat(5)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Trend Analysis Skeleton -->
      <div class="glass-effect rounded-2xl p-6">
        <div class="skeleton-item h-6 w-56 mb-4 rounded"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${this.generateTrendCardSkeleton().repeat(3)}
        </div>
      </div>
    `;
  },

  generateStatsCardSkeleton() {
    return `
      <div class="glass-effect rounded-2xl p-6">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="skeleton-item h-4 w-32 mb-2 rounded"></div>
            <div class="skeleton-item h-8 w-16 rounded"></div>
          </div>
          <div class="w-12 h-12 skeleton-item rounded-xl"></div>
        </div>
        <div class="mt-4 flex items-center">
          <div class="skeleton-item h-4 w-8 mr-2 rounded"></div>
          <div class="skeleton-item h-4 w-20 rounded"></div>
        </div>
      </div>
    `;
  },

  generateTableRowSkeleton() {
    return `
      <tr class="border-b border-white/10">
        <td class="py-3">
          <div class="skeleton-item h-4 w-32 rounded"></div>
        </td>
        <td class="py-3">
          <div class="skeleton-item h-4 w-16 rounded"></div>
        </td>
        <td class="py-3">
          <div class="skeleton-item h-4 w-24 rounded"></div>
        </td>
        <td class="py-3">
          <div class="skeleton-item h-4 w-16 rounded"></div>
        </td>
      </tr>
    `;
  },

  generateTrendCardSkeleton() {
    return `
      <div class="text-center">
        <div class="w-16 h-16 skeleton-item rounded-full mx-auto mb-3"></div>
        <div class="skeleton-item h-5 w-24 mx-auto mb-2 rounded"></div>
        <div class="skeleton-item h-4 w-32 mx-auto rounded"></div>
      </div>
    `;
  },

  animateSkeleton() {
    // Add pulsing animation to skeleton items
    const skeletonItems = document.querySelectorAll('.skeleton-item');
    skeletonItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.05}s`;
    });
  },

  hideSkeleton() {
    // Remove skeleton and show actual content
    const skeletonItems = document.querySelectorAll('.skeleton-item');
    skeletonItems.forEach(item => {
      item.classList.add('skeleton-fade-out');
    });

    setTimeout(() => {
      // Load actual dashboard content
      DashboardModule.loadContent();
    }, 50000);
  }
};

// Enhanced Dashboard Module with Loading States
const EnhancedDashboardModule = {
  ...DashboardModule,

  async loadContent() {
    // Show skeleton first
    DashboardSkeleton.showSkeleton();

    // Simulate API loading time (replace with actual API calls)
    await this.simulateDataLoading();

    // Generate and show actual content
    const content = this.generateDashboardHTML();
    document.getElementById('content-area').innerHTML = content;

    // Initialize chart and update stats with fade-in effect
    setTimeout(() => {
      this.initChart();
      this.updateStats();
      this.addFadeInAnimation();
    }, 100);
  },

  async simulateDataLoading() {
    // Simulate different loading times for different data
    const loadingPromises = [
      this.loadStatsData(),
      this.loadChartData(),
      this.loadRecentItems(),
      this.loadTrendData()
    ];

    await Promise.all(loadingPromises);
  },

  async loadStatsData() {
    return new Promise(resolve => {
      setTimeout(() => {
        // In real app, this would be an API call
        resolve();
      }, 800);
    });
  },

  async loadChartData() {
    return new Promise(resolve => {
      setTimeout(() => {
        // In real app, this would be an API call
        resolve();
      }, 1200);
    });
  },

  async loadRecentItems() {
    return new Promise(resolve => {
      setTimeout(() => {
        // In real app, this would be an API call
        resolve();
      }, 500);
    });
  },

  async loadTrendData() {
    return new Promise(resolve => {
      setTimeout(() => {
        // In real app, this would be an API call
        resolve();
      }, 1000);
    });
  },

  addFadeInAnimation() {
    // Add staggered fade-in animation to actual content
    const elements = document.querySelectorAll('.glass-effect');
    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.6s ease';

      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
};

// Usage Example
// Replace DashboardModule.loadContent() with:
// EnhancedDashboardModule.loadContent();