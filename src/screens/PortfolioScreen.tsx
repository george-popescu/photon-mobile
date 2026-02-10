import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePhoton } from '../context/PhotonContext';

// Chain colors
const CHAIN_COLORS: Record<string, string> = {
  ethereum: '#627EEA',
  base: '#0052FF',
  arbitrum: '#28A0F0',
  optimism: '#FF0420',
  polygon: '#8247E5',
  avalanche: '#E84142',
  bsc: '#F0B90B',
  fantom: '#1969FF',
  default: '#8B5CF6',
};

// Token logos (emoji fallbacks)
const TOKEN_LOGOS: Record<string, string> = {
  ETH: '⟠',
  WETH: '⟠',
  USDC: '💲',
  USDT: '💵',
  DAI: '🔶',
  WBTC: '₿',
  LINK: '🔗',
  UNI: '🦄',
  AAVE: '👻',
  default: '🪙',
};

const getChainColor = (chainId: string): string => {
  const normalized = chainId.toLowerCase();
  return CHAIN_COLORS[normalized] || CHAIN_COLORS.default;
};

const getTokenLogo = (symbol: string): string => {
  return TOKEN_LOGOS[symbol.toUpperCase()] || TOKEN_LOGOS.default;
};

const formatUsd = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(4)}`;
};

// Empty state component
const EmptyState = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>💰</Text>
    <Text style={styles.emptyTitle}>No Portfolio Data</Text>
    <Text style={styles.emptySubtitle}>
      Connect your wallet on the Home tab to see your portfolio
    </Text>
  </View>
);

// Loading state component
const LoadingState = () => (
  <View style={styles.loadingState}>
    <ActivityIndicator size="large" color="#8B5CF6" />
    <Text style={styles.loadingText}>Loading portfolio...</Text>
  </View>
);

export default function PortfolioScreen() {
  const { profile, walletAddress, isLoading, isRefreshing, refreshProfile } = usePhoton();

  if (isLoading && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio</Text>
        </View>
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (!walletAddress || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio</Text>
        </View>
        <EmptyState />
      </SafeAreaView>
    );
  }

  // Flatten all assets from all chains
  const allAssets = Object.values(profile.assets)
    .flat()
    .sort((a, b) => b.balance_usd - a.balance_usd);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshProfile}
            tintColor="#8B5CF6"
            colors={['#8B5CF6']}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio</Text>
        </View>

        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>{formatUsd(profile.total_balance_usd)}</Text>
          <View style={styles.walletRow}>
            <Text style={styles.walletAddress}>
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
            </Text>
          </View>
        </View>

        {/* Chain Distribution */}
        {profile.chains.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chain Distribution</Text>
            <View style={styles.chainsCard}>
              {/* Chain bar visualization */}
              <View style={styles.chainBar}>
                {profile.chains
                  .filter(c => c.value_usd > 0)
                  .map((chain, idx) => {
                    const percentage = (chain.value_usd / profile.total_balance_usd) * 100;
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.chainBarSegment,
                          {
                            width: `${Math.max(percentage, 2)}%`,
                            backgroundColor: getChainColor(chain.id),
                          },
                        ]}
                      />
                    );
                  })}
              </View>

              {/* Chain list */}
              {profile.chains
                .filter(c => c.value_usd > 0)
                .map((chain, idx) => {
                  const percentage = ((chain.value_usd / profile.total_balance_usd) * 100).toFixed(1);
                  return (
                    <View key={idx} style={[
                      styles.chainRow,
                      idx === profile.chains.filter(c => c.value_usd > 0).length - 1 && styles.chainRowLast
                    ]}>
                      <View style={[styles.chainDot, { backgroundColor: getChainColor(chain.id) }]} />
                      <Text style={styles.chainName}>{chain.name}</Text>
                      <Text style={styles.chainPercent}>{percentage}%</Text>
                      <Text style={styles.chainValue}>{formatUsd(chain.value_usd)}</Text>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

        {/* Assets */}
        {allAssets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assets ({allAssets.length})</Text>
            <View style={styles.assetsCard}>
              {allAssets.slice(0, 20).map((asset, idx) => (
                <View key={`${asset.chain_id}-${asset.id}-${idx}`} style={[
                  styles.assetRow,
                  idx === Math.min(allAssets.length, 20) - 1 && styles.assetRowLast
                ]}>
                  <View style={styles.assetIcon}>
                    {asset.logo ? (
                      <Text style={styles.assetLogo}>{getTokenLogo(asset.symbol)}</Text>
                    ) : (
                      <Text style={styles.assetLogo}>{getTokenLogo(asset.symbol)}</Text>
                    )}
                  </View>
                  <View style={styles.assetInfo}>
                    <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                    <Text style={styles.assetName} numberOfLines={1}>{asset.name}</Text>
                  </View>
                  <View style={styles.assetValues}>
                    <Text style={styles.assetValue}>{formatUsd(asset.balance_usd)}</Text>
                    {asset.price_change_24h !== undefined && (
                      <Text style={[
                        styles.assetChange,
                        { color: asset.price_change_24h >= 0 ? '#22C55E' : '#EF4444' }
                      ]}>
                        {asset.price_change_24h >= 0 ? '+' : ''}{asset.price_change_24h.toFixed(2)}%
                      </Text>
                    )}
                  </View>
                </View>
              ))}
              {allAssets.length > 20 && (
                <TouchableOpacity style={styles.showMoreButton}>
                  <Text style={styles.showMoreText}>Show all {allAssets.length} assets</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Last updated */}
        {profile.fetched_at && (
          <View style={styles.lastUpdated}>
            <Text style={styles.lastUpdatedText}>
              Last updated: {new Date(profile.fetched_at).toLocaleString()}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  balanceCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#18181B',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  walletRow: {
    marginTop: 12,
  },
  walletAddress: {
    fontSize: 14,
    color: '#71717A',
    fontFamily: 'monospace',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  chainsCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  chainBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#27272A',
  },
  chainBarSegment: {
    height: '100%',
  },
  chainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  chainRowLast: {
    borderBottomWidth: 0,
  },
  chainDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  chainName: {
    flex: 1,
    fontSize: 14,
    color: '#E4E4E7',
  },
  chainPercent: {
    fontSize: 14,
    color: '#71717A',
    marginRight: 16,
  },
  chainValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    minWidth: 70,
    textAlign: 'right',
  },
  assetsCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  assetRowLast: {
    borderBottomWidth: 0,
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetLogo: {
    fontSize: 20,
  },
  assetInfo: {
    flex: 1,
  },
  assetSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  assetName: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  assetValues: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  assetChange: {
    fontSize: 12,
    marginTop: 2,
  },
  showMoreButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  showMoreText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  lastUpdated: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#52525B',
  },
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Loading state
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#71717A',
    marginTop: 16,
  },
});
