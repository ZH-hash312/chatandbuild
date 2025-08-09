import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Filter } from 'lucide-react';
import { Topic } from '../types';
import { useWeb3 } from '../hooks/useWeb3';
import TopicCard from './TopicCard';

interface TopicsViewProps {
  topics: Topic[];
  onLike: (topicId: string) => void;
  onComment: (topicId: string, content: string) => void;
  onCreateTopic: () => void;
}

const categories = [
  'All',
  'General Discussion',
  'Technology',
  'DeFi',
  'NFTs',
  'Gaming',
  'Art & Culture',
  'News',
  'Help & Support'
];

const TopicsView: React.FC<TopicsViewProps> = ({
  topics,
  onLike,
  onComment,
  onCreateTopic
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { isConnected } = useWeb3();

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Discussion Topics</h1>
            <p className="text-white/70">Share ideas and engage in conversations</p>
          </div>
        </div>
        {isConnected && (
          <button
            onClick={onCreateTopic}
            className="glass-button rounded-lg px-4 py-2 text-white font-medium flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            <span>New Topic</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics..."
              className="glass-input rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass-input rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none w-full sm:w-48"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-gray-800 text-white">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-6">
        {filteredTopics.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No topics found</h3>
            <p className="text-white/70 mb-6">
              {searchTerm || selectedCategory !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'Be the first to start a conversation!'}
            </p>
            {isConnected && (
              <button
                onClick={onCreateTopic}
                className="glass-button rounded-lg px-6 py-3 text-white font-medium"
              >
                Create First Topic
              </button>
            )}
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onLike={onLike}
              onComment={onComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TopicsView;
