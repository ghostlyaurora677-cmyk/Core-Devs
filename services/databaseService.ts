
import { Resource, Feedback, StaffAccount } from '../types';
import { INITIAL_RESOURCES } from '../constants';

const DATA_KEY = 'coredevs_vault_v7';
const FEEDBACK_KEY = 'coredevs_feedback_v2';
const STAFF_KEY = 'coredevs_staff_v1';
const INIT_KEY = 'coredevs_vault_init_v7';

export const databaseService = {
  async getResources(): Promise<Resource[]> {
    try {
      const isInitialized = localStorage.getItem(INIT_KEY);
      const localData = localStorage.getItem(DATA_KEY);

      if (isInitialized !== 'true' || localData === null) {
        localStorage.setItem(DATA_KEY, JSON.stringify(INITIAL_RESOURCES));
        localStorage.setItem(INIT_KEY, 'true');
        return INITIAL_RESOURCES;
      }
      return JSON.parse(localData);
    } catch (e) {
      return INITIAL_RESOURCES;
    }
  },

  async addResource(resource: Resource): Promise<void> {
    const current = await this.getResources();
    localStorage.setItem(DATA_KEY, JSON.stringify([resource, ...current]));
  },

  async updateResource(resource: Resource): Promise<void> {
    const current = await this.getResources();
    localStorage.setItem(DATA_KEY, JSON.stringify(current.map(r => r.id === resource.id ? resource : r)));
  },

  async deleteResource(id: string): Promise<void> {
    const current = await this.getResources();
    localStorage.setItem(DATA_KEY, JSON.stringify(current.filter(r => r.id !== id)));
  },

  async getFeedbacks(): Promise<Feedback[]> {
    try {
      const data = localStorage.getItem(FEEDBACK_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async addFeedback(feedback: Feedback): Promise<void> {
    const current = await this.getFeedbacks();
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify([feedback, ...current]));
  },

  async deleteFeedback(id: string): Promise<void> {
    const current = await this.getFeedbacks();
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(current.filter(f => f.id !== id)));
  },

  async clearAllFeedback(): Promise<void> {
    localStorage.removeItem(FEEDBACK_KEY);
  },

  // Staff Management
  async getStaffAccounts(): Promise<StaffAccount[]> {
    try {
      const data = localStorage.getItem(STAFF_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async addStaffAccount(account: StaffAccount): Promise<void> {
    const current = await this.getStaffAccounts();
    localStorage.setItem(STAFF_KEY, JSON.stringify([...current, account]));
  },

  async deleteStaffAccount(id: string): Promise<void> {
    const current = await this.getStaffAccounts();
    localStorage.setItem(STAFF_KEY, JSON.stringify(current.filter(s => s.id !== id)));
  }
};
