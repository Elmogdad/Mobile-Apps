import { Audio } from 'expo-av';

export const togglePlayback = async (message, sound, setSound, playingMessageId, setPlayingMessageId, setPlaybackPosition, setPlaybackDuration) => {
  try {
    if (playingMessageId === message.id) {
      await sound.stopAsync();
      setPlayingMessageId(null);
      setPlaybackPosition(0);
    } else {
      if (sound) {
        await sound.stopAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: message.content },
        { shouldPlay: true }
      );
      setSound(newSound);
      setPlayingMessageId(message.id);

      const status = await newSound.getStatusAsync();
      setPlaybackDuration(status.durationMillis);

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
