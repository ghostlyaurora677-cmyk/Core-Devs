
import { BotInfo, Resource } from './types';

export const BOTS: BotInfo[] = [
  {
    id: 'coredevs-music',
    name: 'CoreDevs Music',
    tagline: 'High-Fidelity Audio',
    description: 'The ultimate Discord music solution. Supporting all major platforms with advanced DSP filters, zero-buffering technology, and crystal clear 320kbps audio.',
    imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop',
    color: '#5865F2',
    stats: {
      servers: '12.4k',
      users: '2.1M',
      commands: '50+'
    },
    inviteUrl: 'https://discord.com',
    features: [
      { title: 'Lossless Audio', description: 'Stream in 320kbps for the ultimate listening experience.', icon: 'SPEAKER' },
      { title: 'Custom Playlists', description: 'Save and load your favorite tracks instantly.', icon: 'PLAYLIST' },
      { title: 'Slash Commands', description: 'Modern, intuitive interface with full autocomplete support.', icon: 'ZAP' }
    ]
  },
  {
    id: 'ryzer',
    name: 'Ryzer Pro',
    tagline: 'All-in-One Powerhouse',
    description: 'The ultimate multipurpose utility. From AI-driven moderation to a deep global economy system, Ryzer replaces 10 bots with a single, fast solution.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&h=400&fit=crop',
    color: '#10b981',
    stats: {
      servers: '8.2k',
      users: '1.5M',
      commands: '150+'
    },
    inviteUrl: 'https://discord.com',
    features: [
      { title: 'AI Automod', description: 'Intelligent filtering that learns from your server context.', icon: 'SHIELD' },
      { title: 'Global Economy', description: 'Compete across servers with levels, items, and shops.', icon: 'CHART' },
      { title: 'Social Integration', description: 'Connect Twitter, Twitch, and YouTube alerts effortlessly.', icon: 'LINK' }
    ]
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'GPT-4o Developer Key',
    description: 'Official shared access token for rapid prototyping. Limited to 50 requests per minute.',
    type: 'API_KEY',
    content: 'sk-proj-coredevs-vault-v2-4992-XXXX-8822',
    tags: ['AI', 'OpenAI', 'Premium'],
    createdAt: '2024-06-01'
  },
  {
    id: 'r2',
    title: 'Node.js Discord.js Template',
    description: 'Production-ready handler with sharding support and command autoloader.',
    type: 'CODE_SNIPPET',
    content: 'const { Client, Collection } = require("discord.js");\nconst client = new Client({ intents: 32767 });\n\n// CoreDevs Advanced Loader\nclient.commands = new Collection();\nrequire("./handler")(client);\n\nclient.login(process.env.TOKEN);',
    tags: ['NodeJS', 'DiscordJS', 'Boilerplate'],
    createdAt: '2024-06-05'
  },
  {
    id: 'r3',
    title: 'Gemini Pro Access',
    description: 'Global developer key for Google Gemini Pro 1.5 Flash models.',
    type: 'API_KEY',
    content: 'AIzaSyA-coredevs-vault-flash-9911',
    tags: ['Google', 'Gemini', 'AI'],
    createdAt: '2024-06-10'
  }
];
