import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  return (
    <>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
