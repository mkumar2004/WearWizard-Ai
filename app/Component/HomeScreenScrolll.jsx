import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSeasonalData } from '../../src/redux/slice/Seasonal'
import { useRouter } from 'expo-router'
// Import SVG icons
import SpringIcon from '../../assets/images/Spring.svg'
import SummerIcon from '../../assets/images/Summer.svg'
import AutumnIcon from '../../assets/images/Aurumn.svg'
import WinterIcon from '../../assets/images/Winter.svg'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH - 40 // Account for padding
const CARD_SPACING = 10

const HomeScreenScrolll = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const flatListRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { seasons = [], loading } = useSelector((state) => state.season)
  const { user } = useSelector((state) => state.auth)
  const userId = user?._id

  // Get Season Icon Component
  const getSeasonIcon = (seasonType) => {
    switch (seasonType?.toLowerCase()) {
      case 'spring':
        return <SpringIcon width={60} height={60} />
      case 'summer':
        return <SummerIcon width={60} height={60} />
      case 'autumn':
      case 'fall':
        return <AutumnIcon width={60} height={60} />
      case 'winter':
        return <WinterIcon width={60} height={60} />
      default:
        return null
    }
  }

  // Season colors
  const getSeasonColors = (seasonType) => {
    switch (seasonType?.toLowerCase()) {
      case 'spring':
        return {
          bg: '#FFF0F5',
          accent: '#FF69B4',
        }
      case 'summer':
        return {
          bg: '#FFF8DC',
          accent: '#FFA500',
        }
      case 'autumn':
      case 'fall':
        return {
          bg: '#FFF5EE',
          accent: '#FF8C00',
        }
      case 'winter':
        return {
          bg: '#F0F8FF',
          accent: '#87CEEB',
        }
      default:
        return {
          bg: '#f5f5f5',
          accent: '#ff7a00',
        }
    }
  }

  // Fetch data
  useEffect(() => {
    dispatch(fetchSeasonalData(userId))
  }, [userId])

  // Auto scroll
  useEffect(() => {
    if (seasons.length <= 1) return

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % seasons.length

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      })

      setCurrentIndex(nextIndex)
    }, 3000)

    return () => clearInterval(interval)
  }, [currentIndex, seasons.length])

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const handleSeasonPress = (item) => {
    const seasonType = item?.seasonType
    const season = item?.data?.[seasonType] || {}
    router.push({
      pathname: 'Component/AllSeasonal',
      params: {
        city: season.city || 'Madurai',
        seasonType: seasonType || 'summer',
        title: season.title || '',
        subtitle: season.subtitle || '',
        numberOfDays: season.numberOfDays || 3,
        rating: season.rating || 4.5,
        cost: season.cost || '',
      }
    })
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Upcoming Trip</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 18 }}>{'⋮'}</Text>
        </TouchableOpacity>
      </View>

      {/* Slider */}
      <FlatList
        ref={flatListRef}
        data={seasons}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id.toString()}
        snapToInterval={CARD_WIDTH + CARD_SPACING * 2}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}

        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + CARD_SPACING * 2,
          offset: (CARD_WIDTH + CARD_SPACING * 2) * index,
          index,
        })}

        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING * 2)
          )
          setCurrentIndex(index)
        }}

        renderItem={({ item }) => {
          const seasonType = item?.seasonType
          const season = item?.data?.[seasonType]

          if (!season) return <View style={{ width: CARD_WIDTH + CARD_SPACING * 2 }} />

          const colors = getSeasonColors(seasonType)

          return (
            <View style={styles.cardWrapper}>
              <TouchableOpacity
                onPress={() => handleSeasonPress(item)}
                style={[
                  styles.card,
                  { backgroundColor: colors.bg }
                ]}
              >
                {/* Season Icon */}
                <View style={styles.iconContainer}>
                  {getSeasonIcon(seasonType)}
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <View style={styles.seasonBadgeContainer}>
                    <Text style={[styles.seasonBadge, { color: colors.accent }]}>
                      {seasonType?.toUpperCase()}
                    </Text>
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {season.title}
                  </Text>

                  <Text style={styles.cardDate}>
                    {season.city} • {season.numberOfDays} Days
                  </Text>

                  <Text style={styles.cardSubtitle} numberOfLines={2}>
                    {season.subtitle}
                  </Text>
                </View>

                {/* Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.cardRating}>⭐ {season.rating}</Text>
                  </View>
                  <Text style={[styles.cardCost, { color: colors.accent }]}>
                    ${season.cost}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        }}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {seasons.map((item, index) => {
          const colors = getSeasonColors(item.seasonType)
          return (
            <View
              key={item._id}
              style={[
                styles.dot,
                currentIndex === index && [
                  styles.activeDot,
                  { backgroundColor: colors.accent }
                ],
              ]}
            />
          )
        })}
      </View>
    </View>
  )
}

export default HomeScreenScrolll

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'grey'
  },
  cardWrapper: {
    width: CARD_WIDTH + CARD_SPACING * 2,
    paddingHorizontal: CARD_SPACING,
  },
  card: {
    width: CARD_WIDTH,
    padding: 20,
    borderRadius: 20,
    height: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    opacity: 0.3,
  },
  cardContent: {
    flex: 1,
  },
  seasonBadgeContainer: {
   
  },
  seasonBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888',
    textTransform: 'capitalize',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cardCost: {
    fontSize: 22,
    fontWeight: '800',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
  },
})