import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator, StatusBar, RefreshControl
} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyPlans } from '../../src/redux/slice/Travel'
import { useFocusEffect, router } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Goals = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { myPlans, loading } = useSelector(state => state.travel)
  const [refreshing, setRefreshing] = useState(false)

  const loadPlans = useCallback(() => {
    if (user?._id) {
      dispatch(fetchMyPlans(user._id))
    }
  }, [user?._id, dispatch])

  useFocusEffect(
    useCallback(() => {
      loadPlans()
    }, [loadPlans])
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await loadPlans()
    setRefreshing(false)
  }

  const handleSelectPlan = (plan) => {
    // We update the Redux state with the selected plan so Transport screen can show it
    dispatch({ type: 'travel/generateTripPlan/fulfilled', payload: plan })
    router.push('/TravellPlanner/Transport')
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={s.card}
      onPress={() => handleSelectPlan(item)}
      activeOpacity={0.9}
    >
      <View style={s.cardInner}>
        {item.photos?.cover ? (
          <Image source={{ uri: item.photos.cover }} style={s.cover} />
        ) : (
          <View style={[s.cover, { backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name="image-outline" size={32} color="#cbd5e1" />
          </View>
        )}
        <View style={s.content}>
          <View style={s.row}>
            <Text style={s.toLocation} numberOfLines={1}>{item.toLocation}</Text>
            <View style={s.badge}>
              <Text style={s.badgeText}>{item.tripDuration}D</Text>
            </View>
          </View>
          <Text style={s.subText}>{item.fromLocation} → {item.toLocation}</Text>
          <View style={s.footer}>
            <Text style={s.dateText}>📅 {item.startDate || 'Saved trip'}</Text>
            <Text style={s.viewText}>View Plan ➔</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading && !refreshing && myPlans.length === 0) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={s.loadingText}>Fetching your goals...</Text>
      </View>
    )
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.title}>My Saved Plans</Text>
        <Text style={s.subtitle}>Review your AI-generated travel goals</Text>
      </View>

      {/* CATEGORY GRID: FOUR ICON LAYOUT */}
      <View style={s.gridContainer}>
        <View style={s.gridRow}>
          <CategoryItem 
            icon="account-star-outline" 
            label="User Plan" 
            onPress={() => Alert.alert("Coming Soon", "Manual planning will be available in the next update!")} 
          />
          <CategoryItem 
            icon="lightning-bolt-outline" 
            label="Smart Plan" 
            onPress={() => Alert.alert("Coming Soon", "Smart optimized itineraries are coming soon!")} 
          />
        </View>
        <View style={[s.gridRow, { marginTop: 15 }]}>
          <CategoryItem 
            icon="rocket-launch-outline" 
            label="Future Plan" 
            onPress={() => Alert.alert("Coming Soon", "Bucket list goals are coming soon!")} 
          />
          <CategoryItem 
            icon="robot-outline" 
            label="AI Plan" 
            onPress={() => router.push('/Home')} 
            highlight
          />
        </View>
      </View>

      <FlatList
        data={myPlans}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={s.listTitle}>Recent Plans</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <MaterialCommunityIcons name="airplane-takeoff" size={60} color="#e2e8f0" />
            <Text style={s.emptyTitle}>No plans yet!</Text>
            <Text style={s.emptySub}>Your AI trip plans will appear here once you generate them.</Text>
            <TouchableOpacity style={s.btn} onPress={() => router.push('/Home')}>
              <Text style={s.btnText}>Start Planning</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}

const CategoryItem = ({ icon, label, onPress, highlight }) => (
  <TouchableOpacity 
    style={[s.catBox, highlight && s.catBoxHighlight]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[s.catIconWrap, highlight && { backgroundColor: '#4f46e5' }]}>
      <MaterialCommunityIcons 
        name={icon} 
        size={32} 
        color={highlight ? '#FFFFFF' : '#4f46e5'} 
      />
    </View>
    <Text style={[s.catLabel, highlight && { color: '#4f46e5' }]}>{label}</Text>
  </TouchableOpacity>
)

export default Goals

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 15 },
  title: { fontSize: 30, fontWeight: '900', color: '#1e293b', letterSpacing: -1 },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  
  gridContainer: { paddingHorizontal: 24, marginBottom: 30 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  catBox: { 
    width: '47.5%', 
    aspectRatio: 1,
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 20, 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10
  },
  catBoxHighlight: { borderColor: '#eef2ff', backgroundColor: '#fcfdff' },
  catIconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#f5f7ff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  catLabel: { fontSize: 13, fontWeight: '800', color: '#334155', textAlign: 'center' },

  list: { paddingHorizontal: 20, paddingBottom: 40 },
  listTitle: { fontSize: 13, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15, marginTop: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 12, color: '#64748b', fontWeight: '500' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  cardInner: { flexDirection: 'row', overflow: 'hidden' },
  cover: { width: 100, height: 100, borderRadius: 16, margin: 10 },
  content: { flex: 1, paddingRight: 15, paddingVertical: 15, justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toLocation: { fontSize: 18, fontWeight: '800', color: '#1e293b', flex: 1 },
  badge: { backgroundColor: '#eef2ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#4f46e5' },
  subText: { fontSize: 12, color: '#64748b', marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  dateText: { fontSize: 11, fontWeight: '600', color: '#94a3b8' },
  viewText: { fontSize: 11, fontWeight: '800', color: '#4f46e5' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginTop: 10 },
  emptySub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 6, lineHeight: 20 },
  btn: { backgroundColor: '#4f46e5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 20 },
  btnText: { color: '#fff', fontWeight: '800' }
})