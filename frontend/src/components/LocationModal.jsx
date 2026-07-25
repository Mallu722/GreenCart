import React, { useEffect, useRef, useState } from 'react'

const LocationModal = ({ isOpen, onClose, onConfirm }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState('Locating you on map...')
  const [searching, setSearching] = useState(false)
  
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const mapInitRef = useRef(false)

  // Load Leaflet libraries dynamically
  useEffect(() => {
    if (!isOpen) return

    // Clean up function to run on close/reopen
    const cleanUpMap = () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
        mapInitRef.current = false
      }
    }

    cleanUpMap()

    const loadLeaflet = () => {
      // Load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // Load Leaflet JS
      if (!window.L) {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.async = true
        script.onload = () => {
          setTimeout(() => initMap(window.L), 100)
        }
        document.body.appendChild(script)
      } else {
        setTimeout(() => initMap(window.L), 100)
      }
    }

    loadLeaflet()

    return () => cleanUpMap()
  }, [isOpen])

  const initMap = (L) => {
    if (mapInitRef.current || !isOpen) return
    mapInitRef.current = true

    // Default to Mumbai center coordinates
    const defaultCoords = [19.0760, 72.8777]

    try {
      const map = L.map('leaflet-map-element', {
        zoomControl: true,
        attributionControl: false
      }).setView(defaultCoords, 13)
      
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map)

      // Custom icon using standard Leaflet styling fallbacks
      const marker = L.marker(defaultCoords, { 
        draggable: true 
      }).addTo(map)
      
      markerRef.current = marker

      // Set initial address
      reverseGeocode(defaultCoords[0], defaultCoords[1])

      // Handle marker drag
      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        reverseGeocode(pos.lat, pos.lng)
      })

      // Click map to select location
      map.on('click', (e) => {
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        reverseGeocode(lat, lng)
      })

      // Fix gray tiles issue by triggering invalidation size
      setTimeout(() => {
        map.invalidateSize()
      }, 300)

    } catch (e) {
      console.error('Error initializing Leaflet map:', e)
    }
  }

  const reverseGeocode = async (lat, lng) => {
    try {
      setResolvedAddress('Resolving pinned address...')
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await response.json()
      if (data && data.display_name) {
        setResolvedAddress(data.display_name)
      } else {
        setResolvedAddress(`Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      setResolvedAddress(`Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setSearching(true)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        const latitude = parseFloat(lat)
        const longitude = parseFloat(lon)

        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], 15)
          markerRef.current.setLatLng([latitude, longitude])
          setResolvedAddress(display_name)
        }
      } else {
        alert('Location not found. Please try a different search.')
      }
    } catch (error) {
      console.error('Error searching location:', error)
      alert('Error searching for location. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleConfirm = () => {
    let shortName = 'Mumbai'
    if (resolvedAddress) {
      const parts = resolvedAddress.split(',')
      // Pull city/suburb names from parts
      shortName = parts[0].trim()
      if ((shortName.length < 3 || /^\d+$/.test(shortName)) && parts.length > 1) {
        shortName = parts[1].trim()
      }
      if (shortName.length > 18) {
        shortName = shortName.substring(0, 18) + '...'
      }
    }

    onConfirm({
      shortName,
      fullName: resolvedAddress,
      coords: markerRef.current ? markerRef.current.getLatLng() : null
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>📍</span> Pin Delivery Location
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">Drag the pin or search to set your precise delivery address.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 flex-grow flex flex-col overflow-y-auto">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your city, area, or society..."
              className="flex-grow px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition disabled:bg-gray-400"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Leaflet Map Div */}
          <div className="w-full h-80 rounded-2xl border border-gray-200 overflow-hidden shadow-inner relative">
            <div id="leaflet-map-element" className="w-full h-full z-10"></div>
          </div>

          {/* Resolved Address Display */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Selected Delivery Address</p>
            <p className="text-sm font-semibold text-gray-800 leading-relaxed">
              {resolvedAddress}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition bg-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition shadow"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationModal
