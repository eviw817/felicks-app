import { Stack } from 'expo-router';

export default function DemoLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="dogInformation" options={{ title: "Dog Information" }} />
      <Stack.Screen name="dogNotifications" options={{ title: "Dog Notifications" }} />
      <Stack.Screen name="dogFeaturesInfo" options={{ title: "Dog Features Information" }} />
    </Stack>
  );
}
