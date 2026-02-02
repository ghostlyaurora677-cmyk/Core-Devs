
import { BotInfo, Resource } from './types';

export const SUPPORT_SERVER_URL = 'https://dsc.gg/coredevs';

export const BOTS: BotInfo[] = [
  {
    id: 'fynex',
    name: 'Fynex',
    tagline: 'High-Fidelity Music',
    description: 'The ultimate music experience for Discord. Fynex provides crystal clear 320kbps audio, zero buffering, and support for all major streaming platforms. Built for audiophiles and large communities.',
    imageUrl: 'fynex.png',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop',
    color: '#5865F2',
    stats: {
      servers: '93',
      users: '75k+',
      commands: '40+'
    },
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1409862504405925980',
    features: [
      { title: 'Lossless Audio', description: 'Stream in 320kbps for the ultimate listening experience.', icon: 'SPEAKER' },
      { title: 'Custom Playlists', description: 'Save and load your favorite tracks instantly.', icon: 'PLAYLIST' },
      { title: 'Global Coverage', description: 'Low latency nodes located globally for lag-free playback.', icon: 'ZAP' }
    ]
  },
  {
    id: 'ryzer',
    name: 'RYZER™',
    tagline: 'Antinuke & Moderation',
    description: 'The definitive all-in-one security solution. RYZER™ features advanced Antinuke protection, intelligent Auto-moderation, and a robust utility suite to keep your server safe and organized.',
    imageUrl: 'ryzer.png',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=400&fit=crop',
    color: '#10b981',
    stats: {
      servers: '75+',
      users: '10k+',
      commands: '120+'
    },
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1383353669520461824',
    features: [
      { title: 'Advanced Antinuke', description: 'Protect your server from malicious raids and unauthorized changes.', icon: 'SHIELD' },
      { title: 'Smart Automod', description: 'AI-driven moderation that stops bad actors before they start.', icon: 'CHART' },
      { title: 'Utility Suite', description: 'Everything from logs to roles in one powerful bot.', icon: 'LINK' }
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
