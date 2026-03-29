import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Image, ImageBackground, Linking, ActivityIndicator
} from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { useSelector } from 'react-redux'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
// ─────────────────────────────────────────────────────────────────────────────
// THEME HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const TRANSPORT_META = {
  'Train':         { emoji:'🚂', color:'#2563EB', bg:'#EFF6FF' },
  'Bus':           { emoji:'🚌', color:'#059669', bg:'#ECFDF5' },
  'Flight':        { emoji:'✈️', color:'#7C3AED', bg:'#F5F3FF' },
  'Cab':           { emoji:'🚕', color:'#D97706', bg:'#FFFBEB' },
  'Auto Rickshaw': { emoji:'🛺', color:'#DC2626', bg:'#FEF2F2' },
  'Local Bus':     { emoji:'🚎', color:'#059669', bg:'#ECFDF5' },
  'Taxi/Cab':      { emoji:'🚖', color:'#D97706', bg:'#FFFBEB' },
  'Bike Rental':   { emoji:'🛵', color:'#0891B2', bg:'#ECFEFF' },
}
const getTM = (t) => TRANSPORT_META[t] || { emoji:'🚗', color:'#2C6E49', bg:'#EBF5EF' }

const HOTEL_COLORS = {
  'Budget':    { color:'#059669', bg:'#ECFDF5' },
  'Mid-range': { color:'#2563EB', bg:'#EFF6FF' },
  'Luxury':    { color:'#B8860B', bg:'#FFF8E7' },
}
const getHC = (t) => HOTEL_COLORS[t] || { color:'#2C6E49', bg:'#EBF5EF' }

const MONTH_KEYS  = ['january','february','march','april','may','june','july','august','september','october','november','december']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const rainfallColor = (r) => {
  if (r==='Very Heavy') return { bg:'#DBEAFE', bar:'#2563EB' }
  if (r==='Heavy')      return { bg:'#DBEAFE', bar:'#60A5FA' }
  if (r==='Medium')     return { bg:'#D1FAE5', bar:'#34D399' }
  if (r==='Low')        return { bg:'#F1F5F9', bar:'#94A3B8' }
  return                       { bg:'#FEF9C3', bar:'#FBBF24' }
}

const attrPalette = [
  { color:'#2C6E49', bg:'#EBF5EF' },
  { color:'#2563EB', bg:'#EFF6FF' },
  { color:'#B8860B', bg:'#FFF8E7' },
  { color:'#7C3AED', bg:'#F5F3FF' },
  { color:'#D64045', bg:'#FFF0F0' },
  { color:'#0891B2', bg:'#ECFEFF' },
]

// ─────────────────────────────────────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:           '#FFFFFF',    // Pure White
  bgSoft:       '#F8FAFC',    // Subtle blue-gray tint
  bgCard:       '#FFFFFF',
  
  textPrimary:  '#111827',    // Deep Charcoal
  textSec:      '#4B5563',    // Medium Gray
  textMuted:    '#9CA3AF',    // Light Gray

  accent:       '#2563EB',    // Premium Indigo Blue
  accentSoft:   '#EFF6FF',
  
  border:       '#F1F5F9',    // Very subtle borders
  
  gold:         '#CA8A04', goldSoft: '#FEF9C3',
  green:        '#16A34A', greenSoft:'#DCFCE7',
  red:          '#DC2626', redSoft:  '#FEE2E2',
  purple:       '#7C3AED', purpleSoft:'#F5F3FF',
  teal:         '#0D9488', tealSoft: '#F0FDFA',
}

const SectionHeader = ({ label, title, icon }) => (
  <View style={a.shWrap}>
    <Text style={a.shLabel}>{icon}  {label}</Text>
    <View style={[s.row, { justifyContent: 'flex-start', alignItems: 'center' }]}>
      <Text style={[a.shTitle, { flex: 1, marginRight: 10 }]} numberOfLines={2}>{title}</Text>
      <View style={a.shBar} />
    </View>
  </View>
)

const Chip = ({ text, color = C.accent, bg = C.accentSoft, small }) => (
  <View style={[a.chip, { backgroundColor:bg }, small && { paddingHorizontal:7, paddingVertical:2 }]}>
    <Text style={[a.chipTxt, { color }, small && { fontSize:10 }]}>{text}</Text>
  </View>
)

const Stars = ({ rating }) => {
  const num = typeof rating === 'string' ? parseFloat(rating) : (rating || 0)
  return (
    <View style={a.starRow}>
      {[1,2,3,4,5].map(i => (
        <Text key={i} style={[a.star, { color: i <= Math.round(num) ? '#F59E0B' : '#E5E7EB' }]}>★</Text>
      ))}
      <Text style={a.ratingNum}>{num}</Text>
    </View>
  )
}

const Divider = () => <View style={a.divider} />

