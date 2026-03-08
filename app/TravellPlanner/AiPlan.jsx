import {
  View, StyleSheet, TextInput, Text,
  TouchableOpacity, Image, ScrollView,
  Dimensions, Platform, StatusBar
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps'
import * as Location from 'expo-location'
import { getDistanceKm } from '../../Component/GetMeter'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useLocalSearchParams } from 'expo-router'

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')
const TOP_INSET = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24)

// ─── POI Categories ───────────────────────────────────────────────────────────
const POI_CATEGORIES = [
  { id: 'all',        label: 'All',      icon: '🗺️', color: '#6366F1' },
  { id: 'restaurant', label: 'Food',     icon: '🍽️', color: '#EF4444' },
  { id: 'temple',     label: 'Temple',   icon: '🛕', color: '#F59E0B' },
  { id: 'hotel',      label: 'Hotel',    icon: '🏨', color: '#3B82F6' },
  { id: 'tourist',    label: 'Tourist',  icon: '📸', color: '#8B5CF6' },
  { id: 'hospital',   label: 'Hospital', icon: '🏥', color: '#10B981' },
  { id: 'shop',       label: 'Shopping', icon: '🛍️', color: '#EC4899' },
  { id: 'atm',        label: 'ATM',      icon: '🏧', color: '#14B8A6' },
]

// ─── Category → Unsplash photo keyword ───────────────────────────────────────
// Using Unsplash Source API — free, no key needed
const POI_PHOTO_KEYWORDS = {
  restaurant:    'indian+restaurant+food',
  cafe:          'cafe+coffee+india',
  fast_food:     'street+food+india',
  food_court:    'food+court+india',
  place_of_worship: 'hindu+temple+india',
  temple:        'hindu+temple+india',
  church:        'church+india',
  mosque:        'mosque+india',
  hotel:         'hotel+lobby+india',
  guest_house:   'guesthouse+india',
  hostel:        'hostel+travel',
  attraction:    'tourist+attraction+india',
  monument:      'monument+india',
  museum:        'museum+india',
  viewpoint:     'viewpoint+india+landscape',
  fort:          'fort+india',
  palace:        'palace+india',
  ruins:         'ancient+ruins+india',
  hospital:      'hospital+building',
  clinic:        'clinic+medical',
  pharmacy:      'pharmacy+medicine',
  mall:          'shopping+mall+india',
  supermarket:   'supermarket+india',
  market:        'market+bazaar+india',
  atm:           'atm+bank+india',
  bank:          'bank+building+india',
}

const getPhotoUrl = (type, seed) => {
  const keyword = POI_PHOTO_KEYWORDS[type] || 'india+travel+landmark'
  // Unsplash Source — free, random but seeded by POI id
  return `https://source.unsplash.com/400x300/?${keyword}&sig=${seed}`
}

// ─── Overpass query builder ───────────────────────────────────────────────────
const buildOverpassQuery = (lat, lon, radius = 2000, category) => {
  const bbox = `(around:${radius},${lat},${lon})`
  const queries = {
    restaurant: `node["amenity"~"restaurant|cafe|fast_food|food_court"]${bbox};`,
    temple:     `node["amenity"="place_of_worship"]["religion"~"hindu|buddhist|jain|sikh"]${bbox};node["historic"~"temple"]${bbox};`,
    hotel:      `node["tourism"~"hotel|guest_house|hostel|motel"]${bbox};`,
    tourist:    `node["tourism"~"attraction|viewpoint|museum|monument|artwork"]${bbox};node["historic"~"monument|ruins|fort|palace"]${bbox};`,
    hospital:   `node["amenity"~"hospital|clinic|pharmacy|doctors"]${bbox};`,
    shop:       `node["shop"~"mall|supermarket|market|clothes|jewelry"]${bbox};`,
    atm:        `node["amenity"="atm"]${bbox};node["amenity"="bank"]${bbox};`,
    all:        `node["amenity"~"restaurant|cafe|place_of_worship|hospital|atm|bank"]${bbox};node["tourism"~"hotel|attraction|viewpoint|museum|monument"]${bbox};node["historic"~"monument|temple|fort|palace"]${bbox};`,
  }
  return `[out:json][timeout:25];(${queries[category] || queries.all});out body;`
}

