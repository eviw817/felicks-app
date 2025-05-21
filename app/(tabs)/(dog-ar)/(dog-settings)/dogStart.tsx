import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, ScrollView } from "react-native";
import { Link } from "expo-router";
import NavBar from "@/components/NavigationBar";

export default function DogStart() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFDF9",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          top: 1,
          flex: 1,
          marginTop: 40,
          justifyContent: "flex-start",
          paddingRight: 140,
        }}
      >
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "bold",
            fontSize: 24,
            padding: 20,
            textAlign: "center",
          }}
        >
          Virtuele hond
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "bold",
            fontSize: 16,
            paddingHorizontal: 20,
          }}
        >
          Altijd al gedroomd van een trouwe viervoeter in huis?
        </Text>
        <Text
          style={{
            fontFamily: "Nunito",
            fontWeight: "normal",
            fontSize: 16,
            paddingHorizontal: 20,
          }}
        >
          Maar ben jij er klaar voor? Dan is deze ervaring precies wat je nodig
          hebt om daar achter te komen!
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
          }}
        >
          <Image
            style={{
              width: 120,
              height: 120,
              borderRadius: 15,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: "#97B8A5",
            }}
            source={require("@/assets/images/step1.png")}
          />
          <View>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "bold",
                fontSize: 16,
                paddingHorizontal: 20,
              }}
            >
              Step 1
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingHorizontal: 20,
                marginRight: 100,
              }}
            >
              Maak jouw virtuele hond aan.
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 120,
              height: 120,
              borderRadius: 15,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: "#97B8A5",
              marginLeft: 20,
            }}
            source={require("@/assets/images/step2.png")}
          />
          <View
            style={{
              marginRight: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "bold",
                fontSize: 16,
                paddingHorizontal: 20,
              }}
            >
              Step 2
            </Text>
            <Text
              style={{
                fontFamily: "Nunito",
                fontWeight: "normal",
                fontSize: 16,
                paddingHorizontal: 20,
                marginRight: 120,
              }}
            >
              Ga op avontuur met jouw viervoeter en ontdek het zelf!
            </Text>
          </View>
        </View>
        <Link
          style={{
            padding: 12,
            margin: 20,
            paddingHorizontal: 20,
            backgroundColor: "#97B8A5",
            fontWeight: "bold",
            borderRadius: 15,
            textAlign: "center",
          }}
          href="/dogBreed"
        >
          DOORGAAN
        </Link>
      </ScrollView>

      {/* Fixed navbar onderaan scherm */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <NavBar />
      </View>
    </SafeAreaView>
  );
}
