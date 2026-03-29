import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router';

const AddModal = ({ visible, onClose }) => {
  const router = useRouter();
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Plan Your Trip</Text>

          <TouchableOpacity style={styles.option}
            onPress={()=>router.push('TravellPlanner/CreateTrip')}
            // onPress={()=>router.push('TravellPlanner/Transport')}
          >
            <Ionicons name="map-outline" size={22} />
            <Text style={styles.optionText}>Create Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}
            onPress={()=>router.push('TravellPlanner/Goal')}
          >
            <Ionicons name="flag-outline" size={22} />
            <Text style={styles.optionText}>Add Goal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}
            onPress={()=>router.push('TravellPlanner/SmartTrip')}
          >
            <Ionicons name="navigate-outline" size={22} />

            <Text style={styles.optionText}>Smart Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default AddModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  cancel: {
    textAlign: 'center',
    color: 'red',
    marginTop: 12,
  },
})
