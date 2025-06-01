// Constants and Configuration
const PDC_DATA = [
  { PDC: "TOYOTA SUNTER", batches: { jobCosting: "Job Costing 35", set: "Set 35", do: "DO 35" }, client: "PTSO" },
  { PDC: "TOYOTA SUNTER MARUNDA", batches: { jobCosting: "Job Costing 37", set: "Set 37", do: "DO 37" }, client: "PJKK" },
  { PDC: "LEXUS", batches: { jobCosting: "Job Costing 35", set: "Set 35", do: "DO 35" }, client: "PTAM" },
  { PDC: "TOYOTA CIBITUNG", batches: { jobCosting: "Job Costing 35", set: "Set 35", do: "DO 35" }, client: "PTSO" },
  { PDC: "TOYOTA CIBITUNG MARUNDA", batches: { jobCosting: "Job Costing 37", set: "Set 37", do: "DO 37" }, client: "PJKK" },
  { PDC: "TOYOTA KARAWANG", batches: { jobCosting: "Job Costing 35", set: "Set 35", do: "DO 35" }, client: "PTSO" },
  { PDC: "TOYOTA KARAWANG MARUNDA", batches: { jobCosting: "Job Costing 37", set: "Set 37", do: "DO 37" }, client: "PJKK" },
  { PDC: "PDC CHERY", batches: { jobCosting: "Job Costing 38", set: "Set 38", do: "DO 38" }, client: "PTCSI" },
  { PDC: "PDC NETA", batches: { jobCosting: "Job Costing 38", set: "Set 38", do: "DO 38" }, client: "PNETA" },
  { PDC: "PDC JETOUR", batches: { jobCosting: "Job Costing 38", set: "Set 38", do: "DO 38" }, client: "JMI" },
  { PDC: "PDC GWM DAWUAN", batches: { jobCosting: "Job Costing 38", set: "Set 38", do: "DO 38" }, client: "IIEB" },
  { PDC: "ISUZU KARAWANG TIMUR", batches: { jobCosting: "Job Costing 38", set: "Set 38", do: "DO 38" }, client: "PISO" },
  { PDC: "ISUZU KARAWANG BARAT", batches: { jobCosting: "Job Costing 38", set: "Set 38", do: "DO 38" }, client: "PISO" },
  { PDC: "DAIHATSU SUNTER", batches: { jobCosting: "Job Costing 36", set: "Set 36", do: "DO 36" }, client: "PDSO" },
  { PDC: "DAIHATSU SUNTER (BATAM)", batches: { jobCosting: "Job Costing 36", set: "Set 36", do: "DO 36" }, client: "PDSO" },
  { PDC: "PDC HASRAD", batches: { jobCosting: "Job Costing 37", set: "Set 37", do: "DO 37" }, client: "PJKK" },
  { PDC: "PDC DAWUAN", batches: { jobCosting: "Job Costing 35", set: "Set 35", do: "DO 35" }, client: "PVB" },
  { PDC: "PDC BATAM", batches: { jobCosting: "Job Costing 37", set: "Set 37", do: "DO 37" }, client: "PJKK" },
  { PDC: "PONDOK UNGU", batches: { jobCosting: "Job Costing 38", set: "Set 38", do: "DO 38" }, client: "PISO" }
];

const JOB_COSTING_TYPES = {
  JOB_COSTING: "Job Costing",
  SET: "set",
  DO: "do"
};

// Application State
class AppState {
  constructor() {
    this.currentDetail = {
      model: "",
      lokasi: "",
      describe: "",
      gudangCode: "",
      batch: "",
      jobCostingType: JOB_COSTING_TYPES.JOB_COSTING,
      productName: "",
      code: []
    };
  }

  updateJobCostingType(type) {
    this.currentDetail.jobCostingType = type;
  }

  getFormData() {
    return {
      model: this.getInputValue('pdcNameInput'),
      lokasi: this.getInputValue('mobilNameInput'),
      describe: this.getInputValue('keteranganInput'),
      batch: this.getInputValue('batchInput'),
      jobCostingType: this.getInputValue('jobCostingSelect'),
      gudangCode: this.getInputValue('gudangCodeInput')
    };
  }

  getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
  }
}

// Toast Notification System
class ToastManager {
  constructor() {
    this.toastTimeout = null;
  }

