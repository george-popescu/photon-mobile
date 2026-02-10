import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { usePhoton } from '../context/PhotonContext';

const { width } = Dimensions.get('window');

// Score Gauge Component
const ScoreGauge = ({ score, tier, tierColor }: { score: number; tier: string; tierColor: string }) => {
  const percentage = Math.max(0, Math.min(100, ((score - 300) / 550) * 100));
  const radius = 100;
  const strokeWidth = 16;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <View style={styles.gaugeContainer}>
      <Svg width="240" height="140" viewBox="0 0 240 140">
        {/* Background arc */}
        <Path
          d="M 20 120 A 100 100 0 0 1 220 120"
          fill="none"
          stroke="#27272A"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Score arc */}
        <Path
          d="M 20 120 A 100 100 0 0 1 220 120"
          fill="none"
          stroke={tierColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={[circumference, circumference]}
          strokeDashoffset={strokeDashoffset}
        />
        {/* Labels */}
        <SvgText x={20} y={135} fill="#71717A" fontSize={12}>300</SvgText>
        <SvgText x={205} y={135} fill="#71717A" fontSize={12}>850</SvgText>
      </Svg>
      <View style={styles.gaugeCenter}>
        <Text style={styles.gaugeScore}>{score}</Text>
        <View style={[styles.tierBadge, { backgroundColor: tierColor + '30' }]}>
          <Text style={[styles.tierText, { color: tierColor }]}>{tier}</Text>
        </View>
      </View>
    </View>
  );
};

// Subscore Bar Component
const SubscoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <View style={styles.subscoreRow}>
    <View style={styles.subscoreHeader}>
      <Text style={styles.subscoreLabel}>{label}</Text>
      <Text style={[styles.subscoreValue, { color }]}>{value}</Text>
    </View>
    <View style={styles.subscoreBarBg}>
      <View style={[styles.subscoreBarFill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  </View>
);

// Empty State Component
const EmptyState = ({ onAddWallet }: { onAddWallet: () => void }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>🔗</Text>
    <Text style={styles.emptyTitle}>Connect Your Wallet</Text>
    <Text style={styles.emptySubtitle}>
      Add your blockchain wallet address to see your Photon credit score
    </Text>
    <TouchableOpacity style={styles.addWalletButton} onPress={onAddWallet}>
      <Text style={styles.addWalletButtonText}>Add Wallet Address</Text>
    </TouchableOpacity>
  </View>
);

// Loading State
const LoadingState = () => (
  <View style={styles.loadingState}>
    <ActivityIndicator size="large" color="#8B5CF6" />
    <Text style={styles.loadingText}>Loading your score...</Text>
  </View>
);

// Error State
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <View style={styles.errorState}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorTitle}>Something went wrong</Text>
    <Text style={styles.errorMessage}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

