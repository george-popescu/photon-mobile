import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>📊</Text>
        <Text style={styles.title}>Connect Wallet</Text>
        <Text style={styles.subtitle}>
          Connect your crypto wallet to view your Photon Credit Score
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.walletButton}>
          <Text style={styles.walletIcon}>🦊</Text>
          <Text style={styles.walletText}>MetaMask</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.walletButton}>
          <Text style={styles.walletIcon}>🌈</Text>
          <Text style={styles.walletText}>Rainbow</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.walletButton}>
          <Text style={styles.walletIcon}>👛</Text>
          <Text style={styles.walletText}>WalletConnect</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By connecting, you agree to our Terms of Service
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  buttons: {
    padding: 20,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  walletIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  walletText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#52525B',
    textAlign: 'center',
  },
});
