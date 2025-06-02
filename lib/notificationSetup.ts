import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


/*
De logica staat volledig in het bestand app/_layout.tsx en gebruikt één extra helperbestand:

lib/notificationSetup.ts → hierin wordt gevraagd naar meldingsrechten en tokens

In de RootLayout gebeurt er:
De app registreert het toestel voor meldingen
Wanneer de app wordt geopend, vraagt hij of pushmeldingen mogen worden toegelaten.
Als de gebruiker dat goedkeurt, krijgt het toestel een uniek token waarmee meldingen kunnen worden ontvangen.

Er is een realtime verbinding met Supabase ingesteld. De app luistert continu naar nieuwe rijen die aan de notifications-tabel worden toegevoegd.

Bij een nieuwe melding wordt er automatisch een pushmelding getoond
Zodra Supabase een nieuwe melding detecteert, haalt de app het veld summary op en toont dit onmiddellijk in een pushmelding op het scherm

Als je buiten de app bent stuurt hij dus alleen de summary door, wanneer je daarop klikt kom je terecht bij de ar_hond. 

!! Moest het niet werken en we willen dit deel weglaten, kan je gewoon dit doen: 
- nofitifcationSetup verwijderen
- in de root layout het deel van de push meldingen verdwijnen. 

Dan zou alles zonder de push meldingen zijn.



NIET VERGETEN!!: om te testen voeg je eerst handmatig een melding toe in supabase */