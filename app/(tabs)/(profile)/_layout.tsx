import { Stack } from 'expo-router';

export default function ProfileLayout() {
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
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="profileEdit" options={{ title: "ProfileEdit" }} />
      <Stack.Screen name="forget_password" options={{ title: "Forget_password" }} />
      <Stack.Screen name="newpassword" options={{ title: "Newpassword" }} />
      <Stack.Screen name="notification_email" options={{ title: "Notification_email" }} />
    </Stack>
  );
}