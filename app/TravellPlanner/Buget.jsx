import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
  useWindowDimensions
} from 'react-native'
import React from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Budget } from '../../Component/Traveldata'

const { width } = Dimensions.get('window')

const Buget = () => {
  const router = useRouter()
  const { width } = useWindowDimensions()
    const { travelPic,
              travelType,
              travelDesc,
              startDate,
              endDate,
              tripDuration } = useLocalSearchParams()
  return (
    <View style={[styles.container, { padding: width * 0.045 }]}>
      
      {/* Back Arrow */}
      <Pressable
        onPress={() => router.back()}
        style={[
          styles.arrow,
          {
            width: width * 0.11,
            height: width * 0.11,
            borderRadius: width * 0.055,
          },
        ]}
      >
        <AntDesign name="arrow-left" size={width * 0.06} color="#111827" />
      </Pressable>

     
      <Text style={[styles.title, { fontSize: width * 0.08 }]}>
        Budget
      </Text>

    
      <View style={{ flex: 1, marginTop: width * 0.03 }}>
        {Budget.map((item) => (
          <Pressable
            key={item.id}
            style={{ marginBottom: width * 0.04 }}
            onPress={() =>
              router.push({
                pathname: 'TravellPlanner/AiPlan',
                params: {
                  budgetType: item.title,
                  budgetDesc: item.description,
                  budgetPic: item.pic.uri,
                  startDate,
                  endDate,
                  tripDuration,
                  travelPic,
                  travelType,
                  travelDesc,

                },
              })
            }
          >
            <View style={[styles.card, { padding: width * 0.045 }]}>
              
              <View style={styles.leftSection}>
                <View
                  style={[styles.badge, { width: width * 0.05 }]}
                />
                <Text
                  style={[styles.cardTitle, { fontSize: width * 0.05 }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.cardDescription,
                    { fontSize: width * 0.038 },
                  ]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              </View>

              <View
                style={[
                  styles.imageWrapper,
                  {
                    width: width * 0.23,
                    height: width * 0.23,
                    borderRadius: width * 0.06,
                  },
                ]}
              >
                <Image
                  source={item.pic}
                  style={{
                    width: width * 0.19,
                    height: width * 0.19,
                    borderRadius: width * 0.045,
                  }}
                />
              </View>

            </View>
          </Pressable>
        ))}
      </View>

    </View>
  )
}


export default Buget
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  title: {
    fontWeight: '700',
  
    color: '#111827',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  leftSection: {
    flex: 1,
    paddingRight: 10,
  },

  badge: {
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    marginBottom: 8,
  },

  cardTitle: {
    fontWeight: '700',
    color: '#111827',
  },

  cardDescription: {
    marginTop: 2,
    color: '#6B7280',
    lineHeight: 18,
  },

  imageWrapper: {
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
})

