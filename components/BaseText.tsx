// components/BaseText.tsx
import React from "react";
import { Text, TextProps, View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";

type Variant = "text" | "title" | "button";

interface BaseTextProps extends TextProps {
  variant?: Variant;
}

export default function BaseText({
  variant = "text",
  style,
  ...rest
}: BaseTextProps) {
  const [fontsLoaded] = useFonts({
    // Nunito fonts
    NunitoBlack: require("@/assets/fonts/Nunito/NunitoBlack.ttf"),
    NunitoBlackItalic: require("@/assets/fonts/Nunito/NunitoBlackItalic.ttf"),

    NunitoBold: require("@/assets/fonts/Nunito/NunitoBold.ttf"),
    NunitoBoldItalic: require("@/assets/fonts/Nunito/NunitoBoldItalic.ttf"),

    NunitoExtraBold: require("@/assets/fonts/Nunito/NunitoExtraBold.ttf"),
    NunitoExtraBoldItalic: require("@/assets/fonts/Nunito/NunitoExtraBoldItalic.ttf"),

    NunitoExtraLight: require("@/assets/fonts/Nunito/NunitoExtraLight.ttf"),
    NunitoExtraLightItalic: require("@/assets/fonts/Nunito/NunitoExtraLightItalic.ttf"),

    NunitoItalic: require("@/assets/fonts/Nunito/NunitoItalic.ttf"),

    NunitoLight: require("@/assets/fonts/Nunito/NunitoLight.ttf"),
    NunitoLightItalic: require("@/assets/fonts/Nunito/NunitoLightItalic.ttf"),

    NunitoMedium: require("@/assets/fonts/Nunito/NunitoMedium.ttf"),
    NunitoMediumItalic: require("@/assets/fonts/Nunito/NunitoMediumItalic.ttf"),

    NunitoRegular: require("@/assets/fonts/Nunito/NunitoRegular.ttf"),

    NunitoSemiBold: require("@/assets/fonts/Nunito/NunitoSemiBold.ttf"),
    NunitoSemiBoldItalic: require("@/assets/fonts/Nunito/NunitoSemiBoldItalic.ttf"),

    // Sirenia fonts
    SireniaBlack: require("@/assets/fonts/Sirenia/SireniaBlack.ttf"),
    SireniaBlackItalic: require("@/assets/fonts/Sirenia/SireniaBlackItalic.ttf"),

    SireniaBold: require("@/assets/fonts/Sirenia/SireniaBold.ttf"),
    SireniaBoldItalic: require("@/assets/fonts/Sirenia/SireniaBoldItalic.ttf"),

    SireniaExtraLight: require("@/assets/fonts/Sirenia/SireniaExtraLight.ttf"),
    SireniaExtraLightItalic: require("@/assets/fonts/Sirenia/SireniaExtraLightItalic.ttf"),

    SireniaItalic: require("@/assets/fonts/Sirenia/SireniaItalic.ttf"),

    SireniaLight: require("@/assets/fonts/Sirenia/SireniaLight.ttf"),
    SireniaLightItalic: require("@/assets/fonts/Sirenia/SireniaLightItalic.ttf"),

    SireniaMedium: require("@/assets/fonts/Sirenia/SireniaMedium.ttf"),
    SireniaMediumItalic: require("@/assets/fonts/Sirenia/SireniaMediumItalic.ttf"),

    SireniaRegular: require("@/assets/fonts/Sirenia/SireniaRegular.ttf"),

    SireniaSemiBold: require("@/assets/fonts/Sirenia/SireniaSemiBold.ttf"),
    SireniaSemiBoldItalic: require("@/assets/fonts/Sirenia/SireniaSemiBoldItalic.ttf"),

    SireniaThin: require("@/assets/fonts/Sirenia/SireniaThin.ttf"),
    SireniaThinItalic: require("@/assets/fonts/Sirenia/SireniaThinItalic.ttf"),

    // SpaceMono
    SpaceMonoRegular: require("@/assets/fonts/SpaceMonoRegular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const variantStyles = {
    text: {
      fontFamily: "NunitoRegular", //standaardstijl
      fontSize: 16,
      color: "#183A36",
    },
    title: {
      fontFamily: "SireniaMedium",
      fontSize: 24,
      color: "#183A36",
    },
    button: {
      fontFamily: "NunitoBold",
      fontSize: 14,
      color: "#183A36",
      textTransform: "uppercase",
      textAlign: "center",
    },
  } as const;

  return <Text {...rest} style={[variantStyles[variant], style]} />;
}
