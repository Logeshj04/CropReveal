import { motion } from 'framer-motion';
import { Camera, Zap, Shield, TrendingUp } from 'lucide-react';
import { Button } from '../UI/Button';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  const handleDiagnoseClick = () => {
    console.log('Diagnose button clicked');
    try {
      navigate('/diagnose');
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Navigation failed. Please refresh the page and try again.');
    }
  };

  const handleChatClick = () => {
    console.log('Chat button clicked');
    try {
      navigate('/chat');
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Navigation failed. Please refresh the page and try again.');
    }
  };

  const features = [
    { icon: Zap, title: 'AI-Powered', description: 'Advanced machine learning for accurate diagnosis' },
    { icon: Shield, title: 'Reliable', description: '60+ conditions detected with high precision' },
    { icon: TrendingUp, title: 'Scalable', description: 'Supports multiple crops and pest types' }
  ];

  return (
          <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AI for Crop Health
              </span>
              <br />
              <span className="text-gray-700">& Diagnosis</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Detect diseases 50+ conditions with our advanced AI system. 
              Get instant diagnosis, treatment recommendations, and expert advice for healthier crops.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleDiagnoseClick}
                className="px-8 py-4 text-lg font-semibold"
                data-testid="diagnose-button"
              >
                <Camera className="w-5 h-5 mr-2" />
                Upload Image to Diagnose
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={handleChatClick}
                className="px-8 py-4 text-lg font-semibold"
                data-testid="chat-button"
              >
                Ask AI Assistant
              </Button>
            </div>

            
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}