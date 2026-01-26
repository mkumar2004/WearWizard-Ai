import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Calendar } from 'react-native-calendars'
import { getDatesTrip } from '../../Component/GetDatesTrip'
const Dates = () => {
  const router = useRouter()
  const { travelType, travelDesc ,travelPic} = useLocalSearchParams()
  
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const onDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString)
      setEndDate(null)
    } else if (day.dateString >= startDate) {
      setEndDate(day.dateString)
    } else {
      setStartDate(day.dateString)
    }
  }

  const getMarkedDates = () => {
    if (!startDate) return {}

    let marked = {
      [startDate]: {
        startingDay: true,
        color: '#111827',
        textColor: '#fff',
      },
    }

    if (endDate) {
      let current = new Date(startDate)
      const end = new Date(endDate)

      while (current <= end) {
        const date = current.toISOString().split('T')[0]
        marked[date] = {
          color: '#111827',
          textColor: '#fff',
        }
        current.setDate(current.getDate() + 1)
      }

      marked[startDate].startingDay = true
      marked[endDate] = {
        endingDay: true,
        color: '#111827',
        textColor: '#fff',
      }
    }

    return marked
  }
  
  const tripDuration = getDatesTrip(startDate, endDate);
 
  return (
    <View style={styles.container}>
     
      <View >
        <Pressable onPress={() => router.back()} style={styles.arrow}>
          <AntDesign name="arrow-left" size={26} color="#111827" />
        </Pressable>
        <Text style={styles.title}>Travel Dates</Text>
      </View>

      
      <Calendar
        markingType="period"
        markedDates={getMarkedDates()}
        onDayPress={onDayPress}
        minDate={new Date().toISOString().split('T')[0]}
        theme={{
          textMonthFontWeight: '600',
          textDayFontWeight: '500',
          arrowColor: '#111827',
          todayTextColor: '#111827',
          monthTextColor: '#111827',
        }}
      />

     
      <Pressable
        disabled={!startDate || !endDate}
        style={[
          styles.continueBtn,
          (!startDate || !endDate) && { opacity: 0.4 },
        ]}
        onPress={() =>
          router.push({
            pathname: 'TravellPlanner/Buget',
            params: {
              travelPic,
              travelType,
              travelDesc,
              startDate,
              endDate,
              tripDuration
            },
          })
        }
      >
        <Text style={styles.continueText}>Continue</Text>
      </Pressable>
    </View>
  )
}

export default Dates



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
   arrow: {
    marginTop: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 20,
  },

  continueBtn: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
})
