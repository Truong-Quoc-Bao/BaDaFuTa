import React, { useState } from 'react';
import { Image, View, StyleSheet, ImageStyle } from 'react-native';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

interface ImageWithFallbackProps {
  src: string;
  style?: ImageStyle;
  fallbackStyle?: ImageStyle;
  [key: string]: any;
}

export function ImageWithFallback({
  src,
  style,
  fallbackStyle,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  return (
    <View style={[{ justifyContent: 'center', alignItems: 'center' }, style]}>
      <Image
        source={{ uri: didError ? ERROR_IMG_SRC : src }}
        style={[{ width: 80, height: 80, borderRadius: 8 }, fallbackStyle]}
        resizeMode="cover"
        onError={() => setDidError(true)}
        {...rest}
      />
    </View>
  );
}
