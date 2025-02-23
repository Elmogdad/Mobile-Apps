import * as ImagePicker from 'expo-image-picker';

export const handleAttachment = async (setMessages) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const newMessage = {
        id: Date.now(),
        type: result.assets[0].type === 'video' ? 'video' : 'image',
        content: result.assets[0].uri,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  } catch (error) {
    console.error('خطأ في اختيار الملف:', error);
    alert('حدث خطأ أثناء اختيار الملف');
  }
};
