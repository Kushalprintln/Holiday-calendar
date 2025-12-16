// IndexedDB utility for persistent storage
const DB_NAME = "CustomCalendarDB"
const DB_VERSION = 1
const STORE_NAMES = {
  SETTINGS: "settings",
  HOLIDAYS: "holidays",
  SAVED_CALENDARS: "savedCalendars",
}

let dbInstance: IDBDatabase | null = null

export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORE_NAMES.SETTINGS)) {
        db.createObjectStore(STORE_NAMES.SETTINGS, { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains(STORE_NAMES.HOLIDAYS)) {
        const holidayStore = db.createObjectStore(STORE_NAMES.HOLIDAYS, { keyPath: "id" })
        holidayStore.createIndex("date", "date", { unique: false })
      }

      if (!db.objectStoreNames.contains(STORE_NAMES.SAVED_CALENDARS)) {
        db.createObjectStore(STORE_NAMES.SAVED_CALENDARS, { keyPath: "id" })
      }
    }
  })
}

export async function saveData<T>(storeName: string, data: T): Promise<void> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.put(data)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getData<T>(storeName: string, key: string): Promise<T | undefined> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.get(key)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllData<T>(storeName: string): Promise<T[]> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteData(storeName: string, key: string): Promise<void> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.delete(key)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export { STORE_NAMES }
