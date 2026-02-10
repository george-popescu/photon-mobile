import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePhoton } from '../context/PhotonContext';

type TabType = 'transactions' | 'scores';

// Transaction type icons
const TX_ICONS: Record<string, string> = {
  transfer: '↗️',
  receive: '↙️',
  swap: '🔄',
  bridge: '🌉',
  stake: '🥩',
  unstake: '📤',
  claim: '🎁',
  approve: '✅',
  mint: '✨',
  burn: '🔥',
  default: '📝',
};

const getTxIcon = (type: string): string => {
  return TX_ICONS[type.toLowerCase()] || TX_ICONS.default;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};

const shortenHash = (hash: string): string => {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
};

// Empty state component
const EmptyState = ({ tab }: { tab: TabType }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>{tab === 'transactions' ? '📜' : '📊'}</Text>
    <Text style={styles.emptyTitle}>
      {tab === 'transactions' ? 'No Transactions' : 'No Score History'}
    </Text>
    <Text style={styles.emptySubtitle}>
      {tab === 'transactions' 
        ? 'Connect your wallet to see transaction history'
        : 'Refresh your score to start building history'}
    </Text>
  </View>
);

// Loading state component
const LoadingState = () => (
  <View style={styles.loadingState}>
    <ActivityIndicator size="large" color="#8B5CF6" />
    <Text style={styles.loadingText}>Loading history...</Text>
  </View>
);

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('transactions');
  const { profile, history, walletAddress, isLoading, isRefreshing, refreshAll } = usePhoton();

  if (isLoading && !profile && history.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
        </View>
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            tintColor="#8B5CF6"
            colors={['#8B5CF6']}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transactions' && styles.tabActive]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text style={[styles.tabText, activeTab === 'transactions' && styles.tabTextActive]}>
              Transactions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'scores' && styles.tabActive]}
            onPress={() => setActiveTab('scores')}
          >
            <Text style={[styles.tabText, activeTab === 'scores' && styles.tabTextActive]}>
              Score History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <View style={styles.section}>
            {!walletAddress || !profile || profile.transactions.length === 0 ? (
              <EmptyState tab="transactions" />
            ) : (
              <View style={styles.listCard}>
                {profile.transactions.slice(0, 50).map((tx, idx) => (
                  <View key={tx.id || idx} style={[
                    styles.txRow,
                    idx === Math.min(profile.transactions.length, 50) - 1 && styles.txRowLast
                  ]}>
                    <View style={[
                      styles.txIcon,
                      { backgroundColor: tx.successful ? '#22C55E20' : '#EF444420' }
                    ]}>
                      <Text style={styles.txIconText}>{getTxIcon(tx.type)}</Text>
                    </View>
                    <View style={styles.txInfo}>
                      <View style={styles.txHeader}>
                        <Text style={styles.txType}>{tx.classification || tx.type}</Text>
                        <Text style={styles.txChain}>{tx.chain}</Text>
                      </View>
                      <View style={styles.txMeta}>
                        <Text style={styles.txHash}>{shortenHash(tx.hash)}</Text>
                        <Text style={styles.txDate}>{formatDate(tx.date)}</Text>
                      </View>
                      {tx.fee_usd !== undefined && tx.fee_usd > 0 && (
                        <Text style={styles.txFee}>Fee: ${tx.fee_usd.toFixed(4)}</Text>
                      )}
                    </View>
                    <View style={[
                      styles.txStatus,
                      { backgroundColor: tx.successful ? '#22C55E' : '#EF4444' }
                    ]}>
                      <Text style={styles.txStatusText}>
                        {tx.successful ? '✓' : '✗'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Score History Tab */}
        {activeTab === 'scores' && (
          <View style={styles.section}>
            {history.length === 0 ? (
              <EmptyState tab="scores" />
            ) : (
              <>
                {/* Score trend summary */}
                {history.length >= 2 && (
                  <View style={styles.trendCard}>
                    <Text style={styles.trendLabel}>Score Trend</Text>
                    <View style={styles.trendRow}>
                      {(() => {
                        const first = history[0];
                        const last = history[history.length - 1];
                        const change = last.fico_score - first.fico_score;
                        const isPositive = change >= 0;
                        return (
                          <>
                            <Text style={[
                              styles.trendValue,
                              { color: isPositive ? '#22C55E' : '#EF4444' }
                            ]}>
                              {isPositive ? '+' : ''}{change} pts
                            </Text>
                            <Text style={styles.trendPeriod}>
                              over {history.length} checks
                            </Text>
                          </>
                        );
                      })()}
                    </View>
                  </View>
                )}

                {/* Score history list */}
                <View style={styles.listCard}>
                  {history.slice().reverse().slice(0, 20).map((entry, idx) => {
                    const prevEntry = history[history.length - 1 - idx - 1];
                    const change = prevEntry ? entry.fico_score - prevEntry.fico_score : 0;
                    
                    return (
                      <View key={idx} style={[
                        styles.scoreRow,
                        idx === Math.min(history.length, 20) - 1 && styles.scoreRowLast
                      ]}>
                        <View style={styles.scoreDate}>
                          <Text style={styles.scoreDateText}>
                            {new Date(entry.fetched_at).toLocaleDateString()}
                          </Text>
                          <Text style={styles.scoreTimeText}>
                            {new Date(entry.fetched_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Text>
                        </View>
                        <View style={styles.scoreValues}>
                          <Text style={styles.scoreFico}>{entry.fico_score}</Text>
                          {change !== 0 && (
                            <Text style={[
                              styles.scoreChange,
                              { color: change > 0 ? '#22C55E' : '#EF4444' }
                            ]}>
                              {change > 0 ? '+' : ''}{change}
                            </Text>
                          )}
                        </View>
                        <View style={styles.scoreComposite}>
                          <Text style={styles.scoreCompositeValue}>
                            {entry.composite_score.toFixed(1)}
                          </Text>
                          <Text style={styles.scoreCompositeLabel}>/100</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#18181B',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#27272A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
  },
  trendCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 8,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  trendValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  trendPeriod: {
    fontSize: 14,
    color: '#71717A',
    marginLeft: 8,
  },
  listCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  txRowLast: {
    borderBottomWidth: 0,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txIconText: {
    fontSize: 20,
  },
  txInfo: {
    flex: 1,
  },
  txHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  txType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  txChain: {
    fontSize: 12,
    color: '#8B5CF6',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  txMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txHash: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'monospace',
  },
  txDate: {
    fontSize: 12,
    color: '#52525B',
    marginLeft: 8,
  },
  txFee: {
    fontSize: 11,
    color: '#52525B',
    marginTop: 2,
  },
  txStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  txStatusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  scoreRowLast: {
    borderBottomWidth: 0,
  },
  scoreDate: {
    flex: 1,
  },
  scoreDateText: {
    fontSize: 14,
    color: '#E4E4E7',
  },
  scoreTimeText: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  scoreValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 20,
  },
  scoreFico: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreChange: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  scoreComposite: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreCompositeValue: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  scoreCompositeLabel: {
    fontSize: 12,
    color: '#52525B',
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    paddingHorizontal: 20,
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
