import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

export const requestPermissions = async () => {
  try {
    if (Platform.OS !== 'web') {
      const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Audio.requestPermissionsAsync();

      if (imageStatus !== 'granted' || cameraStatus !== 'granted' || audioStatus !== 'granted') {
        alert('عذراً، نحتاج إلى الصلاحيات لتشغيل هذه الميزات!');
      }
    }
  } catch (error) {
    console.error('خطأ في طلب الصلاحيات:', error);
  }
};
