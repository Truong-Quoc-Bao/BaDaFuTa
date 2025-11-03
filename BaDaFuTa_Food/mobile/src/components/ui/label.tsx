import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface LabelProps {
  children: React.ReactNode;
  style?: object;
  disabled?: boolean;
}

export const Label: React.FC<LabelProps> = ({ children, style, disabled }) => {
  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Text style={[styles.text, style]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // tương tự "gap-2"
  },
  text: {
    fontSize: 14, // text-sm
    lineHeight: 16,
    fontWeight: '500', // font-medium
    color: '#111827', // default màu text
  },
  disabled: {
    opacity: 0.5,
  },
});
