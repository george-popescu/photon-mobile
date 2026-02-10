import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PhotonProvider } from './src/context/PhotonContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <PhotonProvider>
        <StatusBar style="light" />
        <Navigation />
      </PhotonProvider>
    </SafeAreaProvider>
  );
}
