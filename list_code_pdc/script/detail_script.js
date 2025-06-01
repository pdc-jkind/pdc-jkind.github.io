// Fungsi utama untuk menginisialisasi halaman detail
let editMode = false;

function initializeDetailPage() {
  // Parsing parameter dari URL
  const params = new URLSearchParams(window.location.search);

  // Data dasar
  const mobilName = params.get("mobilName") || "";
  const pdcName = params.get("pdcName") || "";
  const batchNumber = params.get("batchNumber") || "";
  const warehouseCode = params.get("warehouseCode")
  const jobCosting = params.get("jobCosting") || "Job Costing 1";

  let status = params.get("status");
  let message = params.get("message");

  if (status && message) {
    showToast(message, status);
  }

  // Parse codeData dan describeData
  let codeData = {};
  let describeData = [];

  try {
    if (params.get("codeData")) {
      codeData = JSON.parse(params.get("codeData"));
    }

    if (params.get("describeData")) {
      describeData = JSON.parse(params.get("describeData"));
    }
    console.log("console penerima deskripsi : ", describeData);
  } catch (error) {
    console.error("Error parsing URL parameters:", error);
  }

  // Siapkan objek data untuk digunakan dalam template
  const currentDetail = {
    mobilName: mobilName,
    lokasi: pdcName,
    batch: batchNumber,
    warehouseCode: warehouseCode,
    jobCostingType: jobCosting,
    describe: Array.isArray(describeData) && describeData.length > 0 ? describeData[0] : "",
    codeData: codeData,
  };

  // Render HTML dan masukkan ke dalam container
  const detailContainer = document.getElementById("detailContainer");
  if (detailContainer) {
    detailContainer.innerHTML = editModeCheck(currentDetail);
  }

  // Inisialisasi event listeners setelah DOM dirender
  initializeEventListeners(currentDetail);

  // Populasi data code sesuai dengan tipe job costing
  populateCodeData(currentDetail);
}

function editModeCheck(currentDetail) {
  // Cek apakah dalam mode edit
  if (editMode) {
    return generateEditModeHtml(currentDetail);
  } else {
    return generateDetailHTML(currentDetail);
  }
}

function generateDetailHTML(currentDetail) {
  return `
      <!-- atur layout dulu -->
      <div class="card position-relative">
        <div class="card-body">
          
          <div class="container bg-body-secondary p-2 mb-2 rounded position-relative">
            <h3 class="card-title text-center text-secondary-emphasis">Detail Data</h3>
          </div>

          <div class="container px-4">

            <div class="text-center">
              <!-- Nama PDC dengan Autocomplete -->
              <div class="mb-2 autocomplete-container">
                <h3 class="mt-2 mb-3 text-secondary-emphasis">${currentDetail.lokasi}</h3>
              </div>

              <!-- Nama Mobil -->
              <div class="mb-">
                <h6 class="mt-2 mb-3 text-secondary-emphasis">${currentDetail.mobilName}</h6>
              </div>
            </div>

            <button class="btn btn-sm btn-outline-warning position-absolute top-0 end-0 mt-4 me-4" title="Edit" onclick="toggleEdit()">
                  <i class="bi bi-pencil"></i>
            </button>

            <!-- kode gudang -->
            <div class="mb-3">
              <label for="kodeGudangInput" class="form-label"><strong>kode gudang:</strong></label>
              <div class="input-group">
                <input class="form-control"
                  value="${currentDetail.warehouseCode}"
                  readonly/>
                <button class="btn btn-outline-success" type="button" onclick="copyText('${currentDetail.warehouseCode}')" title="Copy Code Gudang">
                  <i class="bi bi-clipboard2"></i>
                </button>
              </div>
            </div>

            <!-- Keterangan -->
            <div class="mb-3">
              <label for="keteranganInput" class="form-label"><strong>Keterangan:</strong></label>
              <div class="input-group">
                <input class="form-control"
                  value="${currentDetail.describe}"
                  readonly/>
                <button class="btn btn-outline-success" type="button" onclick="copyText('${currentDetail.describe}')" title="Copy Keterangan">
                  <i class="bi bi-clipboard2"></i>
                </button>
              </div>
            </div>

            <!-- Batch Number -->
            <div class="mb-3">
              <label for="batchInput" class="form-label"><strong>Batch Number:</strong></label>
              <input
                type="text"
                class="form-control"
                value="${currentDetail.batch}" readonly
              />
            </div>

            <div class="mb-3">
              <label for="jobCostingSelect" class="form-label"><strong>Tipe Job Costing:</strong></label>
              <select class="form-control" id="jobCostingSelect" disabled>
                <option value="Job Costing 1" ${currentDetail.jobCostingType === 'Job Costing 1' ? 'selected' : ''}>Job Costing 1</option>
                <option value="Job Costing 2" ${currentDetail.jobCostingType === 'Job Costing 2' ? 'selected' : ''}>Job Costing 2</option>
                <option value="DO" ${currentDetail.jobCostingType === 'DO' ? 'selected' : ''}>DO</option>
              </select>
            </div>

            <!-- Dynamic Content based on Job Costing Type -->
            <div id="dynamicJobCostingContent">
              ${renderJobCostingContent(currentDetail)}
            </div>
          </div>
        </div>
      </div>
      <!-- atur layout end  -->
  `;
}

