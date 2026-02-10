import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePhoton } from '../context/PhotonContext';

interface MenuItemProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  danger?: boolean;
}

const MenuItem = ({ icon, label, sublabel, onPress, danger }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuIcon}>{icon}</Text>
    <View style={styles.menuContent}>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {sublabel && <Text style={styles.menuSublabel}>{sublabel}</Text>}
    </View>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { walletAddress, score, profile, clearWallet, refreshAll, history } = usePhoton();

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Wallet',
      'This will remove your wallet and all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: clearWallet,
        },
      ]
    );
  };

  const handleViewOnExplorer = () => {
    if (walletAddress) {
      // Default to Etherscan, but could detect chain
      Linking.openURL(`https://etherscan.io/address/${walletAddress}`);
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@photonai.io?subject=Photon Mobile Support');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://photonai.io/privacy');
  };

  const handleTerms = () => {
    Linking.openURL('https://photonai.io/terms');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletIcon}>
            <Text style={styles.walletIconText}>
              {walletAddress ? '🔗' : '👤'}
            </Text>
          </View>
          {walletAddress ? (
            <>
              <Text style={styles.walletLabel}>Connected Wallet</Text>
              <Text style={styles.walletAddress}>
                {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
              </Text>
              <TouchableOpacity 
                style={styles.viewExplorerButton}
                onPress={handleViewOnExplorer}
              >
                <Text style={styles.viewExplorerText}>View on Explorer ↗</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.walletLabel}>No Wallet Connected</Text>
              <Text style={styles.noWalletHint}>
                Go to Home to connect your wallet
              </Text>
            </>
          )}
        </View>

        {/* Stats */}
        {walletAddress && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{score?.fico_score || '—'}</Text>
              <Text style={styles.statLabel}>FICO Score</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {profile?.chains.filter(c => c.value_usd > 0).length || '—'}
              </Text>
              <Text style={styles.statLabel}>Chains</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>Checks</Text>
            </View>
          </View>
        )}

        {/* Account Section */}
        {walletAddress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="🔄"
                label="Refresh Data"
                sublabel="Update score and portfolio"
                onPress={refreshAll}
              />
              <MenuItem
                icon="🔗"
                label="Change Wallet"
                sublabel="Connect a different address"
                onPress={() => Alert.alert('Coming Soon', 'Multi-wallet support coming soon!')}
              />
            </View>
          </View>
        )}

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="📧"
              label="Contact Support"
              onPress={handleContactSupport}
            />
            <MenuItem
              icon="📜"
              label="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <MenuItem
              icon="📋"
              label="Terms of Service"
              onPress={handleTerms}
            />
            <MenuItem
              icon="ℹ️"
              label="About Photon"
              sublabel="AI-powered blockchain credit scoring"
              onPress={() => Linking.openURL('https://photonai.io')}
            />
          </View>
        </View>

        {/* Danger Zone */}
        {walletAddress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="🚪"
                label="Disconnect Wallet"
                sublabel="Remove wallet and clear data"
                onPress={handleDisconnect}
                danger
              />
            </View>
          </View>
        )}

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Photon Mobile v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2026 Photon AI</Text>
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
  walletCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#18181B',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
  },
  walletIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletIconText: {
    fontSize: 36,
  },
  walletLabel: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 8,
  },
  walletAddress: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  noWalletHint: {
    fontSize: 14,
    color: '#52525B',
    textAlign: 'center',
  },
  viewExplorerButton: {
    backgroundColor: '#27272A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewExplorerText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#71717A',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  menuLabelDanger: {
    color: '#EF4444',
  },
  menuSublabel: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: '#52525B',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#52525B',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#3F3F46',
  },
});