// ─── Fetch POIs ───────────────────────────────────────────────────────────────
const fetchPOIs = async (lat, lon, category = 'all') => {
  try {
    const query = buildOverpassQuery(lat, lon, 2000, category)
    const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query })
    const data = await res.json()
    return (data.elements || [])
      .filter(el => el.lat && el.lon && el.tags)
      .slice(0, 35)
      .map(el => ({
        id: el.id,
        latitude: el.lat,
        longitude: el.lon,
        name: el.tags.name || el.tags['name:en'] || el.tags.amenity || el.tags.tourism || 'Place',
        type: el.tags.amenity || el.tags.tourism || el.tags.historic || el.tags.shop || '',
        cuisine: el.tags.cuisine || '',
        opening_hours: el.tags.opening_hours || '',
        phone: el.tags.phone || el.tags['contact:phone'] || '',
        website: el.tags.website || el.tags['contact:website'] || '',
        rating: el.tags['stars'] || '',
      }))
  } catch (err) {
    console.error('POI fetch error:', err)
    return []
  }
}

// ─── POI style helper ─────────────────────────────────────────────────────────
const getPOIStyle = (type) => {
  if (!type) return { icon: '📍', color: '#6B7280' }
  if (type.match(/restaurant|cafe|fast_food|food/)) return { icon: '🍽️', color: '#EF4444' }
  if (type.match(/worship|temple|church|mosque/))   return { icon: '🛕', color: '#F59E0B' }
  if (type.match(/hotel|guest|hostel|motel/))        return { icon: '🏨', color: '#3B82F6' }
  if (type.match(/attraction|monument|museum|fort|palace|ruins|viewpoint/)) return { icon: '📸', color: '#8B5CF6' }
  if (type.match(/hospital|clinic|pharmacy|doctor/)) return { icon: '🏥', color: '#10B981' }
  if (type.match(/shop|mall|market|supermarket/))    return { icon: '🛍️', color: '#EC4899' }
  if (type.match(/atm|bank/))                        return { icon: '🏧', color: '#14B8A6' }
  return { icon: '📍', color: '#6366F1' }
}

