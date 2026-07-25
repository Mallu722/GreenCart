import axios from 'axios'

// Plant images mapping - using reliable image URLs
const plantImages = {
  // Indoor Plants - all verified working Unsplash URLs
  'Money Plant (Pothos)': 'https://www.orchid-tree.com/cdn/shop/files/MoneyPlantbig.jpg?v=1717158590&width=1445',
  'Snake Plant': 'https://hips.hearstapps.com/hmg-prod/images/potted-snake-plants-inside-a-beautiful-new-flat-or-royalty-free-image-1727481322.jpg?crop=0.668xw:1.00xh;0.0663xw,0&resize=1120:*',
  'Philodendron': 'https://t4.ftcdn.net/jpg/19/76/14/45/360_F_1976144518_8JmZF7Bmy2FD4nke7VT2g2anTqwqvbNQ.jpg',
  'Spider Plant': 'https://thumbs.dreamstime.com/b/spider-plant-chlorophytum-white-flowerpot-wooden-background-ornamental-plants-pot-variegatum-comosum-68591345.jpg',
  'Areca Palm': 'https://www.farmersstop.com/cdn/shop/products/30835742179411.png',
  'Monstera Deliciosa': 'https://images.squarespace-cdn.com/content/v1/56923fa6a976af0bfc533475/4487beac-be01-4ad5-8133-3276fb81972b/IMG_7938.jpg',
  'Jade Plant': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNhlmvbZWDy6mV6F5phd27GMJvM4s7QbLrWIVOHlbsuGc3ICSsVNv8cB0&s=10',
  
  // Vegetable Plants
  'Tomato Plant': 'https://plus.unsplash.com/premium_photo-1661833100239-de8f260b6f8c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dG9tYXRvJTIwcGxhbnR8ZW58MHx8MHx8fDA%3D',
  'Basil Plant': 'https://media.istockphoto.com/id/843955686/photo/thai-holy-basil-flowering-shining-over-dark-background.jpg?s=612x612&w=0&k=20&c=0ss20SutAmY6JNrxdLoWGAEgs5-SI-VKFUXyjzkW1ZA=',
  'Mint Plant': 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=500&h=500&fit=crop',
  'Chilli Plant': 'https://www.shutterstock.com/image-photo/red-chilies-pepper-field-chili-260nw-2723171667.jpg',
  'Coriander Plant': 'https://m.media-amazon.com/images/I/51zhJOc7dSL._AC_UF1000,1000_QL80_.jpg',
  
  // Fruit Plants
  'Lemon Plant': 'https://rukminim2.flixcart.com/image/480/640/xif0q/plant-sapling/n/r/1/annual-yes-yes-vietnam-all-time-1-plastic-bag-exotic-plant-hub-original-imagg6grc6yjkc3u.jpeg?q=90',
  'Guava Plant': 'https://static.vecteezy.com/system/resources/thumbnails/073/843/718/small/lush-guava-orchard-a-bounty-of-green-fruit-in-a-tropical-garden-free-photo.jpg',
  'Papaya Plant': 'https://img.magnific.com/free-vector/papaya-tree-isolated-cartoon-style-white_1308-60822.jpg',
  'Mango Plant': 'https://t4.ftcdn.net/jpg/00/14/71/15/360_F_14711535_o3MgCpenxtKxNX5bw3iAzfoUfWBAKLuy.jpg',
  
  // Flower Seeds
  'Sunflower Seeds': 'https://www.shutterstock.com/image-photo/pile-black-roasted-salty-sunflower-260nw-2408077127.jpg',
  'Rose Seeds': 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=500&h=500&fit=crop',
  'Tulip Seeds': 'https://nurserylive.com/cdn/shop/products/nurserylive-bulbs-tulip-set-of-5.jpg?v=1663687920',
  'Marigold Seeds': 'https://m.media-amazon.com/images/I/61I5bc5WrEL._AC_UF1000,1000_QL80_.jpg',
  'Jasmine Seeds': 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/plant-seed/i/q/k/5-night-jasmine-seeds-parijaat-flower-seeds-ibains-original-imagnqmadxgr8ygh.jpeg?q=90',
  
  // Vegetable Seeds
  'Tomato Seeds': 'https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=500&h=500&fit=crop',
  'Cucumber Seeds': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&h=500&fit=crop',
  'Carrot Seeds': 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=500&h=500&fit=crop',
  'Lettuce Seeds': 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=500&h=500&fit=crop',
  'Pumpkin Seeds': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvb0mtZQzf9mHjr38aqZwex_FmDs8w9VAphk2ZAJFurmAra5qZWaW0TKk&s=10',
  
  // Fruit Seeds
  'Watermelon Seeds': 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=500&h=500&fit=crop',
  'Muskmelon Seeds': 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&h=500&fit=crop',
  'Strawberry Seeds': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop',
  'Papaya Seeds': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=500&h=500&fit=crop',
  
  // Soil and Fertilizers
  'Premium Potting Soil Mix': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&h=500&fit=crop',
  'Organic Vermicompost': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop',
  'Coco Peat Block': 'https://services.ibo.com/media/v1/products/images/9b1e024a-b837-4b11-b7e7-7ac65a95b1f0/nature-plus-coco-peat-block-5-kg-0.webp',
  'Neem Cake Powder': 'https://greenlandnurserychennai.com/wp-content/uploads/2020/08/Neem-Cake-Powder.jpg',
  'Perlite for Plants': 'https://utkarshagro.com/cdn/shop/files/Perlite_Infogs_4.webp?v=1767956007&width=1214'
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
