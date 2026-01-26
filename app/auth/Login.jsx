import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import LoginSetup from '../Component/LoginSteup'
import Fontisto from '@expo/vector-icons/Fontisto'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../src/redux/slice/Auth'

const Login = () => {
  const [showpassword, SetShowpassword] = useState(false)
  const [Logindata, SetLogindata] = useState({ email: '', password: '' })

  const route = useRouter()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const HandleChange = (name, value) => {
    SetLogindata((prev) => ({ ...prev, [name]: value }))
  }

  const HandleLogin = async () => {
    if (!Logindata.email || !Logindata.password) {
      Toast.show({ type: 'error', text1: 'Email and password required' })
      return
    }

    const result = await dispatch(loginUser(Logindata))

    if (loginUser.fulfilled.match(result)) {
      Toast.show({
         type: 'success',
          text1: 'Login Successful',
          text2:'Travel Wizard'
         })
      SetLogindata({ email: '', password: '' })
      route.replace('(tabs)/Home')
    } else {
      Toast.show({
        type: 'error',
        text1: result.payload || 'Login failed',
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
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#864316' }}>
            Travel Wizard
          </Text>
          <Text style={{ fontSize: 18, marginTop: 5 }}>
            Begin your journey with intelligence
          </Text>
        </View>

        <Text style={styles.TextField}>Email</Text>
        <View style={styles.inputContainer}>
          <Fontisto name="email" size={20} color="grey" />
          <TextInput
            style={styles.input}
            value={Logindata.email}
            placeholder='Email'
            onChangeText={(t) => HandleChange('email', t)}
          />
        </View>

        <Text style={styles.TextField}>Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="grey" />
          <TextInput
            style={styles.input}
            secureTextEntry={!showpassword}
            value={Logindata.password}
            placeholder='Password'
            onChangeText={(t) => HandleChange('password', t)}
          />
          <TouchableOpacity onPress={() => SetShowpassword(!showpassword)}>
            <Ionicons
              name={showpassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
            />
          </TouchableOpacity>
        </View>
        <Pressable onPress={HandleForgetPassword}>
                    <Text>Forgot your Password?</Text>
                  </Pressable>
        <TouchableOpacity onPress={HandleLogin} disabled={loading}>
          <Text style={styles.button}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <Pressable onPress={() => route.push('auth/Register')}>
          <Text style={{ textAlign: 'center',marginTop:5 }}>
            Don’t have an account? Sign up
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  )
}

export default Login

const styles = StyleSheet.create({
  Layout: { flex: 1 },
  MainLayout: { bottom: '64%', padding: '10%' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderColor:'grey'
  },
  input: { flex: 1, height: 50 },
  TextField: { color: 'white', fontWeight: 'bold',marginTop:10 },
  button: {
    backgroundColor: '#FF7E5F',
    padding: 15,
    borderRadius: 10,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
  },
})
