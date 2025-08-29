/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../UI/Card';
import { cropCategories } from '../../config/categories';
import * as Icons from 'lucide-react';

export function CategoryGrid() {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Crop Categories
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select a crop category to explore specific diseases and pest conditions, 
          or start diagnosing by uploading an image.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cropCategories.map((category) => {
          const IconComponent = (Icons as any)[category.icon] || Icons.Leaf;
          
          return (
            <motion.div key={category.id} variants={item}>
              <Card
                hover
                onClick={() => navigate(`/knowledge?category=${category.id}`)}
                className="p-6 text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {category.emoji} {category.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {category.conditions.length} conditions detected
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {category.conditions.slice(0, 3).map((condition, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {condition.split('___')[1]?.replace(/_/g, ' ') || condition}
                    </span>
                  ))}
                  {category.conditions.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{category.conditions.length - 3} more
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}