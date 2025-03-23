import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Image, TouchableOpacity, Text } from 'react-native'
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
  //     setUploading(true)

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ['images'], // Restrict to only images
  //       allowsMultipleSelection: false, // Can only select one image
  //       allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
  //       quality: 1,
  //       exif: false, // We don't want nor need that data.
  //     })

  //     if (result.canceled || !result.assets || result.assets.length === 0) {
  //       console.log('User cancelled image picker.')
  //       return
  //     }

  //     const image = result.assets[0]
  //     console.log('Got image', image)

  //     if (!image.uri) {
  //       throw new Error('No image uri!') // Realistically, this should never happen, but just in case...
  //     }

  //     const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

  //     const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
  //     const path = `${Date.now()}.${fileExt}`
  //     const { data, error: uploadError } = await supabase.storage
  //       .from('avatars')
  //       .upload(path, arraybuffer, {
  //         contentType: image.mimeType ?? 'image/jpeg',
  //       })

  //     if (uploadError) {
  //       throw uploadError
  //     }

  //     onUpload(data.path)
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       Alert.alert(error.message)
  //     } else {
  //       throw error
  //     }
  //   } finally {
  //     setUploading(false)
  //   }
  // }
  async function uploadAvatar() {
    try {
      setUploading(true);

      // Vraag de gebruiker of ze de camera of galerij willen gebruiken
      Alert.alert(
        'Kies een foto',
        'Selecteer of maak een foto.',
        [
          { text: 'Camera', onPress: async () => await selectImage('camera') },
          { text: 'Galerij', onPress: async () => await selectImage('gallery') },
          { text: 'Annuleren', onPress: () => {} },
        ]
      );

      // Functie om de afbeelding te selecteren afhankelijk van de keuze
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
          console.log('User cancelled image picker.');
          return;
        }

        const image = result.assets[0];
        console.log('Got image', image);

        if (!image.uri) {
          throw new Error('No image uri!');
        }

        const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

        const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
        const path = `${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, arraybuffer, {
            contentType: image.mimeType ?? 'image/jpeg',
          });

        if (uploadError) {
          throw uploadError;
        }

        onUpload(data.path);
      };
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
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
          <Text style={styles.editButtonText}>{uploading ? 'Aan het laden ...' : 'VOEG FOTO TOE'}</Text>
        </TouchableOpacity>
      )}
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

})