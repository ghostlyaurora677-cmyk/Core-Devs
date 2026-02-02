
import { Resource } from '../types';
import { INITIAL_RESOURCES } from '../constants';

/**
 * CORE DEVS MONGODB CONFIGURATION
 */
const MONGODB_CONFIG = {
  ENDPOINT: 'https://data.mongodb-api.com/app/data-xxxx/endpoint/data/v1', 
  API_KEY: 'YOUR_GENERATED_API_KEY', 
  CLUSTER: 'coredevs',
  DATABASE: 'coredevs',
  COLLECTION: 'resources',
  DATA_SOURCE: 'coredevs'
};

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'api-key': MONGODB_CONFIG.API_KEY,
};

const IS_CONFIGURED = MONGODB_CONFIG.API_KEY !== 'YOUR_GENERATED_API_KEY';
const LOCAL_STORAGE_KEY = 'coredevs_vault_v2';

export const databaseService = {
  async getResources(): Promise<Resource[]> {
    const getLocal = () => {
      try {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!localData) {
          // Initialize local storage with initial data if it's the first time
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
          return INITIAL_RESOURCES;
        }
        return JSON.parse(localData);
      } catch {
        return INITIAL_RESOURCES;
      }
    };

    if (!IS_CONFIGURED) {
      return getLocal();
    }

    // Set a fetch timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(`${MONGODB_CONFIG.ENDPOINT}/action/find`, {
        method: 'POST',
        headers: headers,
        signal: controller.signal,
        body: JSON.stringify({
          collection: MONGODB_CONFIG.COLLECTION,
          database: MONGODB_CONFIG.DATABASE,
          dataSource: MONGODB_CONFIG.DATA_SOURCE,
          filter: {},
          sort: { createdAt: -1 }
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      
      if (!result.documents || result.documents.length === 0) {
        return getLocal();
      }

      return result.documents.map((doc: any) => ({
        ...doc,
        id: doc.id || doc._id.toString()
      }));
    } catch (error) {
      console.warn("MongoDB Fetch Error or Timeout, falling back to local:", error);
      clearTimeout(timeoutId);
      return getLocal();
    }
  },

  async addResource(resource: Resource): Promise<void> {
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const localResources = localData ? JSON.parse(localData) : INITIAL_RESOURCES;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([resource, ...localResources]));
    } catch (e) {
      console.error("Local Storage Error:", e);
    }

    if (!IS_CONFIGURED) return;

    try {
      await fetch(`${MONGODB_CONFIG.ENDPOINT}/action/insertOne`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          collection: MONGODB_CONFIG.COLLECTION,
          database: MONGODB_CONFIG.DATABASE,
          dataSource: MONGODB_CONFIG.DATA_SOURCE,
          document: resource
        })
      });
    } catch (error) {
      console.error("MongoDB Add Error:", error);
    }
  },

  async updateResource(resource: Resource): Promise<void> {
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        const resources: Resource[] = JSON.parse(localData);
        const updated = resources.map(r => r.id === resource.id ? resource : r);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (e) {}

    if (!IS_CONFIGURED) return;

    try {
      await fetch(`${MONGODB_CONFIG.ENDPOINT}/action/updateOne`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          collection: MONGODB_CONFIG.COLLECTION,
          database: MONGODB_CONFIG.DATABASE,
          dataSource: MONGODB_CONFIG.DATA_SOURCE,
          filter: { id: resource.id },
          update: { $set: resource }
        })
      });
    } catch (error) {
      console.error("MongoDB Update Error:", error);
    }
  },

  async deleteResource(id: string): Promise<void> {
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        const resources: Resource[] = JSON.parse(localData);
        const filtered = resources.filter(r => r.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      } else {
        // If local storage was never set, set it now minus the deleted item
        const filtered = INITIAL_RESOURCES.filter(r => r.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch (e) {}

    if (!IS_CONFIGURED) return;

    try {
      await fetch(`${MONGODB_CONFIG.ENDPOINT}/action/deleteOne`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          collection: MONGODB_CONFIG.COLLECTION,
          database: MONGODB_CONFIG.DATABASE,
          dataSource: MONGODB_CONFIG.DATA_SOURCE,
          filter: { id: id }
        })
      });
    } catch (error) {
      console.error("MongoDB Delete Error:", error);
    }
  },

  getStatus(): { isLive: boolean; message: string } {
    return {
      isLive: IS_CONFIGURED,
      message: IS_CONFIGURED ? `CONNECTED TO CLUSTER: ${MONGODB_CONFIG.CLUSTER}` : "OFFLINE: USING LOCAL STORAGE"
    };
  }
};