// Fungsi untuk menghasilkan HTML detail
function generateEditModeHtml(currentDetail) {
  return `
    <div class="card position-relative">
      <div class="card-body">
        <div class="container bg-body-secondary p-3 mb-2 rounded position-relative">
          <h2 class="card-title text-center text-secondary-emphasis">Detail Data</h2>
        </div>
        
        <!-- Nama PDC dengan Autocomplete -->
        <div class="mb-3 autocomplete-container">
          <label for="pdcNameInput" class="form-label"><strong>Nama PDC:</strong></label>
          <input type="text" class="form-control" id="pdcNameInput" value="${currentDetail.lokasi}" placeholder="Masukkan nama PDC..." readonly>
          <div class="suggestions-list" id="pdcSuggestions"></div>
        </div>
        
        <!-- Nama Mobil -->
        <div class="mb-3">
          <label for="mobilNameInput" class="form-label"><strong>Nama Mobil:</strong></label>
          <input type="text" class="form-control" id="mobilNameInput" value="${currentDetail.mobilName}" placeholder="Masukkan nama mobil..." readonly>
        </div>
        
        <!-- Keterangan -->
        <div class="mb-3">
          <label for="keteranganInput" class="form-label"><strong>Keterangan:</strong></label>
          <input class="form-control" id="keteranganInput" value="${currentDetail.describe}" placeholder="Masukkan keterangan...">
        </div>
        
        <!-- Keterangan -->
        <div class="mb-3">
          <label for="kodeGudangInput" class="form-label"><strong>Kode Gudang:</strong></label>
          <input class="form-control" id="kodeGudangInput" value="${currentDetail.warehouseCode}" placeholder="Masukkan keterangan...">
        </div>

        <!-- Job Costing Type Dropdown -->
        <div class="mb-3">
          <label for="jobCostingSelect" class="form-label"><strong>Tipe Job Costing:</strong></label>
          <select class="form-control" id="jobCostingSelect" disabled>
            <option value="Job Costing 1" ${currentDetail.jobCostingType === 'Job Costing 1' ? 'selected' : ''}>Job Costing 1</option>
            <option value="Job Costing 2" ${currentDetail.jobCostingType === 'Job Costing 2' ? 'selected' : ''}>Job Costing 2</option>
            <option value="DO" ${currentDetail.jobCostingType === 'DO' ? 'selected' : ''}>DO</option>
          </select>
        </div>

        <!-- Batch Number -->
        <div class="mb-3">
          <label for="batchInput" class="form-label"><strong>Batch Number:</strong></label>
          <input type="text" class="form-control" id="batchInput" value="${currentDetail.batch}" placeholder="Masukkan batch number...">
        </div>
        
        <!-- Dynamic Content based on Job Costing Type -->
        <div id="dynamicJobCostingContent">
          ${renderJobCostingContentEditMode(currentDetail)}
        </div>
        
        <!-- Action Buttons -->
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-secondary" onclick="cancelForm()">Cancel</button>
          <button class="btn btn-primary" onclick="saveForm()">Save</button>
        </div>
      </div >
    </div >
    `;
}

// Fungsi untuk render konten job costing berdasarkan tipe
function renderJobCostingContent(currentDetail) {
  if (currentDetail.jobCostingType === 'Job Costing 1') {
    return `
    <div id="productPairContainer">
      <!--Placeholder untuk product pairs yang akan diisi nanti-->
    </div>
    `;
  } else if (currentDetail.jobCostingType === 'DO') {
    return `
    <div id="productPairContainer">
      <!--Placeholder untuk DO pairs yang akan diisi nanti-->
    </div>
    `;
  } else {
    return `
    <div class="job-costing-2">
        <label class="form-label"><strong>Kode Produk:</strong></label>
        <div id="codeEditContainer" class="mb-3">
          <!-- Placeholder untuk code edits yang akan diisi nanti -->
        </div>
      </div>
    `;
  }
}

