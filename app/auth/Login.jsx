import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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
  const { width, height } = useWindowDimensions()
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

  // Responsive calculations
  const isTablet = width > 768
  const isSmallHeight = height < 700
  const containerWidth = isTablet ? 500 : width * 0.92
  const horizontalPadding = isTablet ? 40 : 15
  const inputHeight = Math.min(height * 0.07, 52)

  return (
    <LinearGradient colors={['#FF7E5F', '#FEB47B']} style={styles.Layout}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <LoginSetup />

              <View style={[styles.MainLayout, { width: containerWidth, paddingHorizontal: horizontalPadding }]}>
                <View style={{ alignItems: 'center', marginBottom: isSmallHeight ? 10 : 20 }}>
                  <Text style={[styles.title, { fontSize: width > 400 ? 30 : 26 }]}>
                    Travel Wizard
                  </Text>
                  <Text style={[styles.subtitle, { fontSize: width > 400 ? 16 : 14 }]}>
                    Begin your journey with intelligence
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  <Text style={styles.TextField}>Email</Text>
                  <View style={[styles.inputContainer, { height: inputHeight }]}>
                    <Fontisto name="email" size={18} color="grey" />
                    <TextInput
                      style={styles.input}
                      value={Logindata.email}
                      placeholder='Email'
                      onChangeText={(t) => HandleChange('email', t)}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>

                  <Text style={styles.TextField}>Password</Text>
                  <View style={[styles.inputContainer, { height: inputHeight }]}>
                    <Ionicons name="lock-closed-outline" size={18} color="grey" />
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
                        size={20}
                        color="grey"
                      />
                    </TouchableOpacity>
                  </View>

                  <Pressable onPress={() => route.push('auth/ForgotPassword')}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                  </Pressable>
                  
                  <TouchableOpacity onPress={HandleLogin} disabled={loading} activeOpacity={0.8}>
                    <View style={[styles.button, { marginTop: isSmallHeight ? 20 : 30 }]}>
                      <Text style={styles.buttonText}>
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <Pressable onPress={() => route.push('auth/Register')}>
                    <Text style={[styles.signupText, { marginTop: isSmallHeight ? 20 : 30 }]}>
                      Don’t have an account? <Text style={{ color: '#fff', textDecorationLine: 'underline' }}>Sign up</Text>
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default Login

const styles = StyleSheet.create({
  Layout: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  MainLayout: { 
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold', 
    color: '#864316',
    textAlign: 'center'
  },
  subtitle: {
    marginTop: 2,
    textAlign: 'center',
    color: '#444',
    fontWeight: '500'
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderColor: '#eee',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  input: { 
    flex: 1, 
    height: '100%',
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  TextField: { 
    color: '#864316', 
    fontWeight: 'bold', 
    marginTop: 8,
    fontSize: 13,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#FF7E5F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  forgotPassword: {
    color: '#864316', 
    marginTop: 5,
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 13,
  },
  signupText: {
    textAlign: 'center', 
    color: '#864316', 
    fontWeight: '600',
    fontSize: 15,
  }
})




