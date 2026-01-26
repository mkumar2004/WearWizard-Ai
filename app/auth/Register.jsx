import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import LoginSetup from '../Component/LoginSteup';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useRouter} from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux'
import {RegisterUser} from '../../src/redux/slice/Auth'
const Register = () => {
  const [showpassword, SetShowpassword] = useState(false);

  const [Registerdata,SetRegisterdata] = useState({
    username:'',
    email:'',
    password:''

  })
  const dispatch = useDispatch()
  const {user, loading } = useSelector((state) => state.auth)
 
 const route=useRouter();
 const HandleChange = (name,value)=>{
     SetRegisterdata(prev=>({...prev,[name]:value}))
 }

 const HandleRegister = async () => {
     if (!Registerdata.email || !Registerdata.password || !Registerdata.username) {
       Toast.show({ type: 'error', text1: 'Fill the Registeration' })
       return
     }
 
     const result = await dispatch(RegisterUser(Registerdata))
 
     if (RegisterUser.fulfilled.match(result)) {
       Toast.show({
          type: 'success',
           text1: 'Register Successful',
           text2:'Travel Wizard'
          })
       SetRegisterdata({ email: '', password: '' ,username:''})
       route.replace('(tabs)/Home')
     } else {
       Toast.show({
         type: 'error',
         text1: result.payload || 'Register failed',
       })
     }
   }

 const HandleForgetPassword=()=>{
  route.push('auth/ForgotPassword');
 }
  return (
    <LinearGradient colors={['#FF7E5F', '#FEB47B']} style={styles.Layout}>

      <LoginSetup />
      <View style={styles.MainLayout}>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#864316' }} >Travel Wizard</Text>
          <Text style={{ fontSize: 18, fontWeight: 'semibold', marginTop: 5 ,color:'#1511ffff'}}>Begin your journey with intelligence</Text>
        </View>
         {/* name */}
        <View style={{ marginTop: 7 }}>
          <Text style={styles.TextField}>Name</Text>
          <View style={styles.inputContainer}>
            <Feather name="user" size={24}  color="grey" style={styles.inputIcon} />

            <TextInput
              style={styles.input}
              placeholder="Enter your Name"
              placeholderTextColor="#999"
              value={Registerdata.username}
              onChangeText={(text)=>HandleChange('username',text)}
            />
          </View>
        </View>
        {/* email */}
        <View>
          <Text style={styles.TextField}>Email</Text>
          <View style={styles.inputContainer}>
            <Fontisto name="email" size={20} color="grey" style={styles.inputIcon} />

            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
              placeholderTextColor="#999"
              value={Registerdata.email}
              onChangeText={(text)=>HandleChange('email',text)}
            />
          </View>
        </View>

        {/* password */}
        <View>
          <Text style={styles.TextField}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="grey" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your Password"
              placeholderTextColor="#999"
              secureTextEntry={!showpassword}
              value={Registerdata.password}
              onChangeText={(text)=>HandleChange('password',text)}
            />
            <TouchableOpacity onPress={() => SetShowpassword(!showpassword)}>
              <Ionicons name={showpassword ? "eye-off-outline" : "eye-outline"} size={22} color="grey" />
            </TouchableOpacity>

          </View>
          <Pressable onPress={HandleForgetPassword}>
            <Text>Forgot your Password?</Text>
          </Pressable>
        </View>


        <TouchableOpacity
          onPress={HandleRegister}
        >
          <Text style={styles.button}>
         {loading ? 'Signing Up...':'Sign In'}
         </Text>
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 3 }}>
          <Text>Do you have an account?</Text>
          <Pressable onPress={() => route.push('auth/Login')}>
            <Text style={{ color: '#5120BC' }}>Sign in here</Text>
          </Pressable>
        </View>

      </View>


    </LinearGradient>
  )
}

export default Register

const styles = StyleSheet.create({
  Layout: {
    flex: 1,
  },
  MainLayout: {
    bottom: '65%',
    padding: '10%',


  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#a8a5a5ff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
    
  },

  inputIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    height: 50,
  },
  TextField: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 15
  },
   button: {
    backgroundColor: '#FF7E5F',
    padding: 15,
    borderRadius: 10,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
  }

})