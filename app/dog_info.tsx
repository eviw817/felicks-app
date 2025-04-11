import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const dogData = {
  appenzeller: {
    name: 'Appenzeller Sennenhond',
    image: require('@/assets/images/appenzeller.png'),
    description: `Karakter:\nDe Appenzeller Sennenhond is zelfverzekerd, levendig, betrouwbaar en sterk gehecht aan zijn baas en gezin. Hij heeft een vriendelijk en enthousiast karakter, maar zijn energieniveau en leidschapsbehoefte vragen om een duidelijke en consequente opvoeding. Dit ras leert snel en verwerkt stress bij herhaling. Veel beweging en mentale uitdaging zijn essentieel om hem tevreden te houden.\n\nAandachtspunten:\n• De Appenzeller hecht zich sterk aan zijn gezin en woont graag in huis.\n• Hij heeft veel beweging nodig, zoals lange wandelingen, fietsen of zwemmen.\n• Een duidelijke, maar respectvolle opvoeding is belangrijk om dominantie te voorkomen.\n• De vacht vereist minimale verzorging; wekelijks borstelen is meestal voldoende.\n• Hij kan waaks/reactief zijn tegenover vreemden en vakantiemensen binnen het gezin.\n\nGeschikte eigenaar:\nDe Appenzeller is geschikt voor een ervaren hondenbaasje die tijd en energie heeft om hem structuur, beweging en een taak te bieden. Het ras is minder geschikt voor mensen zonder ervaring of met kleine kinderen, vanwege zijn waakzaamheid en hoge energie. Vroege socialisatie is cruciaal om hem aan verschillende situaties en andere dieren te laten wennen.\n\nGezondheid:\nAppenzellers kunnen gevoelig zijn voor erfelijke aandoeningen zoals heupdysplasie (HD), elleboogdysplasie (ED) en patella luxatie.\n\nVachtverzorging:\nDe dubbele vacht is onderhoudsarm en verhaart slechts enkele keren per jaar.\n\nMet kinderen en andere huisdieren:\nDe Appenzeller is vriendelijk tegenover kinderen in het gezin, maar kan waakszaam reageren als hij denkt dat kinderen ruw worden behandeld. Hij gaat goed samen met andere honden als hij als pup hiermee opgroeit, maar ruimt ruimte dominantie af bij tegenover andere honden.\n\nGelijknissen met je profiel:\n• Veel wandelen\n• Makkelijk trainbaar\n• Middelgroot`
  },
  cocker: {
    name: 'Engelse cocker spaniël',
    image: require('@/assets/images/cocker.png'),
    description: `Karakter:\nDe Engelse Cocker Spaniël is aanhankelijk, intelligent en enthousiast. Hij is vrolijk, vriendelijk en speels en houdt van gezelschap van zijn gezin. Hij leert snel en is gevoelig voor de toon van zijn baasje.\n\nAandachtspunten:\n• Cocker Spaniëls kunnen snel afgeleid raken, dus consequent trainen is belangrijk.\n• Ze hebben regelmatig mentale en fysieke uitdaging nodig.\n• Hun lange oren moeten goed verzorgd worden om infecties te voorkomen.\n\nGeschikte eigenaar:\nCocker Spaniëls zijn geschikt voor gezinnen die tijd hebben voor wandelingen, spelen en knuffelen. Ze zijn niet graag alleen en hebben een stabiele omgeving nodig.\n\nGezondheid:\nZe kunnen erfelijke aandoeningen hebben zoals oorontstekingen en staar.\n\nVachtverzorging:\nRegelmatig borstelen en professioneel plukken wordt aangeraden.\n\nMet kinderen en andere huisdieren:\nZe zijn zachtaardig en sociaal, en meestal vriendelijk naar andere huisdieren.\n\nGelijknissen met je profiel:\n• Gezelschapsdier\n• Lief en zachtaardig\n• Middelgroot`
  },
  jack: {
    name: 'Jack russell terriër',
    image: require('@/assets/images/jack.png'),
    description: `Karakter:\nDe Jack Russell Terriër is energiek, speels en leergierig. Hij is vriendelijk naar mensen, maar kan agressief zijn tegenover andere honden en kleine dieren.\n\nAandachtspunten:\n• Jack Russells houden van graven en hebben een sterke prooidrift.\n• Ze zijn springkrachtig en kunnen meer dan 1.5 meter springen.\n• Recente bluffen en agressie tegen andere honden kunnen een probleem zijn zonder vroege socialisatie.\n\nGeschikte eigenaar:\nDe Jack Russell is geschikt voor actieve eigenaren die veel tijd en energie hebben voor training en beweging.\n\nGezondheid:\nZe zijn gevoelig voor patella luxatie en doofheid.\n\nVachtverzorging:\n• Gladharig: Onderhoudsarm, af en toe borstelen.\n• Ruwharig: Plukken 2x per jaar.\n• Borstelen: Regelmatig borstelen na plukken.\n\nMet kinderen en andere huisdieren:\nJack Russells zijn energiek en kunnen goed omgaan met oudere kinderen die weten hoe ze met honden moeten omgaan.\n\nGelijknissen met je profiel:\n• Veel wandelen\n• Makkelijk trainbaar\n• Middelgroot`
  },
  border: {
    name: 'Border collie',
    image: require('@/assets/images/collie.png'),
    description: `Karakter:\nDe Border Collie is een intelligente energieke en hardwerkende hond die voortdurende mentale en fysieke uitdaging nodig heeft. Hij leert snel, is zeer gevoelig voor signalen van zijn eigenaar en heeft een sterk instinct om te hoeden. Zonder voldoende activiteiten kan verveling leiden tot hinderlijk gedrag zoals blaffen, graven of aandacht jagen van kinderen, katten of andere dieren.\n\nAandachtspunten:\n• Border Collies hebben dagelijkse mentale én fysieke uitdaging nodig, zoals sporten of spelletjes.\n• Zonder geestelijke uitlaatklep voor hun energie kunnen ze gedragsproblemen ontwikkelen.\n• Ze reageren sterk op subtiele commando’s van hun baasje.\n• Socialisatie: Vroege socialisatie is essentieel om angstige of overactieve reacties te voorkomen.\n\nGeschikte eigenaar:\nDe Border Collie is ideaal voor een actieve en ervaren eigenaar die tijd en energie wil investeren in training en activiteiten. Hij houdt van regels en consistentie en geniet als hij een verantwoordelijkheid krijgt.\n\nGezondheid:\nBorder Collies kunnen gevoelig zijn voor erfelijke aandoeningen zoals epilepsie, heupdysplasie, collie-oogafwijking (CEA). Regelmatige gezondheidscontroles zijn belangrijk.\n\nVachtverzorging:\nDe vacht van de Border Collie is kort tot middellang en vereist minimale verzorging. Tijdens de ruiperiode kan extra borstelen nodig zijn.\n\nMet kinderen en huisdieren:\nDe Border Collie kan een geweldige familiehond zijn en zich goed hechten aan oudere kinderen. Hij moet echter op jonge leeftijd wennen aan katten of andere huisdieren.\n\nGelijknissen met je profiel:\n• Veel wandelen\n• Makkelijk trainbaar\n• Middelgroot`
  }
};

function DogInfo() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dog = dogData[id as keyof typeof dogData];

  if (!dog) return <Text style={{ padding: 20 }}>Hond niet gevonden.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#183A36" />
        </TouchableOpacity>
        <Text style={styles.title}>{dog.name}</Text>
      </View>

      <Image source={dog.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.description}>{dog.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FDFCF9',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  title: {
    fontSize: 20,
    color: '#183A36',
    fontFamily: 'nunitoBold',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#183A36',
    fontFamily: 'nunitoRegular',
    lineHeight: 22,
  },
});

export default DogInfo;