import { Stack } from 'expo-router';

export default function HelptLayout() {
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
      <Stack.Screen name="help" options={{ title: "Help" }} />
      <Stack.Screen name="helpCentrum" options={{ title: "Help centrum" }} />
      <Stack.Screen name="problem" options={{ title: "Problem" }} />
      <Stack.Screen name="sendHelp" options={{ title: "Send help message" }} />
      <Stack.Screen name="sendProblem" options={{ title: "Send problem message" }} />

    </Stack>
  );
}