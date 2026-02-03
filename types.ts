
export interface BotFeature {
  title: string;
  description: string;
  icon: string;
}

export interface BotInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  bannerUrl: string;
  stats: {
    servers: string;
    users: string;
    commands: string;
  };
  inviteUrl: string;
  features: BotFeature[];
  color: string;
}

export type ResourceType = 'API_KEY' | 'CODE_SNIPPET' | 'TOOL';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  content: string;
  tags: string[];
  createdAt: string;
}

export type FeedbackCategory = 'BUG' | 'SUGGESTION' | 'OTHER';

export interface Feedback {
  id: string;
  type: FeedbackCategory;
  message: string;
  timestamp: string;
  themeAtTime: string;
}

export type StaffPermission = 'VAULT_VIEW' | 'VAULT_EDIT' | 'FEEDBACK_MANAGE';

export interface StaffAccount {
  id: string;
  username: string;
  password: string;
  role: string;
  permissions: StaffPermission[];
}

export interface User {
  username: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  isMaster?: boolean;
  provider: 'staff';
  permissions: StaffPermission[];
}

export type ThemeType = 'light' | 'dark' | 'magenta' | 'lime' | 'red' | 'black';
