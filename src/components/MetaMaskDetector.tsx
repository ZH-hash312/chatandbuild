import React, { useEffect, useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Zap
} from 'lucide-react';
import { MetaMaskInfo } from '../types';

interface MetaMaskDetectorProps {
  metaMaskInfo: MetaMaskInfo;
  className?: string;
}

const MetaMaskDetector: React.FC<MetaMaskDetectorProps> = ({ metaMaskInfo, className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);

  const getIcon = () => {
    switch (metaMaskInfo.type) {
      case 'extension':
        return <Monitor className="w-6 h-6" />;
      case 'mobile':
        return <Smartphone className="w-6 h-6" />;
      case 'website':
        return <Globe className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const getStatusColor = () => {
    if (!metaMaskInfo.isInstalled) return 'text-red-400';
    if (metaMaskInfo.isConnected) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getStatusIcon = () => {
    if (!metaMaskInfo.isInstalled) return <AlertTriangle className="w-5 h-5 text-red-400" />;
    if (metaMaskInfo.isConnected) return <CheckCircle className="w-5 h-5 text-green-400" />;
    return <Info className="w-5 h-5 text-yellow-400" />;
  };

  const getStatusText = () => {
    if (!metaMaskInfo.isInstalled) return 'Not Installed';
    if (metaMaskInfo.isConnected) return 'Connected';
    return 'Detected';
  };

  const getNetworkName = (chainId?: string) => {
    if (!chainId) return 'Unknown Network';
    switch (chainId) {
      case '0x1':
        return 'Ethereum Mainnet';
      case '0x5':
        return 'Goerli Testnet';
      case '0xaa36a7':
        return 'Sepolia Testnet';
      case '0x89':
        return 'Polygon Mainnet';
      case '0xa86a':
        return 'Avalanche Mainnet';
      case '0x38':
        return 'BSC Mainnet';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`glass rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            metaMaskInfo.isInstalled 
              ? 'bg-gradient-to-r from-orange-400 to-pink-500' 
              : 'bg-gradient-to-r from-gray-400 to-gray-600'
          }`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-white font-semibold flex items-center space-x-2">
              <span>MetaMask Detection</span>
              {getStatusIcon()}
            </h3>
            <p className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/50 hover:text-white/80 transition-colors"
        >
          <Zap className="w-5 h-5" />
        </button>
      </div>

      {metaMaskInfo.isInstalled && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="glass-dark rounded-lg p-3">
            <p className="text-white/60 mb-1">Type</p>
            <p className="text-white font-medium capitalize">
              {metaMaskInfo.type} {metaMaskInfo.type === 'extension' ? 'Extension' : 
               metaMaskInfo.type === 'mobile' ? 'App' : 'Website'}
            </p>
          </div>
          
          <div className="glass-dark rounded-lg p-3">
            <p className="text-white/60 mb-1">Version</p>
            <p className="text-white font-medium">{metaMaskInfo.version}</p>
          </div>
          
          <div className="glass-dark rounded-lg p-3">
            <p className="text-white/60 mb-1">Device</p>
            <p className="text-white font-medium capitalize">
              {metaMaskInfo.device} • {metaMaskInfo.browser}
            </p>
          </div>
          
          <div className="glass-dark rounded-lg p-3">
            <p className="text-white/60 mb-1">Network</p>
            <p className="text-white font-medium">
              {getNetworkName(metaMaskInfo.chainId)}
            </p>
          </div>
        </div>
      )}

      {!metaMaskInfo.isInstalled && (
        <div className="glass-dark rounded-lg p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-white/80 mb-3">MetaMask not detected on this device</p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button rounded-lg px-4 py-2 text-white text-sm hover:scale-105 transition-transform inline-block"
          >
            Install MetaMask
          </a>
        </div>
      )}
    </div>
  );
};

export default MetaMaskDetector;
