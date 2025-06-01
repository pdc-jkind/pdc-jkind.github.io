// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  // Your Firebase credentials here
  apiKey: "AIzaSyC7RgiZIIugvmMAyF8TwjUP1-1LKSDDwb4",
  authDomain: "code-list-pdc.firebaseapp.com",
  projectId: "code-list-pdc",
  storageBucket: "code-list-pdc.firebasestorage.app",
  messagingSenderId: "313665311782",
  appId: "1:313665311782:web:c2d4786ff01f3707be82e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fungsi untuk mendapatkan semua data Job Costing
async function getAllJobCostingData(collectionName) {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    const allData = [];

    for (const docSnap of snapshot.docs) {
      const docData = docSnap.data();
      const docId = docSnap.id;

      // Ambil subcollection 'vehicles' jika ada
      const vehiclesRef = collection(db, collectionName, docId, "vehicles");
      const vehiclesSnap = await getDocs(vehiclesRef);
      const vehicles = vehiclesSnap.docs.map((v) => ({
        id: v.id,
        ...v.data(),
      }));

      // Ambil subcollection 'detail_list' jika ada
      const detailListRef = collection(db, collectionName, docId, "detail_list");
      const detailSnap = await getDocs(detailListRef);
      const detailList = detailSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // Gabungkan semua data ke dalam objek
      allData.push({
        id: docId,
        ...docData,
        vehicles,
        detail_list: detailList,
      });
    }

    return allData;
  } catch (error) {
    console.error("Error getting Job Costing data:", error);
    throw error;
  }
}

