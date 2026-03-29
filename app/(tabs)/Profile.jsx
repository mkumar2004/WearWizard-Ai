import { 
  StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar, Alert 
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import { logoutUser, fetchUserProfile } from '../../src/redux/slice/Auth'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { ActivityIndicator, FlatList } from 'react-native'

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop', // Default
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop', // Male 1
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop', // Female 1
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=250&auto=format&fit=crop', // Male 2
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop', // Female 2
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=250&auto=format&fit=crop', // Male 3
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop', // Female 3
]

const Profile = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, profile } = useSelector(state => state.auth)
  const [updating, setUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserProfile(user._id))
    }
  }, [user?._id])

  const handleSelectAvatar = async (avatarUrl) => {
    setUpdating(true);
    try {
      const response = await axios.patch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user/profile`, {
        userId: user._id,
        avatarUrl
      });

      if (response.data.profile) {
        dispatch(fetchUserProfile(user._id));
        setIsEditing(false); // Automaticaly close selection after choice
      }
    } catch (error) {
      console.error("Avatar update error:", error);
      Alert.alert("Error", "Failed to update profile picture.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out of Travel Wizard?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: async () => {
            const resultAction = await dispatch(logoutUser())
            if (logoutUser.fulfilled.match(resultAction)) {
              router.replace('/auth/Login')
            }
          },
          style: "destructive"
        }
      ]
    )
  }

  if (!user) {
    return (
      <View style={s.rootCenter}>
        <Text style={s.subText}>Please log in to see your profile.</Text>
        <TouchableOpacity style={s.loginBtn} onPress={() => router.push('/auth/Login')}>
          <Text style={s.loginBtnTxt}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* HEADER SECTION */}
        <View style={s.header}>
           <Text style={s.headerTitle}>Profile</Text>
           <TouchableOpacity>
             <Ionicons name="settings-outline" size={24} color="#111827" />
           </TouchableOpacity>
        </View>

        {/* HERO / AVATAR */}
        <View style={s.hero}>
          <TouchableOpacity 
            style={s.avatarWrap} 
            onPress={() => setIsEditing(!isEditing)}
            activeOpacity={0.8}
          >
            <Image 
              source={{ uri: profile?.avatarUrl || PRESET_AVATARS[0] }} 
              style={[s.avatar, updating && { opacity: 0.5 }]} 
            />
            {updating && (
              <View style={s.loader}>
                 <ActivityIndicator color="#2563EB" size="small" />
              </View>
            )}
            <View style={s.checkBadge}><Ionicons name="checkmark-circle" size={20} color="#2563EB" /></View>
            
            {/* CUSTOMIZE ICON */}
            <View style={s.editIconWrap}>
               <Ionicons name="brush-outline" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={s.userName}>{user.username || 'Traveler'}</Text>
          <Text style={s.userBio}>{profile?.Bio || 'Traveler • Explorer • Dreamer'}</Text>
          
          {/* AVATAR SELECTION INTEGRATED IN CENTER */}
          {isEditing && (
            <View style={s.selectionContainer}>
              <Text style={s.selectionTitle}>Choose your Persona</Text>
              <FlatList 
                data={PRESET_AVATARS}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => handleSelectAvatar(item)}
                    style={[s.presetItem, profile?.avatarUrl === item && s.presetItemActive]}
                  >
                    <Image source={{ uri: item }} style={s.presetImg} />
                    {profile?.avatarUrl === item && (
                      <View style={s.selectedOverlay}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* MENU OPTIONS */}
        <View style={s.menuWrap}>
          <MenuOption icon="bookmark-outline" label="My Saved Trips" />
          <MenuOption icon="person-outline" label="Edit Profile" />
          <MenuOption icon="airplane-outline" label="Travel Preferences" />
          <MenuOption icon="notifications-outline" label="Notifications" />
          <MenuOption icon="shield-checkmark-outline" label="Privacy & Security" />
          <MenuOption icon="help-circle-outline" label="Help Center" />
          
          <MenuOption 
            icon="log-out-outline" 
            label="Logout" 
            onPress={handleLogout} 
            color="#DC2626" 
            bgColor="#FEE2E2" 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const MenuOption = ({ icon, label, onPress, color, bgColor }) => (
  <TouchableOpacity 
    style={[s.menuItem, label === "Logout" && { borderBottomWidth: 0 }]} 
    onPress={onPress}
  >
    <View style={[s.iconBg, bgColor ? { backgroundColor: bgColor } : null]}>
       <Ionicons name={icon} size={20} color={color || "#111827"} />
    </View>
    <Text style={[s.menuLabel, color ? { color } : null]}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
  </TouchableOpacity>
)

export default Profile

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#FFFFFF' },
  rootCenter: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle:{ fontSize: 24, fontWeight: '900', color: '#111827', letterSpacing: -1 },

  hero:       { alignItems: 'center', paddingVertical: 10 },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatar:     { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#F8FAFC' },
  loader:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 55 },
  checkBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 2 },
  userName:   { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 2 },
  userBio:    { fontSize: 13, color: '#64748B', fontWeight: '500' },
  editIconWrap: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#2563EB', borderRadius: 15, padding: 6, borderWidth: 3, borderColor: '#FFFFFF' },

  selectionContainer: { marginTop: 24, alignItems: 'center', width: '100%'},
  selectionTitle:     { fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 },
  presetItem:         { marginHorizontal: 6, position: 'relative', borderRadius: 30, padding: 2, borderWidth: 2, borderColor: 'transparent' },
  presetItemActive:   { borderColor: '#2563EB' },
  presetImg:          { width: 54, height: 54, borderRadius: 27 },
  selectedOverlay:    { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#2563EB', borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },

  menuWrap:   { marginTop: 30, paddingHorizontal: 24 },
  menuItem:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  iconBg:     { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuLabel:  { flex: 1, fontSize: 15, fontWeight: '600', color: '#374151' },

  loginBtn:   { marginTop: 20, backgroundColor: '#2563EB', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  loginBtnTxt:{ color: '#FFFFFF', fontWeight: '700' },
  subText:    { fontSize: 14, color: '#6B7280' }
})
