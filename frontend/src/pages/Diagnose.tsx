import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "../components/Diagnosis/ImageUpload";
import { DiagnosisResult } from "../components/Diagnosis/DiagnosisResult";
import { Button } from "../components/UI/Button";
import { Card } from "../components/UI/Card";
import type { DiagnosisResult as DiagnosisResultType } from "../types/index";
import { treatments } from "../config/categories";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { apiService } from "../services/api";

export function Diagnose() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<DiagnosisResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setHistory] = useLocalStorage<DiagnosisResultType[]>(
    "diagnosis-history",
    []
  );
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedImage(preview);
    setResult(null);
  };

  const handleClearImage = () => {
    setSelectedImage("");
    setSelectedFile(null);
    setResult(null);
  };

  const handleDiagnose = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    try {
      const response = await apiService.diagnoseImage({
        image: selectedFile,
        language: selectedLanguage, // This will now pass the full language name
      });

      // Convert API response to our DiagnosisResult format
      // The backend returns confidence as a percentage (0-100), convert to decimal (0-1)
      let normalizedConfidence = response.confidence / 100;

      // Ensure confidence is between 0 and 1
      normalizedConfidence = Math.max(0, Math.min(1, normalizedConfidence));

      console.log(
        "Backend confidence (percentage):",
        response.confidence,
        "Normalized (decimal):",
        normalizedConfidence
      );

      const diagnosisResult: DiagnosisResultType = {
        id: Date.now().toString(),
        imageUrl: selectedImage,
        detectedClass: response.predicted_label,
        confidence: normalizedConfidence,
        category: "Crop", // You might want to determine this based on the predicted label
        subtype: response.predicted_label.includes("healthy")
          ? "Healthy"
          : "Disease",
        healthStatus: response.predicted_label.includes("healthy")
          ? "Healthy"
          : "Disease",
        timestamp: new Date(),
        treatment: treatments[response.predicted_label] || {
          title: "Treatment Information",
          description: response.llm_response,
          steps: [
            "Consult with the AI chatbot for detailed treatment recommendations",
            "Monitor the affected area regularly",
            "Consider preventive measures for future crops",
          ],
          prevention: [
            "Maintain proper plant spacing for air circulation",
            "Use disease-resistant varieties when possible",
            "Practice crop rotation",
            "Keep the growing area clean and free of debris",
          ],
        },
      };

      console.log("Diagnosis result:", diagnosisResult);
      setResult(diagnosisResult);

      // Save to history
      setHistory((prev) => [diagnosisResult, ...prev.slice(0, 49)]); // Keep last 50 results
    } catch (error) {
      console.error("Diagnosis failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to analyze image. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);

      // Scroll to results
      setTimeout(() => {
        document.getElementById("diagnosis-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const handleAskChatbot = () => {
    if (!result) return;

    // Store the diagnosis context in localStorage for the chat page to access
    const diagnosisContext = {
      detectedClass: result.detectedClass,
      condition:
        result.detectedClass.split("___")[1]?.replace(/_/g, " ") ||
        result.detectedClass,
      crop: result.detectedClass.split("___")[0]?.replace(/_/g, " ") || "Crop",
      healthStatus: result.healthStatus,
      confidence: result.confidence, // This is already normalized to decimal
      imageUrl: result.imageUrl,
      timestamp: result.timestamp,
    };

    localStorage.setItem("diagnosis-context", JSON.stringify(diagnosisContext));

    // Navigate to chat page
    navigate("/chat");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Crop Disease & Pest Detection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image of your crop to get instant AI-powered diagnosis
            with treatment recommendations.
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="English">English</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Kannada">Kannada</option>
            <option value="Malayalam">Malayalam</option>
          </select>
        </div>

        <Card className="p-6 mb-8">
          <ImageUpload
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onClearImage={handleClearImage}
          />

          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <Button
                size="lg"
                onClick={handleDiagnose}
                loading={isLoading}
                className="px-8"
              >
                {isLoading ? "Analyzing Image..." : "Diagnose Crop"}
              </Button>
            </motion.div>
          )}
        </Card>

        {result && (
          <div id="diagnosis-results">
            <DiagnosisResult result={result} onAskChatbot={handleAskChatbot} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
