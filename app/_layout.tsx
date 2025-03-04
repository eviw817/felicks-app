import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      console.log('Deep link ontvangen:', url);

      // Controleer de deep link URL en navigeer naar de juiste pagina
      if (url.includes('com.anonymous.felicksapp://login/password/newpassword')) {
        router.push('/login/password/newpassword'); // Zorg ervoor dat de juiste route correct wordt verwerkt
      }
    };

    // Voeg de event listener toe voor deep links
    const linkingListener = Linking.addEventListener('url', handleDeepLink);

    // Cleanup listener bij unmount
    return () => {
      linkingListener.remove();
    };
  }, [router]);

  return (
    <>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
