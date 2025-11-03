import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

function Avatar({ style, children, ...props }) {
  return (
    <View style={[styles.avatar, style]} {...props}>
      {children}
    </View>
  );
}

function AvatarImage({ style, ...props }) {
  return <Image style={[styles.avatarImage, style]} {...props} />;
}

function AvatarFallback({ style, children, ...props }) {
  return (
    <View style={[styles.avatarFallback, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    overflow: "hidden",
    backgroundColor: "#ccc",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
});

export { Avatar, AvatarImage, AvatarFallback };
