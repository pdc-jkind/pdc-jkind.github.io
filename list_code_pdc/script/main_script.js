import { getAllJobCostingData } from '../firebase/firebase_setup.js';
import { parseJobCosting1, parseJobCosting2 } from "../helpers/jobCostingParser.js";

let allData = {};
let selectedPDC = "";
let selectedBrand = "";

// Enhanced storage system with fallback
class JobCostingStorage {
  constructor() {
    // Fallback untuk environment yang tidak mendukung localStorage
    this.inMemoryStorage = {};
    this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
  }

  checkLocalStorageAvailability() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.log('localStorage tidak tersedia, menggunakan in-memory storage');
      return false;
    }
  }

  setItem(key, value) {
    const stringValue = JSON.stringify(value);
    if (this.isLocalStorageAvailable) {
      try {
        localStorage.setItem(key, stringValue);
      } catch (e) {
        console.warn('Gagal menyimpan ke localStorage, menggunakan in-memory storage');
        this.inMemoryStorage[key] = stringValue;
      }
    } else {
      this.inMemoryStorage[key] = stringValue;
    }
  }

  getItem(key) {
    let value = null;
    if (this.isLocalStorageAvailable) {
      try {
        value = localStorage.getItem(key);
      } catch (e) {
        console.warn('Gagal membaca dari localStorage, menggunakan in-memory storage');
        value = this.inMemoryStorage[key] || null;
      }
    } else {
      value = this.inMemoryStorage[key] || null;
    }

    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return null;
  }

  removeItem(key) {
    if (this.isLocalStorageAvailable) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        delete this.inMemoryStorage[key];
      }
    } else {
      delete this.inMemoryStorage[key];
    }
  }
}

// Initialize storage
const storage = new JobCostingStorage();

// Default configuration dengan fallback dari storage
const getInitialJobCosting = () => {
  const saved = storage.getItem('selectedJobCosting');
  if (saved && saved.text && saved.code) {
    return saved;
  }
  return {
    text: "Job Costing 1",
    code: "JC1"
  };
};

const initialJobCosting = getInitialJobCosting();
let currentJobCosting = initialJobCosting.text;
let currentJobCostingCode = initialJobCosting.code;

const loadingIndicator = document.getElementById("loadingIndicator");

// Enhanced dropdown setup dengan storage
function setupJobCostingDropdown() {
  const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
  const dropdownButton = document.querySelector('.dropdown-toggle');

  // Set initial button text dari storage atau default
  if (dropdownButton) {
    dropdownButton.textContent = currentJobCosting;
  }

  dropdownItems.forEach(item => {
    item.addEventListener('click', function (event) {
      event.preventDefault();

      const jobCostingText = this.textContent.trim();

      // Update button text
      if (dropdownButton) {
        dropdownButton.textContent = jobCostingText;
      }

      // Determine code
      let jobCostingCode = "";
      if (jobCostingText === "Job Costing 1") {
        jobCostingCode = "JC1";
      } else if (jobCostingText === "Job Costing 2") {
        jobCostingCode = "JC2";
      } else if (jobCostingText === "DO") {
        jobCostingCode = "DO";
      }

      // Update global values
      currentJobCosting = jobCostingText;
      currentJobCostingCode = jobCostingCode;

      // Save to storage
      storage.setItem('selectedJobCosting', {
        text: jobCostingText,
        code: jobCostingCode,
        timestamp: Date.now()
      });

      // Load new data
      loadAndRenderCards();
    });
  });
}

// Enhanced data caching system
class DataCache {
  constructor() {
    this.cache = {};
    this.maxAge = 5 * 60 * 1000; // Cache selama 5 menit
  }

  set(key, data) {
    this.cache[key] = {
      data: data,
      timestamp: Date.now()
    };
  }

  get(key) {
    const cached = this.cache[key];
    if (!cached) return null;

    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.maxAge) {
      delete this.cache[key];
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache = {};
  }

  remove(key) {
    delete this.cache[key];
  }
}

const dataCache = new DataCache();

