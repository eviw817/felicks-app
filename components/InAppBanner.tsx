// components/InAppBanner.tsx
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";

type InAppBannerProps = {
  title: string;
  body: string;
  onHide: () => void;   
  onPress: () => void;  
};

export default function InAppBanner({
  title,
  body,
  onHide,
  onPress,
}: InAppBannerProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const screenWidth = Dimensions.get("window").width;

  // Base64 van kort “ping”‐geluid
  const pingWavBase64 =
    "UklGRhIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YR4AAACAgICAgICA"+
    "gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA"+
    "gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg"+
    "ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA"+
    "gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA"+
    "gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI";

  useEffect(() => {
    // 1) Speel ping‐geluid
    const playPing = async () => {
      try {
        await Audio.Sound.createAsync(
          { uri: `data:audio/wav;base64,${pingWavBase64}` },
          { shouldPlay: true }
        );
      } catch (error) {
        console.warn("Ping niet speelbaar:", error);
      }
    };
    playPing();

    // 2) Slide banner in
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 12,
    }).start();

    //Na 6 seconden
    const timeout = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onHide();
      });
    }, 6000);

    return () => clearTimeout(timeout);
  }, [translateY, onHide]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ translateY }],
          width: screenWidth - 20,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.container}
        onPress={() => {
          onPress();
          onHide();
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.bodyText} numberOfLines={2}>
            {body}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onHide}
          style={styles.closeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 10,
    right: 10,
    zIndex: 9999,
  },
  container: {
    backgroundColor: "#F18B7E",
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontFamily: "SireniaMedium",
    fontSize: 18,
    color: "#183A36",
    marginBottom: 2,
  },
  bodyText: {
    fontFamily: "Nunito",
    fontSize: 14,
    color: "#183A36",
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  closeText: {
    color: "#183A36",
    fontSize: 16,
    fontWeight: "600",
  },
});
