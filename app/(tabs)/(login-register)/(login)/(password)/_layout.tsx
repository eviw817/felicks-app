import { Stack } from "expo-router";

export default function PasswordLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="forgetPassword"
        options={{ title: "Forget password" }}
      />
      <Stack.Screen
        name="newPassword"
        options={{ title: "Set new password" }}
      />
      <Stack.Screen
        name="notificationEmail"
        options={{ title: "Email notification" }}
      />
    </Stack>
  );
}