const a = StyleSheet.create({
  shWrap:    { marginBottom:24 },
  shLabel:   { fontSize:11, fontWeight:'800', color:C.accent, letterSpacing:2.5, marginBottom:6, opacity:0.8 },
  shTitle:   { fontSize:28, fontWeight:'900', color:C.textPrimary, letterSpacing:-0.8 },
  shBar:     { height:4, width:40, backgroundColor:C.accent, borderRadius:2 },
  chip:      { paddingHorizontal:12, paddingVertical:6, borderRadius:24 },
  chipTxt:   { fontSize:12, fontWeight:'700' },
  starRow:   { flexDirection:'row', alignItems:'center', gap:3, marginVertical:8 },
  star:      { fontSize:16 },
  ratingNum: { fontSize:13, fontWeight:'700', color:C.textPrimary, marginLeft:4 },
  divider:   { height:1, backgroundColor:'#F1F5F9', marginVertical:20 },
})

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY SECTION
// ─────────────────────────────────────────────────────────────────────────────
const SummarySection = ({ plan }) => (
  <View style={s.card}>
    {plan.photos?.cover && (
      <Image source={{ uri: plan.photos.cover }} style={{ width: '100%', height: 160, borderRadius: 12, marginBottom: 16 }} resizeMode="cover" />
    )}
    <SectionHeader label="TRIP OVERVIEW" title="Your AI Plan" icon="🗺️" />
    <Text style={s.bodyText}>{plan.summary}</Text>
    <Divider />
    <View style={s.tripMetaRow}>
      <View style={s.tripMetaBox}>
        <Text style={s.metaLabel}>FROM</Text>
        <Text style={s.metaVal}>{plan?.fromLocation}</Text>
      </View>
      <Text style={s.arrow}>→</Text>
      <View style={s.tripMetaBox}>
        <Text style={s.metaLabel}>TO</Text>
        <Text style={s.metaVal}>{plan.toLocation}</Text>
      </View>
    </View>
    <View style={[s.chipRow,{marginTop:12}]}>
      <Chip text={`${plan.tripDuration} Days`} />
      <Chip text={plan.budgetType}   color={C.gold}   bg={C.goldSoft} />
      <Chip text={plan.travelType}   color={C.purple} bg={C.purpleSoft} />
    </View>
  </View>
)

