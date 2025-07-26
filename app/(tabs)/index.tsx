import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { extractTextFromImage, isSupported } from "expo-text-extractor";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string>();
  const [result, setResult] = useState<string[]>([]);

  const handleImagePick = async () => {
    const perm = await requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert("Permission denied");
    const res = await launchImageLibraryAsync({ mediaTypes: ["images"] });
    if (res.canceled || !res.assets?.length) return;
    const uri = res.assets[0].uri;
    setImageUri(uri);

    if (isSupported && uri) {
      try {
        const texts = await extractTextFromImage(uri);
        setResult(texts);
      } catch (e) {
        Alert.alert("Error", (e as Error).message);
      }
    } else {
      Alert.alert("OCR not supported on this device");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.pickButton} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Pick an image</Text>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} />
        )}
      </TouchableOpacity>
      <ScrollView style={styles.results}>
        {result.map((line, i) => (
          <Text key={i}>{line}</Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eee", padding: 16 },
  pickButton: {
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontSize: 20, color: "#555" },
  results: { flex: 1, backgroundColor: "#fff", borderRadius: 8, padding: 16 },
});