async function loadAndRenderCards() {
  try {
    const container = document.getElementById("cardContainer");
    container.innerHTML = "";

    // Show loading
    loadingIndicator.style.display = "block";

    // Reset states
    allData = {};
    selectedPDC = "";
    selectedBrand = "";
    document.getElementById("searchPDC").value = "";
    document.getElementById("searchBrand").value = "";

    // Try to get data from cache first
    const cacheKey = `${currentJobCosting}_${currentJobCostingCode}`;
    let parsedData = dataCache.get(cacheKey);

    if (!parsedData) {
      console.log(`Loading fresh data for ${currentJobCosting}...`);
      parsedData = await loadJobCostingData(currentJobCosting, currentJobCostingCode);

      // Cache the data
      dataCache.set(cacheKey, parsedData);
    } else {
      console.log(`Using cached data for ${currentJobCosting}`);
    }

    loadingIndicator.style.display = "none";
    allData = {};

    // Process the data (same logic as before)
    processJobCostingData(parsedData);

    const pdcSet = new Set(Object.keys(allData));

    // Setup PDC search
    setupSearch("searchPDC", "dropdownPDC", [...pdcSet], (value) => {
      selectedPDC = value;
      selectedBrand = "";
      document.getElementById("searchBrand").value = "";

      const lokasiData = allData[selectedPDC] || {};
      const brandSet = new Set();

      Object.keys(lokasiData)
        .filter(key => key !== "batchNumber")
        .forEach(key => brandSet.add(key));

      toggleInput("searchBrand", true);

      setupSearch("searchBrand", "dropdownBrand", [...brandSet], (val) => {
        selectedBrand = val;
        renderFilteredCards();
      });

      renderFilteredCards();
    });

    toggleInput("searchBrand", false);
    renderFilteredCards();

  } catch (error) {
    console.error("Gagal memuat data dari Firestore:", error);
    loadingIndicator.style.display = "none";
  }
}

// Separate function to process data for better organization
function processJobCostingData(parsedData) {
  if (Array.isArray(parsedData)) {
    parsedData.forEach((group, groupIndex) => {
      if (Array.isArray(group)) {
        group.forEach((item, itemIndex) => {
          processDataItem(item);
        });
      } else if (typeof group === 'object' && group !== null) {
        const numericKeys = Object.keys(group).filter(k => !isNaN(parseInt(k)));
        numericKeys.forEach(key => {
          processDataItem(group[key]);
        });
      }
    });
  }
}

function processDataItem(item) {
  if (item && item.id) {
    const id = item.id;
    const batchNumber = item.batchNumber || "unknown";

    if (!allData[id]) {
      allData[id] = {
        batchNumber: batchNumber
      };
    }

    if (item.mobil && Array.isArray(item.mobil)) {
      item.mobil.forEach(mobilName => {
        allData[id][mobilName] = {
          code: item.code || [],
          describe: item.describe || [],
          warehouseCode: item.warehouseCode || []
        };
      });
    }
  }
}

// Updated loadJobCostingData function dengan error handling yang lebih baik
const loadJobCostingData = async (collectionName, structureType) => {
  try {
    const rawData = await getAllJobCostingData(collectionName);

    if (!rawData || rawData.length === 0) {
      console.warn(`No data found for collection: ${collectionName}`);
      return [];
    }

    const parsedData = rawData.map(doc => {
      try {
        if (structureType === "JC1") {
          return parseJobCosting1(doc);
        } else if (structureType === "JC2") {
          return parseJobCosting2(doc);
        } else if (structureType === "DO") {
          return parseJobCosting1(doc); // Use JC1 parser for DO
        } else {
          return doc; // fallback
        }
      } catch (parseError) {
        console.error(`Error parsing document:`, parseError);
        return null;
      }
    }).filter(item => item !== null); // Remove failed parses

    return parsedData;
  } catch (error) {
    console.error("Failed to load and parse job costing data:", error);
    throw error; // Re-throw to be handled by caller
  }
};

function toggleInput(inputId, enabled) {
  const input = document.getElementById(inputId);
  input.disabled = !enabled;
  if (!enabled) input.placeholder = "Pilih PDC terlebih dahulu";
  else input.placeholder = "Cari merek mobil";
}

