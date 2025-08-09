import React from 'react';
import { 
  Home,
  Megaphone, 
  MessageSquare, 
  MessageCircle, 
  Settings,
  User,
  LogOut,
  Shield
} from 'lucide-react';
import { CategoryType } from '../types';
import { useWeb3 } from '../hooks/useWeb3';

interface SidebarProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  announcementCount: number;
  topicsCount: number;
  chatCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onCategoryChange,
  announcementCount,
  topicsCount,
  chatCount
}) => {
  const { isConnected, account, disconnectWallet } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const menuItems = [
    {
      id: 'home' as CategoryType,
      icon: Home,
      label: 'Home',
      count: 0,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'announcement' as CategoryType,
      icon: Megaphone,
      label: 'Announcements',
      count: announcementCount,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'topics' as CategoryType,
      icon: MessageSquare,
      label: 'Topics',
      count: topicsCount,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'chat' as CategoryType,
      icon: MessageCircle,
      label: 'Chat',
      count: chatCount,
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="w-20 lg:w-64 glass rounded-2xl p-4 h-[calc(100vh-2rem)] flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8 px-2">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-white font-bold text-lg">Web3 Board</h1>
          <p className="text-white/60 text-xs">Decentralized</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onCategoryChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'glass-button bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isActive 
                  ? `bg-gradient-to-r ${item.color}` 
                  : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="hidden lg:flex flex-1 items-center justify-between">
                <span className="font-medium">{item.label}</span>
                {item.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/10 text-white/70'
                  }`}>
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Settings Button */}
        <button
          onClick={() => onCategoryChange('settings')}
          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
            activeCategory === 'settings'
              ? 'glass-button bg-white/20 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            activeCategory === 'settings'
              ? 'bg-gradient-to-r from-gray-500 to-gray-600' 
              : 'bg-white/10 group-hover:bg-white/20'
          }`}>
            <Settings className="w-5 h-5" />
          </div>
          <div className="hidden lg:flex flex-1 items-center justify-between">
            <span className="font-medium">Settings</span>
          </div>
        </button>
      </nav>

      {/* User Section */}
      {isConnected && account && (
        <div className="border-t border-white/20 pt-4 mt-4">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/5">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden lg:block flex-1">
              <p className="text-white font-medium text-sm">{formatAddress(account)}</p>
              <p className="text-green-300 text-xs">Connected</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2 mt-3">
            <button 
              onClick={disconnectWallet}
              className="flex-1 glass-button rounded-lg px-3 py-2 text-white/70 hover:text-red-300 transition-colors flex items-center justify-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile User Actions */}
      {isConnected && (
        <div className="lg:hidden flex flex-col space-y-2 border-t border-white/20 pt-4 mt-4">
          <button 
            onClick={disconnectWallet}
            className="glass-button rounded-lg p-2 text-white/70 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
