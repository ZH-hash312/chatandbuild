import React, { useState } from 'react';
import { 
  Wallet, 
  LogOut, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  X, 
  Smartphone, 
  Monitor, 
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

const WalletConnect: React.FC = () => {
  const { 
    account, 
    isConnecting, 
    isVerifying,
    error, 
    metaMaskInfo,
    verificationSteps,
    connectWallet, 
    disconnectWallet, 
    isConnected 
  } = useWeb3();
  
  const [showDetails, setShowDetails] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getMetaMaskIcon = () => {
    switch (metaMaskInfo.type) {
      case 'extension':
        return <Monitor className="w-5 h-5" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'website':
        return <Globe className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: 'pending' | 'completed' | 'failed') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <X className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getNetworkName = (chainId?: string) => {
    if (!chainId) return 'Unknown';
    switch (chainId) {
      case '0x1':
        return 'Ethereum Mainnet';
      case '0x5':
        return 'Goerli Testnet';
      case '0xaa36a7':
        return 'Sepolia Testnet';
      case '0x89':
        return 'Polygon Mainnet';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  if (isConnected) {
    return (
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">{formatAddress(account!)}</p>
              <p className="text-green-300 text-sm flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Verified & Connected</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="glass-button rounded-lg p-2 text-white/70 hover:text-white"
            >
              {getMetaMaskIcon()}
            </button>
            <button
              onClick={disconnectWallet}
              className="glass-button rounded-lg p-2 text-white hover:text-red-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="glass-dark rounded-lg p-4 space-y-3">
            <h4 className="text-white font-medium flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>MetaMask Details</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/60">Type</p>
                <p className="text-white capitalize">{metaMaskInfo.type}</p>
              </div>
              <div>
                <p className="text-white/60">Version</p>
                <p className="text-white">{metaMaskInfo.version}</p>
              </div>
              <div>
                <p className="text-white/60">Device</p>
                <p className="text-white capitalize">{metaMaskInfo.device}</p>
              </div>
              <div>
                <p className="text-white/60">Browser</p>
                <p className="text-white">{metaMaskInfo.browser}</p>
              </div>
              <div className="col-span-2">
                <p className="text-white/60">Network</p>
                <p className="text-white">{getNetworkName(metaMaskInfo.chainId)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-white/70">
          {metaMaskInfo.isInstalled 
            ? `MetaMask ${metaMaskInfo.type} v${metaMaskInfo.version} detected on ${metaMaskInfo.device}`
            : 'Connect your Web3 wallet to create topics and comment'
          }
        </p>
      </div>

      {/* MetaMask Detection Status */}
      {metaMaskInfo.isInstalled && (
        <div className="glass-dark rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">MetaMask Information</h4>
            {getMetaMaskIcon()}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/60">Type</p>
              <p className="text-white capitalize">{metaMaskInfo.type}</p>
            </div>
            <div>
              <p className="text-white/60">Version</p>
              <p className="text-white">{metaMaskInfo.version}</p>
            </div>
            <div>
              <p className="text-white/60">Device</p>
              <p className="text-white capitalize">{metaMaskInfo.device}</p>
            </div>
            <div>
              <p className="text-white/60">Browser</p>
              <p className="text-white">{metaMaskInfo.browser}</p>
            </div>
          </div>
        </div>
      )}

      {/* Verification Steps */}
      {(isConnecting || isVerifying || verificationSteps.length > 0) && (
        <div className="glass-dark rounded-lg p-4 mb-6">
          <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Two-Step Verification</span>
          </h4>
          <div className="space-y-3">
            {verificationSteps.map((step) => (
              <div key={step.id} className="flex items-start space-x-3">
                {getStatusIcon(step.status)}
                <div className="flex-1">
                  <p className="text-white font-medium">{step.title}</p>
                  <p className="text-white/60 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="glass-dark rounded-lg p-3 mb-6 flex items-center space-x-2 text-red-300">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Connect Button */}
      <button
        onClick={connectWallet}
        disabled={isConnecting || isVerifying || !metaMaskInfo.isInstalled}
        className="glass-button rounded-lg px-6 py-3 text-white font-medium w-full disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {isConnecting || isVerifying ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>{isVerifying ? 'Verifying...' : 'Connecting...'}</span>
          </>
        ) : metaMaskInfo.isInstalled ? (
          <>
            <Wallet className="w-5 h-5" />
            <span>Connect & Verify Wallet</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5" />
            <span>Install MetaMask</span>
          </>
        )}
      </button>

      {/* Install MetaMask Link */}
      {!metaMaskInfo.isInstalled && (
        <div className="text-center mt-4">
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 text-sm underline"
          >
            Download MetaMask →
          </a>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
