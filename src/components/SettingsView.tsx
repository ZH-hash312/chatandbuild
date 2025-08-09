import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Monitor,
  Moon,
  Sun,
  Smartphone,
  Save,
  RefreshCw
} from 'lucide-react';
import { UserSettings } from '../types';
import { useWeb3 } from '../hooks/useWeb3';

interface SettingsViewProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSettingsChange
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const { account, metaMaskInfo } = useWeb3();

  const handleSettingChange = (section: keyof UserSettings, key: string, value: any) => {
    const currentSection = localSettings[section];
    if (typeof currentSection === 'object' && currentSection !== null) {
      const newSettings = {
        ...localSettings,
        [section]: {
          ...currentSection,
          [key]: value
        }
      };
      setLocalSettings(newSettings);
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-white/70">Customize your Web3 experience</p>
          </div>
        </div>
        
        {hasChanges && (
          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="glass-button rounded-lg px-4 py-2 text-white/70 hover:text-white font-medium flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSave}
              className="glass-button rounded-lg px-4 py-2 text-white font-medium flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Account Information */}
      {account && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <User className="w-6 h-6 text-blue-400" />
            <span>Account Information</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 glass-dark rounded-lg">
              <div>
                <p className="text-white font-medium">Wallet Address</p>
                <p className="text-white/60 text-sm">{formatAddress(account)}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            {metaMaskInfo && (
              <div className="flex items-center justify-between p-4 glass-dark rounded-lg">
                <div>
                  <p className="text-white font-medium">MetaMask Version</p>
                  <p className="text-white/60 text-sm">
                    v{metaMaskInfo.version} • {metaMaskInfo.type} • {metaMaskInfo.device}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Theme Settings */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Monitor className="w-6 h-6 text-purple-400" />
          <span>Appearance</span>
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'auto', icon: Monitor, label: 'Auto' }
              ].map((theme) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.value}
                    onClick={() => handleSettingChange('theme', 'theme', theme.value)}
                    className={`glass-button rounded-lg p-4 text-center transition-all ${
                      localSettings.theme === theme.value ? 'ring-2 ring-white/30' : ''
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white mx-auto mb-2" />
                    <p className="text-white text-sm">{theme.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Compact Mode</p>
                <p className="text-white/60 text-sm">Reduce spacing and padding</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.display.compactMode}
                  onChange={(e) => handleSettingChange('display', 'compactMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Show Avatars</p>
                <p className="text-white/60 text-sm">Display user avatars in posts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.display.showAvatars}
                  onChange={(e) => handleSettingChange('display', 'showAvatars', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Bell className="w-6 h-6 text-yellow-400" />
          <span>Notifications</span>
        </h2>
        
        <div className="space-y-4">
          {[
            { key: 'announcements', label: 'Announcements', desc: 'Important platform updates' },
            { key: 'topics', label: 'New Topics', desc: 'When new discussions are created' },
            { key: 'chat', label: 'Chat Messages', desc: 'Real-time chat notifications' },
            { key: 'mentions', label: 'Mentions', desc: 'When someone mentions you' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{notification.label}</p>
                <p className="text-white/60 text-sm">{notification.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.notifications[notification.key as keyof typeof localSettings.notifications]}
                  onChange={(e) => handleSettingChange('notifications', notification.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Eye className="w-6 h-6 text-green-400" />
          <span>Privacy</span>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Show Activity Status</p>
              <p className="text-white/60 text-sm">Let others see when you're online</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.privacy.showActivity}
                onChange={(e) => handleSettingChange('privacy', 'showActivity', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Allow Direct Messages</p>
              <p className="text-white/60 text-sm">Enable private messaging from other users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.privacy.allowDirectMessages}
                onChange={(e) => handleSettingChange('privacy', 'allowDirectMessages', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Device Information */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Smartphone className="w-6 h-6 text-indigo-400" />
          <span>Device Information</span>
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
            <span className="text-white/70">Browser</span>
            <span className="text-white">{metaMaskInfo?.browser || 'Unknown'}</span>
          </div>
          <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
            <span className="text-white/70">Device Type</span>
            <span className="text-white capitalize">{metaMaskInfo?.device || 'Unknown'}</span>
          </div>
          <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
            <span className="text-white/70">Connection Type</span>
            <span className="text-white capitalize">{metaMaskInfo?.type || 'Unknown'}</span>
          </div>
          {metaMaskInfo?.chainId && (
            <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
              <span className="text-white/70">Chain ID</span>
              <span className="text-white">{metaMaskInfo.chainId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
