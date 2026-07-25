import mongoose from 'mongoose'
import Product from './models/Product.js'
import dotenv from 'dotenv'
import { getPlantImage, generatePlantDescription, generateCareInstructions } from './services/imageService.js'

dotenv.config()

const products = [
  // INDOOR PLANTS
  {
    name: 'Money Plant (Pothos)',
    category: 'plants',
    subCategory: 'indoor',
    price: 149,
    discountPrice: 99,
    stock: 50,
    rating: 4.8,
    reviews: 245,
    deliveryTime: '45',
    description: 'Low maintenance indoor plant perfect for home decoration. Money plants are known for bringing good luck and prosperity.',
    careInstructions: 'Light: Bright, indirect light | Water: Keep soil moist but not waterlogged | Temperature: 18-25°C | Humidity: 50-60%'
  },
  {
    name: 'Snake Plant',
    category: 'plants',
    subCategory: 'indoor',
    price: 199,
    discountPrice: 149,
    stock: 35,
    rating: 4.7,
    reviews: 189,
    deliveryTime: '45',
    description: 'An excellent air-purifying plant that can tolerate low light. Very hardy and requires minimal care.',
    careInstructions: 'Light: Can tolerate low light | Water: Only when soil is dry | Temperature: 16-24°C | Humidity: Moderate'
  },
  {
    name: 'Philodendron',
    category: 'plants',
    subCategory: 'indoor',
    price: 169,
    discountPrice: 119,
    stock: 40,
    rating: 4.7,
    reviews: 198,
    deliveryTime: '45',
    description: 'A beautiful climbing vine perfect for indoor spaces. Highly adaptable and easy to care for.',
    careInstructions: 'Light: Bright, indirect light | Water: Keep soil moderately moist | Temperature: 18-25°C'
  },
  {
    name: 'Spider Plant',
    category: 'plants',
    subCategory: 'indoor',
    price: 159,
    discountPrice: 109,
    stock: 25,
    rating: 4.6,
    reviews: 156,
    deliveryTime: '45',
    description: 'Classic houseplant with striking variegated leaves. Produces baby plantlets for propagation.',
    careInstructions: 'Light: Bright, indirect light | Water: Keep soil moist | Temperature: 16-24°C'
  },
  {
    name: 'Areca Palm',
    category: 'plants',
    subCategory: 'indoor',
    price: 299,
    discountPrice: 199,
    stock: 15,
    rating: 4.5,
    reviews: 87,
    deliveryTime: '45',
    description: 'Tall, elegant palm that adds tropical vibes to any room. Excellent air purifier.',
    careInstructions: 'Light: Bright, indirect light | Water: Keep soil moist | Temperature: 18-27°C'
  },
  {
    name: 'Monstera Deliciosa',
    category: 'plants',
    subCategory: 'indoor',
    price: 249,
    discountPrice: 179,
    stock: 20,
    rating: 4.9,
    reviews: 312,
    deliveryTime: '45',
    description: 'Popular statement plant with signature split leaves. Grows tall and makes a bold impact.',
    careInstructions: 'Light: Bright, indirect light | Water: Keep soil moderately moist | Temperature: 18-27°C'
  },
  {
    name: 'Jade Plant',
    category: 'plants',
    subCategory: 'indoor',
    price: 179,
    discountPrice: 129,
    stock: 45,
    rating: 4.8,
    reviews: 201,
    deliveryTime: '45',
    description: 'Succulent with thick, fleshy leaves. Symbol of good fortune and prosperity. Low maintenance.',
    careInstructions: 'Light: Bright light | Water: Let soil dry between watering | Temperature: 15-25°C'
  },

  // VEGETABLE PLANTS
  {
    name: 'Tomato Plant',
    category: 'plants',
    subCategory: 'vegetable',
    price: 89,
    discountPrice: 59,
    stock: 80,
    rating: 4.7,
    reviews: 234,
    deliveryTime: '45',
    description: 'Hybrid tomato plant for growing fresh, juicy tomatoes. High yield and disease resistant.',
    careInstructions: 'Light: Full sunlight (6-8 hours) | Water: Regular watering | Support: Use stakes or cage | Fertilizer: Monthly'
  },
  {
    name: 'Basil Plant',
    category: 'plants',
    subCategory: 'vegetable',
    price: 79,
    discountPrice: 49,
    stock: 100,
    rating: 4.8,
    reviews: 156,
    deliveryTime: '45',
    description: 'Fresh basil for cooking. Aromatic and flavorful. Grows quickly and continuously produces leaves.',
    careInstructions: 'Light: Bright light | Water: Keep soil moist | Temperature: 18-25°C | Pinch regularly for bushiness'
  },
  {
    name: 'Mint Plant',
    category: 'plants',
    subCategory: 'vegetable',
    price: 69,
    discountPrice: 45,
    stock: 70,
    rating: 4.9,
    reviews: 189,
    deliveryTime: '45',
    description: 'Fresh mint for tea and cooking. Highly fragrant and easy to grow. Very productive.',
    careInstructions: 'Light: Partial shade to full light | Water: Keep soil moist | Temperature: 15-25°C | Can be invasive'
  },
  {
    name: 'Chilli Plant',
    category: 'plants',
    subCategory: 'vegetable',
    price: 99,
    discountPrice: 69,
    stock: 50,
    rating: 4.6,
    reviews: 112,
    deliveryTime: '45',
    description: 'Green chilli plant for spicy cooking. High yield, multiple harvests. Very healthy.',
    careInstructions: 'Light: Full sunlight | Water: Regular watering | Temperature: 20-30°C | Fertilizer: Every 3 weeks'
  },
  {
    name: 'Coriander Plant',
    category: 'plants',
    subCategory: 'vegetable',
    price: 59,
    discountPrice: 39,
    stock: 60,
    rating: 4.7,
    reviews: 98,
    deliveryTime: '45',
    description: 'Fresh coriander (cilantro) for Indian cooking. Both leaves and seeds are useful.',
    careInstructions: 'Light: Bright light | Water: Keep soil moist | Temperature: 15-20°C | Harvest leaves regularly'
  },

  // FRUIT PLANTS
  {
    name: 'Lemon Plant',
    category: 'plants',
    subCategory: 'fruit',
    price: 249,
    discountPrice: 179,
    stock: 30,
    rating: 4.8,
    reviews: 145,
    deliveryTime: '45',
    description: 'Grafted lemon plant for home gardening. Produces juicy lemons. Can be grown in containers.',
    careInstructions: 'Light: Full sunlight (6-8 hours) | Water: Regular watering | Temperature: 15-28°C | Fertilizer: Every 6 weeks'
  },
  {
    name: 'Guava Plant',
    category: 'plants',
    subCategory: 'fruit',
    price: 199,
    discountPrice: 149,
    stock: 20,
    rating: 4.7,
    reviews: 123,
    deliveryTime: '45',
    description: 'Dwarf guava plant for small spaces. Sweet, delicious fruits. Very hardy.',
    careInstructions: 'Light: Full sunlight | Water: Moderate watering | Temperature: 18-27°C | Prune annually'
  },
  {
    name: 'Papaya Plant',
    category: 'plants',
    subCategory: 'fruit',
    price: 149,
    discountPrice: 99,
    stock: 25,
    rating: 4.6,
    reviews: 89,
    deliveryTime: '45',
    description: 'Dwarf papaya plant that fruits quickly. Tropical flavor and high nutrition.',
    careInstructions: 'Light: Full sunlight | Water: Regular watering | Temperature: 20-30°C | Support needed'
  },
  {
    name: 'Mango Plant',
    category: 'plants',
    subCategory: 'fruit',
    price: 299,
    discountPrice: 199,
    stock: 15,
    rating: 4.9,
    reviews: 201,
    deliveryTime: '45',
    description: 'Grafted mango plant for faster fruiting. King of fruits. Can be grown in containers.',
    careInstructions: 'Light: Full sunlight | Water: Regular watering | Temperature: 20-30°C | Fertilizer: Every 3 months'
  },

  // FLOWER SEEDS
  {
    name: 'Sunflower Seeds',
    category: 'seeds',
    subCategory: 'flower',
    price: 59,
    discountPrice: 39,
    stock: 100,
    rating: 4.7,
    reviews: 156,
    deliveryTime: '30',
    description: 'Premium sunflower seeds. Bright yellow flowers. Easy to grow, great for kids.',
    careInstructions: 'Sow in full sunlight | Keep soil moist | Germination: 7-10 days | Flowering: 60-80 days'
  },
  {
    name: 'Rose Seeds',
    category: 'seeds',
    subCategory: 'flower',
    price: 99,
    discountPrice: 69,
    stock: 50,
    rating: 4.8,
    reviews: 234,
    deliveryTime: '30',
    description: 'Beautiful rose flower seeds. Multiple colors. Flowers bloom in 90-120 days.',
    careInstructions: 'Pre-soak seeds | Sow in well-draining soil | Keep moist | Germination: 2-4 weeks'
  },
  {
    name: 'Tulip Seeds',
    category: 'seeds',
    subCategory: 'flower',
    price: 89,
    discountPrice: 59,
    stock: 70,
    rating: 4.6,
    reviews: 123,
    deliveryTime: '30',
    description: 'Colorful tulip seeds. Spring flowers. Beautiful garden display.',
    careInstructions: 'Plant in autumn | Needs cold period | Plant 6 inches deep | Flowers in spring'
  },
  {
    name: 'Marigold Seeds',
    category: 'seeds',
    subCategory: 'flower',
    price: 49,
    discountPrice: 29,
    stock: 150,
    rating: 4.9,
    reviews: 312,
    deliveryTime: '30',
    description: 'Easy to grow marigold seeds. Bright orange/yellow flowers. Pest resistant.',
    careInstructions: 'Sow directly in soil | Needs full sun | Germination: 5-7 days | Flowers: 30-45 days'
  },
  {
    name: 'Jasmine Seeds',
    category: 'seeds',
    subCategory: 'flower',
    price: 79,
    discountPrice: 49,
    stock: 60,
    rating: 4.8,
    reviews: 189,
    deliveryTime: '30',
    description: 'Fragrant jasmine flowers. Sweet perfume. Climbing vine, needs support.',
    careInstructions: 'Soak seeds overnight | Sow in moist soil | Germination: 2-3 weeks | Flowering: 1-2 years'
  },

  // VEGETABLE SEEDS
  {
    name: 'Tomato Seeds',
    category: 'seeds',
    subCategory: 'vegetable',
    price: 49,
    discountPrice: 29,
    stock: 120,
    rating: 4.8,
    reviews: 267,
    deliveryTime: '30',
    description: 'Premium hybrid tomato seeds. High yield, disease resistant variety.',
    careInstructions: 'Sow in seed tray | Needs warmth | Germination: 5-7 days | Transplant at 6 weeks'
  },
  {
    name: 'Cucumber Seeds',
    category: 'seeds',
    subCategory: 'vegetable',
    price: 45,
    discountPrice: 29,
    stock: 130,
    rating: 4.7,
    reviews: 145,
    deliveryTime: '30',
    description: 'Fresh cucumber seeds. Fast growing, high yielding variety.',
    careInstructions: 'Sow directly | Needs full sun | Germination: 4-8 days | Harvest: 50-70 days'
  },
  {
    name: 'Carrot Seeds',
    category: 'seeds',
    subCategory: 'vegetable',
    price: 39,
    discountPrice: 25,
    stock: 140,
    rating: 4.6,
    reviews: 98,
    deliveryTime: '30',
    description: 'Orange carrot seeds. Sweet variety. Good for storage.',
    careInstructions: 'Sow thinly | Keep soil moist | Germination: 10-14 days | Harvest: 70-80 days'
  },
  {
    name: 'Lettuce Seeds',
    category: 'seeds',
    subCategory: 'vegetable',
    price: 45,
    discountPrice: 30,
    stock: 100,
    rating: 4.8,
    reviews: 176,
    deliveryTime: '30',
    description: 'Fresh lettuce seeds. Salad variety. Multiple harvests possible.',
    careInstructions: 'Sow directly | Cool season crop | Germination: 7-10 days | Harvest: 45-60 days'
  },
  {
    name: 'Pumpkin Seeds',
    category: 'seeds',
    subCategory: 'vegetable',
    price: 69,
    discountPrice: 45,
    stock: 80,
    rating: 4.7,
    reviews: 112,
    deliveryTime: '30',
    description: 'Large pumpkin seeds. Great for autumn gardening and cooking.',
    careInstructions: 'Sow after frost | Needs full sun | Germination: 7-10 days | Harvest: 90-120 days'
  },

  // FRUIT SEEDS
  {
    name: 'Watermelon Seeds',
    category: 'seeds',
    subCategory: 'fruit',
    price: 79,
    discountPrice: 49,
    stock: 70,
    rating: 4.8,
    reviews: 234,
    deliveryTime: '30',
    description: 'Sweet watermelon seeds. Summer favorite. High germination rate.',
    careInstructions: 'Sow in warm soil | Full sun | Germination: 7-10 days | Harvest: 70-100 days'
  },
  {
    name: 'Muskmelon Seeds',
    category: 'seeds',
    subCategory: 'fruit',
    price: 69,
    discountPrice: 45,
    stock: 60,
    rating: 4.7,
    reviews: 156,
    deliveryTime: '30',
    description: 'Fragrant muskmelon seeds. Sweet and juicy fruits.',
    careInstructions: 'Sow in warm soil | Full sun | Germination: 8-12 days | Harvest: 70-90 days'
  },
  {
    name: 'Strawberry Seeds',
    category: 'seeds',
    subCategory: 'fruit',
    price: 99,
    discountPrice: 69,
    stock: 50,
    rating: 4.9,
    reviews: 289,
    deliveryTime: '30',
    description: 'Premium strawberry seeds. Sweet berries. Container friendly.',
    careInstructions: 'Sow in seed tray | Cold treatment needed | Germination: 2-3 weeks | Fruiting: 6 months'
  },
  {
    name: 'Papaya Seeds',
    category: 'seeds',
    subCategory: 'fruit',
    price: 59,
    discountPrice: 39,
    stock: 80,
    rating: 4.6,
    reviews: 123,
    deliveryTime: '30',
    description: 'Fresh papaya seeds. Quick fruiting variety. Tropical flavor.',
    careInstructions: 'Sow fresh seeds | Warm soil needed | Germination: 2-3 weeks | Fruiting: 4-6 months'
  },
  // SOIL AND FERTILIZERS
  {
    name: 'Premium Potting Soil Mix',
    category: 'soil',
    subCategory: 'potting',
    price: 199,
    discountPrice: 149,
    stock: 60,
    rating: 4.8,
    reviews: 187,
    deliveryTime: '45',
    description: 'Enriched potting soil mix with coco peat, vermicompost, and essential nutrients. Promotes healthy root growth and water retention.',
    careInstructions: 'Use directly for potting | Water moderately after planting | Suitable for all indoor and outdoor plants'
  },
  {
    name: 'Organic Vermicompost',
    category: 'soil',
    subCategory: 'organic',
    price: 149,
    discountPrice: 99,
    stock: 75,
    rating: 4.9,
    reviews: 243,
    deliveryTime: '45',
    description: '100% organic earthworm compost. Rich in humic acids and micro-nutrients to boost plant growth and immunity.',
    careInstructions: 'Mix 20-30% with garden soil | Apply monthly for best results | Store in a cool, dry place'
  },
  {
    name: 'Coco Peat Block',
    category: 'soil',
    subCategory: 'potting',
    price: 129,
    discountPrice: 79,
    stock: 50,
    rating: 4.7,
    reviews: 156,
    deliveryTime: '45',
    description: 'Compressed coco peat block. Expands up to 75 liters of fluffy soil medium when hydrated. Excellent moisture retainer.',
    careInstructions: 'Soak in water to expand | Mix with soil or use as soil-less medium | Ideal for seed germination'
  },
  {
    name: 'Neem Cake Powder',
    category: 'soil',
    subCategory: 'organic',
    price: 99,
    discountPrice: 69,
    stock: 40,
    rating: 4.6,
    reviews: 112,
    deliveryTime: '45',
    description: 'Natural organic fertilizer and pest repellent. Protects plant roots from nematodes and soil-borne pathogens.',
    careInstructions: 'Mix 50g per pot during soil preparation | Apply twice a year | Works as a slow-release fertilizer'
  },
  {
    name: 'Perlite for Plants',
    category: 'soil',
    subCategory: 'fertilizer',
    price: 159,
    discountPrice: 119,
    stock: 35,
    rating: 4.7,
    reviews: 98,
    deliveryTime: '45',
    description: 'Premium drainage-boosting perlite. Light-weight volcanic mineral that prevents soil compaction and aids aeration.',
    careInstructions: 'Mix 10-20% with potting soil | Excellent for succulents and cacti | Helps prevent root rot'
  }
]

