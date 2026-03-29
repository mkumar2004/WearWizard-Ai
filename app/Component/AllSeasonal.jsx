import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  ActivityIndicator, Dimensions, StatusBar
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import axios from 'axios'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const SEASON_THEMES = {
  spring: { gradient: ['#FF9A9E', '#FECFEF'], accent: '#FF69B4', emoji: '🌸', bg: '#FFF0F5' },
  summer: { gradient: ['#F7971E', '#FFD200'], accent: '#FFA500', emoji: '☀️', bg: '#FFF8DC' },
  autumn: { gradient: ['#FF512F', '#DD2476'], accent: '#FF8C00', emoji: '🍂', bg: '#FFF5EE' },
  fall:   { gradient: ['#FF512F', '#DD2476'], accent: '#FF8C00', emoji: '🍂', bg: '#FFF5EE' },
  winter: { gradient: ['#4facfe', '#00f2fe'], accent: '#4facfe', emoji: '❄️', bg: '#F0F8FF' },
}

const AllSeasonal = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { city, seasonType, title, subtitle, numberOfDays, rating, cost } = params

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const theme = SEASON_THEMES[seasonType?.toLowerCase()] || SEASON_THEMES.summer

  useEffect(() => {
    fetchDetails()
  }, [])

  const fetchDetails = async () => {
    try {
      setLoading(true)
      const resp = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/TripPlan/seasonal-detail`,
        { city, seasonType, title, subtitle, numberOfDays: parseInt(numberOfDays), rating, cost }
      )
      setData(resp.data)
    } catch (err) {
      setError('Could not load trip details. Please try again.')
      console.error('Seasonal detail error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={theme.gradient} style={styles.loadingGrad}>
          <Text style={styles.loadingEmoji}>{theme.emoji}</Text>
          <Text style={styles.loadingTitle}>Preparing your {seasonType} guide...</Text>
          <ActivityIndicator color="#fff" size="large" style={{ marginTop: 20 }} />
          <Text style={styles.loadingSubtitle}>Fetching real data from Sanity + AI</Text>
        </LinearGradient>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorScreen}>
        <Text style={{ fontSize: 50 }}>😞</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchDetails}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const heroImage = data?.images?.cover
  const galleryImages = data?.images?.gallery || []

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* HERO */}
      <View style={styles.hero}>
        {heroImage ? (
          <Image source={{ uri: heroImage }} style={styles.heroImage} contentFit="cover" transition={600} />
        ) : (
          <LinearGradient colors={theme.gradient} style={styles.heroImage} />
        )}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.heroOverlay} />

        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Hero Content */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.heroContent}>
          <View style={styles.seasonBadge}>
            <Text style={styles.seasonEmoji}>{theme.emoji}</Text>
            <Text style={[styles.seasonLabel, { color: theme.accent }]}>
              {seasonType?.toUpperCase()} TRIP
            </Text>
          </View>
          <Text style={styles.heroTitle}>{data?.title || title}</Text>
          {data?.tagline ? (
            <Text style={styles.heroTagline}>"{data.tagline}"</Text>
          ) : null}
          <View style={styles.heroMeta}>
            <View style={styles.heroPill}>
              <Ionicons name="time-outline" size={13} color="#fff" />
              <Text style={styles.heroPillText}>{numberOfDays} Days</Text>
            </View>
            <View style={styles.heroPill}>
              <Ionicons name="star" size={13} color="#FFD700" />
              <Text style={styles.heroPillText}>{rating}</Text>
            </View>
            <View style={[styles.heroPill, { backgroundColor: theme.accent + 'BB' }]}>
              <Text style={styles.heroPillText}>{cost || data?.budgetBreakdown?.total}</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* TABS */}
        <View style={styles.tabRow}>
          {['overview', 'activities', 'food', 'tips'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && { borderBottomColor: theme.accent, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && { color: theme.accent, fontWeight: '800' }]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.tabContent}>

            {/* Overview Text */}
            {data?.overview ? (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>✨ About This Trip</Text>
                <Text style={styles.overviewText}>{data.overview}</Text>
              </View>
            ) : null}

            {/* Weather */}
            {data?.weatherInfo ? (
              <View style={[styles.card, { backgroundColor: theme.bg }]}>
                <Text style={styles.sectionTitle}>🌤️ Weather</Text>
                <Text style={styles.weatherText}>{data.weatherInfo}</Text>
                <Text style={styles.bestTime}>Best time: {data.bestTimeToVisit}</Text>
              </View>
            ) : null}

            {/* Highlights */}
            {data?.highlights?.length ? (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>🎯 Highlights</Text>
                {data.highlights.map((h, i) => (
                  <View key={i} style={styles.highlightRow}>
                    <View style={[styles.highlightDot, { backgroundColor: theme.accent }]} />
                    <Text style={styles.highlightText}>{h}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>📸 Gallery</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {galleryImages.map((url, i) => (
                    <Image key={i} source={{ uri: url }} style={styles.galleryImg} contentFit="cover" transition={400} />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Budget Breakdown */}
            {data?.budgetBreakdown ? (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>💰 Budget Breakdown</Text>
                {Object.entries(data.budgetBreakdown).map(([key, val]) => (
                  <View key={key} style={styles.budgetRow}>
                    <Text style={styles.budgetKey}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <Text style={[styles.budgetVal, key === 'total' && { color: theme.accent, fontWeight: '800' }]}>{val}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </Animated.View>
        )}

        {/* ACTIVITIES TAB */}
        {activeTab === 'activities' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.tabContent}>
            {(data?.activities || []).map((act, i) => (
              <View key={i} style={styles.actCard}>
                <Text style={styles.actIcon}>{act.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actName}>{act.name}</Text>
                  <Text style={styles.actDuration}>⏱ {act.duration}</Text>
                  <Text style={styles.actTip}>💡 {act.tip}</Text>
                </View>
              </View>
            ))}
            {/* Sanity Attractions */}
            {(data?.images?.attractions || []).filter(a => a.image).map((a, i) => (
              <View key={'s' + i} style={styles.attractionCard}>
                <Image source={{ uri: a.image }} style={styles.attractionImg} contentFit="cover" />
                <View style={styles.attractionInfo}>
                  <Text style={styles.attractionName}>{a.name}</Text>
                  {a.description ? <Text style={styles.attractionDesc} numberOfLines={2}>{a.description}</Text> : null}
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* FOOD TAB */}
        {activeTab === 'food' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.tabContent}>
            {(data?.localFood || []).map((f, i) => (
              <View key={i} style={[styles.foodCard, { borderLeftColor: theme.accent }]}>
                <Text style={styles.foodEmoji}>{f.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.foodName}>{f.name}</Text>
                  <Text style={styles.foodDesc}>{f.description}</Text>
                </View>
              </View>
            ))}
            {/* Sanity Food Images */}
            {(data?.images?.food || []).filter(f => f.image).map((f, i) => (
              <View key={'sf' + i} style={styles.sanityFoodCard}>
                <Image source={{ uri: f.image }} style={styles.sanityFoodImg} contentFit="cover" />
                <View style={styles.sanityFoodInfo}>
                  <Text style={styles.foodName}>{f.name}</Text>
                  {f.price ? <Text style={styles.foodDesc}>₹{f.price}</Text> : null}
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* TIPS TAB */}
        {activeTab === 'tips' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>🎒 Packing Tips</Text>
              {(data?.packingTips || []).map((tip, i) => (
                <View key={i} style={styles.highlightRow}>
                  <Text style={{ fontSize: 18 }}>•</Text>
                  <Text style={styles.highlightText}>{tip}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.card, { backgroundColor: theme.bg }]}>
              <Text style={styles.sectionTitle}>📅 Best Time to Visit</Text>
              <Text style={styles.overviewText}>{data?.bestTimeToVisit}</Text>
            </View>
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

export default AllSeasonal

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  // Loading
  loadingScreen: { flex: 1 },
  loadingGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingEmoji: { fontSize: 60, marginBottom: 16 },
  loadingTitle: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center', paddingHorizontal: 20 },
  loadingSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 12 },

  // Error
  errorScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  errorText: { fontSize: 16, color: '#64748b', textAlign: 'center', marginTop: 12 },
  retryBtn: { marginTop: 20, backgroundColor: '#4f46e5', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 30 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Hero
  hero: { height: SCREEN_HEIGHT * 0.42, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', bottom: 0, height: '70%', width: '100%' },
  backBtn: {
    position: 'absolute', top: 52, left: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center'
  },
  heroContent: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  seasonBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  seasonEmoji: { fontSize: 16, marginRight: 6 },
  seasonLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 6 },
  heroTagline: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontStyle: 'italic', marginBottom: 12 },
  heroMeta: { flexDirection: 'row', gap: 8 },
  heroPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20
  },
  heroPillText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Tabs
  tabRow: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabText: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  tabContent: { padding: 16 },

  // Cards
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  overviewText: { fontSize: 15, color: '#475569', lineHeight: 24 },
  weatherText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  bestTime: { marginTop: 8, fontSize: 13, fontWeight: '700', color: '#64748b' },

  // Highlights
  highlightRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 10 },
  highlightDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  highlightText: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 22 },

  // Gallery
  galleryImg: { width: 140, height: 100, borderRadius: 12, marginRight: 10 },

  // Budget
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  budgetKey: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  budgetVal: { fontSize: 14, color: '#334155', fontWeight: '700' },

  // Activities
  actCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  actIcon: { fontSize: 30 },
  actName: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  actDuration: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  actTip: { fontSize: 12, color: '#94a3b8' },
  attractionCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  attractionImg: { width: '100%', height: 160 },
  attractionInfo: { padding: 12 },
  attractionName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  attractionDesc: { fontSize: 13, color: '#64748b', marginTop: 4 },

  // Food
  foodCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', gap: 14, borderLeftWidth: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  foodEmoji: { fontSize: 30 },
  foodName: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  foodDesc: { fontSize: 13, color: '#64748b' },
  sanityFoodCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  sanityFoodImg: { width: '100%', height: 140 },
  sanityFoodInfo: { padding: 12 },
})