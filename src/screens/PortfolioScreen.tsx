import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockAssets = [
  { symbol: 'ETH', name: 'Ethereum', balance: 0.0274, value: 55.43, change: -3.2, logo: '⟠' },
  { symbol: 'USDC', name: 'USD Coin', balance: 0.008, value: 0.008, change: 0.01, logo: '💲' },
  { symbol: 'USDT', name: 'Tether', balance: 0.004, value: 0.004, change: 0.02, logo: '💵' },
];

const mockChains = [
  { name: 'Ethereum', value: 31.49, color: '#627EEA' },
  { name: 'Base', value: 9.91, color: '#0052FF' },
  { name: 'Arbitrum', value: 8.12, color: '#28A0F0' },
];

export default function PortfolioScreen() {
  const totalBalance = mockChains.reduce((sum, c) => sum + c.value, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio</Text>
        </View>

        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>${totalBalance.toFixed(2)}</Text>
          <View style={styles.changeRow}>
            <Text style={[styles.changeText, { color: '#22C55E' }]}>+$2.34 (4.8%)</Text>
            <Text style={styles.changePeriod}>24h</Text>
          </View>
        </View>

        {/* Chain Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chain Distribution</Text>
          <View style={styles.chainsCard}>
            {mockChains.map((chain, idx) => (
              <View key={idx} style={styles.chainRow}>
                <View style={[styles.chainDot, { backgroundColor: chain.color }]} />
                <Text style={styles.chainName}>{chain.name}</Text>
                <Text style={styles.chainValue}>${chain.value.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Assets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assets</Text>
          <View style={styles.assetsCard}>
            {mockAssets.map((asset, idx) => (
              <View key={idx} style={styles.assetRow}>
                <View style={styles.assetIcon}>
                  <Text style={styles.assetLogo}>{asset.logo}</Text>
                </View>
                <View style={styles.assetInfo}>
                  <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                  <Text style={styles.assetName}>{asset.name}</Text>
                </View>
                <View style={styles.assetValues}>
                  <Text style={styles.assetValue}>${asset.value.toFixed(2)}</Text>
                  <Text style={[
                    styles.assetChange,
                    { color: asset.change >= 0 ? '#22C55E' : '#EF4444' }
                  ]}>
                    {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

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
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  changePeriod: {
    fontSize: 14,
    color: '#71717A',
    marginLeft: 8,
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
  chainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
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
  chainValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
});
