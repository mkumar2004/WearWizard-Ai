import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
const TabsLayout = () => {
  return (
    <Tabs screenOptions={{headerShown:false
      ,  tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: 'gray',
    }}
      
    >
        <Tabs.Screen 
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
             <MaterialCommunityIcons name="home-circle-outline" size={size} color={color} />
          )
        }}
        />
        <Tabs.Screen name="Chat" 
           options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="qqchat" size={size} color={color} />
          )
        }}
        />
        <Tabs.Screen name="Me"
            options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="phoenix-framework" size={size} color={color} />
          )
        }}
        />
        <Tabs.Screen name="Goals" 
            options={{
          tabBarIcon: ({ color, size }) => (
            <Octicons name="goal" size={size} color={color} />
          )
        }}
        />
        <Tabs.Screen name="Profile" 
            options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          )
        }}
        />
    </Tabs>
  )
}

export default TabsLayout