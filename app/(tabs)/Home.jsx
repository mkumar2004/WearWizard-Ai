import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'

import GetLocation from '../CompondData/GetLocation'
import HomeScreenScrolll from '../Component/HomeScreenScrolll'
import HomeScrollWicket from '../Component/HomeScrollWicket'
import DesinationCard from '../Component/DesinationCard'
import HompAllConten from '../Component/HompAllConten'
import AddModal from '../TravellPlanner/Add'
const Home = () => {
  const user = useSelector((state) => state.auth.user)
  const detectedLocation = useSelector((state) => state.location.address)
  const router = useRouter()
  const [showAddModal, setShowAddModal] = useState(false);
  const [city, setCity] = useState(null)
  const [showCityModal, setShowCityModal] = useState(false)

  const cities = ['Chennai', 'Madurai', 'Coimbatore', 'Bangalore', 'Hyderabad']

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity)
    setShowCityModal(false)
  }
  

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.F1}>
          <View>
            <Text style={styles.title}>
              Hey {user?.name || 'Traveller'} 👋
            </Text>
            <Text style={styles.subtitle}>
              Ready to plan for a next trip?
            </Text>
          </View>

         <TouchableOpacity
  style={styles.bell}
  onPress={() => router.push('Component/Notification')}
>
  <Ionicons name="notifications-outline" size={24} />

  {/* Top Dot */}
  <View style={styles.topDot} />
</TouchableOpacity>

        </View>

        <GetLocation />
        <HomeScreenScrolll />

        {/* City Selector */}
        <View style={styles.MidlleCard}>
          <Text style={styles.fromText}>You're Travelling From</Text>

          <TouchableOpacity
            style={styles.smallCard}
            onPress={() => setShowCityModal(true)}
          >
            <Text>{city || detectedLocation?.city || 'Chennai'}</Text>
            <Ionicons name="chevron-down" size={22} />
          </TouchableOpacity>
        </View>

        {/* City Modal */}
        <Modal visible={showCityModal} transparent animationType="slide">
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Select City</Text>

              {cities.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.cityItem}
                  onPress={() => handleSelectCity(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Horizontal Cards */}
        <View style={styles.Card2}>
          <HomeScrollWicket />
          <DesinationCard/>
        </View>
        
        <View style={{top:16}}>
          <Text style={{fontSize:25,fontWeight:'600'}} >✨ Discover Hidden Places</Text>
          <Text style={{fontSize:15,margin:12,textAlign:'center',color:'grey'}}>Curated by Reatess AI</Text>
           <HompAllConten key="home-content" selectedCity={city || detectedLocation?.city} />
        </View>
      </ScrollView>
      {/* Floating Plus Icon */}
<TouchableOpacity
  style={styles.floatingPlus}
  activeOpacity={0.85}
  onPress={() => setShowAddModal(true)}
>
  <Ionicons name="add" size={37} color="#fff" />
</TouchableOpacity>
<AddModal
  visible={showAddModal}
  onClose={() => setShowAddModal(false)}
/>

    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    padding: 15,
    paddingBottom: 30,
  },

  F1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
   bell: {
    position: 'relative',
    padding: 8,
    borderWidth:1,
    borderColor:'orange'

  },
  topDot: {
    position: 'absolute',
    top: 8, 
    right:14,           
    alignSelf: 'center',
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  MidlleCard: {
    marginTop: 15,
  },

  fromText: {
    fontSize: 16,
    fontWeight: '600',
  },

  smallCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginTop: 8,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  cityItem: {
    paddingVertical: 12,
  },

  cancel: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },

  Card2: {
    marginTop: 15,
  },
  floatingPlus: {
  position: 'absolute',
  bottom: 15,         
  alignSelf: 'center',
  width: 52,
  height: 52,
  borderRadius: 31,
  backgroundColor: '#04040c',
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 6,
},

})
