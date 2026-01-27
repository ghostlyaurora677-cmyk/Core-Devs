
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

export interface User {
  username: string;
  avatar: string;
  isAdmin: boolean;
}
