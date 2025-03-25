// import { useRouter, useLocalSearchParams } from "expo-router";
// import { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
// import { supabase } from '../../../../lib/supabase'; // Zorg ervoor dat je de Supabase-import hebt

// const ProfilePhoto = () => {
//   const router = useRouter();
//   const { imageUri } = useLocalSearchParams(); // Verkrijg de afbeelding URI uit de query
//   const [uploading, setUploading] = useState(false);

//   // Functie om de afbeelding te uploaden
//   const uploadImage = async () => {
//     if (!imageUri) {
//       Alert.alert('Geen afbeelding gekozen', 'Er is geen afbeelding gekozen om te uploaden');
//       return;
//     }

//     try {
//       setUploading(true);

//       // Zet de afbeelding om naar een arraybuffer voor uploaden
//       const arraybuffer = await fetch(imageUri as string).then((res) => res.arrayBuffer());

//       const fileExt = (imageUri as string).split('.').pop()?.toLowerCase() ?? 'jpeg';
//       const path = `${Date.now()}.${fileExt}`;

//       const { data, error: uploadError } = await supabase.storage
//         .from('avatars') // Zorg ervoor dat de bucketnaam correct is
//         .upload(path, arraybuffer, {
//           contentType: 'image/jpeg', // Of gebruik de juiste mime type
//         });

//       if (uploadError) {
//         throw uploadError;
//       }

//       // Als de upload succesvol is, stuur de gebruiker naar profileEdit
//       router.push('/profile/profileEdit/profileEdit');
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       Alert.alert('Upload mislukt', 'Er is iets mis gegaan met het uploaden van je foto.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const confirmImage = () => {
//     uploadImage(); // Hier wordt de uploadImage functie aangeroepen alleen als de gebruiker bevestigt
//   };

//   const cancelSelection = () => {
//     // Alleen als je annuleert, ga naar profiel bewerken zonder uploaden
//     router.push('/profile/profileEdit/profileEdit');
//   };

//   return (
//     <View style={{ alignItems: 'center', marginTop: 50 }}>
//       <Text>Bevestig je foto</Text>
//       {imageUri && <Image source={{ uri: imageUri as string }} style={{ width: 200, height: 200 }} />}
      
//       {/* Confirm button */}
//       <TouchableOpacity onPress={confirmImage} style={{ marginTop: 20, backgroundColor: 'green', padding: 10 }} disabled={uploading}>
//         <Text style={{ color: 'white' }}>{uploading ? 'Bezig met uploaden...' : 'Bevestig'}</Text>
//       </TouchableOpacity>

//       {/* Cancel button */}
//       <TouchableOpacity onPress={cancelSelection} style={{ marginTop: 10, backgroundColor: 'red', padding: 10 }}>
//         <Text style={{ color: 'white' }}>Annuleren</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default ProfilePhoto;
