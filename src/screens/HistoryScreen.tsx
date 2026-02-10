import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockHistory = [
  { date: '2026-02-10', score: 742, change: 5, tier: 'Very Good' },
  { date: '2026-02-03', score: 737, change: -3, tier: 'Good' },
  { date: '2026-01-27', score: 740, change: 12, tier: 'Very Good' },
  { date: '2026-01-20', score: 728, change: 8, tier: 'Good' },
  { date: '2026-01-13', score: 720, change: 0, tier: 'Good' },
];

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Score History</Text>
          <Text style={styles.subtitle}>Track your credit score over time</Text>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartCard}>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>📈</Text>
            <Text style={styles.chartLabel}>Score Trend</Text>
            <View style={styles.trendLine}>
              {[720, 728, 740, 737, 742].map((score, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.trendDot,
                    { bottom: (score - 700) * 2 }
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>

        {/* History List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Scores</Text>
          <View style={styles.historyCard}>
            {mockHistory.map((item, idx) => (
              <View key={idx} style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyDate}>
                    {new Date(item.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                  <Text style={styles.historyTier}>{item.tier}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyScore}>{item.score}</Text>
                  {item.change !== 0 && (
                    <Text style={[
                      styles.historyChange,
                      { color: item.change > 0 ? '#22C55E' : '#EF4444' }
                    ]}>
                      {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change)}
                    </Text>
                  )}
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
  subtitle: {
    fontSize: 14,
    color: '#71717A',
    marginTop: 4,
  },
  chartCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#18181B',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  chartPlaceholder: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chartText: {
    fontSize: 48,
  },
  chartLabel: {
    fontSize: 14,
    color: '#71717A',
    marginTop: 8,
  },
  trendLine: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  trendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
    position: 'absolute',
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
  historyCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  historyLeft: {},
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyTier: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 4,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  historyChange: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});
