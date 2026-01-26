import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Logo from "../../assets/images/Travellogo.svg";
import { Image } from "react-native";

const LoginSetup = () => {
  return ( 
    <View>
      <View style={styles.LogoContent}>
        <Logo width={400} height={250} />
      </View>

      <View style={styles.TopContainer}>
        <Image
          source={require('../../assets/Animation/LogoParo.gif')}
          style={{ width: 100, height: 100 }}
        />
        <Image
          source={require('../../assets/Animation/LogoParo.gif')}
          style={{ width: 100, height: 100 }}
        />
      </View>

      <View style={styles.BottContent}>
        <Image
        source={require('../../assets/Animation/LogoParo.gif')}
        style={{ width: 120, height: 120 }}
      />
      <Image
        source={require('../../assets/Animation/LogoParo.gif')}
        style={{ width: 120, height: 120 }}
      />
      </View>
     


    </View>
  )
}

export default LoginSetup

const styles = StyleSheet.create({
  LogoContent: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
    borderRadius:'70%',
  },
  TopContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap:'40%',
   
    bottom:90
  },
  BottContent:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginTop:290
  }
})