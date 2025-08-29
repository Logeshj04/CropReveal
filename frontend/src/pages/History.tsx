/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Calendar, Trash2, X, Info } from "lucide-react";
import { Card } from "../components/UI/Card";
import { Badge } from "../components/UI/Badge";
import { Button } from "../components/UI/Button";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { DiagnosisResult } from "../types/index";

export function History() {
  const [history, setHistory] = useLocalStorage<DiagnosisResult[]>(
    "diagnosis-history",
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "healthy" | "disease" | "pest"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "confidence">("date");
  const [selectedItem, setSelectedItem] = useState<DiagnosisResult | null>(null);

  const filteredHistory = history
    .filter((item) => {
      const matchesSearch =
        item.detectedClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtype.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" ||
        item.healthStatus.toLowerCase() === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } else {
        return b.confidence - a.confidence;
      }
    });

  const clearHistory = () => {
    if (
      window.confirm("Are you sure you want to clear all diagnosis history?")
    ) {
      setHistory([]);
    }
  };

  const deleteItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const parseClassName = (className: string) => {
    const parts = className.split("___");
    const crop = parts[0]?.replace(/_/g, " ") || "";
    const condition =
      parts[1]?.replace(/_/g, " ") || className.replace(/_/g, " ");
    return { crop, condition };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Diagnosis History
            </h1>
            <p className="text-gray-600">
              Review your past crop diagnoses and track patterns over time.
            </p>
          </div>

          {history.length > 0 && (
            <Button
              variant="secondary"
              onClick={clearHistory}
              className="mt-4 sm:mt-0"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No diagnosis history yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start diagnosing crops to see your history here.
            </p>
            <Button onClick={() => (window.location.href = "/diagnose")}>
              Start Diagnosing
            </Button>
          </Card>
        ) : (
          <>
            {/* Filters */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by crop or condition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="healthy">Healthy</option>
                    <option value="disease">Disease</option>
                    <option value="pest">Pest</option>
                  </select>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="confidence">Sort by Confidence</option>
                </select>
              </div>
            </Card>

            {/* Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredHistory.map((item, index) => {
                const { crop, condition } = parseClassName(item.detectedClass);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card hover className="relative cursor-pointer" onClick={() => setSelectedItem(item)}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 transition-colors z-10"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.imageUrl}
                            alt="Diagnosed crop"
                            className="w-20 h-20 object-cover rounded-lg"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {condition}
                              </h3>
                              <Badge
                                variant={
                                  item.healthStatus.toLowerCase() as
                                    | "healthy"
                                    | "disease"
                                    | "pest"
                                }
                                size="sm"
                              >
                                {item.healthStatus}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                              {crop} • {item.category}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>
                                {Math.round(item.confidence * 100)}% confidence
                              </span>
                              <span>
                                {new Date(item.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredHistory.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-600">
                  No results found matching your criteria.
                </p>
              </Card>
            )}
          </>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Diagnosis Details
                    </h2>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image and Basic Info */}
                    <div>
                      <img
                        src={selectedItem.imageUrl}
                        alt="Diagnosed crop"
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Condition:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {parseClassName(selectedItem.detectedClass).condition}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Crop:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {parseClassName(selectedItem.detectedClass).crop}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Status:</span>
                          <Badge variant={selectedItem.healthStatus.toLowerCase() as 'healthy' | 'disease' | 'pest'}>
                            {selectedItem.healthStatus}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Confidence:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {Math.round(selectedItem.confidence * 100)}%
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Date:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {new Date(selectedItem.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Information */}
                    <div>
                      {selectedItem.treatment && selectedItem.treatment.description ? (
                        <div>
                          <div className="flex items-center space-x-2 mb-4">
                            <Info className="w-5 h-5 text-blue-500" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Disease Information
                            </h3>
                          </div>
                          
                          <div className="prose prose-sm max-w-none">
                            <div 
                              className="text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: selectedItem.treatment.description
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
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            No detailed information available for this diagnosis.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
