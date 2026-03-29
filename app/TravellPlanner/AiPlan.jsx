import {
  View, StyleSheet, Text,
  TouchableOpacity, Image, ScrollView,
  Dimensions, Platform, StatusBar, ActivityIndicator, Alert
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps'
import * as Location from 'expo-location'
import { getDistanceKm } from '../../Component/GetMeter'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useLocalSearchParams } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import { generateTripPlan } from '../../src/redux/slice/Travel'

import { fetchPOIs, POI_CATEGORIES, getPOIStyle, getPhotoUrl, searchLocation, reverseGeocode } from '../../Component/AiPlanHelpers'
import MapSearchCard from '../../Component/MapSearchCard'
import PoiDetailCard from '../../Component/PoiDetailCard'

const { width: SCREEN_W } = Dimensions.get('window')
const TOP_INSET = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24)

export default function AiPlan() {
  const mapRef                          = useRef(null)
  const [region, setRegion]             = useState(null)
  const [fromSearch, setFromSearch]     = useState('')
  const [toSearch, setToSearch]         = useState('')
  const [fromPlace, setFromPlace]       = useState(null)
  const [toPlace, setToPlace]           = useState(null)
  const [searchingTo, setSearchingTo]   = useState(false)
  const [pois, setPois]                 = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loadingPOIs, setLoadingPOIs]   = useState(false)
  const [selectedPOI, setSelectedPOI]   = useState(null)
  const [photoError, setPhotoError]     = useState(false)

  // ── Redux ──────────────────────────────────────────────────────────────────
  const dispatch             = useDispatch()
  const { loading }          = useSelector(state => state.travel)
  const { user }             = useSelector(state => state.auth)

  const {
    budgetType, budgetDesc,
    startDate, endDate, tripDuration,
    travelType, travelDesc,
  } = useLocalSearchParams()

  // ── Location init ──────────────────────────────────────────────────────────
  useEffect(() => {
    ;(async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          setRegion({ latitude: 20.5937, longitude: 78.9629, latitudeDelta: 8, longitudeDelta: 8 })
          return
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low })
        const ul = { latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
        setRegion(ul)
        const readableAddress = await reverseGeocode(loc.coords.latitude, loc.coords.longitude)
        setFromPlace({ ...ul, name: readableAddress })
        setFromSearch(readableAddress)
        loadPOIs(ul.latitude, ul.longitude, 'all')
      } catch {
        setRegion({ latitude: 20.5937, longitude: 78.9629, latitudeDelta: 8, longitudeDelta: 8 })
      }
    })()
  }, [])

  const loadPOIs = async (lat, lon, cat) => {
    setLoadingPOIs(true)
    setPois(await fetchPOIs(lat, lon, cat))
    setLoadingPOIs(false)
  }

  const handleCategoryPress = (id) => {
    setActiveCategory(id)
    if (region) loadPOIs(region.latitude, region.longitude, id)
  }

  const handleFromSearch = async () => {
    const p = await searchLocation(fromSearch)
    if (p) { 
      setFromPlace(p); 
      const r = { ...p, latitudeDelta: 0.05, longitudeDelta: 0.05 }; 
      mapRef.current?.animateToRegion(r, 1000); 
      loadPOIs(p.latitude, p.longitude, activeCategory) 
    }
  }

  const handleToSearch = async () => {
    setSearchingTo(true)
    const p = await searchLocation(toSearch)
    setSearchingTo(false)
    if (p) { 
      setToPlace(p); 
      if (fromPlace) {
        mapRef.current?.fitToCoordinates([
          { latitude: fromPlace.latitude, longitude: fromPlace.longitude },
          { latitude: p.latitude, longitude: p.longitude }
        ], { edgePadding: { top: 100, right: 60, bottom: 380, left: 60 }, animated: true });
      } else {
        const r = { ...p, latitudeDelta: 0.05, longitudeDelta: 0.05 }; 
        mapRef.current?.animateToRegion(r, 1000); 
      }
      loadPOIs(p.latitude, p.longitude, activeCategory) 
    }
  }

  const useCurrentLocation = async () => {
    if (!region) return
    const readableAddress = await reverseGeocode(region.latitude, region.longitude)
    setFromPlace({ latitude: region.latitude, longitude: region.longitude, name: readableAddress })
    setFromSearch(readableAddress)
    mapRef.current?.animateToRegion(region, 1000)
  }

  const handlePredictionSelect = (type, prediction) => {
    if (type === 'from') {
       setFromSearch(prediction.name);
       setFromPlace(prediction);
       const r = { ...prediction, latitudeDelta: 0.05, longitudeDelta: 0.05 }; 
       mapRef.current?.animateToRegion(r, 1000); 
       loadPOIs(prediction.latitude, prediction.longitude, activeCategory);
    } else {
       setToSearch(prediction.name);
       setToPlace(prediction);
       if (fromPlace) {
        mapRef.current?.fitToCoordinates([
          { latitude: fromPlace.latitude, longitude: fromPlace.longitude },
          { latitude: prediction.latitude, longitude: prediction.longitude }
        ], { edgePadding: { top: 100, right: 60, bottom: 380, left: 60 }, animated: true });
      } else {
        const r = { ...prediction, latitudeDelta: 0.05, longitudeDelta: 0.05 }; 
        mapRef.current?.animateToRegion(r, 1000); 
      }
      loadPOIs(prediction.latitude, prediction.longitude, activeCategory);
    }
  }

  const swapLocations = () => {
    const [tp, ts] = [fromPlace, fromSearch]
    setFromPlace(toPlace); setFromSearch(toSearch)
    setToPlace(tp); setToSearch(ts)
    if (toPlace && tp) {
      mapRef.current?.fitToCoordinates([
        { latitude: toPlace.latitude, longitude: toPlace.longitude },
        { latitude: tp.latitude, longitude: tp.longitude }
      ], { edgePadding: { top: 100, right: 60, bottom: 380, left: 60 }, animated: true });
    }
  }

  // ── AI Plan Handler ────────────────────────────────────────────────────────
  const handleAIplan = async () => {
    if (!fromPlace || !toPlace) {
      Alert.alert('Missing Location', 'Please set both From and To locations')
      return
    }

    const tripData = {
      userId:       user?._id,
      fromLocation: fromSearch || 'Current Location',
      toLocation:   toSearch,
      distance:     distance?.toFixed(1) || '0',
      budgetType,
      budgetDesc,
      startDate,
      endDate,
      tripDuration,
      travelType,
      travelDesc,
    }

    console.log('🚀 Sending trip request...')
    const result = await dispatch(generateTripPlan(tripData))

    if (generateTripPlan.fulfilled.match(result)) {
      console.log('✅ Plan received!')
      router.push({
        pathname: 'TravellPlanner/Transport',
        params: { plan: JSON.stringify(result.payload) }
      })
    } else {
      Alert.alert('Error', result.payload || 'Failed to generate plan. Check backend.')
    }
  }

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (!region) {
    return (
      <View style={s.container}>
        <View style={s.loadingContainer}>
          <Image source={require('../../assets/Animation/MapLoader.gif')} style={{ width: 170, height: 150 }} />
          <Text style={s.loadingText}>Loading map...</Text>
        </View>
      </View>
    )
  }

  const distance = fromPlace && toPlace
    ? getDistanceKm(fromPlace.latitude, fromPlace.longitude, toPlace.latitude, toPlace.longitude)
    : null

  const searchCardHeight = fromPlace && toPlace ? 210 : 180
  const categoryBarTop   = TOP_INSET + searchCardHeight + 8

  return (
    <View style={s.container}>

      {/* ── Map ── */}
      <MapView
        ref={mapRef}
        style={s.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
        mapType="none"
        rotateEnabled pitchEnabled
        onPress={() => setSelectedPOI(null)}
      >
        <UrlTile urlTemplate="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" maximumZ={20} flipY={false} shouldReplaceMapContent />

        {fromPlace && toPlace && (
          <Polyline
            coordinates={[
              { latitude: fromPlace.latitude, longitude: fromPlace.longitude },
              { latitude: toPlace.latitude,   longitude: toPlace.longitude   },
            ]}
            strokeWidth={4} strokeColor="#6366F1" lineDashPattern={[8, 4]}
          />
        )}

        {fromPlace && <Marker coordinate={{ latitude: fromPlace.latitude, longitude: fromPlace.longitude }} pinColor="green" />}
        {toPlace   && <Marker coordinate={{ latitude: toPlace.latitude,   longitude: toPlace.longitude   }} pinColor="red"   />}

        {pois.map((poi) => {
          const { icon, color } = getPOIStyle(poi.type)
          const photoUrl = getPhotoUrl(poi.type, poi.id)
          return (
            <Marker 
              key={poi.id} 
              coordinate={{ latitude: poi.latitude, longitude: poi.longitude }} 
              onPress={() => { setPhotoError(false); setSelectedPOI(poi) }}
              tracksViewChanges={false}
            >
              <View style={[s.poiMarkerWithImage, { borderColor: color }]}>
                <Image source={{ uri: photoUrl }} style={s.markerImage} resizeMode="cover" />
                <View style={[s.markerBadge, { backgroundColor: color }]}>
                  <Text style={s.markerBadgeEmoji}>{icon}</Text>
                </View>
              </View>
            </Marker>
          )
        })}
      </MapView>

      {/* ── Search Card ── */}
      <MapSearchCard 
        topInset={TOP_INSET}
        fromSearch={fromSearch} setFromSearch={setFromSearch} handleFromSearch={handleFromSearch}
        useCurrentLocation={useCurrentLocation} fromPlace={fromPlace} toPlace={toPlace}
        swapLocations={swapLocations}
        toSearch={toSearch} setToSearch={setToSearch} handleToSearch={handleToSearch} searchingTo={searchingTo}
        onSelectPrediction={handlePredictionSelect}
      />

      {/* ── Category Filter ── */}
      <View style={[s.categoryBar, { top: categoryBarTop }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categoryScroll}>
          {POI_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id
            return (
              <TouchableOpacity key={cat.id} style={[s.chip, active && { backgroundColor: cat.color, borderColor: cat.color }]} onPress={() => handleCategoryPress(cat.id)}>
                <Text style={s.chipEmoji}>{cat.icon}</Text>
                <Text style={[s.chipLabel, active && { color: '#fff' }]}>{cat.label}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        {loadingPOIs && <View style={s.loadingBadge}><Text style={s.loadingBadgeText}>Fetching places…</Text></View>}
      </View>

      {/* ── POI Detail Card ── */}
      <PoiDetailCard 
        selectedPOI={selectedPOI} setSelectedPOI={setSelectedPOI}
        photoError={photoError} setPhotoError={setPhotoError}
        setToPlace={setToPlace} setToSearch={setToSearch}
        fromPlace={fromPlace} mapRef={mapRef}
      />

      {/* ── Distance Badge ── */}
      {distance !== null && !selectedPOI && (
        <View style={s.distanceBadge}>
          <Ionicons name="navigate-outline" size={13} color="#6366F1" />
          <Text style={s.distanceText}>{distance.toFixed(1)} km away</Text>
        </View>
      )}

      {/* ── AI Travel Assistant Button ── */}
      {distance !== null && (
        <TouchableOpacity
          style={[s.aiBtn, loading && { opacity: 0.7 }]}
          onPress={handleAIplan}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={s.aiBtnText}>Generating Plan...</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color="white" />
              <Text style={s.aiBtnText}>AI Travel Assistant</Text>
              <View style={s.aiBtnBadge}>
                <Text style={s.aiBtnBadgeText}>{distance.toFixed(0)}km</Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      )}

    </View>
  )
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F3F4F6' },
  map:             { flex: 1 },
  loadingContainer:{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  loadingText:     { fontSize: 18, color: '#6B7280', fontWeight: '600', marginTop: 12 },
  categoryBar:     { position: 'absolute', left: 0, right: 0, zIndex: 10 },
  categoryScroll:  { paddingHorizontal: 14, paddingVertical: 4, gap: 8 },
  chip:            { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6, borderWidth: 1.5, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 3 },
  chipEmoji:       { fontSize: 13 },
  chipLabel:       { fontSize: 11, fontWeight: '700', color: '#374151' },
  loadingBadge:    { alignSelf: 'center', marginTop: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  loadingBadgeText:{ color: '#fff', fontSize: 11, fontWeight: '600' },
  distanceBadge:   { position: 'absolute', bottom: 108, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, elevation: 6, shadowColor: '#6366F1', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 8 },
  distanceText:    { fontSize: 13, fontWeight: '700', color: '#111827' },
  aiBtn:           { position: 'absolute', bottom: 46, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, width: SCREEN_W * 0.72, height: 46, borderRadius: 14, backgroundColor: '#0f0f0f', justifyContent: 'center', elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 },
  aiBtnText:       { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.4 },
  aiBtnBadge:      { backgroundColor: '#6366F1', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  aiBtnBadgeText:  { color: '#fff', fontSize: 10, fontWeight: '800' },
  poiMarkerWithImage: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 8, position: 'relative' },
  markerImage:     { width: '100%', height: '100%', borderRadius: 6 },
  markerBadge:     { position: 'absolute', bottom: -6, right: -6, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3 },
  markerBadgeEmoji:{ fontSize: 11 },
})