function renderFilteredCards() {
  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  let cardCount = 0;

  for (const lokasi in allData) {
    if (selectedPDC && lokasi !== selectedPDC) continue;

    const lokasiData = allData[lokasi];
    const batch = lokasiData.batchNumber || "";

    for (const model in lokasiData) {
      if (model === "batchNumber") continue;
      if (selectedBrand && model !== selectedBrand) continue;

      const modelData = lokasiData[model];
      const codeData = modelData.code || {};
      const describeData = modelData.describe || [];
      const warehouseCode = modelData.warehouseCode || [];

      const col = document.createElement("div");
      col.className = "col-xl-4 col-lg-6 mb-3";

      const card = document.createElement("div");
      card.className = "card card-contain shadow-sm h-100";
      card.style.cursor = "pointer";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title mb-2">${model}</h5>
          <h6 class="card-subtitle mb-3">${lokasi}</h6>
          <p class="card-text">${batch}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        const url = new URL("https://pdc-jkind.github.io/list_code_pdc/detail.html", window.location.origin);
        url.searchParams.set("mobilName", model);
        url.searchParams.set("pdcName", lokasi);
        url.searchParams.set("batchNumber", batch);
        url.searchParams.set("warehouseCode", warehouseCode);
        url.searchParams.set("jobCosting", currentJobCosting);
        url.searchParams.set("codeData", JSON.stringify(codeData));
        url.searchParams.set("describeData", JSON.stringify(describeData));
        window.location.href = url.toString();
      });

      col.appendChild(card);
      container.appendChild(col);
      cardCount++;
    }
  }

  if (cardCount === 0) {
    const noDataMsg = document.createElement("div");
    noDataMsg.className = "col-12 text-center py-4";
    noDataMsg.innerHTML = "<h4>Tidak ada data yang sesuai dengan filter</h4>";
    container.appendChild(noDataMsg);
  }
}

function setupSearch(inputId, dropdownId, dataList, onSelect) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  let currentFocus = -1;

  input.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    dropdown.innerHTML = "";
    currentFocus = -1;

    if (!query) {
      dropdown.classList.remove("show");
      if (onSelect) onSelect("");
      return;
    }

    const filtered = dataList.filter(item => item.toLowerCase().includes(query));
    if (filtered.length === 0) {
      dropdown.classList.remove("show");
      return;
    }

    filtered.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<a class="dropdown-item" href="#">${item}</a>`;
      dropdown.appendChild(li);
    });

    dropdown.classList.add("show");
  });

  input.addEventListener("keydown", function (e) {
    const items = dropdown.querySelectorAll("a.dropdown-item");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      currentFocus = (currentFocus + 1) % items.length;
      setActive(items);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      currentFocus = (currentFocus - 1 + items.length) % items.length;
      setActive(items);
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (currentFocus > -1 && items[currentFocus]) {
        e.preventDefault();
        input.value = items[currentFocus].textContent;
        dropdown.classList.remove("show");
        if (onSelect) onSelect(input.value);
      }
    }
  });

  dropdown.addEventListener("click", function (e) {
    if (e.target && e.target.matches("a.dropdown-item")) {
      input.value = e.target.textContent;
      dropdown.classList.remove("show");
      if (onSelect) onSelect(input.value);
    }
  });

  document.addEventListener("click", function (e) {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });

  function setActive(items) {
    items.forEach(item => item.classList.remove("active"));
    if (items[currentFocus]) items[currentFocus].classList.add("active");
  }
}

// Utility function untuk clear cache jika diperlukan
function clearDataCache() {
  dataCache.clear();
  storage.removeItem('selectedJobCosting');
  console.log('Cache cleared');
}

// Export function untuk debugging
window.clearJobCostingCache = clearDataCache;

document.addEventListener("DOMContentLoaded", function () {
  setupJobCostingDropdown();
  loadAndRenderCards();
});

document.addEventListener('keydown', function (event) {
  if (event.key === '/' && !event.target.matches('input, textarea')) {
    event.preventDefault();
    document.getElementById('searchPDC').focus();
  }
});