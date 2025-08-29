import { motion } from "framer-motion";
import {
  HelpCircle,
  Camera,
  History,
  BookOpen,
  MessageCircle,
  Shield,
  Zap,
} from "lucide-react";
import { Card } from "../components/UI/Card";

export function Help() {
  const faqs = [
    {
      question: "How accurate is the AI diagnosis?",
      answer:
        "Our AI model has been trained on thousands of crop images and achieves over 90% accuracy for most common diseases and pests. However, we recommend consulting with agricultural experts for critical decisions.",
    },
    {
      question: "What image formats are supported?",
      answer:
        "We support JPG, PNG, and WebP formats. For best results, use high-quality images with good lighting and clear focus on the affected area.",
    },
    {
      question: "Can I use this on mobile devices?",
      answer:
        "Yes! Our application is fully responsive and works great on mobile devices. You can even use your phone's camera to take photos directly.",
    },
    {
      question: "How do I get the best diagnosis results?",
      answer:
        "Take clear, well-lit photos showing the symptoms clearly. Include both affected and healthy parts for comparison. Avoid blurry or low-light images.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, your uploaded images and diagnosis history are stored locally in your browser. We don't store your images on our servers.",
    },
    {
      question: "What should I do after getting a diagnosis?",
      answer:
        "Follow the treatment recommendations provided, but also consult with local agricultural experts, especially for severe cases or valuable crops.",
    },
  ];

  const features = [
    {
      icon: Camera,
      title: "AI Diagnosis",
      description:
        "Upload images to get instant AI-powered crop health analysis",
    },
    {
      icon: History,
      title: "Track History",
      description:
        "Keep track of all your diagnoses and monitor patterns over time",
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description:
        "Access comprehensive information about diseases and treatments",
    },
    {
      icon: MessageCircle,
      title: "Expert Chat",
      description:
        "Get additional help from our AI chatbot for specific questions",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Help & Support
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn how to use CropAI effectively and get the most accurate
            diagnoses for your crops.
          </p>
        </div>

        {/* Features Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            How to Use CropAI
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Best Practices */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 text-yellow-500 mr-2" />
            Best Practices for Accurate Diagnosis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Image Quality
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                  <span>Use natural daylight when possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                  <span>Focus clearly on affected areas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                  <span>Avoid shadows and reflections</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                  <span>Take multiple angles if needed</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                What to Include
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                  <span>Show both affected and healthy parts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                  <span>Include leaves, stems, or fruits as relevant</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                  <span>Capture the whole plant context when possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                  <span>Show scale by including reference objects</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <HelpCircle className="w-6 h-6 text-blue-500 mr-2" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">
                Privacy & Data Security
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Your uploaded images and diagnosis history are stored locally in
                your browser and are not sent to our servers. This ensures your
                farm data remains private and secure. You can clear your data at
                any time from the History page.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
