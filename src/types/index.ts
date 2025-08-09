export interface Topic {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: number;
  comments: Comment[];
  likes: number;
  category: 'announcement' | 'topics' | 'chat';
  isPinned?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  likes: number;
}

export interface User {
  address: string;
  displayName?: string;
  avatar?: string;
}

export interface MetaMaskInfo {
  isInstalled: boolean;
  version?: string;
  type: 'extension' | 'mobile' | 'website' | 'unknown';
  device: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  isConnected: boolean;
  networkId?: string;
  chainId?: string;
}

export interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  action?: () => Promise<void>;
}

export interface ChatMessage {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  type: 'message' | 'system';
}

export interface ContentSuggestion {
  id: string;
  type: 'trending' | 'recommended' | 'recent' | 'popular';
  title: string;
  description: string;
  category: CategoryType;
  engagement: number;
  timestamp: number;
  author?: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'auto';
  notifications: {
    announcements: boolean;
    topics: boolean;
    chat: boolean;
    mentions: boolean;
  };
  privacy: {
    showActivity: boolean;
    allowDirectMessages: boolean;
  };
  display: {
    compactMode: boolean;
    showAvatars: boolean;
  };
}

export type CategoryType = 'home' | 'announcement' | 'topics' | 'chat' | 'settings';