  show(message, isError = false) {
    let toast = document.getElementById("toast");
    let toastMessage = document.getElementById("toast-message");

    if (!toast || !toastMessage) {
      this.createToastElement();
      toast = document.getElementById("toast");
      toastMessage = document.getElementById("toast-message");
    }

    toastMessage.textContent = message;
    toast.style.display = "flex";
    toast.style.backgroundColor = isError ? "#e74c3c" : "#2ecc71";

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.display = "none";
    }, 2500);
  }

  createToastElement() {
    const toastDiv = document.createElement('div');
    toastDiv.id = 'toast';
    toastDiv.className = 'position-fixed bottom-0 end-0 p-3';
    toastDiv.style.display = 'none';
    toastDiv.style.zIndex = '11';

    toastDiv.innerHTML = `
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">Notifikasi</strong>
          <button type="button" class="btn-close" onclick="hideToast()"></button>
        </div>
        <div class="toast-body" id="toast-message"></div>
      </div>
    `;

    document.body.appendChild(toastDiv);
  }

  hide() {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.style.display = "none";
    }
  }
}

// Form Renderer
class FormRenderer {
  constructor(appState) {
    this.appState = appState;
  }

  renderMainForm() {
    const content = document.getElementById("detail-content");
    const html = `
      <div class="card position-relative mb-5 p-2">
        <div class="card-body">
          <div class="container bg-body-secondary p-3 mb-3 mt-3 rounded position-relative">
            <h4 class="card-title">Form Detail</h4>
          </div>

          ${this.renderFormFields()}
          ${this.renderDynamicContent()}
          ${this.renderActionButtons()}
        </div>
      </div>
    `;
    content.innerHTML = html;

    if (this.appState.currentDetail.jobCostingType === JOB_COSTING_TYPES.SET) {
      this.initializeSortable();
    }
  }

  renderFormFields() {
    return `
      <!-- Nama PDC dengan Autocomplete -->
      <div class="mb-3 autocomplete-container">
        <label for="pdcNameInput" class="form-label"><strong>Nama PDC:</strong></label>
        <input type="text" class="form-control" id="pdcNameInput" placeholder="Masukkan nama PDC..." autocomplete="off" />
        <div class="suggestions-list" id="pdcSuggestions"></div>
      </div>
      
      <!-- Nama Mobil -->
      <div class="mb-3">
        <label for="mobilNameInput" class="form-label"><strong>Nama Mobil:</strong></label>
        <input type="text" class="form-control" id="mobilNameInput" value="${this.appState.currentDetail.lokasi}" autocomplete="off" placeholder="Masukkan nama mobil...">
      </div>
      
      <!-- Keterangan -->
      <div class="mb-3">
        <label for="keteranganInput" class="form-label"><strong>Keterangan:</strong></label>
        <input class="form-control" id="keteranganInput" placeholder="Masukkan keterangan..." autocomplete="off" value="${this.appState.currentDetail.describe}">
      </div>
      
      <!-- Kode Gudang -->
      <div class="mb-3">
        <label for="gudangCodeInput" class="form-label"><strong>Kode Gudang:</strong></label>
        <input class="form-control" id="gudangCodeInput" placeholder="Masukkan kode gudang..." autocomplete="off" value="${this.appState.currentDetail.gudangCode}">
      </div>

      <!-- Job Costing Type Dropdown -->
      <div class="mb-3">
        <label for="jobCostingSelect" class="form-label"><strong>Tipe Job Costing:</strong></label>
        <select class="form-control" id="jobCostingSelect" onchange="handleJobCostingTypeChange()">
          <option value="${JOB_COSTING_TYPES.JOB_COSTING}" ${this.appState.currentDetail.jobCostingType === JOB_COSTING_TYPES.JOB_COSTING ? 'selected' : ''}>Job Costing 1</option>
          <option value="${JOB_COSTING_TYPES.SET}" ${this.appState.currentDetail.jobCostingType === JOB_COSTING_TYPES.SET ? 'selected' : ''}>Job Costing 2</option>
          <option value="${JOB_COSTING_TYPES.DO}" ${this.appState.currentDetail.jobCostingType === JOB_COSTING_TYPES.DO ? 'selected' : ''}>DO</option>
        </select>
      </div>

      <!-- Batch Number -->
      <div class="mb-3">
        <label for="batchInput" class="form-label"><strong>Batch Number:</strong></label>
        <input type="text" class="form-control" id="batchInput" value="${this.appState.currentDetail.batch}" placeholder="Masukkan batch number..." autocomplete="off">
      </div>
    `;
  }

  renderDynamicContent() {
    return `
      <div id="dynamicJobCostingContent">
        ${this.renderJobCostingContent()}
      </div>
    `;
  }

