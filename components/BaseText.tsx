// components/BaseText.tsx
import React from 'react'
import { Text, TextProps, View, ActivityIndicator } from 'react-native'
import { useFonts } from 'expo-font'


type Variant = 'text' | 'title'

interface BaseTextProps extends TextProps {
  variant?: Variant
}

export default function BaseText({ variant = 'text', style, ...rest }: BaseTextProps) {
 
  const [fontsLoaded] = useFonts({

    'Nunito-Regular':            require('../assets/fonts/nunito/Nunito-Regular.ttf'),
    'Nunito-Italic':             require('../assets/fonts/nunito/Nunito-Italic.ttf'),

    'Nunito-Light':              require('../assets/fonts/nunito/Nunito-Light.ttf'),
    'Nunito-LightItalic':        require('../assets/fonts/nunito/Nunito-LightItalic.ttf'),

    'Nunito-Medium':             require('../assets/fonts/nunito/Nunito-Medium.ttf'),
    'Nunito-MediumItalic':       require('../assets/fonts/nunito/Nunito-MediumItalic.ttf'),

    'Nunito-SemiBold':           require('../assets/fonts/nunito/Nunito-SemiBold.ttf'),
    'Nunito-SemiBoldItalic':     require('../assets/fonts/nunito/Nunito-SemiBoldItalic.ttf'),

    'Nunito-Bold':               require('../assets/fonts/nunito/Nunito-Bold.ttf'),
    'Nunito-BoldItalic':         require('../assets/fonts/nunito/Nunito-BoldItalic.ttf'),

    'Nunito-ExtraLight':         require('../assets/fonts/nunito/Nunito-ExtraLight.ttf'),
    'Nunito-ExtraLightItalic':   require('../assets/fonts/nunito/Nunito-ExtraLightItalic.ttf'),

    'Nunito-ExtraBold':          require('../assets/fonts/nunito/Nunito-ExtraBold.ttf'),
    'Nunito-ExtraBoldItalic':    require('../assets/fonts/nunito/Nunito-ExtraBoldItalic.ttf'),

    'Sirenia-Medium':            require('../assets/fonts/Sirenia/Sirenia_medium.ttf'),
    'Sirenia-Regular':           require('../assets/fonts/Sirenia/Sirenia_regular.ttf'),
    'Sirenia-SemiBold':            require('../assets/fonts/Sirenia/Sirenia_SemiBold.ttf'),


  })


  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }


  const variantStyles = {   
    text: {
      fontFamily: 'Nunito-Regular',//standaardstijl
      fontSize: 16,
      color: '#183A36',
    },
    title: {
      fontFamily: 'Sirenia-Medium',
      fontSize: 24,
      color: '#183A36',
    },
  } as const

  return (
    <Text
      {...rest}
      style={[variantStyles[variant], style]}
    />
  )
}
