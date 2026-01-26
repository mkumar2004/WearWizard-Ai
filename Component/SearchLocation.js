
export const searchLocation = async (searchText) => {
  if (!searchText || searchText.trim() === '' || searchText === 'Current Location') {
    return null
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      searchText
    )}&limit=1`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'ReactNativeApp/1.0',
      },
    })

    const data = await res.json()

    if (data && data.length > 0) {
      const result = data[0]

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        name: result.display_name.split(',')[0],
      }
    } else {
      alert(`Location "${searchText}" not found. Try: City, Country`)
      return null
    }
  } catch (error) {
    console.log('Search error:', error)
    alert('Search failed. Check your internet connection.')
    return null
  }
}
