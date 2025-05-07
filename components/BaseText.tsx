import React from 'react';
import { Text, TextProps } from 'react-native';


export default function BaseText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: 'Nunito-SemiBold',
          fontSize: 16,
          color: '#183A36',
          textAlign: 'left',
        },
        props.style,
      ]}
    />
  );
}
