// Configuración de Firebase para Vintage Tapicería

// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBpMM2NOEz0uziHGyqaH9lzaLU9wTSmG5k",
  authDomain: "base-de-datos-6cc34.firebaseapp.com",
  projectId: "base-de-datos-6cc34",
  storageBucket: "base-de-datos-6cc34.firebasestorage.app",
  messagingSenderId: "379818268950",
  appId: "1:379818268950:web:97e47ff91e23fe76d99837",
  measurementId: "G-0NVW69WFJF"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Inicializar Analytics si está disponible en el navegador
let analytics = null;
try {
  // Importar Analytics de forma dinámica para evitar errores en entornos que no lo soportan
  import("https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js")
    .then((module) => {
      const { getAnalytics } = module;
      analytics = getAnalytics(app);
      console.log("Analytics inicializado correctamente");
    })
    .catch(err => console.error("Error al cargar Analytics:", err));
} catch (e) {
  console.log("Analytics no está disponible en este entorno");
}

// Funciones para autenticación
async function loginWithEmailAndPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error de autenticación:", error);
    return { success: false, error: error.message };
  }
}

function logoutUser() {
  return signOut(auth);
}

function getCurrentUser() {
  return auth.currentUser;
}

function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Funciones para Firestore
async function saveData(collectionName, id, data) {
  try {
    await setDoc(doc(db, collectionName, id.toString()), data);
    return { success: true };
  } catch (error) {
    console.error(`Error al guardar en ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}

async function updateData(collectionName, id, data) {
  try {
    await updateDoc(doc(db, collectionName, id.toString()), data);
    return { success: true };
  } catch (error) {
    console.error(`Error al actualizar en ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}

async function deleteData(collectionName, id) {
  try {
    await deleteDoc(doc(db, collectionName, id.toString()));
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar de ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}

async function getData(collectionName, id) {
  try {
    const docSnap = await getDoc(doc(db, collectionName, id.toString()));
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "No existe el documento" };
    }
  } catch (error) {
    console.error(`Error al obtener de ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}

async function getAllData(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: items };
  } catch (error) {
    console.error(`Error al obtener todos de ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}

// Exportar funciones para usar en otros archivos
export {
  db,
  auth,
  loginWithEmailAndPassword,
  logoutUser,
  getCurrentUser,
  onAuthChange,
  saveData,
  updateData,
  deleteData,
  getData,
  getAllData
};