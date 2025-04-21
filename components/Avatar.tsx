import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Image, TouchableOpacity, Text, Modal, Pressable } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

interface Props {
  size: number
  url: string | null
  onUpload: (filePath: string) => void
  showUploadButton?: boolean
}

export default function Avatar({ url, size = 150, onUpload, showUploadButton = true  }: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);  
  const avatarSize = { height: size, width: size }

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  // async function uploadAvatar() {
  //   try {
  //     setUploading(true);

  //     // Vraag de gebruiker of ze de camera of galerij willen gebruiken
  //     Alert.alert(
  //       'Kies een foto',
  //       'Selecteer of maak een foto of verwijder de huidige.',
  //       [
  //         { text: 'Camera', onPress: async () => await selectImage('camera') },
  //         { text: 'Galerij', onPress: async () => await selectImage('gallery') },
  //         { text: 'Annuleren', onPress: () => {}, style: 'cancel' }, 
  //         { text: 'Verwijderen', onPress: handleRemoveAvatar },
  //       ]
  //     );

  //     // Functie om de afbeelding te selecteren afhankelijk van de keuze
  //     const selectImage = async (source: 'camera' | 'gallery') => {
  //       let result;
  //       if (source === 'camera') {
  //         result = await ImagePicker.launchCameraAsync({
  //           mediaTypes: ['images'], 
  //           allowsEditing: true,
  //           quality: 1,
  //         });
  //       } else {
  //         result = await ImagePicker.launchImageLibraryAsync({
  //           mediaTypes: ['images'], 
  //           allowsEditing: true,
  //           quality: 1,
  //         });
  //       }

  //       if (result.canceled || !result.assets || result.assets.length === 0) {
  //         console.log('User cancelled image picker.');
  //         return;
  //       }

  //       const image = result.assets[0];
  //       console.log('Got image', image);

  //       if (!image.uri) {
  //         throw new Error('No image uri!');
  //       }

  //       const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

  //       const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
  //       const path = `${Date.now()}.${fileExt}`;
  //       const { data, error: uploadError } = await supabase.storage
  //         .from('avatars')
  //         .upload(path, arraybuffer, {
  //           contentType: image.mimeType ?? 'image/jpeg',
  //         });

  //       if (uploadError) {
  //         throw uploadError;
  //       }

  //       onUpload(data.path);
  //     };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       Alert.alert(error.message);
  //     } else {
  //       throw error;
  //     }
  //   } finally {
  //     setUploading(false);
  //   }
  // }

  // const handleRemoveAvatar = async () => {
  //   try {
  //     setUploading(true);
  //     if (!url) return;
  
  //     const path = url.split('/').pop();
  //     const { error } = await supabase.storage.from('avatars').remove([path ?? '']);
  
  //     if (error) throw error;
  
  //     setAvatarUrl(null);
  //     onUpload('');
  //     Alert.alert('Verwijderd', 'Je foto is succesvol verwijderd.');
  //   } catch (error) {
  //     if (error instanceof Error) Alert.alert('Fout', error.message);
  //     else throw error;
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  async function uploadAvatar() {
    try {
      setUploading(true)

      // Open the modal to choose the image source (camera, gallery or remove)
      setModalVisible(true)
      
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      } else {
        throw error
      }
    } finally {
      setUploading(false)
    }
  }

  // Function to select image from camera or gallery
  const selectImage = async (source: 'camera' | 'gallery') => {
    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });
    }

    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log('User cancelled image picker.')
      return
    }

    const image = result.assets[0]
    const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

    const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpeg'
    const path = `${Date.now()}.${fileExt}`
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, arraybuffer, {
        contentType: image.mimeType ?? 'image/jpeg',
      })

    if (uploadError) {
      throw uploadError
    }

    onUpload(data.path)
    setModalVisible(false) // Close the modal after uploading
  }

  // Function to handle avatar removal
  const handleRemoveAvatar = async () => {
    if (!url) return

    const path = url.split('/').pop()
    const { error } = await supabase.storage.from('avatars').remove([path ?? ''])

    if (error) throw error

    setAvatarUrl(null)
    onUpload('')
    setModalVisible(false) // Close modal after removing image
    Alert.alert('Verwijderd', 'Je foto is succesvol verwijderd.')
  }

  

  return (
    <View style={styles.avatarContainer}>
    {avatarUrl ? (
      <Image
        source={{ uri: avatarUrl }}
        accessibilityLabel="Avatar"
        style={[avatarSize, styles.avatar, styles.image]}
      />
    ) : (
      <View style={[avatarSize, styles.avatar, styles.noImage]} />
    )}

    {showUploadButton && (
        <TouchableOpacity style={styles.editButton} onPress={uploadAvatar} disabled={uploading}>
          <Text style={styles.editButtonText}> {avatarUrl ? 'FOTO BEWERKEN' : (uploading ? 'Aan het laden ...' : 'VOEG FOTO TOE')}</Text>
        </TouchableOpacity>
      )}

        {/* Modal for choosing camera, gallery, or remove */}
        <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Close modal on back press (Android)
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kies een foto</Text>
            <Text style={styles.modalTitle}>Selecteer of maak een foto of verwijder de huidige.</Text>
            <TouchableOpacity onPress={() => selectImage('camera')}>
              <Text style={styles.modalButton}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectImage('gallery')}>
              <Text style={styles.modalButton}>Galerij</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRemoveAvatar}>
              <Text style={styles.modalButton}>Verwijderen foto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonAnnuleer}>Annuleren</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> 
  </View>
  )
  
}

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderRadius: 100,
    overflow: 'hidden',
    maxWidth: '100%',
    marginRight: 30,
    marginTop: 10,
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: '#ddd',
    borderRadius: 100,
    marginRight: 30,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#8AB89D",
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  editButtonText: {
    color: '#183A36',
    fontWeight: "bold",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 40, 
    paddingHorizontal: 70,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButton: {
    fontSize: 16,
    color: '#8AB89D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalButtonAnnuleer:{
    fontSize: 16,
    color: '#183A36',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    textAlign: 'center',
  }
})