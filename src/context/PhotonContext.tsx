import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import photonApi, { PhotonScoreData, CryptoProfileData, ScoreHistoryEntry } from '../services/photonApi';

interface PhotonContextType {
  // State
  walletAddress: string | null;
  score: PhotonScoreData | null;
  profile: CryptoProfileData | null;
  history: ScoreHistoryEntry[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Actions
  setWallet: (address: string) => Promise<void>;
  clearWallet: () => Promise<void>;
  refreshScore: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshAll: () => Promise<void>;
  loadCachedData: () => Promise<void>;
}

const PhotonContext = createContext<PhotonContextType | undefined>(undefined);

export function PhotonProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [score, setScore] = useState<PhotonScoreData | null>(null);
  const [profile, setProfile] = useState<CryptoProfileData | null>(null);
  const [history, setHistory] = useState<ScoreHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cached data on mount
  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [savedWallet, cachedScore, cachedProfile, savedHistory] = await Promise.all([
        photonApi.getWalletAddress(),
        photonApi.getCachedScore(),
        photonApi.getCachedProfile(),
        photonApi.getScoreHistory(),
      ]);

      setWalletAddress(savedWallet);
      setScore(cachedScore);
      setProfile(cachedProfile);
      setHistory(savedHistory);
    } catch (err: any) {
      console.error('Error loading cached data:', err);
      setError('Failed to load cached data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setWallet = useCallback(async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Save the wallet address
      await photonApi.saveWalletAddress(address);
      setWalletAddress(address);

      // Fetch fresh data
      const [newScore, newProfile] = await Promise.all([
        photonApi.fetchScore(address),
        photonApi.fetchCryptoProfile(address),
      ]);

      setScore(newScore);
      setProfile(newProfile);

      // Reload history
      const updatedHistory = await photonApi.getScoreHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      console.error('Error setting wallet:', err);
      setError(err.message || 'Failed to fetch wallet data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearWallet = useCallback(async () => {
    try {
      await photonApi.clearAllData();
      setWalletAddress(null);
      setScore(null);
      setProfile(null);
      setHistory([]);
      setError(null);
    } catch (err: any) {
      console.error('Error clearing wallet:', err);
    }
  }, []);

  const refreshScore = useCallback(async () => {
    if (!walletAddress) {
      setError('No wallet address set');
      return;
    }

    try {
      setIsRefreshing(true);
      setError(null);

      const newScore = await photonApi.fetchScore(walletAddress);
      setScore(newScore);

      const updatedHistory = await photonApi.getScoreHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      console.error('Error refreshing score:', err);
      setError(err.message || 'Failed to refresh score');
    } finally {
      setIsRefreshing(false);
    }
  }, [walletAddress]);

  const refreshProfile = useCallback(async () => {
    if (!walletAddress) {
      setError('No wallet address set');
      return;
    }

    try {
      setIsRefreshing(true);
      setError(null);

      const newProfile = await photonApi.fetchCryptoProfile(walletAddress);
      setProfile(newProfile);
    } catch (err: any) {
      console.error('Error refreshing profile:', err);
      setError(err.message || 'Failed to refresh profile');
    } finally {
      setIsRefreshing(false);
    }
  }, [walletAddress]);

  const refreshAll = useCallback(async () => {
    if (!walletAddress) {
      setError('No wallet address set');
      return;
    }

    try {
      setIsRefreshing(true);
      setError(null);

      const [newScore, newProfile] = await Promise.all([
        photonApi.fetchScore(walletAddress),
        photonApi.fetchCryptoProfile(walletAddress),
      ]);

      setScore(newScore);
      setProfile(newProfile);

      const updatedHistory = await photonApi.getScoreHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      console.error('Error refreshing all:', err);
      setError(err.message || 'Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  }, [walletAddress]);

  const value: PhotonContextType = {
    walletAddress,
    score,
    profile,
    history,
    isLoading,
    isRefreshing,
    error,
    setWallet,
    clearWallet,
    refreshScore,
    refreshProfile,
    refreshAll,
    loadCachedData,
  };

  return (
    <PhotonContext.Provider value={value}>
      {children}
    </PhotonContext.Provider>
  );
}

export function usePhoton() {
  const context = useContext(PhotonContext);
  if (context === undefined) {
    throw new Error('usePhoton must be used within a PhotonProvider');
  }
  return context;
}

export default PhotonContext;
