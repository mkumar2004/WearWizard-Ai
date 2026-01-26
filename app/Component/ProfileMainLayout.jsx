import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProfileMainLayout = () => {
  return (
    <View style={styles.Content}>
      <Text>ProfileMainLayout</Text>
    </View>
  )
}

export default ProfileMainLayout

const styles = StyleSheet.create({
    Content:{
  
    backgroundColor:'white',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    bottom:10
    }
})