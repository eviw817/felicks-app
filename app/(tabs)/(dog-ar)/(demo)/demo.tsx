import { BeagleScene } from "@/components/augumented-dog/scenes/BeagleScene";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { supabase } from "../../../../lib/supabase";
import { useLocalSearchParams } from "expo-router";

const AugumentedDog = () => {
  const { petId } = useLocalSearchParams();

  const [status, setStatus] = useState<null | {
    id: string;
    user_id: string;
    breed: string;
    name: string;
    is_eating: boolean;
    is_playing: boolean;
    is_running: boolean;
    is_toilet: boolean;
  }>(null);

  const [loading, setLoading] = useState(true);
  const [lastToggledField, setLastToggledField] = useState<null | keyof typeof defaultStatus>(null);

  const defaultStatus = {
    is_eating: false,
    is_playing: false,
    is_running: false,
    is_toilet: false,
  };

  useEffect(() => {
    if (!petId || typeof petId !== "string") {
      console.warn("❌ petId is missing or invalid");
      return;
    }

    const fetchStatus = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ar_dog')
        .select('*')
        .eq('id', petId)
        .single();

      if (error) {
        console.error('❌ Error fetching dog status:', error);
      } else if (!data) {
        console.warn('⚠️ No dog found for this petId:', petId);
      } else {
        setStatus(data);
      }
      setLoading(false);
    };

    fetchStatus();
  }, [petId]);

  const toggleStatus = async (
    field: keyof typeof defaultStatus
  ) => {
    if (!status) return;

    const newValue = !status[field];

    // Update local state
    setStatus((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: newValue };
    });

    setLastToggledField(field);

    // Update Supabase
    const { error } = await supabase
      .from('ar_dog')
      .update({ [field]: newValue })
      .eq('id', status.id);

    if (error) {
      console.error('❌ Failed to update status:', error);
      // Revert state
      setStatus((prev) => {
        if (!prev) return prev;
        return { ...prev, [field]: !newValue };
      });
    }
  };

  if (loading || !status) {
    return (
      <SafeAreaView>
        <View style={{ padding: 20 }}>
          <FontAwesome6 name="hourglass" size={32} />
          <Text style={{ marginTop: 10 }}>⏳ Loading...</Text>
          <Text style={{ marginTop: 10 }}>petId: {petId || "undefined"}</Text>
          <Text>Status: {JSON.stringify(status)}</Text>
          <Text>Loading: {String(loading)}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dogName = status.name || "je hond";

  const getStatusMessages = (dogName: string) => ({
    is_eating: {
      true: `${dogName} heeft flink zijn eten opgegeten!`,
      false: `Na ${dogName} zijn dutje, heeft hij hele grote honger gekregen!`,
    },
    is_playing: {
      true: `${dogName} heeft kunnen spelen!`,
      false: `${dogName} heeft een tennisbal gevonden en wil spelen!`,
    },
    is_running: {
      true: `${dogName} vond het wandelen heel leuk!`,
      false: `${dogName} heeft nood aan beweging, maak een wandeling!`,
    },
    is_toilet: {
      true: `${dogName} heeft zijn behoefte kunnen doen!`,
      false: `${dogName} moet heel dringend naar het toilet, laat hem buiten!`,
    },
  });

  const fieldPriority: (keyof typeof defaultStatus)[] = [
    'is_eating',
    'is_playing',
    'is_running',
    'is_toilet',
  ];

  const getCurrentMessages = (): string[] => {
    if (!status) return [];

    const messagesMap = getStatusMessages(dogName);

    // If a field was toggled last, show only that message
    if (lastToggledField) {
      return [messagesMap[lastToggledField][status[lastToggledField] ? "true" : "false"]];
    }

    // Otherwise, show the first message in priority order
    const firstField = fieldPriority[0];
    return [messagesMap[firstField][status[firstField] ? "true" : "false"]];
  };
  
  const buttons: { field: keyof typeof defaultStatus; icon: any }[] = [
    { field: 'is_eating', icon: 'bowl-food' },
    { field: 'is_playing', icon: 'baseball' },
    { field: 'is_running', icon: 'person-running' },
    { field: 'is_toilet', icon: 'poop' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <BeagleScene />,
        }}
        style={{ flex: 1 }}
      >
        <BeagleScene style={{ width: "100%", height: 1000 }} />
      </ViroARSceneNavigator>

      <View
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          zIndex: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        {getCurrentMessages().map((msg, idx) => (
          <Text
            key={idx}
            style={{
              margin: 6,
              borderRadius: 10,
              overflow: 'hidden',
              backgroundColor: "#FDE4D2",
              padding: 12,
              fontFamily: 'Nunito',
              fontWeight: 'normal',
              fontSize: 16,
              color: "#183A36",
              textAlign: 'center',
            }}
          >
            {msg}
          </Text>
        ))}
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          zIndex: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {buttons.map(({ field, icon }, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => toggleStatus(field)}
            style={{
              marginHorizontal: 10,
              borderRadius: 10,
              overflow: 'hidden',
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: status[field]
                ? "rgba(255, 216, 126, 1)"
                : "rgba(253, 228, 210, 0.5)",
            }}
            accessibilityLabel={icon}
          >
            <FontAwesome6
              name={icon}
              size={28}
              color="#183A36"
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default AugumentedDog;
