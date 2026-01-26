import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const DesinationCard = () => {
      const upcomingTrips = [
    {
      id: '1',
      title: 'Goa Trip',
      date: '12 Jan 2025',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    },
    {
      id: '2',
      title: 'Ooty Trip',
      date: '20 Feb 2025',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    },
    {
      id: '3',
      title: 'Kerala Trip',
      date: '5 Mar 2025',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0',
    },
  ]
  const router = useRouter();
  const HandleView =()=>{
        router.push('Component/ViewAll')
  }
  return (
    <View style={{marginTop:15}}>
    <View style={styles.sidel}>
    <View>
      <Text style={styles.Title1}>Destinations Just For You</Text>
      <Text style={styles.Title2}>Based on your travel preferences</Text>
    </View>
      <Pressable onPress={HandleView}>
         <Text style={{color:'blue',fontSize:15}}>View all</Text>
      </Pressable>
    </View>
      
      <FlatList
        data={upcomingTrips}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            
            {/* 🔥 IMAGE ON TOP */}
            <Image source={{ uri: item.image }} style={styles.image} />

            {/* 🔽 TEXT BELOW IMAGE */}
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>

          </TouchableOpacity>
        )}
      />
    </View>
  )
}


export default DesinationCard

const styles = StyleSheet.create({
  Title1: {
    fontSize: 17,
  
    fontWeight: '700',
  
  },
  Title2: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: '500',
    color:'grey'
  
  },

  card: {
    width: 200,
    backgroundColor: '#f5f5f5',
    marginRight: 15,
    borderRadius: 25,   // 🔥 FULL ROUNDED CARD
    overflow: 'hidden', // IMPORTANT for rounded image
    elevation: 3,
    marginTop:5
  },

  image: {
    width: '100%',
    height: 120,
  },

  textContainer: {
    padding: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  cardDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  sidel:{
    flexDirection:'row',
    justifyContent:'space-between'
  }
})