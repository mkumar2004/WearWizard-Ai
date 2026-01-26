import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker, Callout, Polyline } from 'react-native-maps'
import * as Location from 'expo-location'
import { getDistanceKm } from '../../Component/GetMeter'
import { searchLocation } from '../../Component/SearchLocation'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function AiPlan() {
  const [region, setRegion] = useState(null)
  const [fromSearch, setFromSearch] = useState('')
  const [toSearch, setToSearch] = useState('')
  const [fromPlace, setFromPlace] = useState(null)
  const [toPlace, setToPlace] = useState(null)

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      })

      const userLocation = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }

      setRegion(userLocation)
      setFromPlace({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        name: 'Your Location',
      })
      setFromSearch('Current Location')
    })()
  }, [])


  const handleFromSearch = async () => {
    const place = await searchLocation(fromSearch)
    if (place) setFromPlace(place)
  }

  const handleToSearch = async () => {
    const place = await searchLocation(toSearch)
    if (place) setToPlace(place)
  }

  const useCurrentLocation = () => {
    if (!region) return
    setFromPlace({
      latitude: region.latitude,
      longitude: region.longitude,
      name: 'Your Location',
    })
    setFromSearch('Current Location')
  }

  const swapLocations = () => {
    setFromPlace(toPlace)
    setToPlace(fromPlace)
    setFromSearch(toSearch)
    setToSearch(fromSearch)
  }

  if (!region) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>📍 Loading map...</Text>
        </View>
      </View>
    )
  }

  const distance =
    fromPlace &&
    toPlace &&
    getDistanceKm(
      fromPlace.latitude,
      fromPlace.longitude,
      toPlace.latitude,
      toPlace.longitude
    )

  return (
    <View style={styles.container}>
      <View style={styles.searchCard}>
        <View style={styles.inputWrapper}>
          <View style={styles.iconContainer}>
            <FontAwesome6 name="person-dots-from-line" size={20} color="grey" />
          </View>
          <TextInput
            placeholder="From location"
            placeholderTextColor="#9CA3AF"
            value={fromSearch}
            onChangeText={setFromSearch}
            onSubmitEditing={handleFromSearch}
            style={styles.input}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.currentBtn} onPress={useCurrentLocation}>
            <FontAwesome6 name="feather-pointed" size={15} color="grey" />
          </TouchableOpacity>
        </View>

        {fromPlace && toPlace && (
          <TouchableOpacity style={styles.swapBtn} onPress={swapLocations}>
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>
        )}

        <View style={styles.inputWrapper}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="target-variant" size={24} color="grey" />
          </View>
          <TextInput
            placeholder="To destination"
            placeholderTextColor="#9CA3AF"
            value={toSearch}
            onChangeText={setToSearch}
            onSubmitEditing={handleToSearch}
            style={styles.input}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchIconBtn} onPress={handleToSearch}>
            <Ionicons name="search-outline" size={20} color="grey" />
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {fromPlace && toPlace && (
          <Polyline
            coordinates={[
              { latitude: fromPlace.latitude, longitude: fromPlace.longitude },
              { latitude: toPlace.latitude, longitude: toPlace.longitude },
            ]}
            strokeWidth={4}
            strokeColor="#3B82F6"
            lineDashPattern={[1]}
          />
        )}

        {fromPlace && (
          <Marker
            coordinate={{
              latitude: fromPlace.latitude,
              longitude: fromPlace.longitude,
            }}
            pinColor="green"
          />
        )}

        {toPlace && (
          <Marker
            coordinate={{
              latitude: toPlace.latitude,
              longitude: toPlace.longitude,
            }}
            pinColor="red"
          />
        )}
      </MapView>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  searchCard: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    borderRightWidth:1,
    borderColor:'#c0c3c9'
  },


  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    paddingVertical: 8,
  },
  currentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor:'#c0c3c9',
    borderWidth:1
  },

  searchIconBtn: {
    padding: 8,
    borderWidth:1,
    borderColor:'#c0c3c9',
    borderRadius:8
  },

  swapBtn: {
    position: 'absolute',
    right: -12,
    top: '60%',
    transform: [{ translateY: -20 }],
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  swapIcon: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  calloutContainer: {
    padding: 8,
    minWidth: 200,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    color: '#111827',
  },
  calloutText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#374151',
  },
  coordText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  distanceCallout: {
    marginTop: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  distanceCalloutText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
})