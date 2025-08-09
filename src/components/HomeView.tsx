import React, { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  Star, 
  Clock, 
  Users, 
  MessageSquare, 
  Megaphone,
  MessageCircle,
  ArrowRight,
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Topic, ContentSuggestion, CategoryType } from '../types';
import { useWeb3 } from '../hooks/useWeb3';

interface HomeViewProps {
  topics: Topic[];
  onCategoryChange: (category: CategoryType) => void;
  onCreateContent: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  topics,
  onCategoryChange,
  onCreateContent
}) => {
  const { isConnected, account } = useWeb3();

  // Generate content suggestions based on existing data
  const generateSuggestions = (): ContentSuggestion[] => {
    const suggestions: ContentSuggestion[] = [];

    // Trending topics (most liked in last 24h)
    const trending = topics
      .filter(t => t.likes > 10)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3)
      .map(topic => ({
        id: `trending-${topic.id}`,
        type: 'trending' as const,
        title: topic.title,
        description: `${topic.likes} likes • ${topic.comments.length} comments`,
        category: topic.category,
        engagement: topic.likes + topic.comments.length,
        timestamp: topic.timestamp,
        author: topic.author
      }));

    suggestions.push(...trending);

    // Recent announcements
    const recentAnnouncements = topics
      .filter(t => t.category === 'announcement')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 2)
      .map(topic => ({
        id: `recent-${topic.id}`,
        type: 'recent' as const,
        title: topic.title,
        description: 'Recent announcement',
        category: topic.category,
        engagement: topic.likes,
        timestamp: topic.timestamp,
        author: topic.author
      }));

    suggestions.push(...recentAnnouncements);

    // Popular discussions
    const popular = topics
      .filter(t => t.category === 'topics' && t.comments.length > 0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 2)
      .map(topic => ({
        id: `popular-${topic.id}`,
        type: 'popular' as const,
        title: topic.title,
        description: `${topic.comments.length} replies • Active discussion`,
        category: topic.category,
        engagement: topic.comments.length,
        timestamp: topic.timestamp,
        author: topic.author
      }));

    suggestions.push(...popular);

    return suggestions;
  };

  const suggestions = generateSuggestions();

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'popular':
        return <Star className="w-4 h-4" />;
      case 'recent':
        return <Clock className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'trending':
        return 'from-orange-500 to-red-500';
      case 'popular':
        return 'from-yellow-500 to-orange-500';
      case 'recent':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case 'announcement':
        return <Megaphone className="w-4 h-4" />;
      case 'topics':
        return <MessageSquare className="w-4 h-4" />;
      case 'chat':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: CategoryType) => {
    switch (category) {
      case 'announcement':
        return 'from-red-500 to-pink-500';
      case 'topics':
        return 'from-blue-500 to-purple-500';
      case 'chat':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Calculate stats
  const stats = {
    totalTopics: topics.length,
    totalLikes: topics.reduce((sum, t) => sum + t.likes, 0),
    totalComments: topics.reduce((sum, t) => sum + t.comments.length, 0),
    announcements: topics.filter(t => t.category === 'announcement').length,
    discussions: topics.filter(t => t.category === 'topics').length
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Home Dashboard</h1>
            <p className="text-white/70">Your personalized Web3 community overview</p>
          </div>
        </div>
        {isConnected && (
          <button
            onClick={onCreateContent}
            className="glass-button rounded-lg px-4 py-2 text-white font-medium flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Create Content</span>
          </button>
        )}
      </div>

      {/* Welcome Section */}
      {isConnected && account && (
        <div className="glass rounded-2xl p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Welcome back!</h2>
              <p className="text-white/70">Connected as {formatAddress(account)}</p>
              <p className="text-white/60 text-sm mt-1">Ready to engage with the community?</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Topics</p>
              <p className="text-white font-bold text-lg">{stats.totalTopics}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Announcements</p>
              <p className="text-white font-bold text-lg">{stats.announcements}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Discussions</p>
              <p className="text-white font-bold text-lg">{stats.discussions}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Likes</p>
              <p className="text-white font-bold text-lg">{stats.totalLikes}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Comments</p>
              <p className="text-white font-bold text-lg">{stats.totalComments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Suggestions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-orange-400" />
            <span>Suggested Content</span>
          </h2>
        </div>

        {suggestions.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No suggestions yet</h3>
            <p className="text-white/70 mb-6">
              Start engaging with content to get personalized suggestions!
            </p>
            {isConnected && (
              <button
                onClick={onCreateContent}
                className="glass-button rounded-lg px-6 py-3 text-white font-medium"
              >
                Create Your First Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="glass rounded-xl p-4 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => onCategoryChange(suggestion.category)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getSuggestionColor(suggestion.type)} flex items-center justify-center`}>
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <span className="text-white/60 text-sm capitalize font-medium">
                      {suggestion.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${getCategoryColor(suggestion.category)} flex items-center justify-center`}>
                      {getCategoryIcon(suggestion.category)}
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                  </div>
                </div>

                <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-white/90">
                  {suggestion.title}
                </h3>
                <p className="text-white/60 text-sm mb-3">{suggestion.description}</p>

                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{formatTime(suggestion.timestamp)}</span>
                  {suggestion.author && (
                    <span>by {formatAddress(suggestion.author)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-blue-400" />
          <span>Quick Actions</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onCategoryChange('announcement')}
            className="glass-button rounded-lg p-4 text-left hover:scale-105 transition-transform"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium mb-1">View Announcements</h3>
            <p className="text-white/60 text-sm">Check latest updates</p>
          </button>

          <button
            onClick={() => onCategoryChange('topics')}
            className="glass-button rounded-lg p-4 text-left hover:scale-105 transition-transform"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium mb-1">Browse Topics</h3>
            <p className="text-white/60 text-sm">Join discussions</p>
          </button>

          <button
            onClick={() => onCategoryChange('chat')}
            className="glass-button rounded-lg p-4 text-left hover:scale-105 transition-transform"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium mb-1">Join Chat</h3>
            <p className="text-white/60 text-sm">Real-time conversations</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
