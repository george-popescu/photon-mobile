import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockUser = {
  wallet: '0xe27c...1e19b4',
  fullWallet: '0xe27c3df26c8b0f2338952b193ba5ea505d1e19b4',
  email: 'user@example.com',
  memberSince: '2026-01-15',
};

const menuItems = [
  { icon: '👛', label: 'Connected Wallets', value: '1 wallet' },
  { icon: '🔔', label: 'Notifications', value: 'On' },
  { icon: '🌙', label: 'Dark Mode', value: 'On' },
  { icon: '🔐', label: 'Security', value: '' },
  { icon: '📄', label: 'Export Report', value: '' },
  { icon: '❓', label: 'Help & Support', value: '' },
  { icon: 'ℹ️', label: 'About', value: 'v1.0.0' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.walletAddress}>{mockUser.wallet}</Text>
          <Text style={styles.memberSince}>
            Member since {new Date(mockUser.memberSince).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
          <TouchableOpacity style={styles.copyButton}>
            <Text style={styles.copyButtonText}>📋 Copy Full Address</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            {menuItems.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.menuItem}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuValue}>{item.value}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>🚪 Disconnect Wallet</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Photon AI</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
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
  profileCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#18181B',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF620',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  walletAddress: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  memberSince: {
    fontSize: 14,
    color: '#71717A',
    marginTop: 8,
  },
  copyButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#27272A',
    borderRadius: 8,
  },
  copyButtonText: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
    fontSize: 20,
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#E4E4E7',
  },
  menuValue: {
    fontSize: 14,
    color: '#71717A',
    marginRight: 8,
  },
  menuArrow: {
    fontSize: 20,
    color: '#71717A',
  },
  logoutButton: {
    backgroundColor: '#EF444420',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
  },
  footerVersion: {
    fontSize: 12,
    color: '#52525B',
    marginTop: 4,
  },
});
