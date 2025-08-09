import { useState, useEffect, useCallback } from 'react';
import { MetaMaskInfo, VerificationStep } from '../types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metaMaskInfo, setMetaMaskInfo] = useState<MetaMaskInfo>({
    isInstalled: false,
    type: 'unknown',
    device: 'desktop',
    isConnected: false
  });
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  // Detect device type
  const detectDevice = useCallback((): 'desktop' | 'mobile' | 'tablet' => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    
    if (isTablet) return 'tablet';
    if (isMobile) return 'mobile';
    return 'desktop';
  }, []);

  // Detect browser
  const detectBrowser = useCallback((): string => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) return 'Chrome';
    if (userAgent.includes('firefox')) return 'Firefox';
    if (userAgent.includes('safari')) return 'Safari';
    if (userAgent.includes('edge')) return 'Edge';
    if (userAgent.includes('opera')) return 'Opera';
    return 'Unknown';
  }, []);

  // Detect MetaMask type and version
  const detectMetaMaskInfo = useCallback(async (): Promise<MetaMaskInfo> => {
    const device = detectDevice();
    const browser = detectBrowser();
    
    if (!window.ethereum) {
      return {
        isInstalled: false,
        type: 'unknown',
        device,
        browser,
        isConnected: false
      };
    }

    let type: 'extension' | 'mobile' | 'website' | 'unknown' = 'unknown';
    let version = 'Unknown';

    try {
      // Check if it's MetaMask
      const isMetaMask = window.ethereum.isMetaMask;
      
      if (!isMetaMask) {
        return {
          isInstalled: false,
          type: 'unknown',
          device,
          browser,
          isConnected: false
        };
      }

      // Detect MetaMask type based on environment
      if (device === 'mobile') {
        // Mobile device - could be MetaMask mobile app or mobile browser
        if (window.ethereum._metamask?.isUnlocked !== undefined) {
          type = 'mobile';
        } else {
          type = 'website';
        }
      } else {
        // Desktop - likely extension or website
        if (window.ethereum.isMetaMask && window.ethereum._metamask) {
          type = 'extension';
        } else {
          type = 'website';
        }
      }

      // Try to get version information
      try {
        if (window.ethereum._metamask?.version) {
          version = window.ethereum._metamask.version;
        } else if (window.ethereum.version) {
          version = window.ethereum.version;
        } else {
          // Try to get version through provider info
          const provider = window.ethereum;
          if (provider.request) {
            try {
              const clientVersion = await provider.request({
                method: 'web3_clientVersion'
              });
              if (clientVersion && typeof clientVersion === 'string') {
                const versionMatch = clientVersion.match(/MetaMask\/v?(\d+\.\d+\.\d+)/i);
                if (versionMatch) {
                  version = versionMatch[1];
                }
              }
            } catch (e) {
              // Fallback version detection
              version = 'Latest';
            }
          }
        }
      } catch (e) {
        version = 'Unknown';
      }

      // Get network information
      let chainId, networkId;
      try {
        chainId = await window.ethereum.request({ method: 'eth_chainId' });
        networkId = await window.ethereum.request({ method: 'net_version' });
      } catch (e) {
        // Network info not available
      }

      // Check if already connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const isConnected = accounts && accounts.length > 0;

      return {
        isInstalled: true,
        version,
        type,
        device,
        browser,
        isConnected,
        chainId,
        networkId
      };
    } catch (error) {
      console.error('Error detecting MetaMask info:', error);
      return {
        isInstalled: true,
        version: 'Unknown',
        type: 'unknown',
        device,
        browser,
        isConnected: false
      };
    }
  }, [detectDevice, detectBrowser]);

  // Initialize verification steps
  const initializeVerificationSteps = useCallback((info: MetaMaskInfo): VerificationStep[] => {
    const steps: VerificationStep[] = [
      {
        id: 'detect',
        title: 'Detect MetaMask',
        description: `Detecting MetaMask ${info.type} v${info.version} on ${info.device}`,
        status: info.isInstalled ? 'completed' : 'failed'
      },
      {
        id: 'connect',
        title: 'Connect Wallet',
        description: 'Request account access from MetaMask',
        status: 'pending',
        action: async () => {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            return Promise.resolve();
          }
          throw new Error('No accounts found');
        }
      },
      {
        id: 'verify',
        title: 'Verify Identity',
        description: 'Sign a message to verify wallet ownership',
        status: 'pending',
        action: async () => {
          if (!account) throw new Error('No account connected');
          
          const message = `Verify wallet ownership for Web3 Bulletin Board\nTimestamp: ${Date.now()}\nAddress: ${account}`;
          
          try {
            await window.ethereum.request({
              method: 'personal_sign',
              params: [message, account],
            });
            return Promise.resolve();
          } catch (error) {
            throw new Error('Signature verification failed');
          }
        }
      },
      {
        id: 'network',
        title: 'Network Check',
        description: 'Verify network connection and chain ID',
        status: 'pending',
        action: async () => {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const networkId = await window.ethereum.request({ method: 'net_version' });
          
          setMetaMaskInfo(prev => ({
            ...prev,
            chainId,
            networkId
          }));
          
          return Promise.resolve();
        }
      }
    ];

    return steps;
  }, [account]);

  // Execute verification step
  const executeVerificationStep = useCallback(async (stepId: string) => {
    const step = verificationSteps.find(s => s.id === stepId);
    if (!step || !step.action) return;

    setVerificationSteps(prev =>
      prev.map(s =>
        s.id === stepId ? { ...s, status: 'pending' } : s
      )
    );

    try {
      await step.action();
      setVerificationSteps(prev =>
        prev.map(s =>
          s.id === stepId ? { ...s, status: 'completed' } : s
        )
      );
    } catch (error: any) {
      setVerificationSteps(prev =>
        prev.map(s =>
          s.id === stepId ? { ...s, status: 'failed' } : s
        )
      );
      throw error;
    }
  }, [verificationSteps]);

  // Two-step verification process
  const performTwoStepVerification = useCallback(async () => {
    setIsVerifying(true);
    setError(null);

    try {
      // Step 1: Connect wallet
      await executeVerificationStep('connect');
      
      // Wait a moment for account to be set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Verify identity
      await executeVerificationStep('verify');
      
      // Step 3: Network check
      await executeVerificationStep('network');
      
    } catch (error: any) {
      setError(error.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  }, [executeVerificationStep]);

  // Main connect wallet function
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to use this application');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // First, detect MetaMask info
      const info = await detectMetaMaskInfo();
      setMetaMaskInfo(info);

      // Initialize verification steps
      const steps = initializeVerificationSteps(info);
      setVerificationSteps(steps);

      // Perform two-step verification
      await performTwoStepVerification();

    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [detectMetaMaskInfo, initializeVerificationSteps, performTwoStepVerification]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setError(null);
    setVerificationSteps([]);
    setMetaMaskInfo(prev => ({
      ...prev,
      isConnected: false
    }));
  }, []);

  // Initialize MetaMask detection on component mount
  useEffect(() => {
    const initializeMetaMask = async () => {
      const info = await detectMetaMaskInfo();
      setMetaMaskInfo(info);

      if (info.isConnected && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error getting accounts:', error);
        }
      }
    };

    initializeMetaMask();
  }, [detectMetaMaskInfo]);

  // Set up event listeners
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setMetaMaskInfo(prev => ({ ...prev, isConnected: false }));
        } else {
          setAccount(accounts[0]);
          setMetaMaskInfo(prev => ({ ...prev, isConnected: true }));
        }
      };

      const handleChainChanged = (chainId: string) => {
        setMetaMaskInfo(prev => ({ ...prev, chainId }));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  return {
    account,
    isConnecting,
    isVerifying,
    error,
    metaMaskInfo,
    verificationSteps,
    connectWallet,
    disconnectWallet,
    isConnected: !!account,
  };
};
