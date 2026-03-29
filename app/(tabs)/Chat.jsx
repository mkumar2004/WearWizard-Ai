import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
  Image as RNImage
} from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import Animated, { 
  FadeInUp, FadeInRight, FadeInLeft, 
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence 
} from 'react-native-reanimated'
import { useSelector } from 'react-redux'

const Chat = () => {
  const { user } = useSelector(state => state.auth)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const flatListRef = useRef(null)

  // Animation Pulse for Aria Logo
  const pulse = useSharedValue(1)
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1, true
    )
  }, [])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.8 + (pulse.value - 1) * 2
  }))

  useEffect(() => {
    if (user?._id) {
      loadHistory()
    }
  }, [user?._id])

  const loadHistory = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/ai/history/${user._id}`);
      if (response.data.success && response.data.messages.length > 0) {
        setMessages(response.data.messages.map((m, i) => ({ ...m, id: i.toString() })));
      } else {
        setMessages([
          { id: '1', role: 'bot', text: `Hi ${user?.username || 'Traveler'}! 🌍 I'm Aria, your premium travel agent. How can I help you plan your next journey?` }
        ]);
      }
    } catch (error) {
      console.error("History fetch error:", error);
    } finally {
      setFetching(false);
    }
  };

  const KNOWLEDGE_CHIPS = [
    "What is an AI Plan?",
    "How do I change my Persona?",
    "Where are my saved goals?",
    "Tell me about Notifications"
  ]

  const sendMessage = async (presetText) => {
    const textMsg = (presetText || input).trim();
    if (!textMsg) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text: textMsg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/ai/agent`, {
        message: textMsg,
        userId: user._id,
        history: messages.slice(-5).map(m => ({ role: m.role, text: m.text }))
      });

      if (response.data.success) {
        const botMsg = { id: (Date.now() + 1).toString(), role: 'bot', text: response.data.text };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = error.response?.data?.message || error.message;
      Alert.alert("Aria Error", `Aria says: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    // Basic Markdown Image Parser (Detect ![caption](url))
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = imgRegex.exec(item.text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: item.text.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'image', url: match[2], caption: match[1] });
      lastIndex = imgRegex.lastIndex;
    }
    if (lastIndex < item.text.length) {
      parts.push({ type: 'text', content: item.text.substring(lastIndex) });
    }

    // Default to plain text if no images found
    const displayParts = parts.length > 0 ? parts : [{ type: 'text', content: item.text }];

    return (
      <Animated.View 
        entering={item.role === 'bot' ? FadeInLeft : FadeInRight}
        style={[s.bubble, item.role === 'bot' ? s.botBubble : s.userBubble]}
      >
        {displayParts.map((part, index) => (
          <View key={index}>
            {part.type === 'text' ? (
              <Text style={[s.msgText, item.role === 'user' && { color: '#FFF' }]}>
                {part.content.split(/(\*\*.*?\*\*)/).map((subPart, i) => {
                  if (subPart.startsWith('**') && subPart.endsWith('**')) {
                    return (
                      <Text key={i} style={{ fontWeight: '800', color: item.role === 'user' ? '#FFF' : '#1e293b' }}>
                        {subPart.slice(2, -2)}
                      </Text>
                    );
                  }
                  return subPart;
                })}
              </Text>
            ) : (
              <View style={s.imageMsgWrap}>
                <Image 
                  source={{ uri: part.url }} 
                  style={s.msgImage} 
                  contentFit="cover"
                  transition={500}
                />
                {part.caption ? <Text style={s.imageCaption}>{part.caption}</Text> : null}
              </View>
            )}
          </View>
        ))}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <View style={s.botInfo}>
          <Animated.View style={[s.botAvatar, pulseStyle]}>
             <MaterialCommunityIcons name="robot" size={24} color="#4f46e5" />
          </Animated.View>
          <View>
            <Text style={s.botName}>Aria</Text>
            <Text style={s.botStatus}>Online • Travel Agent</Text>
          </View>
        </View>
        <TouchableOpacity>
           <Ionicons name="information-circle-outline" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 25}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 20, paddingBottom: 10 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View style={s.loadingWrap}>
             <ActivityIndicator size="small" color="#4f46e5" />
             <Text style={s.loadingText}>Aria is planning...</Text>
          </View>
        )}

        <View style={s.footer}>
          {/* QUICK CHIPS */}
          <View style={{ height: 60, marginTop: 10 }}>
            <FlatList 
              data={KNOWLEDGE_CHIPS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={s.chip} onPress={() => sendMessage(item)}>
                  <Text style={s.chipText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={s.inputBar}>
            <TextInput 
              style={s.input}
              placeholder="Ask Aria for a roadmap or tip..."
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity 
              style={[s.sendBtn, !input.trim() && { opacity: 0.5 }]} 
              onPress={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Chat

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  botInfo: { flexDirection: 'row', alignItems: 'center' },
  botAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  botName: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  botStatus: { fontSize: 11, fontWeight: '600', color: '#10B981', marginTop: 1 },

  bubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, marginBottom: 12, maxWidth: '85%' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderTopLeftRadius: 0, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#4f46e5', borderTopRightRadius: 0 },
  msgText: { fontSize: 15, color: '#334155', lineHeight: 22 },

  imageMsgWrap: { marginVertical: 8, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F1F5F9' },
  msgImage:     { width: '100%', height: 180, borderRadius: 12 },
  imageCaption: { fontSize: 11, fontWeight: '700', color: '#64748b', marginTop: 4, paddingHorizontal: 4, fontStyle: 'italic' },

  loadingWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  loadingText: { fontSize: 12, color: '#64748b', fontWeight: '600', marginLeft: 8 },

  footer: { paddingBottom: 20, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.05, shadowRadius: 10 },
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0', height: 40 },
  chipText: { fontSize: 12, fontWeight: '700', color: '#64748b' },

  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10, marginTop: 10 },
  input: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontSize: 15, color: '#1e293b', maxHeight: 100 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginLeft: 12 }
})