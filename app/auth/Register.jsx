import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, 
  KeyboardAvoidingView, Platform, useWindowDimensions, TouchableWithoutFeedback, Keyboard 
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import LoginSetup from '../Component/LoginSteup'
import { useDispatch, useSelector } from 'react-redux'
import { RegisterUser } from '../../src/redux/slice/Auth'
import { Ionicons, Feather, Fontisto } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'

const Register = () => {
  const { width, height } = useWindowDimensions()
  const [showpassword, SetShowpassword] = useState(false)
  const [Registerdata, SetRegisterdata] = useState({
    username: '',
    email: '',
    password: ''
  })

  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  const router = useRouter()

  const HandleChange = (name, value) => {
    SetRegisterdata(prev => ({ ...prev, [name]: value }))
  }

  const HandleRegister = async () => {
    if (!Registerdata.email || !Registerdata.password || !Registerdata.username) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' })
      return
    }

    const result = await dispatch(RegisterUser(Registerdata))

    if (RegisterUser.fulfilled.match(result)) {
      Toast.show({ type: 'success', text1: 'Account Created', text2: 'Welcome to Travel Wizard!' })
      SetRegisterdata({ email: '', password: '', username: '' })
      router.replace('(tabs)/Home')
    } else {
      Toast.show({ type: 'error', text1: result.payload || 'Registration failed' })
    }
  }

  // Ultra-compact responsive calculations
  const isTablet = width > 768
  const isSmallHeight = height < 700
  const containerWidth = isTablet ? 500 : width * 0.92
  const horizontalPadding = isTablet ? 40 : 20
  const inputHeight = isSmallHeight ? 48 : 52

  return (
    <LinearGradient colors={['#FF7E5F', '#FEB47B']} style={styles.Layout}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <View style={styles.MainContainer}>
              <View style={[styles.scrollContent, { paddingVertical: isSmallHeight ? 10 : 20 }]}>
                {/* Compact Logo Setup for Register */}
                <View style={{ height: isSmallHeight ? 140 : 180, width: '100%', overflow: 'hidden' }}>
                    <LoginSetup />
                </View>

                <View style={[styles.MainLayout, { width: containerWidth, paddingHorizontal: horizontalPadding }]}>
                  <View style={{ alignItems: 'center', marginBottom: isSmallHeight ? 10 : 20 }}>
                    <Text style={[styles.title, { fontSize: width > 400 ? 30 : 26 }]} >Travel Wizard</Text>
                    <Text style={[styles.subtitle, { fontSize: width > 400 ? 16 : 14 }]}>Begin your journey with intelligence</Text>
                  </View>

                  <View style={styles.formContainer}>
                    {/* name */}
                    <View style={{ marginTop: isSmallHeight ? 5 : 8 }}>
                      <Text style={styles.TextField}>Name</Text>
                      <View style={[styles.inputContainer, { height: inputHeight, marginVertical: isSmallHeight ? 4 : 6 }]}>
                        <Feather name="user" size={18}  color="grey" style={styles.inputIcon} />
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
                    <View style={{ marginTop: 2 }}>
                      <Text style={styles.TextField}>Email</Text>
                      <View style={[styles.inputContainer, { height: inputHeight, marginVertical: isSmallHeight ? 4 : 6 }]}>
                        <Fontisto name="email" size={16} color="grey" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your Email"
                          placeholderTextColor="#999"
                          value={Registerdata.email}
                          onChangeText={(text)=>HandleChange('email',text)}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    {/* password */}
                    <View style={{ marginTop: 2 }}>
                      <Text style={styles.TextField}>Password</Text>
                      <View style={[styles.inputContainer, { height: inputHeight, marginVertical: isSmallHeight ? 4 : 6 }]}>
                        <Ionicons name="lock-closed-outline" size={16} color="grey" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your Password"
                          placeholderTextColor="#999"
                          secureTextEntry={!showpassword}
                          value={Registerdata.password}
                          onChangeText={(text)=>HandleChange('password',text)}
                        />
                        <TouchableOpacity onPress={() => SetShowpassword(!showpassword)}>
                          <Ionicons name={showpassword ? "eye-off-outline" : "eye-outline"} size={20} color="grey" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity onPress={HandleRegister} disabled={loading} activeOpacity={0.8}>
                      <View style={[styles.button, { marginTop: isSmallHeight ? 15 : 25 }]}>
                        <Text style={styles.buttonText}>
                          {loading ? 'Joining...':'Sign Up'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    
                    <View style={[styles.footer, { marginTop: isSmallHeight ? 15 : 25 }]}>
                      <Text style={styles.footerText}>Already have an account?</Text>
                      <Pressable onPress={() => router.push('auth/Login')}>
                        <Text style={styles.linkText}>Sign in</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default Register

const styles = StyleSheet.create({
  Layout: { flex: 1 },
  MainContainer: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#333',
    fontWeight: '500'
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputIcon: { marginRight: 10 },
  input: { 
    flex: 1, 
    height: '100%',
    fontSize: 15,
    color: '#333',
  },
  TextField: {
    color: "#864316",
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#FF7E5F',
    padding: 15,
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
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 8 
  },
  footerText: { 
    color: '#864316',
    fontSize: 15,
    fontWeight: '500',
  },
  linkText: { 
    color: '#864316', 
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
  }
})