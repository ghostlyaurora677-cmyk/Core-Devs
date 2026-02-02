
import { Resource } from '../types';
import { INITIAL_RESOURCES } from '../constants';

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
const DATA_KEY = 'coredevs_vault_final_fix_v5';
const INIT_KEY = 'coredevs_vault_initialized_v5';

export const databaseService = {
  async getResources(): Promise<Resource[]> {
    const getLocal = () => {
      try {
        const isInitialized = localStorage.getItem(INIT_KEY);
        const localData = localStorage.getItem(DATA_KEY);

        // If never initialized, seed the defaults once
        if (isInitialized !== 'true' || localData === null) {
          localStorage.setItem(DATA_KEY, JSON.stringify(INITIAL_RESOURCES));
          localStorage.setItem(INIT_KEY, 'true');
          return INITIAL_RESOURCES;
        }

        // Return whatever is in storage (could be an empty array [])
        return JSON.parse(localData);
      } catch (e) {
        console.error("Critical Storage Error:", e);
        return INITIAL_RESOURCES;
      }
    };

    if (!IS_CONFIGURED) {
      return getLocal();
    }

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

      if (!response.ok) throw new Error('Network error');
      const result = await response.json();
      
      if (!result.documents || result.documents.length === 0) {
        return getLocal();
      }

      return result.documents.map((doc: any) => ({
        ...doc,
        id: doc.id || doc._id.toString()
      }));
    } catch (error) {
      clearTimeout(timeoutId);
      return getLocal();
    }
  },

  async addResource(resource: Resource): Promise<void> {
    try {
      const current = await this.getResources();
      const updated = [resource, ...current];
      localStorage.setItem(DATA_KEY, JSON.stringify(updated));
      localStorage.setItem(INIT_KEY, 'true');
    } catch (e) {}

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
    } catch (e) {}
  },

  async updateResource(resource: Resource): Promise<void> {
    try {
      const current = await this.getResources();
      const updated = current.map(r => r.id === resource.id ? resource : r);
      localStorage.setItem(DATA_KEY, JSON.stringify(updated));
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
    } catch (e) {}
  },

  async deleteResource(id: string): Promise<void> {
    try {
      const current = await this.getResources();
      const updated = current.filter(r => r.id !== id);
      
      // Save the updated list (even if it is [])
      localStorage.setItem(DATA_KEY, JSON.stringify(updated));
      localStorage.setItem(INIT_KEY, 'true');
      
      console.log(`Resource ${id} deleted and storage synced.`);
    } catch (e) {
      console.error("Delete persistence error:", e);
    }

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
    } catch (e) {}
  }
};
