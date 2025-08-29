import type { CropCategory, KnowledgeItem, TreatmentInfo } from '../types/index';

export const cropCategories: CropCategory[] = [
  {
    id: 'apple',
    name: 'Apple',
    icon: 'Apple',
    emoji: '🍎',
    conditions: ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy'],
    color: 'from-red-400 to-red-600'
  },
  {
    id: 'corn',
    name: 'Corn',
    icon: 'Wheat',
    emoji: '🌽',
    conditions: ['Corn_(maize)___Cercospora_leaf_spot', 'Corn_(maize)___Common_rust', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy'],
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 'grape',
    name: 'Grape',
    icon: 'Grape',
    emoji: '🍇',
    conditions: ['Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight', 'Grape___healthy'],
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    icon: 'Cherry',
    emoji: '🍅',
    conditions: ['Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'],
    color: 'from-red-400 to-red-500'
  },
  {
    id: 'orange',
    name: 'Orange',
    icon: 'Orange',
    emoji: '🍊',
    conditions: ['Orange___Haunglongbing_(Citrus_greening)', 'Orange___healthy'],
    color: 'from-orange-400 to-orange-600'
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    icon: 'Cherry',
    emoji: '🍓',
    conditions: ['Strawberry___Leaf_scorch', 'Strawberry___healthy'],
    color: 'from-pink-400 to-red-500'
  },
  {
    id: 'potato',
    name: 'Potato',
    icon: 'Potato',
    emoji: '🥔',
    conditions: ['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy'],
    color: 'from-amber-600 to-yellow-700'
  },
  {
    id: 'insect',
    name: 'Insect Pests',
    icon: 'Bug',
    emoji: '🐛',
    conditions: ['Aphids', 'Caterpillars', 'Beetles', 'Thrips', 'Whiteflies', 'Spider_mites'],
    color: 'from-amber-400 to-amber-600'
  }
];

export const treatments: Record<string, TreatmentInfo> = {
  'Apple___Apple_scab': {
    title: 'Apple Scab Treatment',
    description: 'Apple scab is a fungal disease that affects apple trees, causing dark spots on leaves and fruit.',
    steps: [
      'Remove and destroy fallen leaves to reduce fungal spores',
      'Apply fungicide sprays during spring before symptoms appear',
      'Ensure proper air circulation by pruning dense branches',
      'Choose scab-resistant apple varieties for future plantings'
    ],
    prevention: [
      'Plant resistant varieties',
      'Maintain good sanitation practices',
      'Ensure adequate spacing between trees',
      'Apply preventive fungicide treatments'
    ]
  },
  'Tomato___Late_blight': {
    title: 'Late Blight Management',
    description: 'Late blight is a serious fungal disease that can destroy tomato crops rapidly.',
    steps: [
      'Remove affected plant parts immediately',
      'Apply copper-based fungicides',
      'Improve air circulation around plants',
      'Avoid overhead watering',
      'Consider destroying severely infected plants'
    ],
    prevention: [
      'Use certified disease-free seeds',
      'Practice crop rotation',
      'Maintain proper plant spacing',
      'Water at soil level to keep foliage dry'
    ]
  },
  'Strawberry___Leaf_scorch': {
    title: 'Strawberry Leaf Scorch Treatment',
    description: 'Leaf scorch is a fungal disease that causes browning and scorching of strawberry leaves, reducing plant vigor.',
    steps: [
      'Remove and destroy affected leaves immediately',
      'Apply appropriate fungicides during early growing season',
      'Improve air circulation by thinning dense plantings',
      'Ensure proper drainage to reduce moisture levels',
      'Avoid overhead irrigation during humid conditions'
    ],
    prevention: [
      'Plant resistant strawberry varieties',
      'Maintain proper plant spacing',
      'Use drip irrigation instead of overhead watering',
      'Apply preventive fungicide treatments in early spring'
    ]
  },
  'Potato___healthy': {
    title: 'Maintaining Healthy Potatoes',
    description: 'Healthy potato plants show vigorous growth and are free from disease and pest damage.',
    steps: [
      'Continue current cultivation practices',
      'Monitor regularly for early signs of disease or pests',
      'Maintain consistent watering schedule',
      'Ensure adequate nutrition throughout growing season'
    ],
    prevention: [
      'Use certified seed potatoes',
      'Practice proper crop rotation',
      'Maintain soil health with organic matter',
      'Monitor and control weeds regularly'
    ]
  }
};

export const knowledgeBase: KnowledgeItem[] = [
  {
    id: 'apple-scab',
    name: 'Apple Scab',
    category: 'Apple',
    type: 'Disease',
    causes: ['Venturia inaequalis fungus', 'High humidity', 'Cool, wet weather conditions'],
    symptoms: ['Dark, scabby spots on leaves', 'Fruit surface lesions', 'Premature leaf drop', 'Reduced fruit quality'],
    treatment: ['Fungicide applications', 'Cultural practices', 'Resistant varieties'],
    prevention: ['Sanitation', 'Proper spacing', 'Preventive sprays'],
    image: 'https://images.pexels.com/photos/574919/pexels-photo-574919.jpeg'
  },
  {
    id: 'tomato-healthy',
    name: 'Healthy Tomato',
    category: 'Tomato',
    type: 'Healthy',
    causes: ['Proper nutrition', 'Adequate water', 'Good growing conditions'],
    symptoms: ['Vibrant green foliage', 'Strong stem structure', 'Normal fruit development'],
    treatment: ['Continue current care practices'],
    prevention: ['Maintain consistent watering', 'Provide adequate nutrition', 'Monitor for early signs of problems'],
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
  },
  {
    id: 'strawberry-leaf-scorch',
    name: 'Strawberry Leaf Scorch',
    category: 'Strawberry',
    type: 'Disease',
    causes: ['Diplocarpon earlianum fungus', 'High humidity', 'Poor air circulation', 'Wet conditions'],
    symptoms: ['Brown, scorched leaf margins', 'Purple to reddish-brown spots', 'Leaf wilting and drop', 'Reduced plant vigor'],
    treatment: ['Fungicide applications', 'Remove affected foliage', 'Improve drainage'],
    prevention: ['Resistant varieties', 'Proper spacing', 'Avoid overhead watering'],
    image: 'https://images.pexels.com/photos/4750270/pexels-photo-4750270.jpeg'
  },
  {
    id: 'potato-healthy',
    name: 'Healthy Potato',
    category: 'Potato',
    type: 'Healthy',
    causes: ['Good soil conditions', 'Proper nutrition', 'Adequate moisture', 'Disease-free seed'],
    symptoms: ['Lush green foliage', 'Strong stem growth', 'Normal flowering', 'Vigorous plant development'],
    treatment: ['Continue current practices', 'Regular monitoring'],
    prevention: ['Crop rotation', 'Quality seed potatoes', 'Soil health maintenance'],
    image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg'
  }
];