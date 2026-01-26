import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import { TravelData } from '../../Component/Traveldata'

const CreateTrip = () => {
  const router = useRouter()

  return (
    <View style={styles.container}>
     
      <Pressable onPress={() => router.back()} style={styles.arrow}>
        <AntDesign name="arrow-left" size={26} color="#111827" />
      </Pressable>

   
      <Text style={styles.title}>Who is Travelling</Text>
      <Text style={styles.subTitle}>Choose your travel type</Text>

     
      {TravelData.map((item) => (
        <Pressable key={item.id} style={styles.pressable}
          onPress={()=>router.push({
            pathname:'TravellPlanner/Dates',
            params:{travelType:item.title, travelDesc:item.description, travelPic:item.pic.uri}
          })}
        >
          <View style={styles.card}>
           
            <View style={styles.leftSection}>
              <View style={styles.badge} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>
                {item.description}
              </Text>
            </View>

            
            <View style={styles.imageWrapper}>
              <Image source={item.pic} style={styles.image} />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  )
}

export default CreateTrip


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#F9FAFB',
  },

  arrow: {
    marginTop: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 24,
    color: '#111827',
    letterSpacing: 0.6,
  },

  subTitle: {
    fontSize: 15,
    marginTop: 6,
    color: '#6B7280',
  },

  pressable: {
    marginTop: 22,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,

    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  leftSection: {
    flex: 1,
    paddingRight: 12,
  },

  badge: {
    width: 40,
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  cardDescription: {
    fontSize: 14,
    marginTop: 6,
    color: '#6B7280',
    lineHeight: 20,
  },

  imageWrapper: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 82,
    height: 82,
    borderRadius: 18,
  },
})
