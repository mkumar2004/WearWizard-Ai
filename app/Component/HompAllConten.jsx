import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTravelPlace } from '../../src/redux/slice/TravelPlace'
import { fetchLike } from '../../src/redux/slice/Interaction'
import { useRouter } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import Fontisto from '@expo/vector-icons/Fontisto'
import AntDesign from '@expo/vector-icons/AntDesign'
import Comments from '../CompondData/Comments'
import { LinearGradient } from 'expo-linear-gradient'

const CHUNK_SIZE = 10

const HompAllConten = ({ selectedCity }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector(state => state.auth)
  const userId = user?._id

  const { items, loading } = useSelector(state => state.TravelPlace)
  const { likesByLocation } = useSelector(state => state.interaction)

  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE)
  const [showComment, setShowComment] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (userId) {
      dispatch(fetchTravelPlace({ userId, city: selectedCity, limit: 30 }))
    }
  }, [userId, selectedCity])

  useEffect(() => {
    if (visibleCount >= items.length) return
    const t = setTimeout(
      () => setVisibleCount(p => p + CHUNK_SIZE),
      800
    )
    return () => clearTimeout(t)
  }, [visibleCount, items.length])

  const handleLike = item => {
    dispatch(fetchLike({ userId, locationId: item._id }))
  }

  if (loading && items.length === 0) {
    return <ActivityIndicator size="large" color="#fff" />
  }

  return (
    <View style={styles.container}>
      {items.slice(0, visibleCount).map(item => {
        const likeInfo = likesByLocation[item._id] || {
          liked: false,
          likeCount: 0,
        }

        return (
          <View key={item._id} style={styles.card}>
            {/* IMAGE */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.mainimage }} style={styles.image} />

              {/* GRADIENT OVERLAY */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={styles.gradient}
              />

              {/* LEFT ACTIONS */}
              <View style={styles.leftActions}>
                <TouchableOpacity
                  style={styles.iconBox}
                  onPress={() => handleLike(item)}
                >
                  <Feather
                    name="heart"
                    size={30}
                    color={likeInfo.liked ? '#ff2e63' : '#fff'}
                  />
                  <Text style={styles.count}>
                    {likeInfo.likeCount}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconBox}
                  onPress={() => {
                    setSelectedItem(item)
                    setShowComment(true)
                  }}
                >
                  <Fontisto name="comment" size={26} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBox}>
                  <AntDesign name="share-alt" size={26} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* TEXT ON IMAGE */}
              <Pressable
                style={styles.textOverlay}
                onPress={() => router.push('Component/AllLocation')}
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>

                <View style={styles.ratingRow}>
                  <Feather name="star" size={14} color="#FFD700" />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>
              </Pressable>
            </View>
          </View>
        )
      })}

      <Comments
        visible={showComment}
        item={selectedItem}
        onClose={() => setShowComment(false)}
      />
    </View>
  )
}

export default HompAllConten

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },

  card: {
    marginBottom: 22,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 8,
  },

  imageWrapper: {
    height: 460,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    height: '55%',
    width: '100%',
  },

  leftActions: {
    position: 'absolute',
    left: 14,

    gap: 24,
    top:10
  },

  iconBox: {
    alignItems: 'center',
    padding: 5,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(10px)',
  
  },

  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },

  textOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  subtitle: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 4,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },

  rating: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
})