  renderActionButtons() {
    return `
      <div class="d-flex justify-content-end gap-2 mt-4">
        <button class="btn btn-secondary" onclick="handleCancel()">Cancel</button>
        <button class="btn btn-primary" onclick="handleSave()">Save</button>
      </div>
    `;
  }

  renderJobCostingContent() {
    switch (this.appState.currentDetail.jobCostingType) {
      case JOB_COSTING_TYPES.JOB_COSTING:
        return this.renderJobCosting1();
      case JOB_COSTING_TYPES.SET:
        return this.renderJobCosting2();
      case JOB_COSTING_TYPES.DO:
        return this.renderDOContent();
      default:
        return this.renderJobCosting1();
    }
  }

  renderJobCosting1() {
    return `
      <div id="productPairContainer">
        ${this.renderProductPair(1)}
      </div>
      <button class="btn btn-outline-success w-100 mb-3 d-flex align-items-center justify-content-center gap-2" 
              type="button" onclick="addNewProductPair()">
        <i class="bi bi-plus-square-fill"></i> Tambah Pasangan Produk
      </button>
    `;
  }

  renderProductPair(index) {
    return `
      <div class="row d-flex justify-content-center mt-3 product-pair-row" data-idx="${index}">
        <div class="col-md-6 col-11">
          <div class="job-costing-1">
            <div class="mb-3">
              <label for="descriptionInput${index}" class="form-label">
                <strong>Deskripsi Product:</strong>
              </label>
              <input type="text" class="form-control description-input" id="descriptionInput${index}" 
                     placeholder="Masukkan deskripsi produk..." />
            </div>
          </div>
        </div>
        <div class="col-md-5 col-11">
          <div class="job-costing-1">
            <div class="mb-3">
              <label for="productCodeInput${index}" class="form-label">
                <strong>Kode Produk:</strong>
              </label>
              <input type="text" class="form-control code-input" id="productCodeInput${index}" 
                     placeholder="Masukkan kode produk..." />
            </div>
          </div>
        </div>
        <div class="col-md-1 col-1 d-flex align-items-center justify-content-center">
          <button class="btn btn-outline-danger btn-sm remove-product-pair-btn" type="button" 
                  title="Hapus pasangan produk" onclick="removeProductPair(this)">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
    `;
  }

  renderJobCosting2() {
    return `
      <div class="job-costing-2">
        <label class="form-label"><strong>Kode Produk:</strong></label>
        <div id="codeEditContainer" class="mb-3">
          ${Array(4).fill().map((_, idx) => this.renderCodeInput(idx)).join('')}
        </div>
        <button class="btn btn-outline-success w-100 mb-3 d-flex align-items-center justify-content-center gap-2" 
                type="button" onclick="addNewCode()">
          <i class="bi bi-plus-square-fill"></i> Tambah Kode Produk
        </button>
      </div>
    `;
  }