// ─────────────────────────────────────────────────────────────────────────────
// BUDGET SECTION
// ─────────────────────────────────────────────────────────────────────────────
const BudgetSection = ({ plan }) => {
  const b = plan.budget || {}
  const bd = b.breakdown || {}
  const rows = [
    { label:'Accommodation', icon:'🏨', color:'#2563EB', bg:'#EFF6FF', val: bd.accommodation },
    { label:'Food',          icon:'🍽️', color:'#059669', bg:'#ECFDF5', val: bd.food          },
    { label:'Transport',     icon:'🚌', color:'#D97706', bg:'#FFFBEB', val: bd.transport      },
    { label:'Attractions',   icon:'📸', color:'#7C3AED', bg:'#F5F3FF', val: bd.attractions    },
    { label:'Shopping',      icon:'🛍️', color:'#0891B2', bg:'#ECFEFF', val: bd.shopping       },
    { label:'Misc',          icon:'💡', color:'#D64045', bg:'#FFF0F0', val: bd.misc           },
  ].filter(r => r.val)

  return (
    <View style={s.card}>
      <SectionHeader label="BUDGET BREAKDOWN" title="How Much to Spend" icon="💰" />
      <View style={[s.budgetTotalBox]}>
        <Text style={s.metaLabel}>TOTAL PER DAY PER PERSON</Text>
        <Text style={s.budgetTotal}>₹{b.perDayPerPerson?.toLocaleString() || bd.total?.toLocaleString()}</Text>
      </View>
      <Divider />
      {rows.map(r => (
        <View key={r.label} style={s.row}>
          <View style={s.row}>
            <View style={[s.budgetDot, { backgroundColor:r.bg }]}><Text>{r.icon}</Text></View>
            <Text style={s.bodyTextSm}>{r.label}</Text>
          </View>
          <Text style={[s.budgetAmt, { color:r.color }]}>₹{r.val?.toLocaleString()}</Text>
        </View>
      ))}
      {bd.total && (
        <View style={[s.row, s.totalRow]}>
          <Text style={s.totalLabel}>TOTAL / DAY</Text>
          <Text style={s.totalAmt}>₹{bd.total?.toLocaleString()}</Text>
        </View>
      )}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOTELS SECTION
// ─────────────────────────────────────────────────────────────────────────────
const HotelsSection = ({ plan }) => (
  <View style={s.card}>
    <SectionHeader label="STAY" title="Where to Stay" icon="🏨" />
    {(plan.hotels || []).map((h, i) => {
      const hc = getHC(h.type)
      return (
        <View key={i} style={[s.subCard, i > 0 && { marginTop:12 }]}>
          <View style={s.row}>
            <View style={{ flex:1 }}>
              <Text style={s.subTitle}>{h.name}</Text>
              <Text style={s.subMeta}>📍 {h.area || h.location}</Text>
            </View>
            <View style={[s.pill, { backgroundColor:hc.bg }]}>
              <Text style={[s.pillTxt, { color:hc.color }]}>{h.type}</Text>
            </View>
          </View>
          <Stars rating={h.rating} />
          {h.photo && (
            <Image source={{ uri: h.photo }} style={{ width: '100%', height: 130, borderRadius: 8, marginTop: 8, marginBottom: 10 }} resizeMode="cover" />
          )}
          {h.description ? <Text style={s.bodyTextSm}>{h.description || h.whyRecommended}</Text> : null}
          <View style={[s.row, { marginTop:10 }]}>
            <View>
              <Text style={s.metaLabel}>PER NIGHT</Text>
              <Text style={[s.bigPrice, { color:C.accent }]}>
                ₹{(h.pricePerNight || parseInt(h.priceRange) || 0).toLocaleString()}
              </Text>
            </View>
            {h.phone ? <Text style={s.phoneRow}>📞 {h.phone}</Text> : null}
          </View>
          {h.amenities?.length > 0 && (
            <View style={[s.chipRow, { marginTop:8 }]}>
              {h.amenities.map(am => <Chip key={am} text={am} color={C.textSec} bg={C.bgSoft} small />)}
            </View>
          )}
        </View>
      )
    })}
  </View>
)

// ─────────────────────────────────────────────────────────────────────────────
// RESTAURANTS SECTION
// ─────────────────────────────────────────────────────────────────────────────
const RestaurantsSection = ({ plan }) => (
  <View style={s.card}>
    <SectionHeader label="DINING" title="Where to Eat" icon="🍽️" />
    {(plan.restaurants || []).map((r, i) => {
      const mustTry = Array.isArray(r.mustTry) ? r.mustTry : [r.mustTry].filter(Boolean)
      const isVeg   = r.vegNonVeg === 'Veg Only'
      // Parse timing if openingTime not separate
      const open  = r.openingTime || (r.timing?.split('-')[0]) || ''
      const close = r.closingTime || (r.timing?.split('-')[1]) || ''
      return (
        <View key={i} style={[s.subCard, i > 0 && { marginTop:12 }]}>
          <View style={s.row}>
            <View style={{ flex:1 }}>
              <Text style={s.subTitle}>{r.name}</Text>
              <Text style={s.subMeta}>{r.cuisine}{r.area ? ` · ${r.area}` : ''}</Text>
            </View>
            <View style={[s.pill, { backgroundColor: isVeg ? '#ECFDF5' : '#FFFBEB' }]}>
              <Text style={[s.pillTxt, { color: isVeg ? '#059669' : C.orange }]}>
                {isVeg ? '🟢 Veg' : '🟡 Both'}
              </Text>
            </View>
          </View>
          <Stars rating={r.rating} />
          {r.photo && (
            <Image source={{ uri: r.photo }} style={{ width: '100%', height: 130, borderRadius: 8, marginTop: 8, marginBottom: 10 }} resizeMode="cover" />
          )}
          <View style={s.row}>
            {open ? <Text style={s.bodyTextSm}>🕐 {open}{close ? ` – ${close}` : ''}</Text> : null}
            <Text style={[s.bigPrice,{fontSize:15}]}>
              ₹{(r.priceForTwo || parseInt(r.priceRange) || 0)} for two
            </Text>
          </View>
          {mustTry.length > 0 && (
            <View style={[s.infoBox, { marginTop:8 }]}>
              <Text style={s.metaLabel}>MUST TRY</Text>
              <View style={[s.chipRow,{marginTop:4}]}>
                {mustTry.map(d => <Chip key={d} text={d} color={C.red} bg={C.redSoft} small />)}
              </View>
            </View>
          )}
        </View>
      )
    })}
  </View>
)

// ─────────────────────────────────────────────────────────────────────────────
// FAMOUS FOOD SECTION
// ─────────────────────────────────────────────────────────────────────────────
const FamousFoodSection = ({ plan }) => {
  const foods = plan.famousFood || []
  if (!foods.length) return null
  return (
    <View style={s.card}>
      <SectionHeader label="LOCAL CUISINE" title="Famous Food & Specialties" icon="🥘" />
      {foods.map((f, i) => (
        <View key={i} style={[s.subCard, i > 0 && { marginTop:12 }]}>
          <View style={s.row}>
            <Text style={[s.subTitle,{flex:1}]}>{f.name}</Text>
            {f.type && <Chip text={f.type} color={C.accent} bg={C.accentSoft} small />}
          </View>
          {f.description ? <Text style={[s.bodyTextSm,{marginVertical:6}]}>{f.description}</Text> : null}
          <View style={s.row}>
            <Text style={[s.bodyTextSm,{flex:1}]}>📍 {f.where}</Text>
            <Text style={[s.bigPrice,{fontSize:16}]}>₹{f.price}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSPORT SECTION
// ─────────────────────────────────────────────────────────────────────────────
const TransportSection = ({ plan }) => {
  const [tab, setTab] = useState('intercity')
  const t = plan.transport || {}

  // Better parsing for from-to and duration to ensure they "come"
  const rawFromTo = t.fromTo || ''
  let from = plan.fromLocation || ''
  let to   = plan.toLocation || ''

  if (rawFromTo.includes(' to ')) {
    const parts = rawFromTo.split(' to ')
    from = parts[0]?.trim() || from
    // Attempt to slice off " by ..." if present
    to = parts[1]?.split(' by ')[0]?.trim() || to
  } else if (rawFromTo && !to) {
    to = rawFromTo
  }

  const travelDuration = t.duration || plan.tripDuration + ' days'

  const fromCities = t.fromCities || [{
    from,
    modes: (t.options || []).map(opt => ({
      type:     opt,
      duration: travelDuration,
      price:    t.price || 0,
      operator: '',
      note:     '',
    })),
  }]

  // Ensure "Recommended" is always shown if it exists
  const recommendedMode = t.recommended || (t.options && t.options[0]) || 'Not specified'

  // Local transport: array of strings or objects
  const localTransport = (t.localTransport || []).map(l =>
    typeof l === 'string'
      ? { type: l.split(' ')[0], avgFare: l, tips: '' }
      : l
  )

  return (
    <View style={s.card}>
      <SectionHeader label="GETTING THERE" title="Transport Guide" icon="🚌" />
      {t.tips && (
        <View style={s.infoBox}>
          <Text style={s.bodyTextSm}>💡 {t.tips}</Text>
        </View>
      )}
      <View style={[s.tabToggle, {marginTop:12}]}>
        {['intercity','local'].map(tb => (
          <TouchableOpacity key={tb} style={[s.toggleBtn, tab===tb && s.toggleBtnActive]} onPress={()=>setTab(tb)} activeOpacity={0.8}>
            <Text style={[s.toggleTxt, tab===tb && s.toggleTxtActive]}>{tb==='intercity'?'🗺️  Intercity':'📍  Local'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'intercity' && fromCities.map((city, ci) => (
        <View key={ci} style={s.cityWrap}>
          <View style={s.cityHeader}>
            <View style={s.cityDot} />
            <View>
              <Text style={s.fromLabel}>FROM</Text>
              <Text style={s.cityName}>{city.from}</Text>
            </View>
            <Text style={s.cityCount}>{city.modes?.length} option(s)</Text>
          </View>
          {(city.modes || []).map((m, mi) => {
            const tm = getTM(m.type)
            return (
              <View key={mi} style={s.modeRow}>
                <View style={[s.modeIcon, { backgroundColor:tm.bg }]}>
                  <Text style={s.modeEmoji}>{tm.emoji}</Text>
                </View>
                <View style={{ flex:1 }}>
                  <View style={s.row}>
                    <Text style={[s.modeName, { color:tm.color }]}>{m.type}</Text>
                    {m.price ? (
                      <View style={[s.pill, { backgroundColor:tm.bg }]}>
                        <Text style={[s.pillTxt,{ color:tm.color }]}>₹{m.price?.toLocaleString()}</Text>
                      </View>
                    ) : null}
                  </View>
                  {m.duration ? <Text style={s.bodyTextSm}>⏱ {m.duration}{m.operator ? `  ·  ${m.operator}` : ''}</Text> : null}
                  {m.note ? <Text style={s.noteText}>ℹ️ {m.note}</Text> : null}
                </View>
              </View>
            )
          })}
        </View>
      ))}

      {tab === 'local' && localTransport.map((item, i) => {
        const tm = getTM(item.type)
        return (
          <View key={i} style={[s.subCard, i > 0 && { marginTop:10 }]}>
            <View style={s.row}>
              <View style={[s.modeIcon, { backgroundColor:tm.bg }]}>
                <Text style={s.modeEmoji}>{tm.emoji}</Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={[s.modeName, { color:tm.color }]}>{item.type}</Text>
                <Text style={[s.bigPrice,{ fontSize:14, color:C.accent }]}>{item.avgFare}</Text>
                {item.tips ? <Text style={s.bodyTextSm}>{item.tips}</Text> : null}
              </View>
            </View>
          </View>
        )
      })}

      {tab === 'local' && localTransport.length === 0 && (
        <Text style={[s.bodyTextSm, {textAlign:'center', marginTop:12}]}>No local transport info available</Text>
      )}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEATHER SECTION
// ─────────────────────────────────────────────────────────────────────────────
const WeatherSection = ({ plan }) => {
  const w = plan.weather || {}

  // Sanity shape: w.january, w.february ... → show month picker
  // Groq shape:   w.during, w.temperature, w.condition → show single card
  const isSanityShape = !!w.january

  const [sel, setSel] = useState(0)

  if (isSanityShape) {
    const m  = w[MONTH_KEYS[sel]] || {}
    const rc = rainfallColor(m.rainfall)
    return (
      <View style={s.card}>
        <SectionHeader label="CLIMATE" title="Weather by Month" icon="🌤️" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:6, paddingHorizontal:4 }}>
          {MONTH_SHORT.map((ms, i) => (
            <TouchableOpacity key={i} style={[s.monthBtn, sel===i && s.monthBtnActive]} onPress={()=>setSel(i)} activeOpacity={0.8}>
              <Text style={[s.monthBtnTxt, sel===i && s.monthBtnTxtActive]}>{ms}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <WeatherCard month={MONTH_KEYS[sel]} data={m} rc={rc} />
      </View>
    )
  }

  // Groq flat shape
  const minTemp = parseInt(w.temperature?.split('-')[0]) || 0
  const maxTemp = parseInt(w.temperature?.split('-')[1]) || parseInt(w.temperature) || 0
  const rc = rainfallColor(w.rainfall)
  return (
    <View style={s.card}>
      <SectionHeader label="CLIMATE" title="Weather During Trip" icon="🌤️" />
      <WeatherCard
        month={w.during || 'During your trip'}
        data={{ minTemp, maxTemp, condition: w.condition, rainfall: w.rainfall, tip: w.tip || w.packingTip }}
        rc={rc}
      />
    </View>
  )
}

const WeatherCard = ({ month, data, rc }) => (
  <View style={[s.weatherCard, { backgroundColor:rc.bg, marginTop:14 }]}>
    <View style={s.row}>
      <Text style={s.weatherMonth}>{typeof month === 'string' ? month.charAt(0).toUpperCase() + month.slice(1) : month}</Text>
      <Chip text={(data.rainfall || '') + ' rainfall'} color={rc.bar} bg={'rgba(255,255,255,0.7)'} small />
    </View>
    <Text style={s.weatherCond}>{data.condition}</Text>
    <View style={s.tempRow}>
      <View style={s.tempBox}><Text style={s.tempLabel}>MIN TEMP</Text><Text style={s.tempVal}>{data.minTemp}°C</Text></View>
      <View style={s.tempDiv} />
      <View style={s.tempBox}><Text style={s.tempLabel}>MAX TEMP</Text><Text style={s.tempVal}>{data.maxTemp}°C</Text></View>
      <View style={s.tempDiv} />
      <View style={[s.tempBox,{flex:1.4}]}>
        <Text style={s.tempLabel}>RAINFALL</Text>
        <View style={s.rainfallBarBg}>
          <View style={[s.rainfallBarFill, { backgroundColor:rc.bar, width:`${{None:5,Low:25,Medium:50,Heavy:75,'Very Heavy':100}[data.rainfall]||5}%` }]} />
        </View>
      </View>
    </View>
    {data.tip && <View style={s.tipBox}><Text style={s.tipEmoji}>💡</Text><Text style={[s.bodyTextSm,{flex:1}]}>{data.tip}</Text></View>}
  </View>
)

// ─────────────────────────────────────────────────────────────────────────────
// ITINERARY SECTION
// ─────────────────────────────────────────────────────────────────────────────
const ItinerarySection = ({ plan }) => {
  const [openDay, setOpenDay] = useState(0)
  const itinerary = plan.itinerary || plan.sampleItinerary || []
  const slotMeta  = {
    morning:   { icon:'🌅', color:'#F59E0B' },
    afternoon: { icon:'☀️', color:'#EF4444' },
    evening:   { icon:'🌆', color:'#8B5CF6' },
  }

  return (
    <View style={s.card}>
      <SectionHeader label="TRIP PLAN" title="Day by Day Itinerary" icon="📅" />
      {itinerary.map((day, i) => (
        <View key={i} style={s.dayWrap}>
          <TouchableOpacity
            style={[s.dayBtn, openDay===i && s.dayBtnOpen]}
            onPress={()=>setOpenDay(openDay===i ? -1 : i)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <View style={[s.dayNumBox, openDay===i && { backgroundColor:C.accent }]}>
                <Text style={s.dayNum}>{day.day}</Text>
              </View>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={s.metaLabel}>DAY</Text>
                <Text style={s.subTitle} numberOfLines={2}>{day.title}</Text>
              </View>
              {day.estimatedCost ? (
                <Text style={[s.bigPrice,{fontSize:15, textAlign: 'right'}]}>₹{day.estimatedCost?.toLocaleString()}</Text>
              ) : null}
            </View>
          </TouchableOpacity>

          {openDay === i && (
            <View style={s.dayContent}>
              {['morning','afternoon','evening'].map(slot => {
                const d = day[slot]
                const m = slotMeta[slot]
                if (!d) return null
                // Handle both string and object slot
                const isObj     = typeof d === 'object'
                const activity  = isObj ? d.activity : d
                const place     = isObj ? d.place    : ''
                const duration  = isObj ? d.duration : ''
                const cost      = isObj ? d.cost     : null
                return (
                  <View key={slot} style={s.slotRow}>
                    <View style={[s.slotBar, { backgroundColor:m.color }]} />
                    <View style={{ flex:1 }}>
                      <Text style={[s.slotLabel, { color:m.color }]}>{m.icon} {slot.toUpperCase()}</Text>
                      <Text style={s.slotActivity}>{activity}</Text>
                      {isObj && d.photo ? (
                        <Image source={{ uri: d.photo }} style={{ width: '100%', height: 120, borderRadius: 8, marginTop: 8, marginBottom: 8 }} resizeMode="cover" />
                      ) : null}
                      {(place || duration || cost != null) && (
                        <Text style={s.bodyTextSm}>
                          {place ? `📍 ${place}` : ''}
                          {duration ? `  ⏱ ${duration}` : ''}
                          {cost != null ? `  ₹${cost}` : ''}
                        </Text>
                      )}
                    </View>
                  </View>
                )
              })}
              {day.meals && (
                <View style={s.mealsBox}>
                  <Text style={s.metaLabel}>🍽️  MEALS</Text>
                  {['breakfast','lunch','dinner'].map(meal => (
                    day.meals[meal] ? (
                      <Text key={meal} style={s.mealRow}>
                        {meal==='breakfast'?'🌅':meal==='lunch'?'☀️':'🌆'} {day.meals[meal]}
                      </Text>
                    ) : null
                  ))}
                </View>
              )}
              {day.tips?.length > 0 && (
                <View style={s.tipsBox}>
                  {day.tips.map((t,ti) => <Text key={ti} style={s.tipTxt}>💡 {t}</Text>)}
                </View>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PACKING SECTION
// ─────────────────────────────────────────────────────────────────────────────
const PackingSection = ({ plan }) => {
  const packing = plan.packingList || {}
  const cats = [
    { key:'essentials',  label:'Essentials',  icon:'🎒', color:'#2C6E49' },
    { key:'clothing',    label:'Clothing',    icon:'👕', color:'#2563EB' },
    { key:'documents',   label:'Documents',   icon:'📄', color:'#D97706' },
    { key:'electronics', label:'Electronics', icon:'🔌', color:'#7C3AED' },
    { key:'medicines',   label:'Medicines',   icon:'💊', color:'#DC2626' },
  ].filter(cat => packing[cat.key]?.length > 0)

  if (!cats.length) return null

  return (
    <View style={s.card}>
      <SectionHeader label="PREPARATION" title="Packing List" icon="🎒" />
      {cats.map(cat => (
        <View key={cat.key} style={[s.packBlock, { borderLeftColor:cat.color }]}>
          <Text style={[s.packCatLabel, { color:cat.color }]}>{cat.icon}  {cat.label}</Text>
          {packing[cat.key].map((item, i) => (
            <View key={i} style={s.packItem}>
              <View style={[s.packDot, { backgroundColor:cat.color }]} />
              <Text style={s.bodyTextSm}>{item}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  { id:'summary',     label:'Summary',   icon:'🗺️' },
  { id:'budget',      label:'Budget',    icon:'💰' },
  { id:'hotels',      label:'Hotels',    icon:'🏨' },
  { id:'restaurants', label:'Dining',    icon:'🍽️' },
  { id:'food',        label:'Food',      icon:'🥘' },
  { id:'transport',   label:'Transport', icon:'🚌' },
  { id:'weather',     label:'Weather',   icon:'🌤️' },
  { id:'itinerary',   label:'Itinerary', icon:'📅' },
  { id:'packing',     label:'Packing',   icon:'🎒' },
]

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
const Travelagent = () => {
  const [activeTab, setActiveTab] = useState('summary')
  const [generating, setGenerating] = useState(false)
  
  // Directly pull the fulfilled payload from the Redux store
  const plan = useSelector(state => state.travel.plan)

  const handleDownloadPDF = async () => {
    if (!plan) return
    setGenerating(true)
    try {
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
            <h1 style="color: #4f46e5; text-align: center;">${plan.toLocation} Trip Plan</h1>
            <p style="text-align: center; color: #777;">Generated by WearWizard AI</p>
            <hr/>
            <h3>Trip Overview</h3>
            <p>${plan.summary}</p>
            <h3>Duration</h3>
            <p>${plan.tripDuration} Days</p>
            <h3>Budget</h3>
            <p>${plan.budgetType}</p>
            <hr/>
            <h3>Itinerary Summary</h3>
            ${(plan.itinerary || []).map(day => `
              <div style="margin-bottom: 20px;">
                <h4 style="color: #4f46e5;">Day ${day.day}: ${day.title}</h4>
                <p><b>Morning:</b> ${day.morning?.activity || ''}</p>
                <p><b>Afternoon:</b> ${day.afternoon?.activity || ''}</p>
                <p><b>Evening:</b> ${day.evening?.activity || ''}</p>
              </div>
            `).join('')}
            <hr/>
            <p style="text-align: center; font-size: 10px; color: #aaa;">Enjoy your journey!</p>
          </body>
        </html>
      `
      const { uri } = await Print.printToFileAsync({ html })
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' })
    } catch (error) {
      console.error('PDF Error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleWhatsAppShare = () => {
    if (!plan) return
    const text = `Hey! Check out my AI Trip Plan to ${plan.toLocation} ✈️\n\n${plan.summary}\n\nDuration: ${plan.tripDuration} days\nBudget: ${plan.budgetType}\n\nShared via WearWizard`
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url)
      } else {
        alert('WhatsApp is not installed on this device')
      }
    })
  }

  if (!plan) {
    return (
      <View style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Text style={s.subTitle}>Loading AI Plan...</Text>
      </View>
    )
  }

  const renderSection = () => {
    switch (activeTab) {
      case 'summary':     return <SummarySection     plan={plan} />
      case 'budget':      return <BudgetSection      plan={plan} />
      case 'hotels':      return <HotelsSection      plan={plan} />
      case 'restaurants': return <RestaurantsSection plan={plan} />
      case 'food':        return <FamousFoodSection  plan={plan} />
      case 'transport':   return <TransportSection   plan={plan} />
      case 'weather':     return <WeatherSection     plan={plan} />
      case 'itinerary':   return <ItinerarySection   plan={plan} />
      case 'packing':     return <PackingSection     plan={plan} />
      default:            return <SummarySection     plan={plan} />
    }
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HERO */}
      <View style={s.hero}>
        <View style={s.heroBadge}>
          <Text style={s.heroBadgeTxt}>✈️ AI TRAVEL PLAN</Text>
        </View>
        <Text style={s.heroTitle}>{plan.toLocation || 'Your Trip'}</Text>
        <View style={s.heroSubRow}>
          <Text style={s.heroSub}>
            {plan.fromLocation} → {plan.toLocation}  ·  {plan.tripDuration} days
          </Text>
        </View>

        <View style={s.shareRow}>
          <TouchableOpacity style={[s.shareBtn, { backgroundColor: '#4f46e5' }]} onPress={handleDownloadPDF} disabled={generating}>
            {generating ? <ActivityIndicator size="small" color="#fff" /> : <Text style={s.shareBtnTxt}>📄 PDF</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={[s.shareBtn, { backgroundColor: '#25D366' }]} onPress={handleWhatsAppShare}>
            <Text style={s.shareBtnTxt}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <View style={s.chipRow}>
          {plan.budgetType ? <Chip text={plan.budgetType} color={C.gold}   bg={C.goldSoft}   /> : null}
          {plan.travelType ? <Chip text={plan.travelType} color={C.purple} bg={C.purpleSoft} /> : null}
        </View>
      </View>

      {/* NAV */}
      <View style={s.navWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.navInner}>
          {NAV.map(n => (
            <TouchableOpacity
              key={n.id}
              style={[s.navItem, activeTab===n.id && s.navItemActive]}
              onPress={()=>setActiveTab(n.id)}
              activeOpacity={0.8}
            >
              <Text style={s.navIcon}>{n.icon}</Text>
              <Text style={[s.navLabel, activeTab===n.id && s.navLabelActive]}>{n.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* CONTENT */}
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:48 }}>
        {renderSection()}
      </ScrollView>
    </View>
  )
}

export default Travelagent

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:       { flex:1, backgroundColor:'#FFFFFF' },
  scroll:     { flex:1 },

  // HERO
  hero:           { backgroundColor:'#FFFFFF', paddingHorizontal:24, paddingTop:60, paddingBottom:30 },
  heroBadge:      { backgroundColor:C.accentSoft, alignSelf:'flex-start', paddingHorizontal:12, paddingVertical:6, borderRadius:8, marginBottom:16 },
  heroBadgeTxt:   { color:C.accent, fontSize:10, fontWeight:'900', letterSpacing:1.5 },
  heroTitle:      { fontSize:42, fontWeight:'900', color:C.textPrimary, letterSpacing:-1.5, lineHeight:46, marginBottom:10 },
  heroSub:        { fontSize:14, color:C.textSec, fontWeight:'500' },
  heroSubRow:     { flexDirection:'row', alignItems:'center', gap:12, marginTop:4 },
  chipRow:        { flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:12 },
  
  shareRow:       { flexDirection:'row', gap:10, marginTop:20, marginBottom:4 },
  shareBtn:       { flexDirection:'row', alignItems:'center', justifyContent:'center', paddingHorizontal:16, paddingVertical:10, borderRadius:12, gap:6, shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.1, shadowRadius:10, elevation:2 },
  shareBtnTxt:    { color:'#FFFFFF', fontSize:13, fontWeight:'800' },

  // NAV
  navWrap:        { backgroundColor:'#FFFFFF', borderBottomWidth:1, borderBottomColor:'#F1F5F9' },
  navInner:       { paddingHorizontal:16, paddingVertical:12, gap:8 },
  navItem:        { paddingHorizontal:14, paddingVertical:10, borderRadius:12, alignItems:'center', justifyContent:'center', minWidth:80, backgroundColor:'#f9fafb' },
  navItemActive:  { backgroundColor:C.accent },
  navIcon:        { fontSize:20, marginBottom:4 },
  navLabel:       { fontSize:11, color:C.textMuted, fontWeight:'700' },
  navLabelActive: { color:'#FFFFFF' },

  // CARDS
  card:       { marginHorizontal:16, marginVertical:12, backgroundColor:'#FFFFFF', borderRadius:24, padding:24, 
                borderWidth:1, borderColor:'#F1F5F9', // Subtle outline 
                shadowColor:'#000', shadowOffset:{width:0,height:8}, shadowOpacity:0.04, shadowRadius:12, elevation:3 },
  subCard:    { backgroundColor:C.bgSoft, borderRadius:16, padding:18, borderWidth:1, borderColor:'#F1F5F9' },
  infoBox:    { backgroundColor:C.accentSoft, borderRadius:12, padding:14, borderWidth:1, borderColor:C.accent+'20' },

  // TYPOGRAPHY
  bodyText:   { fontSize:15, color:C.textSec, lineHeight:24, fontWeight:'400' },
  bodyTextSm: { fontSize:13, color:C.textSec, lineHeight:20 },
  metaLabel:  { fontSize:10, fontWeight:'800', color:C.textMuted, letterSpacing:1.5, marginBottom:6, textTransform:'uppercase' },
  metaVal:    { fontSize:17, fontWeight:'700', color:C.textPrimary },
  bigPrice:   { fontSize:22, fontWeight:'900', color:C.accent },
  phoneRow:   { fontSize:13, color:C.textMuted, marginTop:4 },
  noteText:   { fontSize:12, color:C.textMuted, fontStyle:'italic', marginTop:6 },

  row:        { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  pill:       { paddingHorizontal:12, paddingVertical:5, borderRadius:24 },
  pillTxt:    { fontSize:11, fontWeight:'800' },

  // SUMMARY
  tripMetaRow:  { flexDirection:'row', alignItems:'center', gap:12, marginTop:20 },
  tripMetaBox:  { flex:1, backgroundColor:C.bgSoft, borderRadius:16, padding:16, borderLeftWidth:4, borderLeftColor:C.accent },
  arrow:        { fontSize:20, color:C.textMuted, opacity:0.5 },

  // BUDGET
  budgetTotalBox: { backgroundColor:C.accent, borderRadius:18, padding:24, alignItems:'center', marginBottom:12, shadowColor:C.accent, shadowOpacity:0.3, shadowRadius:10, elevation:5 },
  budgetTotal:    { fontSize:36, fontWeight:'900', color:'#FFFFFF', marginTop:6 },
  budgetDot:      { width:36, height:36, borderRadius:18, alignItems:'center', justifyContent:'center', marginRight:12 },
  budgetAmt:      { fontSize:16, fontWeight:'800' },
  totalRow:       { marginTop:20, paddingTop:20, borderTopWidth:1, borderTopColor:'#F1F5F9' },
  totalLabel:     { fontSize:14, fontWeight:'800', color:C.textPrimary },
  totalAmt:       { fontSize:24, fontWeight:'900', color:C.accent },

  subTitle:   { fontSize:17, fontWeight:'800', color:C.textPrimary },
  subMeta:    { fontSize:13, color:C.textMuted, marginTop:4 },

  // TRANSPORT
  tabToggle:       { flexDirection:'row', backgroundColor:'#F1F5F9', borderRadius:14, padding:5, marginBottom:16 },
  toggleBtn:       { flex:1, paddingVertical:12, alignItems:'center', borderRadius:10 },
  toggleBtnActive: { backgroundColor:'#FFFFFF', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:6, elevation:3 },
  toggleTxt:       { fontSize:14, color:C.textMuted, fontWeight:'700' },
  toggleTxtActive: { color:C.accent },
  
  cityWrap:    { marginBottom:16, borderRadius:20, overflow:'hidden', borderWidth:1, borderColor:'#F1F5F9' },
  cityHeader:  { flexDirection:'row', alignItems:'center', backgroundColor:'#F9FAFB', padding:18, gap:12, justifyContent:'space-between' },
  cityDot:     { width:12, height:12, borderRadius:6, backgroundColor:C.accent },
  fromLabel:   { fontSize:10, fontWeight:'900', color:C.textMuted, letterSpacing:1 },
  cityName:    { fontSize:18, fontWeight:'800', color:C.textPrimary },
  cityCount:   { fontSize:12, fontWeight:'600', color:C.textMuted },
  modeRow:     { flexDirection:'row', gap:16, backgroundColor:'#FFFFFF', padding:20, borderTopWidth:1, borderTopColor:'#F1F5F9', alignItems:'center' },
  modeIcon:    { width:50, height:50, borderRadius:25, alignItems:'center', justifyContent:'center' },
  modeEmoji:   { fontSize:22 },
  modeName:    { fontSize:16, fontWeight:'800', marginBottom:2 },

  // WEATHER
  monthBtn:         { paddingHorizontal:16, paddingVertical:10, borderRadius:24, backgroundColor:'#F1F5F9' },
  monthBtnActive:   { backgroundColor:C.accent },
  monthBtnTxt:      { fontSize:13, fontWeight:'700', color:C.textSec },
  monthBtnTxtActive:{ color:'#FFFFFF' },
  weatherCard:      { borderRadius:20, padding:24 },
  weatherMonth:     { fontSize:26, fontWeight:'900', color:C.textPrimary },
  weatherCond:      { fontSize:16, color:C.textSec, marginVertical:10, fontWeight:'500' },
  tempRow:          { flexDirection:'row', backgroundColor:'rgba(255,255,255,0.85)', borderRadius:16, padding:20, marginBottom:16 },
  tempBox:          { flex:1, alignItems:'center' },
  tempLabel:        { fontSize:9, fontWeight:'900', color:C.textMuted, letterSpacing:1, marginBottom:6 },
  tempVal:          { fontSize:30, fontWeight:'900', color:C.textPrimary },
  tempDiv:          { width:1, backgroundColor:'#E2E8F0' },
  rainfallBarBg:    { width:'100%', height:10, backgroundColor:'#E2E8F0', borderRadius:5, marginTop:8 },
  rainfallBarFill:  { height:10, borderRadius:5 },
  tipBox:           { flexDirection:'row', gap:10, alignItems:'flex-start', marginTop:10 },
  tipEmoji:         { fontSize:18 },

  // ITINERARY
  dayWrap:     { marginBottom:12 },
  dayBtn:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#F9FAFB', borderRadius:16, padding:20, borderWidth:1, borderColor:'transparent' },
  dayBtnOpen:  { backgroundColor:C.accentSoft, borderColor:C.accent },
  dayNumBox:   { width:44, height:44, borderRadius:22, backgroundColor:'#DBEAFE', alignItems:'center', justifyContent:'center', marginRight:14 },
  dayNum:      { fontSize:18, fontWeight:'900', color:C.accent },
  dayContent:  { backgroundColor:'#FFFFFF', borderRadius:20, padding:20, marginTop:10, gap:18, borderWidth:1, borderColor:'#F1F5F9', shadowColor:'#000', shadowOpacity:0.02, shadowRadius:8 },
  slotRow:     { flexDirection:'row', gap:14 },
  slotBar:     { width:4, borderRadius:4, minHeight:60 },
  slotLabel:   { fontSize:10, fontWeight:'900', letterSpacing:1.5, marginBottom:6 },
  slotActivity:{ fontSize:14, fontWeight:'800', color:C.textPrimary, marginBottom:4, lineHeight:20 },
  mealsBox:    { backgroundColor:'#F9FAFB', borderRadius:14, padding:16 },
  mealRow:     { fontSize:13, color:C.textSec, lineHeight:22, marginTop:6, fontWeight:'500' },
  tipsBox:     { backgroundColor:C.accentSoft, borderRadius:12, padding:14, gap:6, borderWidth:1, borderColor:C.accent+'10' },
  tipTxt:      { fontSize:13, color:C.textSec, lineHeight:20, fontWeight:'500' },

  // PACKING
  packBlock:    { backgroundColor:'#F9FAFB', borderRadius:16, padding:18, marginBottom:12, borderLeftWidth:5 },
  packCatLabel: { fontSize:16, fontWeight:'800', marginBottom:12 },
  packItem:     { flexDirection:'row', alignItems:'center', gap:12, marginBottom:10 },
  packDot:      { width:8, height:8, borderRadius:4, flexShrink:0 },
})