// Fungsi untuk render konten job costing berdasarkan tipe
function renderJobCostingContentEditMode(currentDetail) {

  if (currentDetail.jobCostingType === 'Job Costing 1') {
    return `
    <div id="productPairContainer">
      <!--Placeholder untuk product pairs yang akan diisi nanti -->
    </div>

    <!-- Tombol tambah -->
    <button
      class="btn btn-outline-success w-100 mt-2 mb-3 d-flex align-items-center justify-content-center gap-2" type="button" onclick="addNewProductPair()">
      <i class="bi bi-plus-square-fill"> </i> Tambah Pasangan Produk
    </button>
  `;
  } else if (currentDetail.jobCostingType === 'DO') {
    return `
    <div id="productPairContainer">
      <!--Placeholder untuk DO pairs yang akan diisi nanti -->
    </div>
  `;
  } else {
    return `
    <div class="job-costing-2">
        <label class="form-label"><strong>Kode Produk:</strong></label>
        <div id="codeEditContainer" class="mb-3">
          <!-- Placeholder untuk code edits yang akan diisi nanti -->
        </div>
        <button class="btn btn-outline-success w-100 mb-3 d-flex align-items-center justify-content-center gap-2" type="button" onclick="addNewCode()">
          <i class="bi bi-plus-square-fill"></i> Tambah Kode Produk
        </button>
      </div>
    `;
  }
}

