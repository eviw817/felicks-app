import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function SettingsStart() {

    return(
    <SafeAreaView 
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFDF9',
      }}>
        <View
        style={{
            top: 1,
            flex: 1,
            marginTop: 40,
            justifyContent: 'flex-start',
            }}>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'bold',
                fontSize: 24,
                padding: 20,
                textAlign: 'center',
            }}
            >Virtuele hond</Text>
            <Text
            style={{
                fontFamily: 'Nunito',
                fontWeight: 'normal',
                fontSize: 16,
                padding: 20,
            }}
            >Wil je ontdekken hoe het is om een trouwe viervoeter in huis te hebben? Stel je eigen virtuele hond samen en ervaar wat het betekent om voor een huisdier te zorgen.

            Een huisdier nemen is een grote stap en het is belangrijk om te weten of je er klaar voor bent. Ga je mee op avontuur met onze virtuele hond en ontdek het zelf? 🎉
            Maak je klaar voor een leerzame en leuke ervaring! 🌟</Text>
            <View 
            style={{
                padding: 12,
                margin: 20,
                paddingHorizontal: 20,
                backgroundColor: '#97B8A5',
                borderRadius: 15,
            }}
            >DOORGAAN</View>
        </View>
      </SafeAreaView>
)};