
import { BotInfo, Resource } from './types';

export const SUPPORT_SERVER_URL = 'https://dsc.gg/coredevs';

export const BOTS: BotInfo[] = [
  {
    id: 'fynex',
    name: 'Fynex',
    tagline: 'Premium Music Experience',
    description: 'Elite music performance for Discord. Crystal clear audio, zero lag, and support for all major sources. Managed by Core Devs cluster nodes.',
    imageUrl: 'https://cdn.discordapp.com/avatars/1409862504405925980/a_68d90708f75f91e9f1a7d6571583d73f.gif?size=1024',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop',
    color: '#5865F2',
    stats: {
      servers: '100+',
      users: '80k+',
      commands: '50+'
    },
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1409862504405925980&permissions=8&scope=bot%20applications.commands',
    features: [
      { title: 'High-Def Audio', description: 'Lossless streaming at 320kbps for premium listening.', icon: 'AUDIO' },
      { title: 'Smart Playlists', description: 'Save your vibes with lightning-fast database storage.', icon: 'PLAYLIST' },
      { title: 'Global Nodes', description: 'Minimal latency with global deployment across 12 regions.', icon: 'ZAP' }
    ]
  },
  {
    id: 'ryzer',
    name: 'RYZER™',
    tagline: 'Security & Antinuke',
    description: 'The definitive security wall for Discord servers. Protect your community from raids, rogue staff, and malicious entities with Core Devs Antinuke technology.',
    imageUrl: 'https://cdn.discordapp.com/avatars/1383353669520461824/5b71948834f3b1853874972d8e967a91.png?size=1024',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=400&fit=crop',
    color: '#10b981',
    stats: {
      servers: '80+',
      users: '15k+',
      commands: '130+'
    },
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1383353669520461824&permissions=8&scope=bot%20applications.commands',
    features: [
      { title: 'Elite Antinuke', description: 'Real-time protection against mass-kicking and channel nuking.', icon: 'SHIELD' },
      { title: 'Auto-Moderation', description: 'Intelligent filters that stop bad actors before they start.', icon: 'LOCK' },
      { title: 'Audit Logs', description: 'Comprehensive logging synced directly to our secure database.', icon: 'LINK' }
    ]
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'Cluster Core Key',
    description: 'A shared asset for community developers to access the testing framework.',
    type: 'API_KEY',
    content: 'sk-proj-coredevs-vault-free-001-XXXX',
    tags: ['Core', 'Framework', 'Free'],
    createdAt: '2024-06-01'
  }
];