// Fungsi untuk mengisi data code sesuai dengan tipe job costing
function populateCodeData(currentDetail) {

  if (currentDetail.jobCostingType === 'Job Costing 1') {
    // Job Costing 1 - populasi pasangan produk
    const productPairContainer = document.getElementById("productPairContainer");
    if (!productPairContainer) return;

    // Bersihkan container
    productPairContainer.innerHTML = '';

    // Jika codeData ada dan memiliki beberapa properti
    if (currentDetail.codeData && typeof currentDetail.codeData === 'object') {
      let idx = 0;

      // Loop melalui semua properti codeData
      for (const [key, value] of Object.entries(currentDetail.codeData)) {
        idx++;

        // Buat row baru untuk setiap pasangan key-value
        const newRow = document.createElement('div');
        newRow.className = 'row d-flex justify-content-center mt-3 product-pair-row';
        newRow.setAttribute('data-idx', idx);

        if (editMode) {
          // EDIT MODE (form input + tombol hapus)
          newRow.innerHTML = `
          <div class="col-md-6 col-11">
            <div class="job-costing-1">
              <div class="mb-3">
                <label for="descriptionInput${idx}" class="form-label">
                  <strong>Deskripsi Product:</strong>
                </label>
                <input
                  type="text"
                  class="form-control description-input"
                  id="descriptionInput${idx}"
                  value="${key}"
                  placeholder="Masukkan deskripsi produk..."
                />
              </div>
            </div>
          </div>
          <div class="col-md-5 col-11">
            <div class="job-costing-1">
              <div class="mb-3">
                <label for="productCodeInput${idx}" class="form-label">
                  <strong>Kode Produk:</strong>
                </label>
                <input
                  type="text"
                  class="form-control code-input"
                  id="productCodeInput${idx}"
                  value="${value}"
                  placeholder="Masukkan kode produk..."
                />
              </div>
            </div>
          </div>
          <div class="col-md-1 col-1 d-flex align-items-center justify-content-center">
            <button class="btn btn-outline-danger btn-sm remove-product-pair-btn" type="button" title="Hapus pasangan produk" onclick="removeProductPair(this)">
              <i class="bi bi-x"></i>
            </button>
          </div>
        `;
        } else {
          newRow.innerHTML = `
          <div class="col-md-6 col-11">
            <div class="job-costing-1">
              <label for="descriptionInput${idx}" class="form-label">
                <strong>Deskripsi Product:</strong>
              </label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control description-input"
                  id="descriptionInput${idx}"
                  value="${key}"
                  placeholder="Deskripsi produk"
                  readonly
                />
                <button class="btn btn-outline-success" type="button" onclick="copyText('${key}')" title="Copy Deskripsi">
                  <i class="bi bi-clipboard2"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-11">
            <div class="job-costing-1">
              <label for="productCodeInput${idx}" class="form-label">
                <strong>Kode Produk:</strong>
              </label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control code-input"
                  id="productCodeInput${idx}"
                  value="${value}"
                  placeholder="Kode produk"
                  readonly
                />
                <button class="btn btn-outline-success" type="button" onclick="copyText('${value}')" title="Copy Code">
                  <i class="bi bi-clipboard2"></i>
                </button>
              </div>
            </div>
          </div>
        `;
        }

        productPairContainer.appendChild(newRow);
      }

      // Jika tidak ada data, buat row kosong
      if (idx === 0) {
        addEmptyProductPair(productPairContainer);
      }
    } else {
      // Jika tidak ada codeData, tambahkan row kosong
      addEmptyProductPair(productPairContainer);
    }
  } else if (currentDetail.jobCostingType === 'DO') {
    // DO - populasi pasangan client (sama dengan Job Costing 1 tapi label berbeda)
    const productPairContainer = document.getElementById("productPairContainer");
    if (!productPairContainer) return;

    // Bersihkan container
    productPairContainer.innerHTML = '';

    // Jika codeData ada dan memiliki beberapa properti
    if (currentDetail.codeData && typeof currentDetail.codeData === 'object') {
      let idx = 0;

      // Loop melalui semua properti codeData
      for (const [key, value] of Object.entries(currentDetail.codeData)) {
        idx++;

        // Buat row baru untuk setiap pasangan key-value
        const newRow = document.createElement('div');
        newRow.className = 'row d-flex justify-content-center mt-3 product-pair-row';
        newRow.setAttribute('data-idx', idx);

        if (editMode) {
          // EDIT MODE (form input + tombol hapus)
          newRow.innerHTML = `
          <div class="col-md-6 col-11">
            <div class="job-costing-1">
              <div class="mb-3">
                <label for="clientInput${idx}" class="form-label">
                  <strong>Client:</strong>
                </label>
                <input
                  type="text"
                  class="form-control description-input"
                  id="clientInput${idx}"
                  value="${key}"
                  placeholder="Masukkan nama client..."
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="col-md-6 col-11">
            <div class="job-costing-1">
              <div class="mb-3">
                <label for="doCodeInput${idx}" class="form-label">
                  <strong>Kode Produk:</strong>
                </label>
                <input
                  type="text"
                  class="form-control code-input"
                  id="doCodeInput${idx}"
                  value="${value}"
                  placeholder="Masukkan kode produk..."
                />
              </div>
            </div>
          </div>
        `;
        } else {
          newRow.innerHTML = `
          <div class="col-md-6 col-11">
            <div class="job-costing-1">
              <label for="clientInput${idx}" class="form-label">
                <strong>Client:</strong>
              </label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control description-input"
                  id="clientInput${idx}"
                  value="${key}"
                  placeholder="Client"
                  disabled
                />
                <button class="btn btn-outline-success" type="button" onclick="copyText('${key}')" title="Copy Client">
                  <i class="bi bi-clipboard2"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-11">
            <div class="job-costing-1">
              <label for="doCodeInput${idx}" class="form-label">
                <strong>Kode Produk:</strong>
              </label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control code-input"
                  id="doCodeInput${idx}"
                  value="${value}"
                  placeholder="Kode produk"
                  readonly
                />
                <button class="btn btn-outline-success" type="button" onclick="copyText('${value}')" title="Copy Code">
                  <i class="bi bi-clipboard2"></i>
                </button>
              </div>
            </div>
          </div>
        `;
        }

        productPairContainer.appendChild(newRow);
      }

      // Jika tidak ada data, buat row kosong
      if (idx === 0) {
        addEmptyDOPair(productPairContainer);
      }
    } else {
      // Jika tidak ada codeData, tambahkan row kosong
      addEmptyDOPair(productPairContainer);
    }
  } else {
    // Job Costing 2 - populasi kode
    const codeEditContainer = document.getElementById("codeEditContainer");
    if (!codeEditContainer) return;

    // Bersihkan container
    codeEditContainer.innerHTML = '';

    // Jika codeData ada dan memiliki beberapa properti
    if (currentDetail.codeData && typeof currentDetail.codeData === 'object') {
      let idx = 0;

      // Loop melalui semua properti codeData
      for (const [key, value] of Object.entries(currentDetail.codeData)) {
        idx++;

        // Buat input baru untuk setiap pasangan key-value
        const newCodeEdit = document.createElement('div');
        newCodeEdit.className = 'input-group mb-2';
        newCodeEdit.setAttribute('data-idx', idx);

        if (editMode) {
          newCodeEdit.innerHTML = `
          <span class="input-group-text drag-handle" style="cursor: grab;">
            <i class="bi bi-grip-horizontal"></i>
          </span>
          <input class="form-control code-edit" rows="1" value="${value}"></input>
          <button class="btn btn-outline-danger btn-sm remove-code-btn" type="button" title="Hapus kode" onclick="removeCode(this)">
            <i class="bi bi-x"></i>
          </button>
        `;
        } else {
          newCodeEdit.innerHTML = `
          <div class="input-group">
            <input class="form-control code-edit ps-3" value="${value}" readonly/>
            <button class="btn btn-outline-success" type="button" onclick="copyText('${value}')" title="Copy Code">
              <i class="bi bi-clipboard2"></i>
            </button>
          </div>
        `;
        }

        codeEditContainer.appendChild(newCodeEdit);
      }

      // Jika tidak ada data, buat input kosong
      if (idx === 0) {
        addEmptyCodeEdits(codeEditContainer);
      }
    } else {
      // Jika tidak ada codeData, tambahkan input kosong
      addEmptyCodeEdits(codeEditContainer);
    }

    new Sortable(codeEditContainer, {
      handle: '.drag-handle',
      animation: 300,
      ghostClass: 'bg-transparent',
    });
  }
}

