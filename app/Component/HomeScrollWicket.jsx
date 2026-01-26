import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const HomeScrollWicket = () => {
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

  return (
    <View>
      <Text style={styles.Title}>’Tis The Season to be Jolly 🎄</Text>
      <Text style={styles.Title}>Explore Our Top Picks</Text>

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

export default HomeScrollWicket
const styles = StyleSheet.create({
  Title: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: '500',
  },

  card: {
    width: 200,
    backgroundColor: '#f5f5f5',
    marginRight: 15,
    borderRadius: 25,   // 🔥 FULL ROUNDED CARD
    overflow: 'hidden', // IMPORTANT for rounded image
    elevation: 3,
    marginTop:15
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
})
