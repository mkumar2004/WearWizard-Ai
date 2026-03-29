import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { searchLocation } from './AiPlanHelpers';

export default function MapSearchCard({
  topInset,
  fromSearch,
  setFromSearch,
  handleFromSearch,
  useCurrentLocation,
  fromPlace,
  toPlace,
  swapLocations,
  toSearch,
  setToSearch,
  handleToSearch,
  searchingTo,
  onSelectPrediction
}) {
  const [activeInput, setActiveInput] = useState(null); // 'from' | 'to' | null
  const [fromPredictions, setFromPredictions] = useState([]);
  const [toPredictions, setToPredictions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timer;
    if (activeInput === 'from' && fromSearch?.length > 2) {
      setIsTyping(true);
      timer = setTimeout(async () => {
        const results = await searchLocation(fromSearch, 5);
        setFromPredictions(results || []);
        setIsTyping(false);
      }, 800);
    } else {
      setFromPredictions([]);
    }
    return () => clearTimeout(timer);
  }, [fromSearch, activeInput]);

  useEffect(() => {
    let timer;
    if (activeInput === 'to' && toSearch?.length > 2) {
      setIsTyping(true);
      timer = setTimeout(async () => {
        const results = await searchLocation(toSearch, 5);
        setToPredictions(results || []);
        setIsTyping(false);
      }, 800);
    } else {
      setToPredictions([]);
    }
    return () => clearTimeout(timer);
  }, [toSearch, activeInput]);

  const renderDropdown = (type) => {
    const data = type === 'from' ? fromPredictions : toPredictions;
    if (activeInput !== type || data.length === 0) return null;

    return (
      <View style={styles.dropdownContainer}>
        <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
          {data.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.dropdownItem}
              onPress={() => {
                setActiveInput(null);
                onSelectPrediction(type, item);
              }}
            >
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text style={styles.dropdownText} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.searchCard, { top: topInset }]}>
      <View style={[styles.inputWrapper, activeInput === 'from' && { borderColor: '#6366F1' }]}>
        <View style={styles.iconBox}><FontAwesome6 name="person-dots-from-line" size={18} color="#6366F1" /></View>
        <TextInput 
          placeholder="From location" placeholderTextColor="#9CA3AF" 
          value={fromSearch} onChangeText={setFromSearch} 
          onSubmitEditing={() => { setActiveInput(null); handleFromSearch(); }} 
          style={styles.input} returnKeyType="search" 
          onFocus={() => setActiveInput('from')}
          onBlur={() => setTimeout(() => setActiveInput(null), 200)}
        />
        <TouchableOpacity style={styles.iconBtn} onPress={useCurrentLocation}>
          <Ionicons name="locate-outline" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>
      
      {renderDropdown('from')}

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        {fromPlace && toPlace && (
          <TouchableOpacity style={styles.swapBtn} onPress={swapLocations}>
            <Ionicons name="swap-vertical" size={16} color="#6366F1" />
          </TouchableOpacity>
        )}
        <View style={styles.dividerLine} />
      </View>

      <View style={[styles.inputWrapper, { marginBottom: 0 }, activeInput === 'to' && { borderColor: '#6366F1' }]}>
        <View style={styles.iconBox}><MaterialCommunityIcons name="target-variant" size={20} color="#EF4444" /></View>
        <TextInput 
          placeholder="To destination" placeholderTextColor="#9CA3AF" 
          value={toSearch} onChangeText={setToSearch} 
          onSubmitEditing={() => { setActiveInput(null); handleToSearch(); }} 
          style={styles.input} returnKeyType="search" 
          onFocus={() => setActiveInput('to')}
          onBlur={() => setTimeout(() => setActiveInput(null), 200)}
        />
        <TouchableOpacity style={styles.iconBtn} onPress={() => { setActiveInput(null); handleToSearch(); }}>
          {searchingTo || (activeInput === 'to' && isTyping) ? 
            <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '700' }}>...</Text> 
            : <Ionicons name="search" size={16} color="#6B7280" />
          }
        </TouchableOpacity>
      </View>

      {renderDropdown('to')}
      
    </View>
  );
}

const styles = StyleSheet.create({
  searchCard:      { position: 'absolute', left: 16, right: 16, zIndex: 20, backgroundColor: '#fff', borderRadius: 20, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 12 },
  inputWrapper:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FC', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#EAECF4', marginBottom: 4 },
  iconBox:         { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', marginRight: 8, borderRightWidth: 1, borderColor: '#E5E7EB' },
  input:           { flex: 1, fontSize: 14, color: '#111827', fontWeight: '500', paddingVertical: 6 },
  iconBtn:         { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  dividerRow:      { flexDirection: 'row', alignItems: 'center', marginVertical: 6, paddingHorizontal: 4 },
  dividerLine:     { flex: 1, height: 1, backgroundColor: '#F3F4F6' },
  swapBtn:         { marginHorizontal: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#C7D2FE' },
  dropdownContainer: { backgroundColor: '#fff', borderRadius: 12, marginTop: 4, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 6, zIndex: 30 },
  dropdownScroll:  { maxHeight: 180 },
  dropdownItem:    { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownText:    { flex: 1, fontSize: 13, color: '#374151', marginLeft: 8 },
});
