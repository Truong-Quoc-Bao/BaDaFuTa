import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  style?: object;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  style,
}) => {
  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    backgroundColor: '#E5E7EB', // màu giống Tailwind gray-200
  },
  vertical: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
});
