import axios from 'axios'

// Plant images mapping - using reliable image URLs
const plantImages = {
  // Indoor Plants
  'Money Plant': 'https://images.unsplash.com/photo-1509909756405-dfc993d674d4?w=500&h=500&fit=crop',
  'Snake Plant': 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500&h=500&fit=crop',
  'Pothos': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
  'Spider Plant': 'https://images.unsplash.com/photo-1450126613828-dc30d279aacc?w=500&h=500&fit=crop',
  'Philodendron': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&h=500&fit=crop',
  'Areca Palm': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64e1d?w=500&h=500&fit=crop',
  'Monstera': 'https://images.unsplash.com/photo-1502082553048-f007c77b6dba?w=500&h=500&fit=crop',
  'Jade Plant': 'https://images.unsplash.com/photo-1576420344272-c6f05ad9e4b7?w=500&h=500&fit=crop',
  
  // Vegetable Plants
  'Tomato Plant': 'https://images.unsplash.com/photo-1585551666519-0055eca6402d?w=500&h=500&fit=crop',
  'Basil Plant': 'https://images.unsplash.com/photo-1518917183309-9d19ee268e0d?w=500&h=500&fit=crop',
  'Mint Plant': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&h=500&fit=crop',
  'Chilli Plant': 'https://images.unsplash.com/photo-1627875649417-7d58bdd2cbbb?w=500&h=500&fit=crop',
  'Coriander Plant': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64e1d?w=500&h=500&fit=crop',
  'Parsley Plant': 'https://images.unsplash.com/photo-1509909756405-dfc993d674d4?w=500&h=500&fit=crop',
  
  // Fruit Plants
  'Lemon Plant': 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=500&h=500&fit=crop',
  'Guava Plant': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64e1d?w=500&h=500&fit=crop',
  'Papaya Plant': 'https://images.unsplash.com/photo-1585518419759-47f1667caf3f?w=500&h=500&fit=crop',
  'Mango Plant': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64e1d?w=500&h=500&fit=crop',
  
  // Flower Seeds
  'Sunflower': 'https://images.unsplash.com/photo-1597848212624-753a6238abeb?w=500&h=500&fit=crop',
  'Rose': 'https://images.unsplash.com/photo-1608848541803-ba4f8a70ae0b?w=500&h=500&fit=crop',
  'Tulip': 'https://images.unsplash.com/photo-1520763185298-1b434c919eba?w=500&h=500&fit=crop',
  'Marigold': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&h=500&fit=crop',
  'Jasmine': 'https://images.unsplash.com/photo-1490297066288-4652492266f5?w=500&h=500&fit=crop',
  
  // Vegetable Seeds
  'Tomato Seeds': 'https://images.unsplash.com/photo-1585551666519-0055eca6402d?w=500&h=500&fit=crop',
  'Cucumber Seeds': 'https://images.unsplash.com/photo-1518917183309-9d19ee268e0d?w=500&h=500&fit=crop',
  'Carrot Seeds': 'https://images.unsplash.com/photo-1447078519245-c2400ca199e7?w=500&h=500&fit=crop',
  'Lettuce Seeds': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop',
  'Pumpkin Seeds': 'https://images.unsplash.com/photo-1590511666519-0055eca6402d?w=500&h=500&fit=crop',
  
  // Aloe and Cacti
  'Aloe Vera': 'https://images.unsplash.com/photo-1576420344272-c6f05ad9e4b7?w=500&h=500&fit=crop',
  'Cactus': 'https://images.unsplash.com/photo-1485579149c01123123e42a1fb158e50?w=500&h=500&fit=crop',
}

export const getPlantImage = (plantName) => {
  // Try exact match first
  if (plantImages[plantName]) {
    return plantImages[plantName]
  }
  
  // Try partial match
  const key = Object.keys(plantImages).find(k => 
    k.toLowerCase().includes(plantName.toLowerCase()) ||
    plantName.toLowerCase().includes(k.toLowerCase())
  )
  
  return key ? plantImages[key] : plantImages['Money Plant']
}

export const getAllPlantImages = () => {
  return plantImages
}

// Fetch image from Google via Unsplash (free image service)
export const fetchPlantImageFromSearch = async (plantName) => {
  try {
    // Using Unsplash API as a proxy for plant images
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: `${plantName} plant`,
        per_page: 1,
        client_id: process.env.UNSPLASH_API_KEY || 'demo'
      }
    })
    
    if (response.data.results.length > 0) {
      return response.data.results[0].urls.regular
    }
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error.message)
  }
  
  return getPlantImage(plantName)
}

// Generate description from plant name
export const generatePlantDescription = (plantName, category, subCategory) => {
  const descriptions = {
    'Money Plant': 'Low maintenance indoor plant perfect for home decoration. Money plants are known for bringing good luck and prosperity. They require bright, indirect light and moderate watering.',
    'Snake Plant': 'An excellent air-purifying plant that can tolerate low light. Snake plants are very hardy and require minimal care, making them perfect for beginners.',
    'Pothos': 'A beautiful trailing vine that adds elegance to any space. Easy to grow and can thrive in various light conditions. Perfect for hanging baskets.',
    'Spider Plant': 'A classic houseplant with striking variegated leaves. Spider plants produce baby plantlets that can be propagated. Great for shelves and hanging baskets.',
    'Aloe Vera': 'A medicinal succulent with gel-filled leaves. Aloe vera is excellent for skincare and requires minimal watering. Thrives in bright light.',
  }
  
  if (descriptions[plantName]) {
    return descriptions[plantName]
  }
  
  // Generate generic description
  if (category === 'plants') {
    if (subCategory === 'indoor') {
      return `Beautiful indoor ${plantName.toLowerCase()} perfect for home decoration. Low maintenance and air-purifying properties.`
    } else if (subCategory === 'vegetable') {
      return `Fresh ${plantName.toLowerCase()} plant for growing your own vegetables at home. Easy to cultivate and nurture.`
    } else if (subCategory === 'fruit') {
      return `Quality ${plantName.toLowerCase()} plant to grow delicious fruits in your garden. Healthy and organic.`
    }
  }
  
  return `Premium quality ${plantName.toLowerCase()} seeds. High germination rate and excellent growth potential.`
}

// Generate care instructions
export const generateCareInstructions = (plantName, subCategory) => {
  const instructions = {
    'Money Plant': [
      'Light: Bright, indirect light',
      'Water: Keep soil moist but not waterlogged',
      'Humidity: 50-60% is perfect',
      'Temperature: 18-25°C',
      'Fertilizer: Monthly during growing season',
      'Pruning: Trim regularly for bushier growth'
    ],
    'Snake Plant': [
      'Light: Can tolerate low light',
      'Water: Water only when soil is completely dry',
      'Humidity: Moderate, can handle dry air',
      'Temperature: 16-24°C',
      'Fertilizer: Dilute fertilizer monthly',
      'Maintenance: Wipe leaves occasionally'
    ],
    'Aloe Vera': [
      'Light: Bright, indirect light preferred',
      'Water: Let soil dry between watering',
      'Soil: Well-draining cactus soil',
      'Temperature: 13-27°C',
      'Humidity: Low, prefers dry air',
      'Propagation: Easy to propagate from leaves'
    ]
  }
  
  return instructions[plantName] || [
    'Light: Bright, indirect light',
    'Water: Water when top inch of soil is dry',
    'Temperature: 18-25°C',
    'Humidity: 50-60%',
    'Fertilizer: Monthly',
    'Drainage: Ensure pot has drainage holes'
  ]
}
