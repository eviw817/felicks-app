import { View } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFDF9',
        }}>
        <Link 
        style={{
          padding: 8,
          backgroundColor: '#97B8A5',
          borderRadius: 7,
        }}
        href="/demo">Go to demo</Link>
      </View>
  );
}