export async function seedDatabase(force = false) {
  try {
    const count = await Product.countDocuments()
    if (count > 0 && !force) {
      console.log('📊 Database already has products. Skipping seeding.')
      return
    }

    if (force) {
      await Product.deleteMany({})
      console.log('🗑️ Cleared existing products')
    }

    // Add images to products
    const productsWithImages = products.map(product => ({
      ...product,
      image: getPlantImage(product.name),
      images: [getPlantImage(product.name)]
    }))

    // Insert products
    const inserted = await Product.insertMany(productsWithImages)
    console.log(`✅ ${inserted.length} products added to database!`)

    // Show summary
    console.log('\n📊 Product Summary:')
    const summary = {
      'Plants (Indoor)': await Product.countDocuments({ category: 'plants', subCategory: 'indoor' }),
      'Plants (Vegetable)': await Product.countDocuments({ category: 'plants', subCategory: 'vegetable' }),
      'Plants (Fruit)': await Product.countDocuments({ category: 'plants', subCategory: 'fruit' }),
      'Seeds (Flower)': await Product.countDocuments({ category: 'seeds', subCategory: 'flower' }),
      'Seeds (Vegetable)': await Product.countDocuments({ category: 'seeds', subCategory: 'vegetable' }),
      'Seeds (Fruit)': await Product.countDocuments({ category: 'seeds', subCategory: 'fruit' }),
      'Soil (Potting)': await Product.countDocuments({ category: 'soil', subCategory: 'potting' }),
      'Soil (Organic)': await Product.countDocuments({ category: 'soil', subCategory: 'organic' }),
      'Soil (Fertilizer)': await Product.countDocuments({ category: 'soil', subCategory: 'fertilizer' })
    }
    
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} products`)
    })
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

// If run directly
if (process.argv[1] && process.argv[1].includes('seeds.js')) {
  const force = process.argv.includes('--force')
  import('mongoose').then(async (mongoose) => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencart')
    console.log('✅ MongoDB connected (Direct Run)')
    await seedDatabase(force)
    process.exit(0)
  })
}
