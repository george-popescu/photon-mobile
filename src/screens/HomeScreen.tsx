import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Mock data - will be replaced with API
const mockScore = {
  fico_score: 742,
  composite_score: 68.5,
  tier: 'very_good',
  tier_label: 'Very Good',
  tier_color: '#22C55E',
  subscores: {
    capacity: 85,
    stability: 78,
    behavior: 92,
    diversity: 45,
  },
  top_reasons: [
    { reason: 'Strong transaction history', impact: 15 },
    { reason: 'Good wallet age', impact: 10 },
    { reason: 'Limited protocol diversity', impact: -8 },
  ],
};

// Score Gauge Component
const ScoreGauge = ({ score, tier, tierColor }: { score: number; tier: string; tierColor: string }) => {
  const percentage = Math.max(0, Math.min(100, ((score - 300) / 550) * 100));
  const radius = 100;
  const strokeWidth = 16;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <View style={styles.gaugeContainer}>
      <Svg width={240} height={140} viewBox="0 0 240 140">
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
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
        />
        {/* Labels */}
        <SvgText x="20" y="135" fill="#71717A" fontSize="12">300</SvgText>
        <SvgText x="205" y="135" fill="#71717A" fontSize="12">850</SvgText>
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

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good afternoon 👋</Text>
          <Text style={styles.title}>Your Photon Score</Text>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <ScoreGauge
            score={mockScore.fico_score}
            tier={mockScore.tier_label}
            tierColor={mockScore.tier_color}
          />
          
          <View style={styles.compositeRow}>
            <Text style={styles.compositeLabel}>Composite Score</Text>
            <Text style={styles.compositeValue}>{mockScore.composite_score}/100</Text>
          </View>
        </View>

        {/* Subscores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Breakdown</Text>
          <View style={styles.subscoresCard}>
            <SubscoreBar label="Capacity" value={mockScore.subscores.capacity} color="#8B5CF6" />
            <SubscoreBar label="Stability" value={mockScore.subscores.stability} color="#06B6D4" />
            <SubscoreBar label="Behavior" value={mockScore.subscores.behavior} color="#22C55E" />
            <SubscoreBar label="Diversity" value={mockScore.subscores.diversity} color="#F59E0B" />
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Insights</Text>
          <View style={styles.insightsCard}>
            {mockScore.top_reasons.map((reason, idx) => (
              <View key={idx} style={styles.insightRow}>
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🔄</Text>
              <Text style={styles.actionText}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Details</Text>
            </TouchableOpacity>
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
});
