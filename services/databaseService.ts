
import { Resource, Feedback, StaffAccount } from '../types';
import { INITIAL_RESOURCES } from '../constants';

/**
 * CORE DEVS GLOBAL SYNC ENGINE (Cluster0 Proxy)
 * -------------------------------------------
 * This service acts as the bridge for your hawk:core database.
 * It provides global persistence for:
 * 1. Vault Resources (API Keys, Download URLs, Codes)
 * 2. Community Feedback
 * 3. Staff Personnel Records
 */

const GLOBAL_BIN_ID = '07d57c28a5096ca05537'; 
const API_URL = `https://api.npoint.io/${GLOBAL_BIN_ID}`;

interface GlobalData {
  cluster_data: {
    resources: Resource[];
    staff: StaffAccount[];
    feedbacks: Feedback[];
  };
  metadata: {
    lastUpdated: string;
    cluster_id: string;
  };
}

const DEFAULT_DATA: GlobalData = {
  cluster_data: {
    resources: INITIAL_RESOURCES,
    staff: [],
    feedbacks: []
  },
  metadata: {
    lastUpdated: new Date().toISOString(),
    cluster_id: "cluster0.d0bkcdd"
  }
};

async function syncCluster(data?: GlobalData): Promise<GlobalData> {
  try {
    if (data) {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return data;
    } else {
      const response = await fetch(`${API_URL}?t=${Date.now()}`, { cache: 'no-store' });
      if (response.status === 404) {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_DATA)
        });
        return DEFAULT_DATA;
      }
      const result = await response.json();
      return result.cluster_data ? result : DEFAULT_DATA;
    }
  } catch (error) {
    console.error('Cluster Sync Error:', error);
    return DEFAULT_DATA;
  }
}

export const databaseService = {
  // Vault Management
  async getResources(): Promise<Resource[]> {
    const data = await syncCluster();
    return data.cluster_data.resources || [];
  },
  async addResource(resource: Resource): Promise<void> {
    const data = await syncCluster();
    data.cluster_data.resources = [resource, ...data.cluster_data.resources];
    await syncCluster(data);
  },
  async updateResource(resource: Resource): Promise<void> {
    const data = await syncCluster();
    data.cluster_data.resources = data.cluster_data.resources.map(r => r.id === resource.id ? resource : r);
    await syncCluster(data);
  },
  async deleteResource(id: string): Promise<void> {
    const data = await syncCluster();
    data.cluster_data.resources = data.cluster_data.resources.filter(r => r.id !== id);
    await syncCluster(data);
  },

  // Feedback Management
  async getFeedbacks(): Promise<Feedback[]> {
    const data = await syncCluster();
    return data.cluster_data.feedbacks || [];
  },
  async addFeedback(feedback: Feedback): Promise<void> {
    const data = await syncCluster();
    data.cluster_data.feedbacks = [feedback, ...data.cluster_data.feedbacks];
    await syncCluster(data);
  },
  async deleteFeedback(id: string): Promise<void> {
    const data = await syncCluster();
    data.cluster_data.feedbacks = data.cluster_data.feedbacks.filter(f => f.id !== id);
    await syncCluster(data);
  },
  async clearAllFeedback(): Promise<void> {
    const data = await syncCluster();
    data.cluster_data.feedbacks = [];
    await syncCluster(data);
  },

  // Staff Management
  async getStaffAccounts(): Promise<StaffAccount[]> {
    const data = await syncCluster();
    return data.cluster_data.staff || [];
  },
  async addStaffAccount(account: StaffAccount): Promise<void> {
    const data = await syncCluster();
    data.cluster_data.staff = [...data.cluster_data.staff, account];
    await syncCluster(data);
  },
  async updateStaffAccount(account: StaffAccount): Promise<void> {
    const data = await syncCluster();
    data.cluster_data.staff = data.cluster_data.staff.map(s => s.id === account.id ? account : s);
    await syncCluster(data);
  },
  async deleteStaffAccount(id: string): Promise<void> {
    const data = await syncCluster();
    data.cluster_data.staff = data.cluster_data.staff.filter(s => s.id !== id);
    await syncCluster(data);
  }
};
