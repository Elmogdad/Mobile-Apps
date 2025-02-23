import React, { useState, useRef, useEffect } from 'react';
import { I18nManager } from 'react-native';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Platform,
  KeyboardAvoidingView,
  
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingMessageId, setPlayingMessageId] = useState(null); // ID الرسالة الصوتية قيد التشغيل
  const [playbackPosition, setPlaybackPosition] = useState(0); // موقع التشغيل الحالي
  const [playbackDuration, setPlaybackDuration] = useState(0); // مدة الرسالة الصوتية
  const flatListRef = useRef(null);
  const recordingInterval = useRef(null);

  // عكس الاتجاه للغة العربية
  I18nManager.forceRTL(true);

  // تنظيف ملف الصوت عند إغلاق المكون
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // طلب الأذونات
  const requestPermissions = async () => {
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

  useEffect(() => {
    requestPermissions();
  }, []);

  // اختيار المرفقات (صور/فيديوهات)
  const handleAttachment = async () => {
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

  // بدء تسجيل الصوت
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);

      // بدء مؤقت التسجيل
      setRecordingDuration(0);
      recordingInterval.current = setInterval(() => {
        setRecordingDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } catch (error) {
      console.error('خطأ في بدء التسجيل:', error);
      alert('حدث خطأ أثناء بدء التسجيل');
    }
  };

  // إيقاف تسجيل الصوت
  const stopRecording = async () => {
    try {
      if (!recording) return;

      // إيقاف المؤقت
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;

      // إيقاف التسجيل
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // إضافة التسجيل كرسالة جديدة
      const newMessage = {
        id: Date.now(),
        type: 'audio',
        content: uri,
        sender: 'user',
        timestamp: new Date(),
        duration: recordingDuration, // إضافة مدة التسجيل
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // إعادة الضبط
      setIsRecording(false);
      setRecording(null);
      setRecordingDuration(0);
    } catch (error) {
      console.error('خطأ في إيقاف التسجيل:', error);
      alert('حدث خطأ أثناء إيقاف التسجيل');
    }
  };

  // تشغيل أو إيقاف الرسالة الصوتية
  const togglePlayback = async (message) => {
    try {
      if (playingMessageId === message.id) {
        // إذا كانت الرسالة قيد التشغيل، نوقفها
        await sound.stopAsync();
        setPlayingMessageId(null);
        setPlaybackPosition(0);
      } else {
        // إذا كانت رسالة أخرى قيد التشغيل، نوقفها أولاً
        if (sound) {
          await sound.stopAsync();
        }

        // تشغيل الرسالة الجديدة
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: message.content },
          { shouldPlay: true }
        );
        setSound(newSound);
        setPlayingMessageId(message.id);

        // الحصول على مدة الرسالة الصوتية
        const status = await newSound.getStatusAsync();
        setPlaybackDuration(status.durationMillis);

        // تحديث موقع التشغيل كل 500 ميلي ثانية
        const interval = setInterval(async () => {
          const playbackStatus = await newSound.getStatusAsync();
          if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            setPlaybackPosition(playbackStatus.positionMillis);
          } else {
            clearInterval(interval);
            setPlayingMessageId(null);
            setPlaybackPosition(0);
          }
        }, 500);
      }
    } catch (error) {
      console.error('خطأ في تشغيل الرسالة الصوتية:', error);
      alert('حدث خطأ أثناء تشغيل الرسالة الصوتية');
    }
  };

  // عرض الرسائل
  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.teacherMessage]}>
        {item.type === 'text' && (
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.teacherMessageText]}>
            {item.content}
          </Text>
        )}

        {item.type === 'image' && (
          <Image source={{ uri: item.content }} style={styles.mediaContent} resizeMode="cover" />
        )}

        {item.type === 'audio' && (
          <TouchableOpacity
            style={styles.audioContainer}
            onPress={() => togglePlayback(item)}
          >
            <Ionicons
              name={playingMessageId === item.id ? 'pause-circle' : 'play-circle'}
              size={24}
              color={isUser ? '#fff' : '#000'}
            />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={item.duration * 1000 || 1}
              value={playingMessageId === item.id ? playbackPosition : 0}
              onSlidingComplete={async (value) => {
                if (sound) {
                  await sound.setPositionAsync(value);
                }
              }}
              minimumTrackTintColor="#422EFF"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#422EFF"
            />
            <Text style={[styles.audioText, isUser ? styles.userAudioText : styles.teacherAudioText]}>
              {formatTime(item.duration || 0)}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.teacherTimestamp]}>
          {new Date(item.timestamp).toLocaleTimeString('ar-SA')}
        </Text>
      </View>
    );
  };

  // تنسيق الوقت
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>راندي ويغام</Text>
        <View style={styles.headerSpace} />
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        style={styles.messagesList}
      />

      {/* Input Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          {/* زر الإرسال */}
          <TouchableOpacity
            onPress={() => {
              if (inputText.trim()) {
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    id: Date.now(),
                    type: 'text',
                    content: inputText.trim(),
                    sender: 'user',
                    timestamp: new Date(),
                  },
                ]);
                setInputText('');
              }
            }}
            style={styles.iconButton}
          >
            <Ionicons name="send" size={24} color="#422EFF" />
          </TouchableOpacity>

          {/* مربع النص */}
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="اكتب رسالتك هنا..."
            placeholderTextColor="#666"
            multiline
            maxLength={1000}
          />

          {/* زر التسجيل الصوتي */}
          <TouchableOpacity
            onPressIn={startRecording}
            onPressOut={stopRecording}
            style={styles.iconButton}
          >
            <Ionicons name={isRecording ? 'mic' : 'mic-outline'} size={24} color={isRecording ? 'red' : '#666'} />
          </TouchableOpacity>

          {/* زر إضافة المرفقات */}
          <TouchableOpacity onPress={handleAttachment} style={styles.iconButton}>
            <Ionicons name="attach" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* مؤشر زمني للتسجيل */}
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <Text style={styles.timerText}>{formatTime(recordingDuration * 1000)}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

// الأنماط
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'right',
  },
  headerSpace: {
    width: 24,
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#422EFF',
  },
  teacherMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E9ECEF',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'right',
  },
  userMessageText: {
    color: '#fff',
  },
  teacherMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  teacherTimestamp: {
    color: 'rgba(0,0,0,0.5)',
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  iconButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    maxHeight: 100,
    color: '#000',
    textAlign: 'right',
  },
  mediaContent: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 4,
  },
  audioContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
  },
  audioText: {
    marginLeft: 8,
    textAlign: 'right',
  },
  userAudioText: {
    color: '#fff',
  },
  teacherAudioText: {
    color: '#000',
  },
  recordingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default ChatScreen;