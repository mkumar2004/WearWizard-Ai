import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getPOIStyle, getPhotoUrl } from './AiPlanHelpers';

export default function PoiDetailCard({
  selectedPOI,
  setSelectedPOI,
  photoError,
  setPhotoError,
  setToPlace,
  setToSearch,
  fromPlace,
  mapRef
}) {
  if (!selectedPOI) return null;

  const { icon, color } = getPOIStyle(selectedPOI.type);
  const photoUrl = getPhotoUrl(selectedPOI.type, selectedPOI.id);

  return (
    <View style={styles.poiCard}>
      <View style={styles.photoContainer}>
        {!photoError ? (
          <Image 
            source={{ uri: photoUrl }} 
            style={styles.poiPhoto} 
            onError={() => setPhotoError(true)} 
            resizeMode="cover" 
          />
        ) : (
          <View style={[styles.poiPhotoFallback, { backgroundColor: color + '22' }]}>
            <Text style={{ fontSize: 48 }}>{icon}</Text>
          </View>
        )}
        <View style={styles.photoOverlay} />
        <View style={[styles.photoBadge, { backgroundColor: color }]}>
          <Text style={styles.photoBadgeText}>
            {selectedPOI.type?.replace(/_/g, ' ') || 'Place'}
          </Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedPOI(null)}>
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.poiInfo}>
        <Text style={styles.poiName} numberOfLines={2}>{selectedPOI.name}</Text>
        <View style={styles.poiMeta}>
          {selectedPOI.cuisine ? (
            <View style={styles.metaChip}><Text style={styles.metaChipText}>🍴 {selectedPOI.cuisine}</Text></View>
          ) : null}
          {selectedPOI.opening_hours ? (
            <View style={styles.metaChip}><Text style={styles.metaChipText}>🕐 {selectedPOI.opening_hours}</Text></View>
          ) : null}
          {selectedPOI.phone ? (
            <View style={styles.metaChip}><Text style={styles.metaChipText}>📞 {selectedPOI.phone}</Text></View>
          ) : null}
        </View>
        <TouchableOpacity 
          style={[styles.setDestBtn, { backgroundColor: color }]} 
          onPress={() => { 
            setToPlace({ latitude: selectedPOI.latitude, longitude: selectedPOI.longitude, name: selectedPOI.name }); 
            setToSearch(selectedPOI.name); 
            setSelectedPOI(null);
            if (fromPlace && mapRef?.current) {
              mapRef.current.fitToCoordinates([
                { latitude: fromPlace.latitude, longitude: fromPlace.longitude },
                { latitude: selectedPOI.latitude, longitude: selectedPOI.longitude }
              ], { edgePadding: { top: 100, right: 60, bottom: 380, left: 60 }, animated: true });
            }
          }}
        >
          <Ionicons name="navigate" size={14} color="#fff" />
          <Text style={styles.setDestText}>Set as Destination</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  poiCard:         { position: 'absolute', bottom: 100, left: 16, right: 16, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 20, elevation: 14 },
  photoContainer:  { width: '100%', height: 150, position: 'relative' },
  poiPhoto:        { width: '100%', height: 150 },
  poiPhotoFallback:{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center' },
  photoOverlay:    { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(0,0,0,0.3)' },
  photoBadge:      { position: 'absolute', bottom: 10, left: 12, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  photoBadgeText:  { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  closeBtn:        { position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  poiInfo:         { padding: 14 },
  poiName:         { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 8, lineHeight: 22 },
  poiMeta:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  metaChip:        { backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  metaChipText:    { fontSize: 11, color: '#374151', fontWeight: '500' },
  setDestBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12 },
  setDestText:     { color: '#fff', fontWeight: '700', fontSize: 13 },
});