// Fungsi untuk menambahkan pasangan produk kosong
function addEmptyProductPair(container) {
  const newRow = document.createElement('div');
  newRow.className = 'row d-flex justify-content-center mt-3 product-pair-row';
  newRow.setAttribute('data-idx', '1');

  newRow.innerHTML = `
    <div class="col-md-6 col-11">
      <div class="job-costing-1">
        <div class="mb-3">
          <label for="descriptionInput1" class="form-label">
            <strong>Deskripsi Product:</strong>
          </label>
          <input
            type="text"
            class="form-control description-input"
            id="descriptionInput1"
            placeholder="Masukkan deskripsi produk..."
          />
        </div>
      </div>
    </div>
    <div class="col-md-5 col-11">
      <div class="job-costing-1">
        <div class="mb-3">
          <label for="productCodeInput1" class="form-label">
            <strong>Kode Produk:</strong>
          </label>
          <input
            type="text"
            class="form-control code-input"
            id="productCodeInput1"
            placeholder="Masukkan kode produk..."
          />
        </div>
      </div>
    </div>
    <div class="col-md-1 col-1 d-flex align-items-center justify-content-center">
      <button class="btn btn-outline-danger btn-sm remove-product-pair-btn" type="button" title="Hapus pasangan produk" onclick="removeProductPair(this)">
        <i class="bi bi-x"></i>
      </button>
    </div>
  `;

  container.appendChild(newRow);
}

// Fungsi untuk menambahkan code edits kosong
function addEmptyCodeEdits(container) {
  // Tambahkan 4 input kosong
  for (let i = 0; i < 4; i++) {
    const newCodeEdit = document.createElement('div');
    newCodeEdit.className = 'input-group mb-2';
    newCodeEdit.setAttribute('data-idx', i + 1);

    newCodeEdit.innerHTML = `
      <span class="input-group-text drag-handle" style="cursor: grab;">
        <i class="bi bi-grip-horizontal"></i>
      </span>
      <input type="text" class="form-control code-edit" placeholder="Kode produk..."/>
      <button class="btn btn-outline-danger btn-sm remove-code-btn" type="button" title="Hapus kode" onclick="removeCode(this)">
        <i class="bi bi-x"></i>
      </button>
    `;

    container.appendChild(newCodeEdit);
  }
}

// Fungsi untuk inisialisasi event listeners
function initializeEventListeners(currentDetail) {
  // Event listener untuk perubahan tipe job costing
  const jobCostingSelect = document.getElementById("jobCostingSelect");
  if (jobCostingSelect) {
    // Remove existing event listeners to avoid duplicates
    jobCostingSelect.removeEventListener("change", jobCostingTypeChanged);

    // Add event listener only in edit mode
    if (editMode) {
      jobCostingSelect.disabled = false;
      jobCostingSelect.addEventListener("change", function () {
        jobCostingTypeChanged();
      });
    } else {
      jobCostingSelect.disabled = true;
    }
  }

  // Event listener untuk auto-resize textarea (jika ada)
  const textareas = document.querySelectorAll('textarea.code-edit');
  textareas.forEach(textarea => {
    textarea.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
  });
}

// Fungsi untuk menambah pasangan produk baru (untuk Job Costing 1)
function addNewProductPair() {
  const container = document.getElementById("productPairContainer");
  if (!container) return;

  // Cek apakah ada input yang masih kosong
  const descriptions = container.querySelectorAll('.description-input');
  const codes = container.querySelectorAll('.code-input');

  for (let i = 0; i < descriptions.length; i++) {
    if (descriptions[i].value.trim() === "" || codes[i].value.trim() === "") {
      showToast("Harap isi semua deskripsi dan kode produk sebelum menambahkan pasangan baru.", "warning");
      return;
    }
  }

  // Hitung jumlah row yang sudah ada
  const rows = container.querySelectorAll(".product-pair-row");
  const newIdx = rows.length + 1;

  // Buat row baru
  const newRow = document.createElement('div');
  newRow.className = 'row d-flex justify-content-center mt-3 product-pair-row';
  newRow.setAttribute('data-idx', newIdx);

  newRow.innerHTML = `
    <div class="col-md-6 col-11">
      <div class="job-costing-1">
        <div class="mb-3">
          <label for="descriptionInput${newIdx}" class="form-label">
            <strong>Deskripsi Product:</strong>
          </label>
          <input
            type="text"
            class="form-control description-input"
            id="descriptionInput${newIdx}"
            placeholder="Masukkan deskripsi produk..."
          />
        </div>
      </div>
    </div>
    <div class="col-md-5 col-11">
      <div class="job-costing-1">
        <div class="mb-3">
          <label for="productCodeInput${newIdx}" class="form-label">
            <strong>Kode Produk:</strong>
          </label>
          <input
            type="text"
            class="form-control code-input"
            id="productCodeInput${newIdx}"
            placeholder="Masukkan kode produk..."
          />
        </div>
      </div>
    </div>
    <div class="col-md-1 col-1 d-flex align-items-center justify-content-center">
      <button class="btn btn-outline-danger btn-sm remove-product-pair-btn" type="button" title="Hapus pasangan produk" onclick="removeProductPair(this)">
        <i class="bi bi-x"></i>
      </button>
    </div>
  `;

  container.appendChild(newRow);
}

