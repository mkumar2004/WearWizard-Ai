export const C = {
  bg:'#FFFFFF', bgSoft:'#F7F8F5', bgCard:'#FFFFFF',
  border:'#EBEBEB', borderMid:'#D5D5D0',
  accent:'#2C6E49', accentSoft:'#EBF5EF', accentDark:'#1A4730',
  gold:'#B8860B', goldSoft:'#FFF8E7',
  textPrimary:'#1A1A1A', textSec:'#555550', textMuted:'#999990', textLight:'#CCCCCC',
  red:'#D64045', redSoft:'#FFF0F0',
  blue:'#2563EB', blueSoft:'#EFF6FF',
  orange:'#D97706', orangeSoft:'#FFFBEB',
  purple:'#7C3AED', purpleSoft:'#F5F3FF',
  teal:'#0891B2', tealSoft:'#ECFEFF',
}

export const TRANSPORT_META = {
  'Train':          { emoji:'🚂', color:'#2563EB', bg:'#EFF6FF' },
  'Bus':            { emoji:'🚌', color:'#059669', bg:'#ECFDF5' },
  'Flight':         { emoji:'✈️', color:'#7C3AED', bg:'#F5F3FF' },
  'Cab':            { emoji:'🚕', color:'#D97706', bg:'#FFFBEB' },
  'Auto Rickshaw':  { emoji:'🛺', color:'#DC2626', bg:'#FEF2F2' },
  'Local Bus':      { emoji:'🚎', color:'#059669', bg:'#ECFDF5' },
  'Taxi/Cab':       { emoji:'🚖', color:'#D97706', bg:'#FFFBEB' },
  'Bike Rental':    { emoji:'🛵', color:'#0891B2', bg:'#ECFEFF' },
}

export const HOTEL_COLORS = {
  'Budget':   { color:'#059669', bg:'#ECFDF5' },
  'Mid-range':{ color:'#2563EB', bg:'#EFF6FF' },
  'Luxury':   { color:'#B8860B', bg:'#FFF8E7' },
}


export const MONTH_KEYS  = ['january','february','march','april','may','june','july','august','september','october','november','december']
export const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']


export const NAV = [
  { id:'overview',    label:'Overview',  icon:'🗺️' },
  { id:'budget',      label:'Budget',    icon:'💰' },
  { id:'hotels',      label:'Hotels',    icon:'🏨' },
  { id:'restaurants', label:'Dining',    icon:'🍽️' },
  { id:'attractions', label:'Places',    icon:'📸' },
  { id:'food',        label:'Food',      icon:'🥘' },
  { id:'transport',   label:'Transport', icon:'🚌' },
  { id:'weather',     label:'Weather',   icon:'🌤️' },
  { id:'itinerary',   label:'Itinerary', icon:'📅' },
  { id:'packing',     label:'Packing',   icon:'🎒' },
]

export const tiers = [
    { key:'budget',   label:'Budget',    icon:'🪙', color:'#059669', bg:'#ECFDF5', data:Traveldata.budgetPerDay.budget },
    { key:'midRange', label:'Mid-Range', icon:'💳', color:'#2563EB', bg:'#EFF6FF', data:Traveldata.budgetPerDay.midRange },
    { key:'luxury',   label:'Luxury',    icon:'💎', color:'#B8860B', bg:'#FFF8E7', data:Traveldata.budgetPerDay.luxury },
  ]

export  const attrPalette = [
    { color:C.accent, bg:C.accentSoft },
    { color:C.blue,   bg:C.blueSoft },
    { color:C.gold,   bg:C.goldSoft },
    { color:C.purple, bg:C.purpleSoft },
    { color:C.red,    bg:C.redSoft },
    { color:C.teal,   bg:C.tealSoft },
  ]
  
 export  const cats = [
      { key:'essentials', label:'Essentials',  icon:'🎒', color:'#2C6E49' },
      { key:'clothing',   label:'Clothing',    icon:'👕', color:'#2563EB' },
      { key:'documents',  label:'Documents',   icon:'📄', color:'#D97706' },
      { key:'electronics',label:'Electronics', icon:'🔌', color:'#7C3AED' },
      { key:'medicines',  label:'Medicines',   icon:'💊', color:'#DC2626' },
    ]