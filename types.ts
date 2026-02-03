
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

export interface User {
  username: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  provider: 'discord' | 'google' | 'email';
}

export type ThemeType = 'light' | 'dark' | 'magenta' | 'lime' | 'red' | 'black';
