import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScheduledAppointment = ({ title, date, time, period }) => {
  return (
    <View style={styles.appointmentDetails}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.time}>{time} ({period})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appointmentDetails: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right', // توجيه النص لليمين
  },
  date: {
    fontSize: 16,
    color: '#555',
    textAlign: 'right', // توجيه النص لليمين
  },
  time: {
    fontSize: 16,
    color: '#555',
    textAlign: 'right', // توجيه النص لليمين
  },
});

export default ScheduledAppointment;