export default function HomeScreen() {
  const { 
    score, 
    walletAddress, 
    isLoading, 
    isRefreshing, 
    error,
    refreshAll, 
    setWallet,
    clearWallet,
  } = usePhoton();

  const handleAddWallet = () => {
    // For demo, use a test wallet address
    Alert.prompt(
      'Enter Wallet Address',
      'Enter your blockchain wallet address (e.g., 0x...)',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: async (address) => {
            if (address && address.length > 10) {
              try {
                await setWallet(address);
              } catch (err) {
                // Error is handled by context
              }
            }
          }
        },
      ],
      'plain-text',
      // Demo address
      '0x1234567890abcdef1234567890abcdef12345678'
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 🌅';
    if (hour < 18) return 'Good afternoon 👋';
    return 'Good evening 🌙';
  };

  // Loading state
  if (isLoading && !score) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState />
      </SafeAreaView>
    );
  }

  // No wallet state
  if (!walletAddress && !score) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.title}>Photon Score</Text>
        </View>
        <EmptyState onAddWallet={handleAddWallet} />
      </SafeAreaView>
    );
  }

  // Error state (but only if no cached data)
  if (error && !score) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.title}>Photon Score</Text>
        </View>
        <ErrorState error={error} onRetry={refreshAll} />
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.title}>Your Photon Score</Text>
        </View>

        {/* Score Card */}
        {score && (
          <>
            <View style={styles.scoreCard}>
              <ScoreGauge
                score={score.fico_score}
                tier={score.tier_label}
                tierColor={score.tier_color}
              />
              
              <View style={styles.compositeRow}>
                <Text style={styles.compositeLabel}>Composite Score</Text>
                <Text style={styles.compositeValue}>{score.composite_score.toFixed(1)}/100</Text>
              </View>

              {/* Wallet address */}
              <View style={styles.walletRow}>
                <Text style={styles.walletLabel}>Wallet</Text>
                <Text style={styles.walletAddress}>
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ''}
                </Text>
              </View>
            </View>

            {/* Subscores */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Score Breakdown</Text>
              <View style={styles.subscoresCard}>
                <SubscoreBar label="Capacity" value={score.subscores.capacity} color="#8B5CF6" />
                <SubscoreBar label="Stability" value={score.subscores.stability} color="#06B6D4" />
                <SubscoreBar label="Behavior" value={score.subscores.behavior} color="#22C55E" />
                <SubscoreBar label="Diversity" value={score.subscores.diversity} color="#F59E0B" />
              </View>
            </View>

            {/* Insights */}
            {score.top_reasons && score.top_reasons.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💡 Key Factors</Text>
                <View style={styles.insightsCard}>
                  {score.top_reasons.slice(0, 5).map((reason, idx) => (
                    <View key={idx} style={[
                      styles.insightRow,
                      idx === score.top_reasons.length - 1 || idx === 4 ? styles.insightRowLast : null
                    ]}>
                      <Text style={styles.insightIcon}>
                        {reason.impact > 0 ? '✅' : '⚠️'}
                      </Text>
                      <View style={styles.insightContent}>
                        <Text style={styles.insightText}>{reason.reason}</Text>
                        <Text style={[
                          styles.insightImpact,
                          { color: reason.impact > 0 ? '#22C55E' : '#F59E0B' }
                        ]}>
                          {reason.impact > 0 ? '+' : ''}{reason.impact} pts
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Risk Flags */}
            {score.risk_flags && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🛡️ Risk Flags</Text>
                <View style={styles.riskCard}>
                  {score.risk_flags.auto_decline_blacklisted_ge_5pct > 0 && (
                    <View style={styles.riskRow}>
                      <Text style={styles.riskDot}>🔴</Text>
                      <Text style={styles.riskText}>Blacklisted tokens ≥5%</Text>
                    </View>
                  )}
                  {score.risk_flags.capped_blacklisted_1_to_5pct > 0 && (
                    <View style={styles.riskRow}>
                      <Text style={styles.riskDot}>🟡</Text>
                      <Text style={styles.riskText}>Blacklisted tokens 1-5%</Text>
                    </View>
                  )}
                  {score.risk_flags.capped_scam_ge_10pct > 0 && (
                    <View style={styles.riskRow}>
                      <Text style={styles.riskDot}>🟡</Text>
                      <Text style={styles.riskText}>Scam interactions ≥10%</Text>
                    </View>
                  )}
                  {score.risk_flags.capped_inactive_young > 0 && (
                    <View style={styles.riskRow}>
                      <Text style={styles.riskDot}>🟡</Text>
                      <Text style={styles.riskText}>Young/inactive wallet</Text>
                    </View>
                  )}
                  {Object.values(score.risk_flags).every(v => v === 0) && (
                    <View style={styles.riskRow}>
                      <Text style={styles.riskDot}>🟢</Text>
                      <Text style={styles.riskText}>No risk flags detected</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={refreshAll} disabled={isRefreshing}>
              <Text style={styles.actionIcon}>🔄</Text>
              <Text style={styles.actionText}>{isRefreshing ? 'Refreshing...' : 'Refresh'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Share', 'Sharing coming soon!')}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={clearWallet}>
              <Text style={styles.actionIcon}>🔓</Text>
              <Text style={styles.actionText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Last updated */}
        {score?.fetched_at && (
          <View style={styles.lastUpdated}>
            <Text style={styles.lastUpdatedText}>
              Last updated: {new Date(score.fetched_at).toLocaleString()}
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
  greeting: {
    fontSize: 16,
    color: '#71717A',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#18181B',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
    top: 50,
  },
  gaugeScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  tierText: {
    fontSize: 14,
    fontWeight: '600',
  },
  compositeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    marginTop: 16,
  },
  compositeLabel: {
    fontSize: 14,
    color: '#71717A',
  },
  compositeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 12,
  },
  walletLabel: {
    fontSize: 14,
    color: '#71717A',
  },
  walletAddress: {
    fontSize: 14,
    color: '#A1A1AA',
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
  subscoresCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  subscoreRow: {
    marginBottom: 16,
  },
  subscoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subscoreLabel: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  subscoreValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  subscoreBarBg: {
    height: 8,
    backgroundColor: '#27272A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  subscoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  insightsCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  insightRowLast: {
    borderBottomWidth: 0,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightText: {
    fontSize: 14,
    color: '#E4E4E7',
    flex: 1,
  },
  insightImpact: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  riskCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  riskDot: {
    fontSize: 16,
    marginRight: 12,
  },
  riskText: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#A1A1AA',
    fontWeight: '500',
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
    marginBottom: 32,
    lineHeight: 24,
  },
  addWalletButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addWalletButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  // Error state
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#27272A',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
