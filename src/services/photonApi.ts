import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PHOTON_API_URL = 'https://photonai.io/api';
const PHOTON_API_KEY = 'e0aa83e41f56a39f74c54058a42d239d83d6c36d31e83f40c5c071db8bf55e99';

// Storage keys
const STORAGE_KEYS = {
  WALLET_ADDRESS: '@photon_wallet_address',
  CACHED_SCORE: '@photon_cached_score',
  CACHED_PROFILE: '@photon_cached_profile',
  SCORE_HISTORY: '@photon_score_history',
};

// Tier calculation
export function calculateTier(ficoScore: number): { tier: string; label: string; color: string } {
  if (ficoScore >= 800) return { tier: 'exceptional', label: 'Exceptional', color: '#22C55E' };
  if (ficoScore >= 740) return { tier: 'very_good', label: 'Very Good', color: '#84CC16' };
  if (ficoScore >= 670) return { tier: 'good', label: 'Good', color: '#06B6D4' };
  if (ficoScore >= 580) return { tier: 'fair', label: 'Fair', color: '#F59E0B' };
  return { tier: 'poor', label: 'Poor', color: '#EF4444' };
}

// API Response types
interface CreditSummary {
  scores: {
    fico_equivalent: number;
    composite_0_100: number;
    subscores: {
      capacity: number;
      stability: number;
      behavior: number;
      diversity: number;
    };
  };
  risk_flags: {
    auto_decline_blacklisted_ge_5pct: number;
    capped_blacklisted_1_to_5pct: number;
    capped_scam_ge_10pct: number;
    capped_inactive_young: number;
  };
  top_reasons: Array<{
    reason: string;
    impact: number;
  }>;
}

interface OwnerReportItem {
  category: string;
  metric: string;
  value: string | number;
  percentile: number;
}

interface PhotonScoreResponse {
  credit_summary: CreditSummary;
  owner_report: OwnerReportItem[];
}

interface CryptoProfileResponse {
  totalBalanceUsd: number;
  multiChainBalances: {
    byChain: Array<{
      id: string;
      name: string;
      valueUsd: number;
    }>;
    totalValueUsd: number;
  };
  assets: Record<string, Array<{
    id: string;
    name: string;
    symbol: string;
    logo?: string;
    balanceUsd: number;
    priceUsd?: number;
    priceChange24h?: number;
    chainId: string;
  }>>;
  transactionHistory: Array<{
    id: string;
    hash: string;
    chain: string;
    txType: string;
    txClassification: string;
    isoDate: string;
    successful: boolean;
    txFeeUsd?: number;
  }>;
}

// Transformed score for UI
export interface PhotonScoreData {
  wallet_address: string;
  fico_score: number;
  composite_score: number;
  subscores: {
    capacity: number;
    stability: number;
    behavior: number;
    diversity: number;
  };
  risk_flags: {
    auto_decline_blacklisted_ge_5pct: number;
    capped_blacklisted_1_to_5pct: number;
    capped_scam_ge_10pct: number;
    capped_inactive_young: number;
  };
  top_reasons: Array<{
    reason: string;
    impact: number;
  }>;
  owner_report: OwnerReportItem[];
  tier: string;
  tier_label: string;
  tier_color: string;
  fetched_at: string;
}

export interface CryptoProfileData {
  wallet_address: string;
  total_balance_usd: number;
  chains: Array<{
    id: string;
    name: string;
    value_usd: number;
  }>;
  assets: Record<string, Array<{
    id: string;
    name: string;
    symbol: string;
    logo?: string;
    balance_usd: number;
    price_usd?: number;
    price_change_24h?: number;
    chain_id: string;
  }>>;
  transactions: Array<{
    id: string;
    hash: string;
    chain: string;
    type: string;
    classification: string;
    date: string;
    successful: boolean;
    fee_usd?: number;
  }>;
  fetched_at: string;
}

export interface ScoreHistoryEntry {
  fico_score: number;
  composite_score: number;
  fetched_at: string;
}

class PhotonApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: PHOTON_API_URL,
      headers: {
        'Authorization': `Bearer ${PHOTON_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  // Fetch score from API
  async fetchScore(walletAddress: string): Promise<PhotonScoreData> {
    try {
      const response = await this.client.get<PhotonScoreResponse>(`/score/${walletAddress}`);
      const data = response.data;
      
      const ficoScore = data.credit_summary.scores.fico_equivalent;
      const tierInfo = calculateTier(ficoScore);

      const scoreData: PhotonScoreData = {
        wallet_address: walletAddress,
        fico_score: ficoScore,
        composite_score: data.credit_summary.scores.composite_0_100,
        subscores: data.credit_summary.scores.subscores,
        risk_flags: data.credit_summary.risk_flags,
        top_reasons: data.credit_summary.top_reasons,
        owner_report: data.owner_report || [],
        tier: tierInfo.tier,
        tier_label: tierInfo.label,
        tier_color: tierInfo.color,
        fetched_at: new Date().toISOString(),
      };

      // Cache the score
      await this.cacheScore(scoreData);
      
      // Add to history
      await this.addToHistory(scoreData);

      return scoreData;
    } catch (error: any) {
      console.error('Error fetching Photon score:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch score');
    }
  }

  // Fetch crypto profile from API
  async fetchCryptoProfile(walletAddress: string): Promise<CryptoProfileData> {
    try {
      const response = await this.client.get<CryptoProfileResponse>(`/crypto-profile/${walletAddress}`);
      const data = response.data;

      const profileData: CryptoProfileData = {
        wallet_address: walletAddress,
        total_balance_usd: data.totalBalanceUsd,
        chains: data.multiChainBalances.byChain.map(c => ({
          id: c.id,
          name: c.name,
          value_usd: c.valueUsd,
        })),
        assets: Object.fromEntries(
          Object.entries(data.assets).map(([chainId, assets]) => [
            chainId,
            assets.map(a => ({
              id: a.id,
              name: a.name,
              symbol: a.symbol,
              logo: a.logo,
              balance_usd: a.balanceUsd,
              price_usd: a.priceUsd,
              price_change_24h: a.priceChange24h,
              chain_id: a.chainId,
            })),
          ])
        ),
        transactions: data.transactionHistory.map(tx => ({
          id: tx.id,
          hash: tx.hash,
          chain: tx.chain,
          type: tx.txType,
          classification: tx.txClassification,
          date: tx.isoDate,
          successful: tx.successful,
          fee_usd: tx.txFeeUsd,
        })),
        fetched_at: new Date().toISOString(),
      };

      // Cache the profile
      await this.cacheProfile(profileData);

      return profileData;
    } catch (error: any) {
      console.error('Error fetching crypto profile:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch crypto profile');
    }
  }

  // Storage methods
  async saveWalletAddress(address: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);
  }

  async getWalletAddress(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
  }

  async clearWalletAddress(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
  }

  private async cacheScore(score: PhotonScoreData): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_SCORE, JSON.stringify(score));
  }

  async getCachedScore(): Promise<PhotonScoreData | null> {
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_SCORE);
    return cached ? JSON.parse(cached) : null;
  }

  private async cacheProfile(profile: CryptoProfileData): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_PROFILE, JSON.stringify(profile));
  }

  async getCachedProfile(): Promise<CryptoProfileData | null> {
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_PROFILE);
    return cached ? JSON.parse(cached) : null;
  }

  private async addToHistory(score: PhotonScoreData): Promise<void> {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.SCORE_HISTORY);
    const history: ScoreHistoryEntry[] = historyJson ? JSON.parse(historyJson) : [];
    
    history.push({
      fico_score: score.fico_score,
      composite_score: score.composite_score,
      fetched_at: score.fetched_at,
    });

    // Keep only last 100 entries
    const trimmed = history.slice(-100);
    await AsyncStorage.setItem(STORAGE_KEYS.SCORE_HISTORY, JSON.stringify(trimmed));
  }

  async getScoreHistory(): Promise<ScoreHistoryEntry[]> {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.SCORE_HISTORY);
    return historyJson ? JSON.parse(historyJson) : [];
  }

  async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.WALLET_ADDRESS,
      STORAGE_KEYS.CACHED_SCORE,
      STORAGE_KEYS.CACHED_PROFILE,
      STORAGE_KEYS.SCORE_HISTORY,
    ]);
  }
}

export const photonApi = new PhotonApiService();
export default photonApi;