// Fungsi untuk mendapatkan data PDC tertentu
async function getPDCData(pdcName, rootCollection) {
  try {
    if (!pdcName || !rootCollection) {
      throw new Error('PDC name and root collection are required');
    }

    const sanitizedPdcName = pdcName.replace(/[\/\.#$\[\]]/g, "_");
    const pdcRef = doc(db, rootCollection, sanitizedPdcName);
    const docSnap = await getDoc(pdcRef);

    if (!docSnap.exists()) {
      throw new Error(`PDC ${pdcName} not found in ${rootCollection}`);
    }

    const pdcData = { id: docSnap.id, ...docSnap.data() };

    // Ambil vehicles subcollection
    const vehiclesRef = collection(db, rootCollection, sanitizedPdcName, "vehicles");
    const vehiclesSnap = await getDocs(vehiclesRef);
    const vehicles = vehiclesSnap.docs.map((v) => ({
      id: v.id,
      ...v.data(),
    }));

    // Ambil detail_list subcollection jika ada
    const detailListRef = collection(db, rootCollection, sanitizedPdcName, "detail_list");
    const detailSnap = await getDocs(detailListRef);
    const detailList = detailSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return {
      ...pdcData,
      vehicles,
      detail_list: detailList,
    };
  } catch (error) {
    console.error(`Error getting PDC data for ${pdcName}:`, error);
    throw error;
  }
}

// Fungsi untuk menambahkan PDC baru dengan dukungan DO
async function addNewPDC(pdcName, batchNumber, vehicles = [], rootCollection, kodeGudang = "") {
  try {
    // Validasi parameter
    if (!pdcName || typeof pdcName !== 'string') {
      throw new Error(`Nama PDC tidak valid: ${pdcName}`);
    }

    // Validasi rootCollection dengan dukungan DO
    if (!rootCollection) {
      throw new Error('Root collection tidak boleh kosong');
    }

    const allowedCollections = ['Job Costing 1', 'Job Costing 2', 'DO'];
    if (!allowedCollections.includes(rootCollection)) {
      throw new Error(`Root collection tidak dikenali: ${rootCollection}. Collection yang diizinkan: ${allowedCollections.join(', ')}`);
    }

    // Sanitasi PDC name - hapus karakter ilegal dalam path Firestore
    const sanitizedPdcName = pdcName.replace(/[\/\.#$\[\]]/g, "_");

    console.log(`Creating PDC: ${sanitizedPdcName} in ${rootCollection} with batch ${batchNumber}, kodeGudang: ${kodeGudang}`);
    console.log('Vehicles data received:', vehicles);

    // Buat dokumen PDC dengan batchNumber dan kodeGudang
    const pdcRef = doc(db, rootCollection, sanitizedPdcName);
    await setDoc(pdcRef, {
      batchNumber,
      kodeGudang: kodeGudang || "",
      createdAt: new Date()
    });

    // Proses setiap kendaraan dengan validasi berdasarkan tipe collection
    for (const vehicle of vehicles) {
      console.log('Processing vehicle:', vehicle);

      if (!vehicle.name) {
        console.warn('Skipping vehicle without name:', vehicle);
        continue;
      }

      // Sanitasi vehicle name
      const sanitizedVehicleName = String(vehicle.name).replace(/[\/\.#$\[\]]/g, "_");
      console.log(`Adding vehicle: ${sanitizedVehicleName} to PDC: ${sanitizedPdcName} in collection: ${rootCollection}`);

      const vehicleRef = doc(collection(db, rootCollection, sanitizedPdcName, "vehicles"), sanitizedVehicleName);

      // Struktur data berbeda berdasarkan tipe Job Costing
      if (rootCollection === 'Job Costing 1') {
        // Job Costing 1: menggunakan productData (object dengan key-value pairs)
        const vehicleData = {
          productData: vehicle.productData || {},
          describe: vehicle.describe || ""
        };
        console.log(`Job Costing 1 - Vehicle data for ${sanitizedVehicleName}:`, vehicleData);
        await setDoc(vehicleRef, vehicleData);
      } else if (rootCollection === 'Job Costing 2') {
        // Job Costing 2: menggunakan code array
        const vehicleData = {
          code: Array.isArray(vehicle.code) ? vehicle.code : [],
          describe: vehicle.describe || ""
        };
        console.log(`Job Costing 2 - Vehicle data for ${sanitizedVehicleName}:`, vehicleData);
        await setDoc(vehicleRef, vehicleData);
      } else if (rootCollection === 'DO') {
        // DO: menggunakan struktur sama seperti Job Costing 1 (productData + describe)
        const vehicleData = {
          productData: vehicle.productData || {},
          describe: vehicle.describe || ""
        };
        console.log(`DO - Vehicle data for ${sanitizedVehicleName}:`, vehicleData);
        await setDoc(vehicleRef, vehicleData);
      }
    }

    console.log(`PDC ${sanitizedPdcName} berhasil ditambahkan ke koleksi ${rootCollection}.`);
    return true;
  } catch (error) {
    console.error(`Error saat menambahkan PDC ${pdcName}:`, error);
    throw error;
  }
}

// Fungsi update dengan dukungan DO
async function updatePDC(pdcName, batchNumber, vehicles = [], rootCollection, kodeGudang = "") {
  try {
    // Validasi parameter
    if (!pdcName || typeof pdcName !== 'string') {
      throw new Error(`Nama PDC tidak valid: ${pdcName}`);
    }

    // Validasi rootCollection dengan dukungan DO
    if (!rootCollection) {
      throw new Error('Root collection tidak boleh kosong');
    }

    const allowedCollections = ['Job Costing 1', 'Job Costing 2', 'DO'];
    if (!allowedCollections.includes(rootCollection)) {
      throw new Error(`Root collection tidak dikenali: ${rootCollection}. Collection yang diizinkan: ${allowedCollections.join(', ')}`);
    }

    // Sanitasi PDC name
    const sanitizedPdcName = pdcName.replace(/[\/\.#$\[\]]/g, "_");

    console.log(`Updating PDC: ${sanitizedPdcName} in ${rootCollection} with batch ${batchNumber}, kodeGudang: ${kodeGudang}`);

    // Reference ke dokumen PDC
    const pdcRef = doc(db, rootCollection, sanitizedPdcName);

    // Periksa apakah dokumen PDC ada
    const docSnap = await getDoc(pdcRef);

    if (!docSnap.exists()) {
      console.log(`PDC ${sanitizedPdcName} tidak ditemukan di ${rootCollection}, membuat dokumen baru`);
      await setDoc(pdcRef, {
        batchNumber,
        kodeGudang: kodeGudang || "",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      console.log(`Updating existing PDC ${sanitizedPdcName} di ${rootCollection}`);
      await updateDoc(pdcRef, {
        batchNumber,
        kodeGudang: kodeGudang || "",
        updatedAt: new Date()
      });
    }

    // Update vehicles
    for (const vehicle of vehicles) {
      if (!vehicle.name) {
        console.warn('Skipping vehicle without name:', vehicle);
        continue;
      }

      const sanitizedVehicleName = String(vehicle.name).replace(/[\/\.#$\[\]]/g, "_");
      console.log(`Updating vehicle: ${sanitizedVehicleName} in PDC: ${sanitizedPdcName} in collection: ${rootCollection}`);

      const vehicleRef = doc(collection(db, rootCollection, sanitizedPdcName, "vehicles"), sanitizedVehicleName);
      const vehicleDoc = await getDoc(vehicleRef);

      if (rootCollection === 'Job Costing 1') {
        const vehicleData = {
          productData: vehicle.productData || {},
          describe: vehicle.describe || ""
        };
        console.log(`Job Costing 1 Update - Vehicle data for ${sanitizedVehicleName}:`, vehicleData);

        if (vehicleDoc.exists()) {
          await updateDoc(vehicleRef, vehicleData);
        } else {
          await setDoc(vehicleRef, vehicleData);
        }
      } else if (rootCollection === 'Job Costing 2') {
        const vehicleData = {
          code: Array.isArray(vehicle.code) ? vehicle.code : [],
          describe: vehicle.describe || ""
        };
        console.log(`Job Costing 2 Update - Vehicle data for ${sanitizedVehicleName}:`, vehicleData);

        if (vehicleDoc.exists()) {
          await updateDoc(vehicleRef, vehicleData);
        } else {
          await setDoc(vehicleRef, vehicleData);
        }
      } else if (rootCollection === 'DO') {
        // DO: menggunakan struktur sama seperti Job Costing 1 (productData + describe)
        const vehicleData = {
          productData: vehicle.productData || {},
          describe: vehicle.describe || ""
        };
        console.log(`DO Update - Vehicle data for ${sanitizedVehicleName}:`, vehicleData);

        if (vehicleDoc.exists()) {
          await updateDoc(vehicleRef, vehicleData);
        } else {
          await setDoc(vehicleRef, vehicleData);
        }
      }
    }

    console.log(`PDC ${sanitizedPdcName} berhasil diupdate di koleksi ${rootCollection}.`);
    return true;
  } catch (error) {
    console.error(`Error saat mengupdate PDC ${pdcName}:`, error);
    throw error;
  }
}

// Fungsi untuk mengedit vehicle tertentu
async function editVehicle(pdcName, vehicleName, vehicleData, rootCollection) {
  try {
    if (!pdcName || !vehicleName || !rootCollection) {
      throw new Error('PDC name, vehicle name, and root collection are required');
    }

    const allowedCollections = ['Job Costing 1', 'Job Costing 2', 'DO'];
    if (!allowedCollections.includes(rootCollection)) {
      throw new Error(`Root collection tidak dikenali: ${rootCollection}`);
    }

    const sanitizedPdcName = pdcName.replace(/[\/\.#$\[\]]/g, "_");
    const sanitizedVehicleName = String(vehicleName).replace(/[\/\.#$\[\]]/g, "_");

    const vehicleRef = doc(collection(db, rootCollection, sanitizedPdcName, "vehicles"), sanitizedVehicleName);

    // Periksa apakah vehicle ada
    const vehicleDoc = await getDoc(vehicleRef);
    if (!vehicleDoc.exists()) {
      throw new Error(`Vehicle ${vehicleName} not found in PDC ${pdcName}`);
    }

    // Update berdasarkan tipe collection
    let updateData = {};
    if (rootCollection === 'Job Costing 1') {
      updateData = {
        productData: vehicleData.productData || {},
        describe: vehicleData.describe || "",
        updatedAt: new Date()
      };
    } else if (rootCollection === 'Job Costing 2') {
      updateData = {
        code: Array.isArray(vehicleData.code) ? vehicleData.code : [],
        describe: vehicleData.describe || "",
        updatedAt: new Date()
      };
    } else if (rootCollection === 'DO') {
      // DO: menggunakan struktur sama seperti Job Costing 1 (productData + describe)
      updateData = {
        productData: vehicleData.productData || {},
        describe: vehicleData.describe || "",
        updatedAt: new Date()
      };
    }

    await updateDoc(vehicleRef, updateData);
    console.log(`Vehicle ${vehicleName} in PDC ${pdcName} successfully updated`);
    return true;
  } catch (error) {
    console.error(`Error editing vehicle ${vehicleName}:`, error);
    throw error;
  }
}

// Fungsi untuk menghapus vehicle
async function deleteVehicle(pdcName, vehicleName, rootCollection) {
  try {
    if (!pdcName || !vehicleName || !rootCollection) {
      throw new Error('PDC name, vehicle name, and root collection are required');
    }

    const sanitizedPdcName = pdcName.replace(/[\/\.#$\[\]]/g, "_");
    const sanitizedVehicleName = String(vehicleName).replace(/[\/\.#$\[\]]/g, "_");

    const vehicleRef = doc(collection(db, rootCollection, sanitizedPdcName, "vehicles"), sanitizedVehicleName);

    // Periksa apakah vehicle ada
    const vehicleDoc = await getDoc(vehicleRef);
    if (!vehicleDoc.exists()) {
      throw new Error(`Vehicle ${vehicleName} not found in PDC ${pdcName}`);
    }

    await deleteDoc(vehicleRef);
    console.log(`Vehicle ${vehicleName} in PDC ${pdcName} successfully deleted`);
    return true;
  } catch (error) {
    console.error(`Error deleting vehicle ${vehicleName}:`, error);
    throw error;
  }
}

// Fungsi untuk menghapus PDC dan semua subcollectionnya
async function deletePDC(pdcName, rootCollection) {
  try {
    if (!pdcName || !rootCollection) {
      throw new Error('PDC name and root collection are required');
    }

    const sanitizedPdcName = pdcName.replace(/[\/\.#$\[\]]/g, "_");

    // Hapus semua vehicles terlebih dahulu
    const vehiclesRef = collection(db, rootCollection, sanitizedPdcName, "vehicles");
    const vehiclesSnap = await getDocs(vehiclesRef);

    for (const vehicleDoc of vehiclesSnap.docs) {
      await deleteDoc(vehicleDoc.ref);
    }

    // Hapus semua detail_list jika ada
    const detailListRef = collection(db, rootCollection, sanitizedPdcName, "detail_list");
    const detailSnap = await getDocs(detailListRef);

    for (const detailDoc of detailSnap.docs) {
      await deleteDoc(detailDoc.ref);
    }

    // Hapus dokumen PDC utama
    const pdcRef = doc(db, rootCollection, sanitizedPdcName);
    await deleteDoc(pdcRef);

    console.log(`PDC ${pdcName} and all its subcollections successfully deleted`);
    return true;
  } catch (error) {
    console.error(`Error deleting PDC ${pdcName}:`, error);
    throw error;
  }
}

export {
  getAllJobCostingData,
  getPDCData,
  addNewPDC,
  updatePDC,
  editVehicle,
  deleteVehicle,
  deletePDC
};