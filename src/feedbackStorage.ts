export type FeedbackStatus = 'new' | 'reviewed' | 'resolved';

export type FeedbackItem = {
  id: string;
  createdAt: string;
  pagePath: string;
  comment: string;
  status: FeedbackStatus;
  elementTag: string;
  elementLabel: string;
  elementSelector: string;
  elementText: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  viewport: {
    width: number;
    height: number;
  };
};

const DB_NAME = 'aina-review-feedback';
const DB_VERSION = 1;
const STORE_NAME = 'feedback';
const API_PATH = '/api/feedback';

let dbPromise: Promise<IDBDatabase> | null = null;

function openFeedbackDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {keyPath: 'id'});
        store.createIndex('createdAt', 'createdAt');
        store.createIndex('status', 'status');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>,
) {
  return openFeedbackDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = callback(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }),
  );
}

async function requestJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    headers: {'Content-Type': 'application/json'},
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Feedback API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function getLocalFeedbackItems() {
  const items = await runTransaction<FeedbackItem[]>('readonly', (store) => store.getAll());

  return items.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function addLocalFeedbackItem(item: FeedbackItem) {
  return runTransaction<IDBValidKey>('readwrite', (store) => store.add(item));
}

async function updateLocalFeedbackStatus(id: string, status: FeedbackStatus) {
  const db = await openFeedbackDb();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const item = request.result as FeedbackItem | undefined;

      if (!item) {
        reject(new Error('Feedback item not found'));
        return;
      }

      store.put({...item, status});
    };

    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function deleteLocalFeedbackItem(id: string) {
  return runTransaction<undefined>('readwrite', (store) => store.delete(id));
}

function clearLocalFeedbackItems() {
  return runTransaction<undefined>('readwrite', (store) => store.clear());
}

export async function getFeedbackItems() {
  try {
    return await requestJson<FeedbackItem[]>(API_PATH);
  } catch {
    return getLocalFeedbackItems();
  }
}

export async function addFeedbackItem(item: FeedbackItem) {
  try {
    await requestJson<FeedbackItem>(API_PATH, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  } catch {
    await addLocalFeedbackItem(item);
  }
}

export async function updateFeedbackStatus(id: string, status: FeedbackStatus) {
  try {
    await requestJson<void>(`${API_PATH}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({status}),
    });
  } catch {
    await updateLocalFeedbackStatus(id, status);
  }
}

export async function deleteFeedbackItem(id: string) {
  try {
    await requestJson<void>(`${API_PATH}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch {
    await deleteLocalFeedbackItem(id);
  }
}

export async function clearFeedbackItems() {
  try {
    await requestJson<void>(API_PATH, {
      method: 'DELETE',
    });
  } catch {
    await clearLocalFeedbackItems();
  }
}