// Fungsi untuk mengindeks ulang semua DO pairs
function reindexDOPairs() {
  const container = document.getElementById("productPairContainer");
  if (!container) return;

  const rows = container.querySelectorAll('.product-pair-row');
  rows.forEach((row, idx) => {
    const newIdx = idx + 1;

    // Update data-idx attribute
    row.setAttribute('data-idx', newIdx);

    // Update ID untuk input fields
    const clientInput = row.querySelector('.description-input');
    if (clientInput) {
      clientInput.id = `clientInput${newIdx}`;
    }

    const codeInput = row.querySelector('.code-input');
    if (codeInput) {
      codeInput.id = `doCodeInput${newIdx}`;
    }
  });
}

// Update fungsi saveForm untuk mendukung DO
function saveForm() {
  // Ambil semua nilai form
  const pdcName = document.getElementById("pdcNameInput").value;
  const mobilName = document.getElementById("mobilNameInput").value;
  const kodeGudang = document.getElementById("kodeGudangInput").value;
  const keterangan = document.getElementById("keteranganInput").value;
  const jobCostingType = document.getElementById("jobCostingSelect").value;
  const batchNumber = document.getElementById("batchInput").value;

  // Validasi input dasar
  if (!pdcName || !mobilName || !batchNumber) {
    alert("Nama PDC, Nama Mobil, dan Batch Number harus diisi!");
    return;
  }

  // Konfirmasi simpan
  const confirmSwitch = confirm("Apakah Anda yakin ingin menyimpan perubahan?");
  if (!confirmSwitch) return;

  // Kumpulkan data code
  const codeData = {};

  if (jobCostingType === 'Job Costing 1') {
    // Job Costing 1 - pasangan deskripsi dan kode produk
    const productPairs = document.querySelectorAll('.product-pair-row');
    productPairs.forEach(row => {
      const description = row.querySelector('.description-input').value;
      const code = row.querySelector('.code-input').value;
      if (description && code) {
        codeData[description] = code;
      }
    });
  } else if (jobCostingType === 'DO') {
    // DO - pasangan client dan kode produk
    const doPairs = document.querySelectorAll('.product-pair-row');
    doPairs.forEach(row => {
      const client = row.querySelector('.description-input').value;
      const code = row.querySelector('.code-input').value;
      if (client && code) {
        codeData[client] = code;
      }
    });
  } else {
    // Job Costing 2 - kode produk saja
    const codeEdits = document.querySelectorAll('.code-edit');
    codeEdits.forEach((input, idx) => {
      const codeText = input.value;
      if (codeText) {
        const match = codeText.match(/^(.+?)\s*:\s*(.+)$/);
        if (match) {
          codeData[match[1]] = match[2];
        } else {
          codeData[`item${idx + 1}`] = codeText;
        }
      }
    });
  }

  const rootCollection = jobCostingType;

  // Encode codeData sebagai JSON string, lalu encodeURIComponent agar bisa dikirim di URL
  const encodedCodeData = encodeURIComponent(JSON.stringify(codeData));

  // Susun URL tujuan
  const saveUrl = `https://pdc-jkind.github.io/list_code_pdc/save.html?pdcName=${encodeURIComponent(pdcName)}&vehicles=${encodeURIComponent(mobilName)}&batch=${encodeURIComponent(batchNumber)}&gudangCode=${encodeURIComponent(kodeGudang)}&describe=${encodeURIComponent(keterangan)}&root=${encodeURIComponent(rootCollection)}&data=${encodedCodeData}&mode=edit`;

  // Arahkan ke halaman save.html
  window.location.href = saveUrl;
}

