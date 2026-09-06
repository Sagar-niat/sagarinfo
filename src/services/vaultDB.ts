// IndexedDB Persistent Engine for SAGARINFO Vault
// Solves browser 5MB localStorage limits by providing high-capacity persistent storage for documents, files, and profile data.

const DB_NAME = 'SagarVaultDB';
const DB_VERSION = 2;
const DATA_STORE = 'vault_data';
const FILES_STORE = 'vault_files';

let dbInstance: IDBDatabase | null = null;

export const openVaultDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DATA_STORE)) {
        db.createObjectStore(DATA_STORE);
      }
      if (!db.objectStoreNames.contains(FILES_STORE)) {
        db.createObjectStore(FILES_STORE);
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };
  });
};

export const idbSet = async <T>(key: string, value: T): Promise<void> => {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DATA_STORE, 'readwrite');
      const store = tx.objectStore(DATA_STORE);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB set failed for key "${key}":`, err);
  }
};

export const idbGet = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const db = await openVaultDB();
    return new Promise((resolve) => {
      const tx = db.transaction(DATA_STORE, 'readonly');
      const store = tx.objectStore(DATA_STORE);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result !== undefined && req.result !== null) {
          resolve(req.result as T);
        } else {
          resolve(defaultValue);
        }
      };
      req.onerror = () => resolve(defaultValue);
    });
  } catch (err) {
    console.warn(`IndexedDB get failed for key "${key}":`, err);
    return defaultValue;
  }
};

export const idbSaveFile = async (fileId: string, dataUrl: string): Promise<void> => {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FILES_STORE, 'readwrite');
      const store = tx.objectStore(FILES_STORE);
      const req = store.put(dataUrl, fileId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB file save failed for "${fileId}":`, err);
  }
};

export const idbGetFile = async (fileId: string): Promise<string | null> => {
  try {
    const db = await openVaultDB();
    return new Promise((resolve) => {
      const tx = db.transaction(FILES_STORE, 'readonly');
      const store = tx.objectStore(FILES_STORE);
      const req = store.get(fileId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn(`IndexedDB file get failed for "${fileId}":`, err);
    return null;
  }
};

export const idbClearAll = async (): Promise<void> => {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([DATA_STORE, FILES_STORE], 'readwrite');
      tx.objectStore(DATA_STORE).clear();
      tx.objectStore(FILES_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to clear IndexedDB:', err);
  }
};
