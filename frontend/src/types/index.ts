export interface DiagnosisResult {
  id: string;
  imageUrl: string;
  detectedClass: string;
  confidence: number;
  category: 'Crop' | 'Insect';
  subtype: string;
  healthStatus: 'Healthy' | 'Disease' | 'Pest';
  timestamp: Date;
  treatment?: TreatmentInfo;
}

export interface TreatmentInfo {
  title: string;
  description: string;
  steps: string[];
  prevention: string[];
}

export interface CropCategory {
  id: string;
  name: string;
  icon: string;
  emoji: string;
  conditions: string[];
  color: string;
}

export interface KnowledgeItem {
  id: string;
  name: string;
  category: string;
  type: 'Healthy' | 'Disease' | 'Pest';
  causes: string[];
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  image: string;
}