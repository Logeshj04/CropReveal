import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react';
import { Button } from '../UI/Button';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage?: string;
  onClearImage: () => void;
}

export function ImageUpload({ onImageSelect, selectedImage, onClearImage }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(imageFile, reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [onImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const triggerFileInput = () => {
    document.getElementById('file-input')?.click();
  };

  const triggerCamera = () => {
    const input = document.getElementById('camera-input');
    input?.click();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {selectedImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <img
                src={selectedImage}
                alt="Selected crop"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <button
                onClick={onClearImage}
                className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragOver
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-green-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <motion.div
              animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${
                isDragOver ? 'text-green-500' : 'text-gray-400'
              }`} />
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Crop Image
              </h3>
              
              <p className="text-gray-600 mb-6">
                Drag and drop an image here, or click to select from your device
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={triggerFileInput} className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>Choose File</span>
                </Button>
                
                <Button variant="secondary" onClick={triggerCamera} className="flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Take Photo</span>
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: JPG, PNG, WebP (max 10MB)
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}