// ─── Nominatim search ─────────────────────────────────────────────────────────
const searchLocation = async (query) => {
  if (!query?.trim() || query === 'Current Location') return null
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&limit=1&countrycodes=in`,
      { headers: { 'User-Agent': 'TravelApp/1.0', 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    if (data?.length > 0) return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon), name: data[0].display_name }
    return null
  } catch { return null }
}

export default function AiPlan() {
  const [region, setRegion] = useState(null)
  const [fromSearch, setFromSearch] = useState('')
  const [toSearch, setToSearch] = useState('')
  const [fromPlace, setFromPlace] = useState(null)
  const [toPlace, setToPlace] = useState(null)
  const [searchingTo, setSearchingTo] = useState(false)
  const [pois, setPois] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loadingPOIs, setLoadingPOIs] = useState(false)
  const [selectedPOI, setSelectedPOI] = useState(null)
  const [photoError, setPhotoError] = useState(false)

  const {
    budgetType, budgetDesc, budgetPic,
    startDate, endDate, tripDuration,
    travelPic, travelType, travelDesc,
  } = useLocalSearchParams()

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
        setFromPlace({ ...ul, name: 'Your Location' })
        setFromSearch('Current Location')
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
    if (p) { setFromPlace(p); const r = { ...p, latitudeDelta: 0.05, longitudeDelta: 0.05 }; setRegion(r); loadPOIs(p.latitude, p.longitude, activeCategory) }
  }

  const handleToSearch = async () => {
    setSearchingTo(true)
    const p = await searchLocation(toSearch)
    setSearchingTo(false)
    if (p) { setToPlace(p); const r = { ...p, latitudeDelta: 0.05, longitudeDelta: 0.05 }; setRegion(r); loadPOIs(p.latitude, p.longitude, activeCategory) }
  }

  const useCurrentLocation = () => {
    if (!region) return
    setFromPlace({ latitude: region.latitude, longitude: region.longitude, name: 'Your Location' })
    setFromSearch('Current Location')
  }

  const swapLocations = () => {
    const [tp, ts] = [fromPlace, fromSearch]
    setFromPlace(toPlace); setFromSearch(toSearch)
    setToPlace(tp); setToSearch(ts)
  }

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
  const categoryBarTop = TOP_INSET + searchCardHeight + 8

  return (
    <View style={s.container}>

      {/* ── Map ── */}
      <MapView
        style={s.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
        mapType="none"
        rotateEnabled pitchEnabled
        onPress={() => setSelectedPOI(null)}
      >
        <UrlTile
          urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
          maximumZ={19} flipY={false} shouldReplaceMapContent
        />

        {fromPlace && toPlace && (
          <Polyline
            coordinates={[
              { latitude: fromPlace.latitude, longitude: fromPlace.longitude },
              { latitude: toPlace.latitude, longitude: toPlace.longitude },
            ]}
            strokeWidth={4} strokeColor="#6366F1" lineDashPattern={[8, 4]}
          />
        )}

        {fromPlace && <Marker coordinate={{ latitude: fromPlace.latitude, longitude: fromPlace.longitude }} pinColor="green" />}
        {toPlace && <Marker coordinate={{ latitude: toPlace.latitude, longitude: toPlace.longitude }} pinColor="red" />}

        {pois.map((poi) => {
          const { icon, color } = getPOIStyle(poi.type)
          return (
            <Marker key={poi.id} coordinate={{ latitude: poi.latitude, longitude: poi.longitude }} onPress={() => { setPhotoError(false); setSelectedPOI(poi) }}>
              <View style={[s.poiMarker, { borderColor: color }]}>
                <Text style={s.poiEmoji}>{icon}</Text>
              </View>
            </Marker>
          )
        })}
      </MapView>

      {/* ── Search Card ── */}
      <View style={[s.searchCard, { top: TOP_INSET }]}>
        {/* From */}
        <View style={s.inputWrapper}>
          <View style={s.iconBox}>
            <FontAwesome6 name="person-dots-from-line" size={18} color="#6366F1" />
          </View>
          <TextInput
            placeholder="From location" placeholderTextColor="#9CA3AF"
            value={fromSearch} onChangeText={setFromSearch}
            onSubmitEditing={handleFromSearch} style={s.input} returnKeyType="search"
          />
          <TouchableOpacity style={s.iconBtn} onPress={useCurrentLocation}>
            <Ionicons name="locate-outline" size={16} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Divider + swap */}
        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          {fromPlace && toPlace && (
            <TouchableOpacity style={s.swapBtn} onPress={swapLocations}>
              <Ionicons name="swap-vertical" size={16} color="#6366F1" />
            </TouchableOpacity>
          )}
          <View style={s.dividerLine} />
        </View>

        {/* To */}
        <View style={[s.inputWrapper, { marginBottom: 0 }]}>
          <View style={s.iconBox}>
            <MaterialCommunityIcons name="target-variant" size={20} color="#EF4444" />
          </View>
          <TextInput
            placeholder="To destination" placeholderTextColor="#9CA3AF"
            value={toSearch} onChangeText={setToSearch}
            onSubmitEditing={handleToSearch} style={s.input} returnKeyType="search"
          />
          <TouchableOpacity style={s.iconBtn} onPress={handleToSearch}>
            {searchingTo
              ? <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '700' }}>...</Text>
              : <Ionicons name="search" size={16} color="#6B7280" />
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Category Filter ── */}
      <View style={[s.categoryBar, { top: categoryBarTop }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categoryScroll}>
          {POI_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id
            return (
              <TouchableOpacity
                key={cat.id}
                style={[s.chip, active && { backgroundColor: cat.color, borderColor: cat.color }]}
                onPress={() => handleCategoryPress(cat.id)}
              >
                <Text style={s.chipEmoji}>{cat.icon}</Text>
                <Text style={[s.chipLabel, active && { color: '#fff' }]}>{cat.label}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        {loadingPOIs && (
          <View style={s.loadingBadge}>
            <Text style={s.loadingBadgeText}>Fetching places…</Text>
          </View>
        )}
      </View>

      {/* ── POI Detail Card with Photo ── */}
      {selectedPOI && (() => {
        const { icon, color } = getPOIStyle(selectedPOI.type)
        const photoUrl = getPhotoUrl(selectedPOI.type, selectedPOI.id)
        return (
          <View style={s.poiCard}>
            {/* Photo */}
            <View style={s.photoContainer}>
              {!photoError ? (
                <Image
                  source={{ uri: photoUrl }}
                  style={s.poiPhoto}
                  onError={() => setPhotoError(true)}
                  resizeMode="cover"
                />
              ) : (
                <View style={[s.poiPhotoFallback, { backgroundColor: color + '22' }]}>
                  <Text style={{ fontSize: 48 }}>{icon}</Text>
                </View>
              )}
              {/* Gradient overlay on photo */}
              <View style={s.photoOverlay} />
              {/* Category badge on photo */}
              <View style={[s.photoBadge, { backgroundColor: color }]}>
                <Text style={s.photoBadgeText}>{selectedPOI.type?.replace(/_/g, ' ') || 'Place'}</Text>
              </View>
              {/* Close button */}
              <TouchableOpacity style={s.closeBtn} onPress={() => setSelectedPOI(null)}>
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={s.poiInfo}>
              <Text style={s.poiName} numberOfLines={2}>{selectedPOI.name}</Text>

              <View style={s.poiMeta}>
                {selectedPOI.cuisine ? (
                  <View style={s.metaChip}>
                    <Text style={s.metaChipText}>🍴 {selectedPOI.cuisine}</Text>
                  </View>
                ) : null}
                {selectedPOI.opening_hours ? (
                  <View style={s.metaChip}>
                    <Text style={s.metaChipText}>🕐 {selectedPOI.opening_hours}</Text>
                  </View>
                ) : null}
                {selectedPOI.phone ? (
                  <View style={s.metaChip}>
                    <Text style={s.metaChipText}>📞 {selectedPOI.phone}</Text>
                  </View>
                ) : null}
              </View>

              {/* Set as destination button */}
              <TouchableOpacity
                style={[s.setDestBtn, { backgroundColor: color }]}
                onPress={() => {
                  setToPlace({ latitude: selectedPOI.latitude, longitude: selectedPOI.longitude, name: selectedPOI.name })
                  setToSearch(selectedPOI.name)
                  setSelectedPOI(null)
                }}
              >
                <Ionicons name="navigate" size={14} color="#fff" />
                <Text style={s.setDestText}>Set as Destination</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })()}

      {/* ── Distance badge ── */}
      {distance !== null && !selectedPOI && (
        <View style={s.distanceBadge}>
          <Ionicons name="navigate-outline" size={13} color="#6366F1" />
          <Text style={s.distanceText}>{distance.toFixed(1)} km away</Text>
        </View>
      )}

      {/* ── AI Travel Assistant ── */}
      {distance !== null && (
        <TouchableOpacity
          style={s.aiBtn}
          onPress={() => router.push({
            pathname: '/CompondData/Agent/Travelagent',
            params: { budgetType, budgetDesc, budgetPic, startDate, endDate, tripDuration, travelPic, travelType, travelDesc, distance },
          })}
          activeOpacity={0.85}
        >
          <Ionicons name="sparkles" size={18} color="white" />
          <Text style={s.aiBtnText}>AI Travel Assistant</Text>
          <View style={s.aiBtnBadge}>
            <Text style={s.aiBtnBadgeText}>{distance.toFixed(0)}km</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  map: { flex: 1 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  loadingText: { fontSize: 18, color: '#6B7280', fontWeight: '600', marginTop: 12 },

  // ── Search Card ──
  searchCard: {
    position: 'absolute', left: 16, right: 16, zIndex: 20,
    backgroundColor: '#fff', borderRadius: 20, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 12,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8F9FC', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: '#EAECF4', marginBottom: 4,
  },
  iconBox: {
    width: 32, height: 32, justifyContent: 'center', alignItems: 'center',
    marginRight: 8, borderRightWidth: 1, borderColor: '#E5E7EB',
  },
  input: { flex: 1, fontSize: 14, color: '#111827', fontWeight: '500', paddingVertical: 6 },
  iconBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', marginVertical: 6, paddingHorizontal: 4,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F3F4F6' },
  swapBtn: {
    marginHorizontal: 10, width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#C7D2FE',
  },

  // ── Category Bar ──
  categoryBar: { position: 'absolute', left: 0, right: 0, zIndex: 10 },
  categoryScroll: { paddingHorizontal: 14, paddingVertical: 4, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 11, paddingVertical: 6,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 4, elevation: 3,
  },
  chipEmoji: { fontSize: 13 },
  chipLabel: { fontSize: 11, fontWeight: '700', color: '#374151' },
  loadingBadge: {
    alignSelf: 'center', marginTop: 6,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 12,
  },
  loadingBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  // ── POI Marker ──
  poiMarker: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 6,
  },
  poiEmoji: { fontSize: 17 },

  // ── POI Card ──
  poiCard: {
    position: 'absolute', bottom: 100, left: 16, right: 16,
    backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 20, elevation: 14,
  },
  photoContainer: { width: '100%', height: 150, position: 'relative' },
  poiPhoto: { width: '100%', height: 150 },
  poiPhotoFallback: {
    width: '100%', height: 150,
    justifyContent: 'center', alignItems: 'center',
  },
  photoOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  photoBadge: {
    position: 'absolute', bottom: 10, left: 12,
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  photoBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  closeBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  poiInfo: { padding: 14 },
  poiName: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 8, lineHeight: 22 },
  poiMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  metaChip: {
    backgroundColor: '#F3F4F6', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  metaChipText: { fontSize: 11, color: '#374151', fontWeight: '500' },
  setDestBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 12,
  },
  setDestText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // ── Distance Badge ──
  distanceBadge: {
    position: 'absolute', bottom: 108, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, elevation: 6,
    shadowColor: '#6366F1', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 8,
  },
  distanceText: { fontSize: 13, fontWeight: '700', color: '#111827' },

  // ── AI Button ──
  aiBtn: {
    position: 'absolute', bottom: 46, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 8,
    width: SCREEN_W * 0.72, height: 46, borderRadius: 14,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    elevation: 12, shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10,
  },
  aiBtnText: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.4 },
  aiBtnBadge: {
    backgroundColor: '#6366F1', borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  aiBtnBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
})
