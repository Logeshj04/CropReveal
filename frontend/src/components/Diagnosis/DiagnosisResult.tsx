import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Bug, Info, MessageCircle } from 'lucide-react';
import type { DiagnosisResult as DiagnosisResultType } from '../../types/index';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';

interface DiagnosisResultProps {
  result: DiagnosisResultType;
  onAskChatbot: () => void;
}

export function DiagnosisResult({ result, onAskChatbot }: DiagnosisResultProps) {
  const getStatusIcon = () => {
    switch (result.healthStatus) {
      case 'Healthy':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'Disease':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'Pest':
        return <Bug className="w-6 h-6 text-amber-500" />;
    }
  };

  const getStatusColor = () => {
    switch (result.healthStatus) {
      case 'Healthy':
        return 'text-green-600';
      case 'Disease':
        return 'text-red-600';
      case 'Pest':
        return 'text-amber-600';
    }
  };

  const parseClassName = (className: string) => {
    const parts = className.split('___');
    const crop = parts[0]?.replace(/_/g, ' ') || '';
    const condition = parts[1]?.replace(/_/g, ' ') || className.replace(/_/g, ' ');
    return { crop, condition };
  };

  const { crop, condition } = parseClassName(result.detectedClass);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Result Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className={`text-xl font-semibold ${getStatusColor()}`}>
                {condition}
              </h3>
              <p className="text-gray-600">
                {crop} • {result.category}
              </p>
            </div>
          </div>
          
          <Badge variant={result.healthStatus.toLowerCase() as 'healthy' | 'disease' | 'pest'}>
            {result.healthStatus}
          </Badge>
        </div>

        {/* Confidence Score */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Confidence Score
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(Math.max(0, Math.min(100, result.confidence * 100)))}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                result.confidence >= 0.8 ? 'bg-green-500' :
                result.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, result.confidence * 100))}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Image Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Uploaded Image
            </h4>
            <img
              src={result.imageUrl}
              alt="Diagnosed crop"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Detection Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{result.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtype:</span>
                  <span className="font-medium text-gray-900">{result.subtype}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={result.healthStatus.toLowerCase() as 'healthy' | 'disease' | 'pest'} size="sm">
                    {result.healthStatus}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button
              onClick={onAskChatbot}
              variant="secondary"
              className="w-full flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask Chatbot for Advice</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Detailed Disease Information */}
      {result.treatment && result.treatment.description && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Detailed Disease Information
            </h3>
          </div>

          <div className="prose prose-sm max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: result.treatment.description
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/## (.*?)\n/g, '<h2 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h2>')
                  .replace(/### (.*?)\n/g, '<h3 class="text-md font-medium text-gray-800 mt-3 mb-2">$1</h3>')
                  .replace(/- (.*?)(?=\n|$)/g, '<li class="ml-4">$1</li>')
                  .replace(/\n\n/g, '<br><br>')
                  .replace(/\n/g, '<br>')
              }}
            />
          </div>
        </Card>
      )}

      {/* Quick Treatment Steps */}
      {result.treatment && result.treatment.steps && Array.isArray(result.treatment.steps) && result.treatment.steps.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Action Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Immediate Treatment Steps
              </h4>
              <ul className="space-y-2">
                {result.treatment.steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Prevention Tips
              </h4>
              <ul className="space-y-2">
                {result.treatment.prevention && Array.isArray(result.treatment.prevention) ? (
                  result.treatment.prevention.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 italic">
                    No specific prevention tips available.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
}