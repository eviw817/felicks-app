import { View, Text, Pressable } from 'react-native';

export default function Demo() {
  return (
    <View 
    style={{
      flex: 1,
      paddingTop: 80,
      alignItems: 'center',
      backgroundColor: '#FFFDF9',
      }}>
      <Text>Cooper</Text>

{/* viro box */}

      <Pressable
        style={({ 
          padding: 8,
          backgroundColor: '#183A36',
          borderRadius: 7
         })}
        onPress={() => {
          console.log('Wandelen knop ingedrukt!');
        }}
      >
        <Text
        style={{          
          color: '#97B8A5',
        }}
        >Wandelen</Text>
      </Pressable>
    </View>
  );
}