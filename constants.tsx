
import { BotInfo, Resource } from './types';

export const BOTS: BotInfo[] = [
  {
    id: 'fynex',
    name: 'Fynex Music',
    tagline: 'Crystal Clear Audio Experience',
    description: 'The premier music solution for Discord. Support for Spotify, SoundCloud, and YouTube with zero-lag playback and advanced filters.',
    imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop',
    color: '#5865F2',
    stats: {
      servers: '1.5k+',
      users: '800k+',
      commands: '40+'
    },
    inviteUrl: '#',
    features: [
      { title: 'Multi-Source', description: 'Play music from Spotify, Apple Music, and more.', icon: '🎵' },
      { title: 'Audio Filters', description: 'Bassboost, Nightcore, and 8D audio effects.', icon: '🎛️' },
      { title: '24/7 Mode', description: 'Keep the party going even when everyone leaves.', icon: '🌙' }
    ]
  },
  {
    id: 'ryzer',
    name: 'Ryzer',
    tagline: 'Your Server\'s Best Friend',
    description: 'A powerful multipurpose bot designed to handle everything from advanced moderation and economy to leveling and games.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&h=400&fit=crop',
    color: '#10b981',
    stats: {
      servers: '2.1k+',
      users: '1.2M+',
      commands: '120+'
    },
    inviteUrl: '#',
    features: [
      { title: 'Auto-Mod', description: 'AI-driven moderation to keep your server safe.', icon: '🛡️' },
      { title: 'Economy', description: 'Global currency, shops, and daily rewards.', icon: '💰' },
      { title: 'Giveaways', description: 'Host and manage giveaways effortlessly.', icon: '🎉' }
    ]
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'GPT-4 Shared Key',
    description: 'A shared developer token for GPT-4 API access. Please use responsibly.',
    type: 'API_KEY',
    content: 'sk-proj-coredevs-shared-v1-xxxxxxxxxxxxxxxxxxxx',
    tags: ['AI', 'GPT4', 'Free'],
    createdAt: '2024-05-20'
  },
  {
    id: 'r2',
    title: 'Advanced Discord Handler v14',
    description: 'Boilerplate for building multi-command bots with event management.',
    type: 'CODE_SNIPPET',
    content: '// CoreDevs Pro Handler\nconst { Client } = require("discord.js");\nconst client = new Client({ intents: 32767 });\n\nmodule.exports = async (dir) => {\n  // Logic for loading commands recursively\n  console.log("CoreDevs: All systems operational.");\n};',
    tags: ['NodeJS', 'Discord.js', 'Source'],
    createdAt: '2024-05-18'
  },
  {
    id: 'r3',
    title: 'Gemini Pro API Token',
    description: 'Global access token for Google Gemini Pro 1.5 flash-image models.',
    type: 'API_KEY',
    content: 'AIzaSyA-coredevs-free-gemini-8899',
    tags: ['Google', 'Gemini', 'API'],
    createdAt: '2024-05-21'
  }
];