// Update fungsi jobCostingTypeChanged untuk mendukung DO
function jobCostingTypeChanged() {
  const select = document.getElementById('jobCostingSelect');
  const currentDetail = getCurrentDetailFromForm();
  currentDetail.jobCostingType = select.value;

  // Update current codes before switching view
  if (currentDetail.jobCostingType === 'Job Costing 1' || currentDetail.jobCostingType === 'DO') {
    // Save current codes from Job Costing 2 if any
    const codeEdits = document.querySelectorAll('.code-edit');
    if (codeEdits.length > 0) {
      currentDetail.codeData = {};
      codeEdits.forEach((el, idx) => {
        const value = el.value.trim();
        if (value) {
          currentDetail.codeData[`item${idx + 1}`] = value;
        }
      });
    }
  } else {
    // Save from Job Costing 1 or DO
    const pairs = document.querySelectorAll('.product-pair-row');
    if (pairs.length > 0) {
      currentDetail.codeData = {};
      pairs.forEach(row => {
        const description = row.querySelector('.description-input')?.value.trim();
        const code = row.querySelector('.code-input')?.value.trim();
        if (description && code) {
          currentDetail.codeData[description] = code;
        }
      });
    }
  }

  // Update the dynamic content
  const dynamicContent = document.getElementById('dynamicJobCostingContent');
  if (editMode) {
    dynamicContent.innerHTML = renderJobCostingContentEditMode(currentDetail);
  } else {
    dynamicContent.innerHTML = renderJobCostingContent(currentDetail);
  }

  // Populasi ulang data
  populateCodeData(currentDetail);

  // Initialize sortable for Job Costing 2
  if (currentDetail.jobCostingType === 'Job Costing 2') {
    const codeEditContainer = document.getElementById("codeEditContainer");
    if (codeEditContainer) {
      new Sortable(codeEditContainer, {
        handle: '.drag-handle',
        animation: 300,
        ghostClass: 'bg-transparent',
      });
    }
  }
}

// Fungsi untuk toggle edit mode
function toggleEdit() {
  editMode = !editMode;

  // Re-render halaman dengan mode yang baru
  const params = new URLSearchParams(window.location.search);
  const mobilName = params.get("mobilName") || "";
  const pdcName = params.get("pdcName") || "";
  const batchNumber = params.get("batchNumber") || "";
  const warehouseCode = params.get("warehouseCode") || "";
  const jobCosting = params.get("jobCosting") || "Job Costing 1";

  let codeData = {};
  let describeData = [];

  try {
    if (params.get("codeData")) {
      codeData = JSON.parse(params.get("codeData"));
    }
    if (params.get("describeData")) {
      describeData = JSON.parse(params.get("describeData"));
    }
  } catch (error) {
    console.error("Error parsing URL parameters:", error);
  }

  const currentDetail = {
    mobilName: mobilName,
    lokasi: pdcName,
    batch: batchNumber,
    warehouseCode: warehouseCode,
    jobCostingType: jobCosting,
    describe: Array.isArray(describeData) && describeData.length > 0 ? describeData[0] : "",
    codeData: codeData,
  };

  // Update container
  const detailContainer = document.getElementById("detailContainer");
  if (detailContainer) {
    detailContainer.innerHTML = editModeCheck(currentDetail);
  }

  // Re-initialize event listeners
  initializeEventListeners(currentDetail);

  // Re-populate data
  populateCodeData(currentDetail);
}

// Fungsi untuk copy text ke clipboard
function copyText(text) {
  // Gunakan Clipboard API modern jika tersedia
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Teks berhasil disalin ke clipboard!", "success");
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
      // Fallback ke metode lama
      fallbackCopyText(text);
    });
  } else {
    // Fallback untuk browser lama atau context tidak secure
    fallbackCopyText(text);
  }
}

