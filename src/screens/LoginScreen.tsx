import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePhoton } from '../context/PhotonContext';

// Example wallet addresses for quick testing
const EXAMPLE_WALLETS = [
  { label: 'Demo Wallet 1', address: '0x1234567890abcdef1234567890abcdef12345678' },
  { label: 'Demo Wallet 2', address: '0xabcdef1234567890abcdef1234567890abcdef12' },
];

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setWallet, isLoading } = usePhoton();
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');

  const validateAddress = (address: string): boolean => {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleConnect = async () => {
    const trimmed = walletAddress.trim();
    
    if (!trimmed) {
      setError('Please enter a wallet address');
      return;
    }

    if (!validateAddress(trimmed)) {
      setError('Invalid wallet address format');
      return;
    }

    try {
      setError('');
      await setWallet(trimmed);
      // Navigation will happen automatically via the navigation logic
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const handleDemoWallet = async (address: string) => {
    try {
      setError('');
      await setWallet(address);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo/Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>✨</Text>
            <Text style={styles.title}>Photon</Text>
            <Text style={styles.subtitle}>AI-Powered Credit Scoring</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Wallet Address</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="0x..."
              placeholderTextColor="#52525B"
              value={walletAddress}
              onChangeText={(text) => {
                setWalletAddress(text);
                setError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.hintText}>
                Enter your Ethereum, Base, or other EVM wallet address
              </Text>
            )}

            <TouchableOpacity
              style={[styles.connectButton, isLoading && styles.connectButtonDisabled]}
              onPress={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.connectButtonText}>Connect Wallet</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Demo Wallets */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Or try a demo wallet</Text>
            {EXAMPLE_WALLETS.map((wallet, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.demoButton}
                onPress={() => handleDemoWallet(wallet.address)}
                disabled={isLoading}
              >
                <Text style={styles.demoButtonText}>{wallet.label}</Text>
                <Text style={styles.demoAddress}>
                  {wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By connecting, you agree to our{' '}
              <Text style={styles.footerLink}>Terms</Text> and{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A1A1AA',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#52525B',
    marginTop: 8,
  },
  connectButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  demoSection: {
    marginBottom: 32,
  },
  demoTitle: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 12,
  },
  demoButton: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  demoAddress: {
    fontSize: 12,
    color: '#52525B',
    fontFamily: 'monospace',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#52525B',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#8B5CF6',
  },
});