  renderDOContent() {
    return `
      <div class="do-content">
        <div class="row d-flex justify-content-center mt-3">
          <div class="col-md-6 col-11">
            <div class="mb-3">
              <label for="clientInput" class="form-label">
                <strong>Client:</strong>
              </label>
              <input type="text" class="form-control" id="clientInput" 
                     placeholder="Masukkan client..." disabled/>
            </div>
          </div>
          <div class="col-md-6 col-11">
            <div class="mb-3">
              <label for="doCodeInput" class="form-label">
                <strong>Kode Produk:</strong>
              </label>
              <input type="text" class="form-control" id="doCodeInput" 
                     placeholder="Masukkan kode produk..." />
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCodeInput(index) {
    return `
      <div class="input-group mb-2" data-idx="${index}">
        <span class="input-group-text drag-handle" style="cursor: grab;">
          <i class="bi bi-grip-horizontal"></i>
        </span>
        <input class="form-control code-edit" placeholder="Kode produk..." />
        <button class="btn btn-outline-danger btn-sm remove-code-btn" type="button" 
                title="Hapus kode" onclick="removeCode(this)">
          <i class="bi bi-x"></i>
        </button>
      </div>
    `;
  }

  initializeSortable() {
    const container = document.getElementById('codeEditContainer');
    if (container) {
      new Sortable(container, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        handle: '.drag-handle',
      });
    }
  }
}

// Form Validation
class FormValidator {
  static validateBasicFields(formData) {
    if (!formData.model || !formData.lokasi) {
      return { isValid: false, message: "Nama PDC dan Nama Mobil wajib diisi!" };
    }
    return { isValid: true };
  }

  static validateJobCosting1() {
    const productPairs = document.querySelectorAll('.product-pair-row');
    let hasValidPair = false;

    for (const row of productPairs) {
      const descInput = row.querySelector('.description-input');
      const codeInput = row.querySelector('.code-input');

      if (descInput && codeInput) {
        const desc = descInput.value.trim();
        const code = codeInput.value.trim();

        if (desc && code) {
          hasValidPair = true;
        } else if (desc || code) {
          return { isValid: false, message: "Setiap pasangan deskripsi dan kode produk harus diisi lengkap!" };
        }
      }
    }

    if (!hasValidPair) {
      return { isValid: false, message: "Minimal satu pasangan deskripsi dan kode produk wajib diisi!" };
    }

    return { isValid: true };
  }

  static validateJobCosting2() {
    const codeEdits = document.querySelectorAll('.code-edit');
    const codes = Array.from(codeEdits)
      .map(el => el.value.trim())
      .filter(code => code !== "");

    if (codes.length === 0) {
      return { isValid: false, message: "Minimal satu kode produk wajib diisi!" };
    }

    return { isValid: true };
  }

  static validateDO() {
    const clientInput = document.getElementById('clientInput');
    const codeInput = document.getElementById('doCodeInput');

    if (!clientInput || !codeInput) {
      return { isValid: false, message: "Form DO tidak ditemukan!" };
    }

    const client = clientInput.value.trim();
    const code = codeInput.value.trim();

    if (!client || !code) {
      return { isValid: false, message: "Client dan Kode Produk wajib diisi!" };
    }

    return { isValid: true };
  }
}

// PDC Search Handler
class PDCSearchHandler {
  constructor() {
    this.activeIndex = -1;
  }

  setup() {
    const input = document.getElementById("pdcNameInput");
    const batchType = document.getElementById("jobCostingSelect");
    const suggestionsBox = document.getElementById("pdcSuggestions");

    input.addEventListener("input", (e) => this.handleInput(e, suggestionsBox));
    input.addEventListener("keydown", (e) => this.handleKeydown(e, suggestionsBox));
    input.addEventListener('focusout', () => this.updateBatchNumber(input.value, batchType.value));
    batchType.addEventListener('change', () => this.updateBatchNumber(input.value, batchType.value));

    document.addEventListener("click", (e) => this.handleOutsideClick(e, input, suggestionsBox));
  }

  handleInput(e, suggestionsBox) {
    const value = e.target.value.trim().toLowerCase();
    suggestionsBox.innerHTML = "";
    this.activeIndex = -1;

    if (value.length === 0) {
      suggestionsBox.style.display = "none";
      return;
    }

    const filtered = PDC_DATA
      .filter(item => item.PDC.toLowerCase().includes(value))
      .map(item => item.PDC);

    if (filtered.length === 0) {
      suggestionsBox.style.display = "none";
      return;
    }

    this.renderSuggestions(filtered, suggestionsBox, e.target);
    suggestionsBox.style.display = "block";
  }

  renderSuggestions(suggestions, suggestionsBox, input) {
    suggestions.forEach(pdc => {
      const div = document.createElement("div");
      div.classList.add("suggestion-item");
      div.textContent = pdc;
      div.addEventListener("click", () => {
        input.value = pdc;
        suggestionsBox.innerHTML = "";
        suggestionsBox.style.display = "none";

        // Update batch number when PDC is selected from suggestions
        const batchType = document.getElementById("jobCostingSelect");
        this.updateBatchNumber(pdc, batchType.value);
      });
      suggestionsBox.appendChild(div);
    });
  }

  handleKeydown(e, suggestionsBox) {
    const items = suggestionsBox.querySelectorAll(".suggestion-item");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (this.activeIndex < items.length - 1) this.activeIndex++;
      this.updateActiveItem(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (this.activeIndex > 0) this.activeIndex--;
      this.updateActiveItem(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (this.activeIndex >= 0 && this.activeIndex < items.length) {
        const selected = items[this.activeIndex];
        e.target.value = selected.textContent;
        suggestionsBox.innerHTML = "";
        suggestionsBox.style.display = "none";

        // Update batch number when PDC is selected with Enter key
        const batchType = document.getElementById("jobCostingSelect");
        this.updateBatchNumber(selected.textContent, batchType.value);
      }
    }
  }

  updateActiveItem(items) {
    items.forEach((item, index) => {
      item.classList.toggle("active", index === this.activeIndex);
    });
  }

  handleOutsideClick(e, input, suggestionsBox) {
    if (!suggestionsBox.contains(e.target) && e.target !== input) {
      suggestionsBox.innerHTML = "";
      suggestionsBox.style.display = "none";
      this.activeIndex = -1;
    }
  }

  updateBatchNumber(pdcName, batchTypeValue) {
    const found = PDC_DATA.find(item => item.PDC === pdcName);
    const batchInput = document.getElementById("batchInput");

    if (found && batchInput) {
      let batchNumber;

      switch (batchTypeValue) {
        case JOB_COSTING_TYPES.JOB_COSTING:
          batchNumber = found.batches.jobCosting;
          break;
        case JOB_COSTING_TYPES.SET:
          batchNumber = found.batches.set;
          break;
        case JOB_COSTING_TYPES.DO:
          batchNumber = found.batches.do;
          break;
        default:
          batchNumber = found.batches.jobCosting;
      }

      batchInput.value = batchNumber;
      batchInput.disabled = true;

      // Auto-fill client for DO mode
      if (batchTypeValue === JOB_COSTING_TYPES.DO) {
        const clientInput = document.getElementById("clientInput");
        if (clientInput) {
          clientInput.value = found.client;
        }
      }
    }
  }
}

// Data Processor
class DataProcessor {
  static processJobCosting1Data() {
    const productPairs = document.querySelectorAll('.product-pair-row');
    const productData = {};

    productPairs.forEach((row) => {
      const descInput = row.querySelector('.description-input');
      const codeInput = row.querySelector('.code-input');

      if (descInput && codeInput) {
        const desc = descInput.value.trim();
        const code = codeInput.value.trim();

        if (desc && code) {
          productData[desc] = code;
        }
      }
    });

    return productData;
  }

  static processJobCosting2Data() {
    const codeEdits = document.querySelectorAll('.code-edit');
    return Array.from(codeEdits)
      .map(el => el.value.trim())
      .filter(code => code !== "");
  }

  static processDOData() {
    const clientInput = document.getElementById('clientInput');
    const codeInput = document.getElementById('doCodeInput');

    const client = clientInput ? clientInput.value.trim() : '';
    const code = codeInput ? codeInput.value.trim() : '';

    const result = {};

    if (client && code) {
      result[client] = code;
    }

    return result;
  }

  static buildSaveUrl(formData, productData, rootCollection) {
    const params = new URLSearchParams({
      pdcName: formData.model,
      batch: formData.batch,
      root: rootCollection
    });

    switch (rootCollection) {
      case 'Job Costing 1':
        params.append('vehicles', formData.lokasi);
        params.append('data', encodeURIComponent(JSON.stringify(productData)));
        params.append('describe', formData.describe);
        params.append('gudangCode', formData.gudangCode);
        break;

      case 'Job Costing 2':
        const vehicles = [{
          name: formData.lokasi,
          code: productData,
          describe: formData.describe
        }];
        params.append('vehicles', JSON.stringify(vehicles));
        break;

      case 'DO':
        params.append('vehicles', formData.lokasi);
        params.append('data', encodeURIComponent(JSON.stringify(productData)));
        params.append('describe', formData.describe);
        params.append('gudangCode', formData.gudangCode);
        break;
    }

    return `./save.html?${params.toString()}`;
  }
}

// Global instances
const appState = new AppState();
const toastManager = new ToastManager();
const formRenderer = new FormRenderer(appState);
const searchHandler = new PDCSearchHandler();

// URL Parameter handling
const params = new URLSearchParams(window.location.search);
const status = params.get('status');
const message = params.get('message');

if (message) {
  const isError = status === 'error';
  toastManager.show(message, isError);
}

// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  formRenderer.renderMainForm();
  searchHandler.setup();
});

// Global Event Handlers
function handleJobCostingTypeChange() {
  const select = document.getElementById('jobCostingSelect');
  appState.updateJobCostingType(select.value);

  const dynamicContent = document.getElementById('dynamicJobCostingContent');
  dynamicContent.innerHTML = formRenderer.renderJobCostingContent();

  if (appState.currentDetail.jobCostingType === JOB_COSTING_TYPES.SET) {
    formRenderer.initializeSortable();
  }

  // Update batch number when job costing type changes
  const pdcInput = document.getElementById('pdcNameInput');
  if (pdcInput && pdcInput.value) {
    searchHandler.updateBatchNumber(pdcInput.value, select.value);
  }
}

function addNewProductPair() {
  const container = document.getElementById('productPairContainer');
  const newIndex = container.querySelectorAll('.product-pair-row').length + 1;

  const newRow = document.createElement('div');
  newRow.innerHTML = formRenderer.renderProductPair(newIndex);
  container.appendChild(newRow.firstElementChild);
}

function removeProductPair(button) {
  const row = button.closest('.product-pair-row');
  const allRows = document.querySelectorAll('.product-pair-row');

  if (allRows.length <= 1) {
    toastManager.show('Minimal harus ada satu pasangan produk.');
    return;
  }

  row.remove();
  updateProductPairIndices();
}

function updateProductPairIndices() {
  const rows = document.querySelectorAll('.product-pair-row');
  rows.forEach((row, idx) => {
    const newIdx = idx + 1;
    row.dataset.idx = newIdx;

    const descInput = row.querySelector('.description-input');
    const codeInput = row.querySelector('.code-input');
    const descLabel = row.querySelector('label[for^="descriptionInput"]');
    const codeLabel = row.querySelector('label[for^="productCodeInput"]');

    descInput.id = `descriptionInput${newIdx}`;
    codeInput.id = `productCodeInput${newIdx}`;
    descLabel.setAttribute('for', `descriptionInput${newIdx}`);
    codeLabel.setAttribute('for', `productCodeInput${newIdx}`);
  });
}

function addNewCode() {
  const container = document.getElementById("codeEditContainer");
  if (!container) return;

  const textareas = container.querySelectorAll(".code-edit");
  for (const ta of textareas) {
    if (ta.value.trim() === "") {
      toastManager.show("Isi dulu kode produk yang kosong sebelum menambah yang baru.");
      return;
    }
  }

  const newIndex = container.children.length;
  const div = document.createElement("div");
  div.innerHTML = formRenderer.renderCodeInput(newIndex);
  container.appendChild(div.firstElementChild);
}

function removeCode(button) {
  const codeRow = button.closest('.input-group');
  const allCodes = document.querySelectorAll('#codeEditContainer .input-group');

  if (allCodes.length <= 1) {
    toastManager.show('Minimal harus ada satu kode produk.');
    return;
  }

  codeRow.remove();
  updateCodeIndices();
}

function updateCodeIndices() {
  const codeRows = document.querySelectorAll('#codeEditContainer .input-group');
  codeRows.forEach((row, idx) => {
    row.dataset.idx = idx;
  });
}

function handleSave() {
  const formData = appState.getFormData();

  // Basic validation
  const basicValidation = FormValidator.validateBasicFields(formData);
  if (!basicValidation.isValid) {
    toastManager.show(basicValidation.message);
    return;
  }

  // Job costing specific validation and processing
  let productData, rootCollection, validation;

  if (formData.jobCostingType === JOB_COSTING_TYPES.JOB_COSTING) {
    validation = FormValidator.validateJobCosting1();
    if (!validation.isValid) {
      toastManager.show(validation.message);
      return;
    }

    productData = DataProcessor.processJobCosting1Data();
    rootCollection = 'Job Costing 1';

  } else if (formData.jobCostingType === JOB_COSTING_TYPES.SET) {
    validation = FormValidator.validateJobCosting2();
    if (!validation.isValid) {
      toastManager.show(validation.message);
      return;
    }

    productData = DataProcessor.processJobCosting2Data();
    rootCollection = 'Job Costing 2';

  } else if (formData.jobCostingType === JOB_COSTING_TYPES.DO) {
    validation = FormValidator.validateDO();
    if (!validation.isValid) {
      toastManager.show(validation.message);
      return;
    }

    productData = DataProcessor.processDOData();
    rootCollection = 'DO';
  }

  if (!confirm("Apakah Anda yakin ingin menyimpan data?")) return;

  try {
    const saveUrl = DataProcessor.buildSaveUrl(formData, productData, rootCollection);
    window.location.href = saveUrl;
    toastManager.show("Data berhasil disimpan!");
  } catch (error) {
    console.error("Gagal menyimpan:", error);
    toastManager.show("Terjadi kesalahan saat menyimpan data.");
  }
}

function handleCancel() {
  if (confirm("Batalkan perubahan? Data yang belum diisi akan hilang.")) {
    window.location.href = "./add_data.html";
  }
}

// Toast functions for global access
function showToast(message, isError = false) {
  toastManager.show(message, isError);
}

function hideToast() {
  toastManager.hide();
}