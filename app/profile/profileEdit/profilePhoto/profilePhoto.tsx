// import { View, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';
// import { supabase } from '../../../../lib/supabase';
// import { FileObject } from '@supabase/storage-js';
// import ImageItem from '../../../../components/Avatar'; // Zorg ervoor dat dit correct wordt geïmporteerd

// const List = () => {
//   const [user, setUser] = useState<any>(null);
//   const [files, setFiles] = useState<FileObject[]>([]);
//   const [session, setSession] = useState<any | null>(null);

//   const fetchSession = async () => {
//     const { data: { session } } = await supabase.auth.getSession();
//     console.log('Fetched session:', session);
//     setSession(session);

//     if (session) {
//       setUser(session.user);
//     }
//   };

//   useEffect(() => {
//     fetchSession();
//   }, []);

//   useEffect(() => {
//     if (!user) return;

//     console.log('User loaded:', user);

//     loadImages();
//   }, [user]);

//   const loadImages = async () => {
//     if (!user) return;

//     console.log('Loading images for user:', user.id);

//     const { data, error } = await supabase.storage.from('avatars').list(user!.id);

//     if (error) {
//       console.log('Error loading images:', error.message);
//       return;
//     }

//     console.log('Loaded images:', data);
//     if (data) {
//       setFiles(data);
//     }
//   };

//   const onSelectImage = async () => {
//     const options: ImagePicker.ImagePickerOptions = {
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,  // Correcte waarde
//       allowsEditing: true,
//     };

//     const result = await ImagePicker.launchImageLibraryAsync(options);

//     if (!result.canceled) {
//       const img = result.assets[0];
//       const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
//       const filePath = `${user!.id}/${new Date().getTime()}.${img.type === 'image' ? 'png' : 'mp4'}`;
//       const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';
//       await supabase.storage.from('avatars').upload(filePath, base64, { contentType });
//       loadImages();
//     }
//   };

//   const onRemoveImage = async (item: FileObject, listIndex: number) => {
//     const { error } = await supabase.storage.from('avatars').remove([`${user!.id}/${item.name}`]);
//     if (error) {
//       console.log('Error removing image:', error.message);
//       return;
//     }
//     const newFiles = [...files];
//     newFiles.splice(listIndex, 1);
//     setFiles(newFiles);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         {files.length === 0 ? (
//           <Text style={{ color: 'white' }}>Geen afbeeldingen beschikbaar</Text>
//         ) : (
//           files.map((item, index) => (
//             <ImageItem
//               key={item.id}
//               item={item}
//               userId={user!.id}
//               onRemoveImage={() => onRemoveImage(item, index)}
//             />
//           ))
//         )}
//       </ScrollView>

//       {/* FAB to add images */}
//       <TouchableOpacity onPress={onSelectImage} style={styles.fab}>
//         <Ionicons name="camera-outline" size={30} color={'#fff'} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#151515',
//   },
//   fab: {
//     borderWidth: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 70,
//     position: 'absolute',
//     bottom: 40,
//     right: 30,
//     height: 70,
//     backgroundColor: '#2b825b',
//     borderRadius: 100,
//   },
// });

// export default List;
