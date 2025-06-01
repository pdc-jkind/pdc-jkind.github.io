import { getAllJobCostingData } from '../firebase/firebase_setup.js';

/**
 * Job Costing Card Handler - Refactored Version
 * Mengelola interaksi dengan kartu job costing
 */
class JobCostingCardHandler {
  constructor() {
    this.cardConfig = {
      0: { type: 'excel', collection: 'Job Costing 1', code: 'JC1', name: 'Excel_JC1' },
      1: { type: 'const', collection: 'Job Costing 1', code: 'JC1', name: 'Const Job Costing 1' },
      2: { type: 'excel', collection: 'Job Costing 2', code: 'JC2', name: 'Excel_JC2' },
      3: { type: 'const', collection: 'Job Costing 2', code: 'JC2', name: 'Const Job Costing 2' },
      4: { type: 'excel', collection: 'DO', code: 'DO', name: 'Excel_DO' },
      5: { type: 'const', collection: 'DO', code: 'DO', name: 'Const DO' },
      6: { type: 'excel', collection: 'Job Costing 1', code: 'Reject', name: 'Excel_Reject' },
      7: { type: 'const', collection: 'Job Costing 1', code: 'Reject', name: 'Const Reject' }
    };

    this.loadingModalId = 'loadingModal';
    this.clickFeedbackClass = 'card-clicked';
    this.clickFeedbackDuration = 200;
    this.currentParsedData = null;
    this.currentConfig = null;

    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
    } else {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    const hoverCards = document.querySelectorAll('.hover-card');
    if (hoverCards.length === 0) {
      console.warn('Tidak ada elemen dengan class .hover-card ditemukan');
      return;
    }

    hoverCards.forEach((card, index) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', async (e) => {
        e.preventDefault();
        await this.handleCardClick(card, index);
      });
    });
  }

  async handleCardClick(card, index) {
    try {
      const config = this.cardConfig[index];
      if (!config) {
        console.warn(`Konfigurasi untuk card index ${index} tidak ditemukan`);
        return;
      }

      this.openModal(this.loadingModalId);
      this.addClickFeedback(card);

      const parsedData = await this.loadJobCostingData(config.collection, config.code);
      this.currentParsedData = parsedData;
      this.currentConfig = config;

      await this.processData(parsedData, config);
    } catch (error) {
      console.error(`Error handling card click for index ${index}:`, error);
      this.handleError(error);
    }
  }

  async loadJobCostingData(collectionName, structureType) {
    try {
      const rawData = await getAllJobCostingData(collectionName);
      return rawData.map(doc => this.parseJobCosting(doc, structureType));
    } catch (error) {
      console.error("Failed to load and parse job costing data:", error);
      return [];
    }
  }

  parseJobCosting(doc, structureType) {
    if (structureType === "JC1") {
      // logika parsing untuk JC1
      return { ...doc, parsedType: "JC1" };
    }

    if (structureType === "JC2") {
      // logika parsing untuk JC2
      return { ...doc, parsedType: "JC2" };
    }

    if (structureType === "DO") {
      // logika parsing untuk DO (sama seperti JC2)
      return { ...doc, parsedType: "DO" };
    }

    if (structureType === "Reject") {
      // logika parsing untuk Reject (sama seperti JC1)
      return { ...doc, parsedType: "Reject" };
    }

    // default
    return doc;
  }

  async processData(parsedData, config) {
    switch (config.type) {
      case 'excel':
        this.closeModal(this.loadingModalId);
        this.showFilterModal(parsedData);
        break;
      case 'const':
        return this.processConstData(parsedData, config);
      default:
        console.warn(`Tipe ${config.type} tidak dikenali`);
    }
  }

  showFilterModal(parsedData) {
    this.populatePDCOptions(parsedData);
    this.setupModalEventListeners();
    this.openModal('inputModal');
  }

  populatePDCOptions(parsedData) {
    const pdcInput = document.getElementById('pdcInput');
    const pdcSuggestions = document.getElementById('pdcSuggestions');
    const pdcOptions = parsedData.map(item => ({
      id: item.id,
      name: item.valuenamamobil || item.id
    }));

    this.setupAutocomplete(pdcInput, pdcSuggestions, pdcOptions, (selectedPDC) => {
      this.populateVehicleOptions(selectedPDC);
    });
  }

  populateVehicleOptions(selectedPDC) {
    const selectedPDCData = this.currentParsedData.find(item => item.id === selectedPDC.id);
    if (!selectedPDCData || !selectedPDCData.vehicles) {
      console.warn('Data kendaraan tidak ditemukan untuk PDC yang dipilih');
      return;
    }

    const vehicleInput = document.getElementById('vehicleInput');
    const vehicleSuggestions = document.getElementById('vehicleSuggestions');
    const vehicleTagsContainer = document.getElementById('vehicleTags');

    // Clear existing data
    vehicleTagsContainer.innerHTML = '';
    vehicleInput.value = '';

    this.setupVehicleTagInput(vehicleInput, vehicleSuggestions, selectedPDCData.vehicles, vehicleTagsContainer);
  }

  setupVehicleTagInput(input, dropdown, vehicles, tagsContainer) {
    const selectedVehicles = new Set();

    const handleInput = (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length === 0) {
        dropdown.classList.add('d-none');
        return;
      }

      const filteredOptions = vehicles.filter(vehicle =>
        !selectedVehicles.has(vehicle.id) &&
        (vehicle.name || vehicle.id).toLowerCase().includes(query)
      );

      this.renderSuggestions(dropdown, filteredOptions, (selectedVehicle) => {
        this.addVehicleTag(selectedVehicle, tagsContainer, selectedVehicles);
        input.value = '';
        dropdown.classList.add('d-none');
      });

      dropdown.classList.toggle('d-none', filteredOptions.length === 0);
    };

    input.addEventListener('input', handleInput);
    this.setupClickOutside(input, dropdown);
  }

  addVehicleTag(vehicle, container, selectedVehicles) {
    selectedVehicles.add(vehicle.id);

    const tag = document.createElement('span');
    tag.className = 'badge bg-primary me-2 mb-2 d-inline-flex align-items-center';
    tag.style.fontSize = '0.875rem';
    tag.dataset.vehicleId = vehicle.id;
    tag.innerHTML = `
      <span class="me-1">${vehicle.name || vehicle.id}</span>
      <button type="button" class="btn-close btn-close-white ms-1" style="font-size: 0.6rem;" aria-label="Remove"></button>
    `;

    const removeBtn = tag.querySelector('.btn-close');
    removeBtn.addEventListener('click', () => {
      selectedVehicles.delete(vehicle.id);
      tag.remove();
    });

    container.appendChild(tag);
  }

  setupAutocomplete(input, dropdown, options, onSelect = null) {
    const handleInput = (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length === 0) {
        dropdown.classList.add('d-none');
        this.clearPDCDisplay(input);
        return;
      }

      const filteredOptions = options.filter(option =>
        (option.name || option.id).toLowerCase().includes(query)
      );

      this.renderSuggestions(dropdown, filteredOptions, (selectedOption) => {
        input.value = selectedOption.name || selectedOption.id;
        input.dataset.selectedId = selectedOption.id;
        dropdown.classList.add('d-none');
        this.displaySelectedPDC(input, selectedOption);
        if (onSelect) onSelect(selectedOption);
      });

      dropdown.classList.remove('d-none');
    };

    input.addEventListener('input', handleInput);
    this.setupClickOutside(input, dropdown);
  }

  renderSuggestions(dropdown, options, onSelect) {
    dropdown.innerHTML = '';

    if (options.length === 0) {
      dropdown.innerHTML = '<div class="suggestion-item p-2 text-muted">Tidak ada hasil ditemukan</div>';
      return;
    }

    options.forEach(option => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'suggestion-item p-2 cursor-pointer';
      suggestionItem.textContent = option.name || option.id;
      suggestionItem.addEventListener('click', () => onSelect(option));
      dropdown.appendChild(suggestionItem);
    });
  }

  setupClickOutside(input, dropdown) {
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('d-none');
      }
    });
  }

  setupModalEventListeners() {
    const addPDCBtn = document.getElementById('addVehicleBtn');
    const exportForm = document.getElementById('exportForm');
    const pdcInput = document.getElementById('pdcInput');

    addPDCBtn.addEventListener('click', this.addNewPDCForm.bind(this));
    exportForm.addEventListener('submit', this.handleExportSubmit.bind(this));

    pdcInput.addEventListener('input', () => {
      const vehicleTagsContainer = document.getElementById('vehicleTags');
      const vehicleInput = document.getElementById('vehicleInput');

      if (vehicleTagsContainer) vehicleTagsContainer.innerHTML = '';
      if (vehicleInput) vehicleInput.value = '';
      if (!pdcInput.value.trim()) this.clearPDCDisplay(pdcInput);
    });
  }

  addNewPDCForm() {
    const pdcFormsContainer = document.getElementById('pdcFormsContainer');
    const existingPDCs = new Set();

    pdcFormsContainer.querySelectorAll('.pdc-input').forEach(input => {
      if (input.dataset.selectedId) existingPDCs.add(input.dataset.selectedId);
    });

    const pdcFormGroup = this.createPDCFormGroup();
    pdcFormsContainer.appendChild(pdcFormGroup);

    this.setupPDCFormEvents(pdcFormGroup, existingPDCs);
  }

  createPDCFormGroup() {
    const pdcFormGroup = document.createElement('div');
    pdcFormGroup.className = 'pdc-form-group border rounded p-3 mb-3';
    pdcFormGroup.innerHTML = `
      <div class="d-flex justify-content-end align-items-end mb-3">
        <button type="button" class="btn btn-outline-danger btn-sm remove-pdc-form-btn">
          <i class="bi bi-trash"></i>
        </button>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Nama PDC</label>
        <div class="position-relative">
          <input type="text" class="form-control pdc-input" placeholder="Ketik atau pilih nama PDC..." autocomplete="off" />
          <div class="suggestion-dropdown d-none pdc-suggestions"></div>
        </div>
        <div class="selected-pdc-display mt-2 text-muted small"></div>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Kendaraan</label>
        <div class="position-relative">
          <input type="text" class="form-control vehicle-tag-input" placeholder="Ketik atau pilih nama kendaraan..." autocomplete="off" />
          <div class="suggestion-dropdown d-none vehicle-tag-suggestions"></div>
        </div>
        <div class="vehicle-tags-container mt-2"></div>
      </div>
    `;
    return pdcFormGroup;
  }

  setupPDCFormEvents(pdcFormGroup, existingPDCs) {
    const removeBtn = pdcFormGroup.querySelector('.remove-pdc-form-btn');
    const pdcInput = pdcFormGroup.querySelector('.pdc-input');
    const pdcSuggestions = pdcFormGroup.querySelector('.pdc-suggestions');

    removeBtn.addEventListener('click', () => pdcFormGroup.remove());

    const availablePDCs = this.currentParsedData.filter(item => !existingPDCs.has(item.id));
    this.setupAutocomplete(pdcInput, pdcSuggestions, availablePDCs, (selectedPDC) => {
      const vehicleInput = pdcFormGroup.querySelector('.vehicle-tag-input');
      const vehicleSuggestions = pdcFormGroup.querySelector('.vehicle-tag-suggestions');
      const vehicleTagsContainer = pdcFormGroup.querySelector('.vehicle-tags-container');

      vehicleTagsContainer.innerHTML = '';
      vehicleInput.value = '';

      if (selectedPDC.vehicles) {
        this.setupVehicleTagInput(vehicleInput, vehicleSuggestions, selectedPDC.vehicles, vehicleTagsContainer);
      }
    });
  }

  async handleExportSubmit(e) {
    e.preventDefault();

    try {
      const allResults = [...this.getMainFormData(), ...this.getAdditionalPDCFormsData()];

      if (allResults.length === 0) {
        alert('Silakan pilih minimal satu PDC dan kendaraan');
        return;
      }

      this.closeModal('inputModal');
      this.updateLoadingText('Memproses export data...');

      const filteredData = this.filterMultipleParsedData(allResults);
      this.processExcelData(filteredData, this.currentConfig);
      this.clearAllForms();
    } catch (error) {
      console.error('Error during export:', error);
      this.closeModal(this.loadingModalId);
      this.handleError(error);
    }
  }

  getMainFormData() {
    const mainPDCInput = document.getElementById('pdcInput');
    const mainPDCId = mainPDCInput?.dataset?.selectedId;
    const mainVehicleTags = document.querySelectorAll('#vehicleTags [data-vehicle-id]');
    const mainVehicleIds = Array.from(mainVehicleTags).map(tag => tag.dataset.vehicleId);

    const mainData = mainPDCId ? [{ pdcId: mainPDCId, vehicleIds: mainVehicleIds }] : [];

    console.log(`main data : ${JSON.stringify(mainData)}`);
    return mainData;
  }

  getAdditionalPDCFormsData() {
    const results = [];
    const pdcForms = document.querySelectorAll('.pdc-form-group');

    pdcForms.forEach(form => {
      const pdcInput = form.querySelector('.pdc-input');

      // Add null check before accessing dataset
      if (!pdcInput) {
        console.warn('PDC input not found in form');
        return;
      }

      const selectedPDCId = pdcInput.dataset?.selectedId;

      if (selectedPDCId) {
        const vehicleTagsContainer = form.querySelector('.vehicle-tags-container');

        if (!vehicleTagsContainer) {
          console.warn('Vehicle tags container not found in form');
          return;
        }

        const vehicleTags = vehicleTagsContainer.querySelectorAll('[data-vehicle-id]');
        let selectedVehicleIds = Array.from(vehicleTags).map(tag => tag.dataset.vehicleId);

        // If no vehicles are selected, use all vehicles from PDC
        if (selectedVehicleIds.length === 0) {
          const selectedPDCData = this.currentParsedData.find(item => item.id === selectedPDCId);
          if (selectedPDCData && selectedPDCData.vehicles) {
            selectedVehicleIds = selectedPDCData.vehicles.map(vehicle => vehicle.id);
          }
        }

        results.push({ pdcId: selectedPDCId, vehicleIds: selectedVehicleIds });
      }
    });

    console.log(`data secondary dll : ${JSON.stringify(results)}`);
    return results;
  }

  filterMultipleParsedData(results) {
    return results.map(result => {
      const selectedPDCData = this.currentParsedData.find(item => item.id === result.pdcId);
      if (selectedPDCData) {
        const filteredVehicles = selectedPDCData.vehicles.filter(vehicle =>
          result.vehicleIds.includes(vehicle.id)
        );
        return { ...selectedPDCData, vehicles: filteredVehicles };
      }
      return null;
    }).filter(Boolean);
  }

  clearAllForms() {
    const elements = {
      pdcInput: document.getElementById('pdcInput'),
      vehicleInput: document.getElementById('vehicleInput'),
      vehicleTags: document.getElementById('vehicleTags'),
      pdcFormsContainer: document.getElementById('pdcFormsContainer')
    };

    if (elements.pdcInput) {
      elements.pdcInput.value = '';
      elements.pdcInput.removeAttribute('data-selected-id');
      this.clearPDCDisplay(elements.pdcInput);
    }
    if (elements.vehicleInput) elements.vehicleInput.value = '';
    if (elements.vehicleTags) elements.vehicleTags.innerHTML = '';
    if (elements.pdcFormsContainer) elements.pdcFormsContainer.innerHTML = '';
  }

  displaySelectedPDC(input, selectedPDC) {
    const container = input.closest('.mb-3') || input.parentElement;
    let displayElement = container.querySelector('.selected-pdc-display');

    if (!displayElement) {
      displayElement = document.createElement('div');
      displayElement.className = 'selected-pdc-display mt-2 text-muted small';
      container.appendChild(displayElement);
    }

    displayElement.innerHTML = `<strong>PDC Terpilih:</strong> ${selectedPDC.name || selectedPDC.id}`;
    displayElement.style.display = 'block';
  }

  clearPDCDisplay(input) {
    const container = input.closest('.mb-3') || input.parentElement;
    const displayElement = container.querySelector('.selected-pdc-display');
    if (displayElement) {
      displayElement.style.display = 'none';
      displayElement.innerHTML = '';
    }
  }

  updateLoadingText(text) {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) loadingText.textContent = text;
  }

  processExcelData(parsedData, config) {
    try {
      let excelData;

      switch (config.code) {
        case 'JC1':
          excelData = this.transformJC1ToExcel(parsedData);
          break;
        case 'JC2':
          excelData = this.transformJC2ToExcel(parsedData);
          break;
        case 'DO':
          excelData = this.transformDOToExcel(parsedData);
          break;
        case 'Reject':
          excelData = this.transformRejectToExcel(parsedData);
          break;
        default:
          throw new Error(`Unknown code: ${config.code}`);
      }

      this.generateExcelFile(excelData, config.name);
    } catch (error) {
      console.error(`Error processing Excel data:`, error);
    } finally {
      this.closeModal(this.loadingModalId);
    }
  }

  transformJC1ToExcel(parsedData) {
    const excelRows = [];
    const headers = ['PDC', 'Mobil', "Jenis KF", "Rules", "Tanggal", ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()), 'Total'];
    excelRows.push(headers);

    parsedData.forEach(itemPDC => {
      if (itemPDC && itemPDC.id && Array.isArray(itemPDC.vehicles)) {
        const pdcName = itemPDC.id;

        itemPDC.vehicles.forEach(itemVehicle => {
          if (itemVehicle && itemVehicle.id && typeof itemVehicle.productData === 'object' && itemVehicle.productData !== null) {
            const vehicleName = itemVehicle.id;

            Object.keys(itemVehicle.productData).forEach(productKey => {
              const createRow = (description) => [
                pdcName, vehicleName, productKey, '', description,
                ...Array(31).fill(''), ''
              ];

              excelRows.push(createRow('Pemasangan (satuan kaca)'));
              excelRows.push(createRow('NG Line (satuan kaca)'));
            });
          }
        });
      }
    });
    return excelRows;
  }

  transformJC2ToExcel(parsedData) {
    const excelRows = [];
    const headers = ['PDC', 'Mobil/Tanggal', ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()), 'Total'];
    excelRows.push(headers);

    parsedData.forEach(itemPDC => {
      if (itemPDC && itemPDC.id && Array.isArray(itemPDC.vehicles)) {
        const pdcName = itemPDC.id;

        itemPDC.vehicles.forEach(itemVehicle => {
          if (itemVehicle && itemVehicle.id) {
            const row = [pdcName, itemVehicle.id, ...Array(31).fill(''), ''];
            excelRows.push(row);
          }
        });
      }
    });

    return excelRows;
  }

  transformDOToExcel(parsedData) {
    const excelRows = [];
    const headers = ['PDC', 'Mobil/Tanggal', ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()), 'Total'];
    excelRows.push(headers);

    parsedData.forEach(itemPDC => {
      if (itemPDC && itemPDC.id && Array.isArray(itemPDC.vehicles)) {
        const pdcName = itemPDC.id;

        itemPDC.vehicles.forEach(itemVehicle => {
          if (itemVehicle && itemVehicle.id) {
            const row = [pdcName, itemVehicle.id, ...Array(31).fill(''), ''];
            excelRows.push(row);
          }
        });
      }
    });

    return excelRows;
  }

  transformRejectToExcel(parsedData) {
    const excelRows = [];
    const headers = ['PDC', 'Mobil', "Jenis KF", "Rules", ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()), 'Total'];
    excelRows.push(headers);

    parsedData.forEach(itemPDC => {
      if (itemPDC && itemPDC.id && Array.isArray(itemPDC.vehicles)) {
        const pdcName = itemPDC.id;

        itemPDC.vehicles.forEach(itemVehicle => {
          if (itemVehicle && itemVehicle.id && typeof itemVehicle.productData === 'object' && itemVehicle.productData !== null) {
            const vehicleName = itemVehicle.id;

            Object.keys(itemVehicle.productData).forEach(productKey => {
              // Hanya satu baris per product, tidak ada duplikasi untuk "Pemasangan" dan "NG Line"
              const row = [
                pdcName,
                vehicleName,
                productKey,
                '',
                ...Array(31).fill(''),
                ''
              ];
              excelRows.push(row);
            });
          }
        });
      }
    });

    return excelRows;
  }

  processConstData(parsedData, config) {
    try {
      let tsContent, fileName;

      switch (config.code) {
        case 'JC1':
          tsContent = this.generateJC1TS(parsedData);
          fileName = 'productCodesJC1.ts';
          break;
        case 'JC2':
          tsContent = this.generateJC2TS(parsedData);
          fileName = 'productCodesJC2.ts';
          break;
        case 'DO':
          tsContent = this.generateDOTS(parsedData);
          fileName = 'Delivery_Order.ts';
          break;
        case 'Reject':
          tsContent = this.generateRejectTS(parsedData);
          fileName = 'reject.ts';
          break;
        default:
          throw new Error(`Unknown code: ${config.code}`);
      }

      this.downloadTSFile(tsContent, fileName);
    } catch (error) {
      console.error(`Error processing Const data:`, error);
    } finally {
      this.closeModal(this.loadingModalId);
    }
  }

  generateJC1TS(parsedData) {
    let tsContent = 'export const productbatchNumbersJC1 = {\n';
    const pdcGroups = this.groupParsedDataByPDC(parsedData);

    Object.entries(pdcGroups).forEach(([pdcName, pdcData]) => {
      tsContent += `  "${pdcName}": {\n`;
      tsContent += `    batchNumber: "${pdcData.batchNumber}",\n`;
      tsContent += `    warehouseCode: "${pdcData.warehouseCode}",\n`;

      pdcData.vehicles.forEach(vehicle => {
        tsContent += `    "${vehicle.name}": \n${vehicle.code},\n`;
      });

      tsContent += `  },\n`;
    });

    tsContent += '} as const;\n';
    return tsContent;
  }

  generateJC2TS(parsedData) {
    let tsContent = 'export const productbatchNumbersJC2 = {\n';
    const pdcGroups = this.groupParsedDataByPDC(parsedData);

    Object.entries(pdcGroups).forEach(([pdcName, pdcData]) => {
      tsContent += `  "${pdcName}": {\n`;
      tsContent += `    batchNumber: "${pdcData.batchNumber}",\n`;
      tsContent += `    warehouseCode: "${pdcData.warehouseCode}",\n`;

      pdcData.vehicles.forEach(vehicle => {
        tsContent += `    "${vehicle.name}": {\n`;
        tsContent += `      describe: "${vehicle.describe}",\n`;
        tsContent += `      code: [\n`;
        vehicle.code.forEach(code => {
          tsContent += `        "${code}",\n`;
        });
        tsContent += `      ],\n    },\n`;
      });

      tsContent += `  },\n`;
    });

    tsContent += '} as const;\n';
    return tsContent;
  }

  generateDOTS(parsedData) {
    let tsContent = 'export const Delivery_Order = {\n';
    const pdcGroups = this.groupParsedDataByPDC(parsedData);

    Object.entries(pdcGroups).forEach(([pdcName, pdcData]) => {
      console.log(`data vehicle : ${pdcData.vehicles}`)
      tsContent += `  "${pdcName}": {\n`;
      tsContent += `    batchNumber: "${pdcData.batchNumber}",\n`;
      tsContent += `    warehouseCode: "${pdcData.warehouseCode}",\n`;

      pdcData.vehicles.forEach(vehicle => {
        tsContent += `    "${vehicle.name}": {\n`;
        tsContent += `      describe: "${vehicle.describe}",\n`;
        tsContent += `      code: \n`;
        tsContent += `      ${vehicle.code || 'default'},\n`;
        tsContent += `      \n    },\n`;
      });

      tsContent += `  },\n`;
    });

    tsContent += '} as const;\n';
    return tsContent;
  }

  generateRejectTS(parsedData) {
    let tsContent = 'export const reject = {\n';
    const pdcGroups = this.groupParsedDataByPDCForReject(parsedData);

    Object.entries(pdcGroups).forEach(([pdcName, pdcData]) => {
      tsContent += `  "${pdcName}": {\n`;
      tsContent += `    batchNumber: "${pdcData.batchNumber}",\n`;
      tsContent += `    warehouseCode: "${pdcData.warehouseCode}",\n`;

      pdcData.vehicles.forEach(vehicle => {
        tsContent += `    "${vehicle.name}": \n${vehicle.code},\n`;
      });

      tsContent += `  },\n`;
    });

    tsContent += '} as const;\n';
    return tsContent;
  }

  groupParsedDataByPDC(parsedData) {
    const pdcGroups = {};

    parsedData.flat().forEach(item => {
      if (item && item.id) {
        const pdcName = item.id;

        if (!pdcGroups[pdcName]) {
          pdcGroups[pdcName] = {
            batchNumber: item.batchNumber || 'set',
            warehouseCode: item.kodeGudang || 'warehousecode',
            vehicles: []
          };
        }

        if (item.vehicles) {
          const vehicleNames = Array.isArray(item.vehicles) ? item.vehicles : [item.vehicles];
          vehicleNames.forEach(vehicleName => {
            const vehicleData = {
              name: vehicleName.id,
              describe: vehicleName.describe,
              code: typeof vehicleName.productData === 'object' && vehicleName.productData !== null
                ? JSON.stringify(vehicleName.productData)
                : Array.isArray(vehicleName.code) ? vehicleName.code : ['-', '-', '-']
            };
            pdcGroups[pdcName].vehicles.push(vehicleData);
          });
        }
      }
    });

    return pdcGroups;
  }

  groupParsedDataByPDCForReject(parsedData) {
    const pdcGroups = {};

    parsedData.flat().forEach(item => {
      if (item && item.id) {
        const pdcName = item.id;

        if (!pdcGroups[pdcName]) {
          // Modifikasi batchNumber untuk Reject
          let modifiedBatchNumber = 'set';
          if (item.batchNumber && typeof item.batchNumber === 'string') {
            // Extract angka dari "Job Costing XX" dan ubah menjadi "Reject XX"
            const match = item.batchNumber.match(/Job Costing (\d+)/);
            if (match && match[1]) {
              modifiedBatchNumber = `Reject ${match[1]}`;
            }
          }

          pdcGroups[pdcName] = {
            batchNumber: modifiedBatchNumber,
            warehouseCode: item.warehouseCode || 'warehousecode',
            vehicles: []
          };
        }

        if (item.vehicles) {
          const vehicleNames = Array.isArray(item.vehicles) ? item.vehicles : [item.vehicles];
          vehicleNames.forEach(vehicleName => {
            const vehicleData = {
              name: vehicleName.id,
              describe: vehicleName.describe,
              code: typeof vehicleName.productData === 'object' && vehicleName.productData !== null
                ? JSON.stringify(vehicleName.productData)
                : Array.isArray(vehicleName.code) ? vehicleName.code : ['-', '-', '-']
            };
            pdcGroups[pdcName].vehicles.push(vehicleData);
          });
        }
      }
    });

    return pdcGroups;
  }

  generateExcelFile(data, fileName) {
    try {
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      this.downloadFile(wbout, `${fileName}.xlsx`, 'application/octet-stream');
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  }

  downloadTSFile(content, fileName) {
    try {
      const blob = new Blob([content], { type: 'text/typescript;charset=utf-8;' });
      this.downloadFile(blob, fileName, 'text/typescript;charset=utf-8;');
    } catch (error) {
      console.error('Error downloading TypeScript file:', error);
    }
  }

  downloadFile(data, fileName, mimeType) {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  addClickFeedback(card) {
    if (!card || !card.classList) return;

    card.classList.add(this.clickFeedbackClass);
    setTimeout(() => card.classList.remove(this.clickFeedbackClass), this.clickFeedbackDuration);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (window.bootstrap && bootstrap.Modal) {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    } else {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (window.bootstrap && bootstrap.Modal) {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    } else {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
  }

  handleError(error) {
    console.error('Job Costing Handler Error:', error);
    this.closeModal(this.loadingModalId);
  }
}

// Initialize handler
const jobCostingHandler = new JobCostingCardHandler();
export default JobCostingCardHandler;

document.addEventListener("DOMContentLoaded", function () {
  jobCostingHandler;
});