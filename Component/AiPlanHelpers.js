export const POI_CATEGORIES = [
  { id: 'all',        label: 'All',      icon: '🗺️', color: '#6366F1' },
  { id: 'restaurant', label: 'Food',     icon: '🍽️', color: '#EF4444' },
  { id: 'temple',     label: 'Temple',   icon: '🛕', color: '#F59E0B' },
  { id: 'hotel',      label: 'Hotel',    icon: '🏨', color: '#3B82F6' },
  { id: 'tourist',    label: 'Tourist',  icon: '📸', color: '#8B5CF6' },
  { id: 'hospital',   label: 'Hospital', icon: '🏥', color: '#10B981' },
  { id: 'shop',       label: 'Shopping', icon: '🛍️', color: '#EC4899' },
  { id: 'atm',        label: 'ATM',      icon: '🏧', color: '#14B8A6' },
]

export const POI_PHOTO_KEYWORDS = {
  restaurant: 'indian+restaurant+food', cafe: 'cafe+coffee+india',
  fast_food: 'street+food+india', food_court: 'food+court+india',
  place_of_worship: 'hindu+temple+india', temple: 'hindu+temple+india',
  church: 'church+india', mosque: 'mosque+india',
  hotel: 'hotel+lobby+india', guest_house: 'guesthouse+india', hostel: 'hostel+travel',
  attraction: 'tourist+attraction+india', monument: 'monument+india',
  museum: 'museum+india', viewpoint: 'viewpoint+india+landscape',
  fort: 'fort+india', palace: 'palace+india', ruins: 'ancient+ruins+india',
  hospital: 'hospital+building', clinic: 'clinic+medical', pharmacy: 'pharmacy+medicine',
  mall: 'shopping+mall+india', supermarket: 'supermarket+india', market: 'market+bazaar+india',
  atm: 'atm+bank+india', bank: 'bank+building+india',
}

export const getPhotoUrl = (type, seed) => {
  const keyword = POI_PHOTO_KEYWORDS[type] || 'india+travel+landmark'
  const cleanKeyword = keyword.replace(/\+/g, ',')
  // Create a numeric seed from string ID to keep image stable for the same POI
  let numericSeed = 0;
  for (let i = 0; i < seed.length; i++) numericSeed = (numericSeed << 5) - numericSeed + seed.charCodeAt(i);
  numericSeed = Math.abs(numericSeed) % 1000;
  return `https://loremflickr.com/150/150/${cleanKeyword}?lock=${numericSeed}`
}

export const buildOverpassQuery = (lat, lon, radius = 2000, category) => {
  const bbox = `(around:${radius},${lat},${lon})`
  const queries = {
    restaurant: `node["amenity"~"restaurant|cafe|fast_food|food_court"]${bbox};`,
    temple:     `node["amenity"="place_of_worship"]["religion"~"hindu|buddhist|jain|sikh"]${bbox};node["historic"~"temple"]${bbox};`,
    hotel:      `node["tourism"~"hotel|guest_house|hostel|motel"]${bbox};`,
    tourist:    `node["tourism"~"attraction|viewpoint|museum|monument|artwork"]${bbox};node["historic"~"monument|ruins|fort|palace"]${bbox};`,
    hospital:   `node["amenity"~"hospital|clinic|pharmacy|doctors"]${bbox};`,
    shop:       `node["shop"~"mall|supermarket|market|clothes|jewelry"]${bbox};`,
    atm:        `node["amenity"="atm"]${bbox};node["amenity"="bank"]${bbox};`,
    all:        `node["amenity"~"restaurant|cafe|place_of_worship|hospital|atm|bank"]${bbox};node["tourism"~"hotel|attraction|viewpoint|museum|monument"]${bbox};node["historic"~"monument|temple|fort|palace"]${bbox};`,
  }
  return `[out:json][timeout:25];(${queries[category] || queries.all});out body;`
}

export const fetchPOIs = async (lat, lon, category = 'all') => {
  try {
    const query = buildOverpassQuery(lat, lon, 2000, category)
    const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query })
    if (!res.ok) return []
    const text = await res.text()
    if (text.trim().startsWith('<')) return [] // Suppress HTML error responses silently
    const data = JSON.parse(text)
    return (data.elements || [])
      .filter(el => el.lat && el.lon && el.tags)
      .slice(0, 35)
      .map(el => ({
        id: el.id,
        latitude: el.lat, longitude: el.lon,
        name: el.tags.name || el.tags['name:en'] || el.tags.amenity || el.tags.tourism || 'Place',
        type: el.tags.amenity || el.tags.tourism || el.tags.historic || el.tags.shop || '',
        cuisine: el.tags.cuisine || '',
        opening_hours: el.tags.opening_hours || '',
        phone: el.tags.phone || el.tags['contact:phone'] || '',
        website: el.tags.website || el.tags['contact:website'] || '',
      }))
  } catch (err) {
    console.error('POI fetch error:', err)
    return []
  }
}

export const getPOIStyle = (type) => {
  if (!type) return { icon: '📍', color: '#6B7280' }
  if (type.match(/restaurant|cafe|fast_food|food/)) return { icon: '🍽️', color: '#EF4444' }
  if (type.match(/worship|temple|church|mosque/))   return { icon: '🛕', color: '#F59E0B' }
  if (type.match(/hotel|guest|hostel|motel/))        return { icon: '🏨', color: '#3B82F6' }
  if (type.match(/attraction|monument|museum|fort|palace|ruins|viewpoint/)) return { icon: '📸', color: '#8B5CF6' }
  if (type.match(/hospital|clinic|pharmacy|doctor/)) return { icon: '🏥', color: '#10B981' }
  if (type.match(/shop|mall|market|supermarket/))    return { icon: '🛍️', color: '#EC4899' }
  if (type.match(/atm|bank/))                        return { icon: '🏧', color: '#14B8A6' }
  return { icon: '📍', color: '#6366F1' }
}

export const searchLocation = async (query, limit = 1) => {
  if (!query?.trim() || query === 'Current Location') return limit === 1 ? null : []
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&limit=${limit}&countrycodes=in`,
      { headers: { 'User-Agent': 'TravelApp/1.0', 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    if (limit === 1) {
      if (data?.length > 0) return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon), name: data[0].display_name }
      return null
    } else {
      return (data || []).map(item => ({ latitude: parseFloat(item.lat), longitude: parseFloat(item.lon), name: item.display_name }))
    }
  } catch { return limit === 1 ? null : [] }
}

export const reverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      { headers: { 'User-Agent': 'TravelApp/1.0', 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    if (data?.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.county
      const state = data.address.state
      if (city && state) return `${city}, ${state}`
      return data.display_name?.split(',')?.slice(0, 2)?.join(',') || 'Your Location'
    }
  } catch { return 'Your Location' }
  return 'Your Location'
}
