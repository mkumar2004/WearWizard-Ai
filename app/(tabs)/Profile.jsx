import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProfileBackground from '../Component/ProfileBackground'

import ProfileMainLayout from '../Component/ProfileMainLayout'

const Profile = () => {
  return (
    <View>
       <ProfileBackground/>
       <ProfileMainLayout/>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})