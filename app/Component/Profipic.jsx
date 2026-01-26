import { StyleSheet, Text, View ,Image} from 'react-native'
import React from 'react'

const Profipic = () => {
  return (
    <View style={styles.content}>
        <Image source={require('../../assets/images/Map.png')} style={styles.image} />
    </View>
  )
}

export default Profipic

const styles = StyleSheet.create({
    content:{
        borderRadius:50,
        width:100,
        height:100,
        backgroundColor:'white',
       
    },
    image:{
        width:90,
        height:90,
        borderRadius:45,
        margin:5
    }
})