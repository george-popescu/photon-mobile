// Score types
export interface Subscores {
  capacity: number;
  stability: number;
  behavior: number;
  diversity: number;
}

export interface TopReason {
  reason: string;
  impact: number;
}

export interface RiskFlags {
  auto_decline_blacklisted_ge_5pct: number;
  capped_blacklisted_1_to_5pct: number;
  capped_scam_ge_10pct: number;
  capped_inactive_young: number;
}

export interface PhotonScore {
  id: string;
  wallet_address: string;
  fico_score: number;
  composite_score: number;
  subscores: Subscores;
  risk_flags: RiskFlags;
  top_reasons: TopReason[];
  tier: 'exceptional' | 'very_good' | 'good' | 'fair' | 'poor';
  tier_label: string;
  tier_color: string;
  created_at: string;
}

// Crypto Profile types
export interface ChainBalance {
  id: string;
  name: string;
  valueUsd: number;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  logo?: string;
  balanceUsd: number;
  priceUsd?: number;
  priceChange24h?: number;
  chainId: string;
}

export interface Transaction {
  id: string;
  hash: string;
  chain: string;
  txType: string;
  txClassification: string;
  isoDate: string;
  successful: boolean;
  txFeeUsd?: number;
}

export interface CryptoProfile {
  address: string;
  totalBalanceUsd: number;
  multiChainBalances: {
    byChain: ChainBalance[];
    totalValueUsd: number;
  };
  assets: Record<string, Asset[]>;
  transactionHistory: Transaction[];
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  wallet_address?: string;
}

// Navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: undefined;
  ScoreDetail: { scoreId: string };
  Transactions: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Portfolio: undefined;
  History: undefined;
  Profile: undefined;
};
