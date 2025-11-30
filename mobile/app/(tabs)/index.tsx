import React, { useState } from "react";
import { ScrollView, Alert, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import ImagePreview from "../../components/analysis/ImagePreview";
import ImagePlaceholder from "../../components/analysis/ImagePlaceholder";
import ActionButtons from "../../components/analysis/ActionButtons";
import TipsCard from "../../components/analysis/TipsCard";
import ScreenHeader from "../../components/common/ScreenHeader";

export default function AnalysisScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập thư viện ảnh"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Cần quyền truy cập", "Vui lòng cấp quyền sử dụng camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = () => {
    console.log("Analyzing image:", selectedImage);
    // TODO: Call analysis API
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["bottom"]}>
      <ScreenHeader title="Phân tích da" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        showsVerticalScrollIndicator={false}
      >
        {selectedImage ? (
          <ImagePreview
            imageUri={selectedImage}
            onRemove={() => setSelectedImage(null)}
            onAnalyze={handleAnalyze}
          />
        ) : (
          <ImagePlaceholder />
        )}

        <ActionButtons onTakePhoto={takePhoto} onPickImage={pickImage} />

        <TipsCard />
      </ScrollView>
    </SafeAreaView>
  );
}
