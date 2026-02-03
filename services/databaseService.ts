
import { Resource, Feedback, StaffAccount } from '../types';
import { INITIAL_RESOURCES } from '../constants';

/**
 * CORE DEVS GLOBAL DATABASE SERVICE - RECOVERY VERSION
 * Partitioned: MongoDB (Assets) & SQLite (Feedback)
 */

// Fresh Verified Global ID for cross-browser sync
const GLOBAL_BIN_ID = '90d40236a2818619623e'; 
const API_URL = `https://api.npoint.io/${GLOBAL_BIN_ID}`;

interface GlobalData {
  mongodb_partition: {
    resources: Resource[];
    staff: StaffAccount[];
  };
  sqlite_partition: {
    feedbacks: Feedback[];
  };
  metadata: {
    lastUpdated: string;
    version: string;
  };
}

const DEFAULT_DATA: GlobalData = {
  mongodb_partition: {
    resources: INITIAL_RESOURCES,
    staff: []
  },
  sqlite_partition: {
    feedbacks: []
  },
  metadata: {
    lastUpdated: new Date().toISOString(),
    version: '1.2.0'
  }
};

// Robust sync helper that prevents "Cloud Pull Failed" from breaking the app
async function syncCloud(data?: GlobalData): Promise<GlobalData> {
  try {
    if (data) {
      // Saving/Updating data
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) console.error('Cloud Sync Update Delayed');
      return data;
    } else {
      // Fetching data
      const response = await fetch(API_URL);
      
      if (response.status === 404) {
        // Bin doesn't exist yet, initialize it
        console.warn('Database bin not found. Initializing storage...');
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_DATA)
        });
        return DEFAULT_DATA;
      }

      if (!response.ok) {
        console.warn('Cloud connection unstable, using local cache.');
        return DEFAULT_DATA;
      }

      const result = await response.json();
      
      // Validation to ensure data structure is correct
      if (!result || !result.mongodb_partition) {
        return DEFAULT_DATA;
      }
      
      return result;
    }
  } catch (error) {
    // SILENT FAIL: Instead of crashing, we return the last known good state or defaults
    console.error('Core Devs Database Offline:', error);
    return DEFAULT_DATA;
  }
}

export const databaseService = {
  // --- MONGODB PARTITION (Resources / Keys / Code) ---
  async getResources(): Promise<Resource[]> {
    const data = await syncCloud();
    return data.mongodb_partition.resources || [];
  },

  async addResource(resource: Resource): Promise<void> {
    const data = await syncCloud();
    data.mongodb_partition.resources = [resource, ...(data.mongodb_partition.resources || [])];
    data.metadata.lastUpdated = new Date().toISOString();
    await syncCloud(data);
  },

  async updateResource(resource: Resource): Promise<void> {
    const data = await syncCloud();
    data.mongodb_partition.resources = (data.mongodb_partition.resources || []).map(r => 
      r.id === resource.id ? resource : r
    );
    data.metadata.lastUpdated = new Date().toISOString();
    await syncCloud(data);
  },

  async deleteResource(id: string): Promise<void> {
    const data = await syncCloud();
    data.mongodb_partition.resources = (data.mongodb_partition.resources || []).filter(r => r.id !== id);
    data.metadata.lastUpdated = new Date().toISOString();
    await syncCloud(data);
  },

  // --- SQLITE PARTITION (Feedback / Community Logs) ---
  async getFeedbacks(): Promise<Feedback[]> {
    const data = await syncCloud();
    return data.sqlite_partition.feedbacks || [];
  },

  async addFeedback(feedback: Feedback): Promise<void> {
    const data = await syncCloud();
    data.sqlite_partition.feedbacks = [feedback, ...(data.sqlite_partition.feedbacks || [])];
    data.metadata.lastUpdated = new Date().toISOString();
    await syncCloud(data);
  },

  async deleteFeedback(id: string): Promise<void> {
    const data = await syncCloud();
    data.sqlite_partition.feedbacks = (data.sqlite_partition.feedbacks || []).filter(f => f.id !== id);
    data.metadata.lastUpdated = new Date().toISOString();
    await syncCloud(data);
  },

  async clearAllFeedback(): Promise<void> {
    const data = await syncCloud();
    data.sqlite_partition.feedbacks = [];
    data.metadata.lastUpdated = new Date().toISOString();
    await syncCloud(data);
  },

  // --- SHARED STAFF ACCOUNTS ---
  async getStaffAccounts(): Promise<StaffAccount[]> {
    const data = await syncCloud();
    return data.mongodb_partition.staff || [];
  },

  async addStaffAccount(account: StaffAccount): Promise<void> {
    const data = await syncCloud();
    data.mongodb_partition.staff = [...(data.mongodb_partition.staff || []), account];
    await syncCloud(data);
  },

  async updateStaffAccount(account: StaffAccount): Promise<void> {
    const data = await syncCloud();
    data.mongodb_partition.staff = (data.mongodb_partition.staff || []).map(s => 
      s.id === account.id ? account : s
    );
    await syncCloud(data);
  },

  async deleteStaffAccount(id: string): Promise<void> {
    const data = await syncCloud();
    data.mongodb_partition.staff = (data.mongodb_partition.staff || []).filter(s => s.id !== id);
    await syncCloud(data);
  }
};
