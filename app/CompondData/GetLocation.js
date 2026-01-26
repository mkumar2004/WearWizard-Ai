import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { useDispatch } from 'react-redux'
import { setLocation } from '../../src/redux/slice/CurrentLocation'

const GetLocation = () => {
  const [address, setAddress] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchLocation()
  }, [])

  const fetchLocation = async () => {
    try {
      setLoading(true)

      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setError('Location permission denied')
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      const addr = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })

      const finalAddress = addr[0]

      setAddress(finalAddress)

      dispatch(
        setLocation({
          address: finalAddress,
          coords: location.coords,
        })
      )
    } catch (err) {
      setError('Failed to get location')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.card}>
      {loading && (
        <View style={styles.row}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>Detecting location...</Text>
        </View>
      )}

      {!loading && address && (
        <Text style={styles.text}>
          📍 {address.formattedAddress || `${address.city}, ${address.region}, ${address.country}`}
        </Text>
      )}

      {!loading && error && (
        <Text style={{ color: 'red' }}>{error}</Text>
      )}
    </View>
  )
}


export default GetLocation

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 10,
    margin: 7,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
  flexDirection: 'row',
  alignItems: 'center',
},
loadingText: {
  marginLeft: 8,
  fontSize: 13,
  color: '#666',
},

})
