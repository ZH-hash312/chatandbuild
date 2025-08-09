import React, { useState, useEffect } from 'react';
import { Topic, Comment, ChatMessage, CategoryType, UserSettings } from './types';
import { useWeb3 } from './hooks/useWeb3';
import Sidebar from './components/Sidebar';
import WalletConnect from './components/WalletConnect';
import MetaMaskDetector from './components/MetaMaskDetector';
import HomeView from './components/HomeView';
import AnnouncementView from './components/AnnouncementView';
import TopicsView from './components/TopicsView';
import ChatView from './components/ChatView';
import SettingsView from './components/SettingsView';
import CreateTopicModal from './components/CreateTopicModal';

// Mock data for demonstration
const mockData: Topic[] = [
  {
    id: '1',
    title: 'Platform Launch Announcement',
    content: 'Welcome to the Web3 Bulletin Board! This decentralized platform enables secure, transparent discussions with wallet-based authentication. Enjoy enhanced MetaMask detection, two-step verification, and beautiful glassmorphism design.',
    author: '0x1234567890123456789012345678901234567890',
    timestamp: Date.now() - 3600000,
    category: 'announcement',
    likes: 25,
    isPinned: true,
    priority: 'high',
    comments: [
      {
        id: '1',
        content: 'Excited to be part of this decentralized community!',
        author: '0x9876543210987654321098765432109876543210',
        timestamp: Date.now() - 1800000,
        likes: 8
      }
    ]
  },
  {
    id: '2',
    title: 'Security Update: Enhanced MetaMask Integration',
    content: 'We\'ve implemented comprehensive MetaMask detection with version identification, device-specific recognition, and two-step verification for maximum security.',
    author: '0xsecurityteam123456789012345678901234567890',
    timestamp: Date.now() - 7200000,
    category: 'announcement',
    likes: 18,
    priority: 'medium',
    comments: []
  },
  {
    id: '3',
    title: 'The Future of DeFi: What to Expect in 2024',
    content: 'Decentralized Finance has evolved rapidly. What are your predictions for DeFi in 2024? Will we see more institutional adoption, better UX, or new innovative protocols?',
    author: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    timestamp: Date.now() - 10800000,
    category: 'topics',
    likes: 32,
    comments: [
      {
        id: '2',
        content: 'I think cross-chain protocols will dominate, especially with better MetaMask integration.',
        author: '0x1111111111111111111111111111111111111111',
        timestamp: Date.now() - 5400000,
        likes: 12
      }
    ]
  },
  {
    id: '4',
    title: 'NFT Gaming: Beyond the Hype',
    content: 'While NFT gaming has seen ups and downs, innovative projects are building sustainable gaming economies. What games are you excited about?',
    author: '0xgamer123456789012345678901234567890123456',
    timestamp: Date.now() - 14400000,
    category: 'topics',
    likes: 15,
    comments: []
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Welcome to the Web3 community chat!',
    author: 'system',
    timestamp: Date.now() - 3600000,
    type: 'system'
  },
  {
    id: '2',
    content: 'Hey everyone! Loving the new platform design 🚀',
    author: '0x1234567890123456789012345678901234567890',
    timestamp: Date.now() - 1800000,
    type: 'message'
  },
  {
    id: '3',
    content: 'The MetaMask integration is so smooth! Great work team 👏',
    author: '0x9876543210987654321098765432109876543210',
    timestamp: Date.now() - 900000,
    type: 'message'
  }
];

const defaultSettings: UserSettings = {
  theme: 'dark',
  notifications: {
    announcements: true,
    topics: true,
    chat: false,
    mentions: true
  },
  privacy: {
    showActivity: true,
    allowDirectMessages: true
  },
  display: {
    compactMode: false,
    showAvatars: true
  }
};

function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('home');
  const [topics, setTopics] = useState<Topic[]>(mockData);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings);
  const { isConnected, account, metaMaskInfo } = useWeb3();

  // Filter data by category
  const announcements = topics.filter(topic => topic.category === 'announcement');
  const discussionTopics = topics.filter(topic => topic.category === 'topics');

  const handleCreateContent = (
    title: string, 
    content: string, 
    category: CategoryType,
    priority?: 'high' | 'medium' | 'low',
    isPinned?: boolean
  ) => {
    if (!isConnected || !account) return;

    const newTopic: Topic = {
      id: Date.now().toString(),
      title,
      content,
      category: category === 'home' || category === 'settings' ? 'topics' : category,
      author: account,
      timestamp: Date.now(),
      likes: 0,
      comments: [],
      priority,
      isPinned
    };

    setTopics(prev => [newTopic, ...prev]);
  };

  const handleLikeTopic = (topicId: string) => {
    setTopics(prev =>
      prev.map(topic =>
        topic.id === topicId
          ? { ...topic, likes: topic.likes + 1 }
          : topic
      )
    );
  };

  const handleComment = (topicId: string, content: string) => {
    if (!isConnected || !account) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author: account,
      timestamp: Date.now(),
      likes: 0
    };

    setTopics(prev =>
      prev.map(topic =>
        topic.id === topicId
          ? { ...topic, comments: [...topic.comments, newComment] }
          : topic
      )
    );
  };

  const handleSendMessage = (content: string) => {
    if (!isConnected || !account) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      author: account,
      timestamp: Date.now(),
      type: 'message'
    };

    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleSettingsChange = (settings: UserSettings) => {
    setUserSettings(settings);
    // Here you could save to localStorage or send to backend
    localStorage.setItem('web3-board-settings', JSON.stringify(settings));
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('web3-board-settings');
    if (savedSettings) {
      try {
        setUserSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeCategory) {
      case 'home':
        return (
          <HomeView
            topics={topics}
            onCategoryChange={setActiveCategory}
            onCreateContent={handleCreateClick}
          />
        );
      case 'announcement':
        return (
          <AnnouncementView
            announcements={announcements}
            onLike={handleLikeTopic}
            onComment={handleComment}
            onCreateAnnouncement={handleCreateClick}
          />
        );
      case 'topics':
        return (
          <TopicsView
            topics={discussionTopics}
            onLike={handleLikeTopic}
            onComment={handleComment}
            onCreateTopic={handleCreateClick}
          />
        );
      case 'chat':
        return (
          <ChatView
            messages={chatMessages}
            onSendMessage={handleSendMessage}
          />
        );
      case 'settings':
        return (
          <SettingsView
            settings={userSettings}
            onSettingsChange={handleSettingsChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto flex space-x-6">
        {/* Sidebar */}
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          announcementCount={announcements.length}
          topicsCount={discussionTopics.length}
          chatCount={chatMessages.filter(m => m.type === 'message').length}
        />

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* MetaMask Detector - Only show if not connected */}
          {!isConnected && (
            <MetaMaskDetector metaMaskInfo={metaMaskInfo} />
          )}

          {/* Wallet Connection - Only show if not connected */}
          {!isConnected && (
            <WalletConnect />
          )}

          {/* Category Content */}
          {renderContent()}
        </div>

        {/* Create Content Modal */}
        <CreateTopicModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateContent}
          defaultCategory={activeCategory === 'chat' ? 'topics' : activeCategory === 'home' || activeCategory === 'settings' ? 'topics' : activeCategory}
        />
      </div>
    </div>
  );
}

export default App;
