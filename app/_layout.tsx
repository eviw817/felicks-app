import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function RootLayout() {
  const router = useRouter();
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      // console.log('Deep link ontvangen:', url);

      // Controleer of er een # aanwezig is in de URL (fragment)
      const fragmentIndex = url.indexOf('#');
      if (fragmentIndex !== -1) {
        const fragment = url.substring(fragmentIndex + 1);
        // console.log('Fragment:', fragment);

        // Haal de toegangstoken uit de URL fragment
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token'); // Je zou dit ook kunnen ophalen als je het nodig hebt

        if (accessToken) {
          // console.log('Access token ontvangen:', accessToken);
          
          // Sla de token op
          SecureStore.setItemAsync('access_token', accessToken).then(() => {
            // console.log('Access token opgeslagen!');
            // Navigeer naar de juiste pagina
            router.push('/login/password/newpassword'); // Pas dit pad aan naar waar je de gebruiker wilt sturen
          });
        } else {
          console.log('Geen access_token gevonden in deeplink');
        }
      } else {
        console.log('Geen fragment gevonden in deeplink');
      }
    };

    // Luister naar deeplinks
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
