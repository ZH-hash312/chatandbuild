import React from 'react';
import { MessageSquare, Plus, Search, Filter } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

interface HeaderProps {
  onCreateTopic: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
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

const Header: React.FC<HeaderProps> = ({
  onCreateTopic,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}) => {
  const { isConnected } = useWeb3();

  return (
    <div className="glass rounded-2xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Web3 Bulletin Board</h1>
            <p className="text-white/70">Decentralized discussions for everyone</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search topics..."
              className="glass-input rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-full sm:w-64"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="glass-input rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none w-full sm:w-48"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-gray-800 text-white">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Create Topic Button */}
          {isConnected && (
            <button
              onClick={onCreateTopic}
              className="glass-button rounded-lg px-6 py-3 text-white font-medium flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              <span>Create Topic</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
