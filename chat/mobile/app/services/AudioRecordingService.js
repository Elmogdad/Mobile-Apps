import { Audio } from 'expo-av';

export const startRecording = async (setRecording, setIsRecording, setRecordingDuration, recordingInterval) => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    setRecording(recording);
    setIsRecording(true);

    setRecordingDuration(0);
    recordingInterval.current = setInterval(() => {
      setRecordingDuration((prevDuration) => prevDuration + 1);
    }, 1000);
  } catch (error) {
    console.error('خطأ في بدء التسجيل:', error);
    alert('حدث خطأ أثناء بدء التسجيل');
  }
};

export const stopRecording = async (recording, setMessages, setIsRecording, setRecording, recordingDuration, setRecordingDuration, recordingInterval) => {
  try {
    if (!recording) return;

    clearInterval(recordingInterval.current);
    recordingInterval.current = null;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    const newMessage = {
      id: Date.now(),
      type: 'audio',
      content: uri,
      sender: 'user',
      timestamp: new Date(),
      duration: recordingDuration,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setIsRecording(false);
    setRecording(null);
    setRecordingDuration(0);
  } catch (error) {
    console.error('خطأ في إيقاف التسجيل:', error);
    alert('حدث خطأ أثناء إيقاف التسجيل');
  }
};
