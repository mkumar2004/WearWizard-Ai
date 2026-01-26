import { View, Text, Modal, Pressable, StyleSheet,Image } from 'react-native'

const Comments = ({ visible, onClose, item }) => {
  if (!item) return null

  return (
    <Modal visible={visible} transparent animationType="slide">
      
      <Pressable style={styles.overlay} onPress={onClose} />

     
      <View style={styles.sheet}>
      
        <View style={styles.dragIndicator} />

         <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
             <Text style={styles.title}>{item.title}</Text>
         <Image source={{ uri: item.mainimage }} style={{width:50,height:50,borderRadius:50}} />
         </View>
       
        <View style={styles.tagsWrap}>
          {item.tags.map((itm, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{itm}</Text>
            </View>
          ))}
        </View>

        {/* Close */}
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  )
}

export default Comments
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',          
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  tag: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  tagText: {
    color: '#007AFF',
    fontWeight: '600',
  },

  closeBtn: {
    marginTop: 'auto',
    alignSelf: 'center',
    paddingVertical: 12,
  },

  closeText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
