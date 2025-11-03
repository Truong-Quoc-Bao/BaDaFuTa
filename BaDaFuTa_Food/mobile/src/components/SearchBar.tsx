import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Search size={20} color="#9CA3AF" style={styles.icon} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Tìm kiếm món ăn..."
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  inner: {
    position: 'relative',
    maxWidth: 400,
    alignSelf: 'center',
  },
  icon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  input: {
    height: 40,
    paddingLeft: 36,
    paddingRight: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
});
