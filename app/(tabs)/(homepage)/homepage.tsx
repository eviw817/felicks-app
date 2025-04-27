import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from "react-native";

export default function Homepage() {
    const name = "John";
  return (
    <SafeAreaView 
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFDF9',
      }}>
    <Text
    style={{
      fontSize: 24,
      padding: 20,
    }}
    >Welkom {name}!</Text>

    <View>
    <Text
        style={{
            fontFamily: "Nunito",
            fontWeight: "semibold",
            fontSize: 16,
            padding: 20,
            paddingRight: 40,
            marginRight: 10,
        }}
    >Quiz van de week
    </Text>
    <Text
        style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            paddingRight: 40,
        }}
    >Doe nog snel de quiz van deze week, voor je informatie misloopt. 
    </Text>
    </View>
    </SafeAreaView>
  );
}