// Fungsi fallback untuk copy text (untuk browser lama)
function fallbackCopyText(text) {
  // Buat elemen textarea sementara
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Buat tidak terlihat
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";

  // Tambahkan ke DOM
  document.body.appendChild(textArea);

  // Fokus dan select
  textArea.focus();
  textArea.select();

  try {
    // Copy menggunakan execCommand (deprecated tapi masih work)
    const successful = document.execCommand('copy');
    if (successful) {
      showToast("Teks berhasil disalin ke clipboard!", "success");
    } else {
      showToast("Gagal menyalin teks ke clipboard.", "error");
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    showToast("Gagal menyalin teks ke clipboard.", "error");
  }

  // Hapus elemen sementara
  document.body.removeChild(textArea);
}

// Fungsi untuk cancel form (kembali ke view mode)
function cancelForm() {
  const confirmCancel = confirm("Apakah Anda yakin ingin membatalkan perubahan?");
  if (confirmCancel) {
    editMode = false;
    // Reload halaman atau re-render ke view mode
    window.location.reload();
  }
}

// Fungsi untuk remove product pair
function removeProductPair(button) {
  const row = button.closest('.product-pair-row');
  if (!row) return;

  // Jika ini adalah row terakhir, jangan hapus
  const container = document.getElementById("productPairContainer");
  if (container && container.querySelectorAll('.product-pair-row').length <= 1) {
    showToast("Minimal harus ada satu pasangan produk!", "warning");
    return;
  }

  // Hapus row
  row.remove();

  // Re-index rows yang tersisa
  reindexProductPairs();
}

// Fungsi untuk mengindeks ulang semua product pairs
function reindexProductPairs() {
  const container = document.getElementById("productPairContainer");
  if (!container) return;

  const rows = container.querySelectorAll('.product-pair-row');
  rows.forEach((row, idx) => {
    const newIdx = idx + 1;

    // Update data-idx attribute
    row.setAttribute('data-idx', newIdx);

    // Update ID untuk input fields
    const descriptionInput = row.querySelector('.description-input');
    if (descriptionInput) {
      descriptionInput.id = `descriptionInput${newIdx}`;
    }

    const codeInput = row.querySelector('.code-input');
    if (codeInput) {
      codeInput.id = `productCodeInput${newIdx}`;
    }

    // Update label for attributes
    const labels = row.querySelectorAll('label');
    labels.forEach(label => {
      if (label.getAttribute('for')) {
        const currentFor = label.getAttribute('for');
        if (currentFor.includes('descriptionInput')) {
          label.setAttribute('for', `descriptionInput${newIdx}`);
        } else if (currentFor.includes('productCodeInput')) {
          label.setAttribute('for', `productCodeInput${newIdx}`);
        }
      }
    });
  });
}

// Fungsi untuk add new code (Job Costing 2)
function addNewCode() {
  const container = document.getElementById("codeEditContainer");
  if (!container) return;

  // Cek apakah ada input yang masih kosong
  const codeEdits = container.querySelectorAll('.code-edit');
  for (let input of codeEdits) {
    if (input.value.trim() === "") {
      showToast("Harap isi semua kode produk sebelum menambahkan kode baru.", "warning");
      return;
    }
  }

  // Hitung jumlah code yang sudah ada
  const codes = container.querySelectorAll(".input-group");
  const newIdx = codes.length + 1;

  // Buat input baru
  const newCodeEdit = document.createElement('div');
  newCodeEdit.className = 'input-group mb-2';
  newCodeEdit.setAttribute('data-idx', newIdx);

  newCodeEdit.innerHTML = `
    <span class="input-group-text drag-handle" style="cursor: grab;">
      <i class="bi bi-grip-horizontal"></i>
    </span>
    <textarea class="form-control code-edit" rows="1" placeholder="Kode produk..."></textarea>
    <button class="btn btn-outline-danger btn-sm remove-code-btn" type="button" title="Hapus kode" onclick="removeCode(this)">
      <i class="bi bi-x"></i>
    </button>
  `;

  container.appendChild(newCodeEdit);

  // Re-initialize sortable
  new Sortable(container, {
    handle: '.drag-handle',
    animation: 300,
    ghostClass: 'bg-transparent',
  });
}

// Fungsi untuk remove code (Job Costing 2)
function removeCode(button) {
  const inputGroup = button.closest('.input-group');
  if (!inputGroup) return;

  // Jika ini adalah input terakhir, jangan hapus
  const container = document.getElementById("codeEditContainer");
  if (container && container.querySelectorAll('.input-group').length <= 1) {
    showToast("Minimal harus ada satu kode produk!", "warning");
    return;
  }

  // Hapus input group
  inputGroup.remove();

  // Re-index inputs yang tersisa
  reindexCodeEdits();
}

// Fungsi untuk mengindeks ulang semua code edits
function reindexCodeEdits() {
  const container = document.getElementById("codeEditContainer");
  if (!container) return;

  const inputGroups = container.querySelectorAll('.input-group');
  inputGroups.forEach((group, idx) => {
    const newIdx = idx + 1;
    group.setAttribute('data-idx', newIdx);
  });
}

// Fungsi showToast jika belum ada
function showToast(message, type = 'info') {
  // Buat toast element
  const toast = document.createElement('div');
  toast.className = `alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
  toast.style.top = '20px';
  toast.style.right = '20px';
  toast.style.zIndex = '9999';
  toast.style.minWidth = '300px';

  toast.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  // Tambahkan ke body
  document.body.appendChild(toast);

  // Auto remove setelah 3 detik
  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}



// Fungsi helper untuk mendapatkan detail dari form saat ini
function getCurrentDetailFromForm() {
  return {
    mobilName: document.getElementById("mobilNameInput")?.value || "",
    lokasi: document.getElementById("pdcNameInput")?.value || "",
    batch: document.getElementById("batchInput")?.value || "",
    warehouseCode: document.getElementById("kodeGudangInput")?.value || "",
    jobCostingType: document.getElementById("jobCostingSelect")?.value || "Job Costing 1",
    describe: document.getElementById("keteranganInput")?.value || "",
    codeData: {},
  };
}

// Jalankan inisialisasi halaman setelah DOM selesai dimuat
document.addEventListener("DOMContentLoaded", initializeDetailPage);