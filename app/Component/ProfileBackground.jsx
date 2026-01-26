import { StatusBar, StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Profipic from './Profipic';
const ProfileBackground = () => {
  return (
    <View style={styles.Background}>
     <StatusBar barStyle="light-content" />

     <TouchableOpacity style={styles.icon}>
         <FontAwesome6 name="share-square" size={24} color="white" />
        </TouchableOpacity>
     
     <View style={styles.pic}>
        <Profipic/>  
     </View>
     
    </View>
  )
}

export default ProfileBackground

const styles = StyleSheet.create({
  Background: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
    backgroundColor:'#5F4DFF',
    
  },
 icon: {
  marginTop: '25%',
  alignSelf: 'flex-start',   
  marginLeft: '80%',            
  borderRadius: 50,
  backgroundColor: '#AA94F9',
  width: 50,
  height: 40,
  justifyContent: 'center',  
  alignItems: 'center', 
},
 pic:{
    bottom:40,
    left:20
 }
})