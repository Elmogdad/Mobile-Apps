import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, I18nManager } from 'react-native';
import TeacherCard from '../../components/TeacherCard'
import ScheduledAppointment from '../../components/ScheduledAppointment';
import TextButton from '../../components/PrimaryButton';
import PackageDetails from '../../components/PackageDetails';
import { useNavigation } from '@react-navigation/native';

const AppointmentScreen = () => {

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
      // يجب إعادة تشغيل التطبيق بعد تغيير الاتجاه.
    }
  }, []);
  
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerIcon}>💬</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>مواعيدي</Text>
        <TouchableOpacity>
        <Text style={styles.headerIcon}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <TeacherCard
        name={'راندي ويغام'}
        title={'أحياء'}
        rating={4.8}
        reviews={200}
        price={200}
        style={styles.teacherCard}
      />

      {/* Appointment Details */}
      <ScheduledAppointment 
        title={'موعدي المجدول القادم'}
        date={'الأربعاء، ١٢ مايو ٢٠٥'}
        time={'٤:٠٠ مساءً - ٤:٣٠ مساءً'} 
        period={'٣٠ دقيقة'}
      />

      {/* Package Section */}
      <PackageDetails 
        title={'الرسائل'}
        subtitle={'الرسائل مع الاستاذ'}
        price={'١٠٠ ر.س'}
        paidLabel={'مدفوع'}
      />

      {/* Bottom Button */}
      <TextButton 
        title='تبدأ الرسائل عند (٤:٠٠ مساءً)'
        style={styles.messagingButton}
        onPress={() => navigation.navigate('Chat')}
      /> 
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagingButton : {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  teacherCard : {
    
  },
});

export default AppointmentScreen;