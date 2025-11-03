import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MapPin, ChevronRight, Search } from "lucide-react-native";

interface HeaderProps {
  cartCount: number;
  onMenuClick: () => void;
  onCartClick: () => void;
  onSearchClick?: () => void;
  onLocationClick?: () => void;
}

export function Header({ cartCount, onMenuClick, onCartClick, onSearchClick, onLocationClick }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {/* Top section with location */}
        <View style={styles.locationSection}>
          <Text style={styles.label}>Giao đến:</Text>
          <TouchableOpacity onPress={onLocationClick} style={styles.locationButton}>
            <MapPin size={20} color="white" />
            <Text style={styles.locationText} numberOfLines={1}>
              Chung Cư Mizuki Flora, Số 10.06 Block Mp,...
            </Text>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <TouchableOpacity onPress={onSearchClick} style={styles.searchButton}>
          <Search size={20} color="#FF6900" />
          <Text style={styles.searchText} numberOfLines={1}>
            Bữa Tối No Nê, Freeship 0Đ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // position: 'absolute', // để tràn lên trên
    top: -50,
    width: '100%',
    backgroundColor: "#EA580C", // orange-700
    paddingTop: 50, // notch
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: -50,
    // zIndex: 50,
  
    // // Shadow iOS
    // shadowColor: "#EA580C",
    // shadowOffset: { width: 0, height: 10 },
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
  
    // // Shadow Android
    // elevation: 3,
  
    // // Nếu muốn viền mờ đơn giản
    // borderBottomColor: 'rgba(200,100,50,0.05)',
    // borderBottomWidth: 1,
  },
  
  
  container: {
    width: '100%',
  },
  locationSection: {
    marginBottom: 12,
  },
  label: {
    color: "white",
    fontSize: 12,
    marginBottom: 4,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  locationText: {
    flex: 1,
    color: "white",
    fontSize: 12,
    marginHorizontal: 4,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "white",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchText: {
    flex: 1,
    color: "#FF6900",
    fontSize: 12,
  },
});
