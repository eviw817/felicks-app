import { Link } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFDF9',
    }}>
      <Link 
        style={{
          padding: 12,
          paddingHorizontal: 20,
          backgroundColor: '#97B8A5',
          borderRadius: 7 }}
      href="/demo">Ga naar demo</Link>
    </SafeAreaView>
    
  );
}