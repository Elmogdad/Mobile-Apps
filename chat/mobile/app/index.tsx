import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppointmentSceen from './screens/AppointmentScreen'
import Chat from './screens/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <Stack.Navigator initialRouteName="Appointment" screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Appointment' component={AppointmentSceen}/>
            <Stack.Screen name='Chat' component={Chat}/>
        </Stack.Navigator>
    );
}