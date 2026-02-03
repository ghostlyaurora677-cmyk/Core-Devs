
import { Resource, Feedback, StaffAccount } from '../types';
import { INITIAL_RESOURCES } from '../constants';

/**
 * CORE DEVS GLOBAL DATABASE SERVICE - STABLE V2
 * Optimized for cross-continent synchronization and real-time updates.
 */

// Fresh Verified Global ID for cross-browser sync
const GLOBAL_BIN_ID = '07d57c28a5096ca05537'; 
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
    version: '2.0.0'
  }
};

/**
 * syncCloud handles both fetching (GET) and saving (POST).
 * Added cache: 'no-store' and timestamp query to force fresh data from cloud.
 */
async function syncCloud(data?: GlobalData): Promise<GlobalData> {
  try {
    const timestamp = new Date().getTime();
    if (data) {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Update Failed');
      return data;
    } else {
      // Force fetch fresh data bypassing browser cache
      const response = await fetch(`${API_URL}?t=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      
      if (response.status === 404) {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_DATA)
        });
        return DEFAULT_DATA;
      }

      if (!response.ok) return DEFAULT_DATA;
      const result = await response.json();
      return (result && result.mongodb_partition) ? result : DEFAULT_DATA;
    }
  } catch (error) {
    console.error('Global Sync Interrupted:', error);
    return DEFAULT_DATA;
  }
}

export const databaseService = {
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
    await syncCloud(data);
  },

  async clearAllFeedback(): Promise<void> {
    const data = await syncCloud();
    data.sqlite_partition.feedbacks = [];
    await syncCloud(data);
  },

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
