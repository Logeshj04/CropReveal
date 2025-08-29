import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Search, BookOpen, Leaf, Bug, Shield } from "lucide-react";
import { Card } from "../components/UI/Card";
import { Badge } from "../components/UI/Badge";
import { knowledgeBase, cropCategories } from "../config/categories";

export function Knowledge() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState<
    "all" | "Healthy" | "Disease" | "Pest"
  >("all");

  const filteredKnowledge = knowledgeBase.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      item.category.toLowerCase() === selectedCategory;
    const matchesType = selectedType === "all" || item.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Healthy":
        return <Shield className="w-4 h-4 text-green-500" />;
      case "Disease":
        return <Leaf className="w-4 h-4 text-red-500" />;
      case "Pest":
        return <Bug className="w-4 h-4 text-amber-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Knowledge Center
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive information about crop diseases, pest identification,
            and treatment strategies. Learn to identify, treat, and prevent
            common agricultural problems.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search knowledge base..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {cropCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Healthy">Healthy</option>
              <option value="Disease">Disease</option>
              <option value="Pest">Pest</option>
            </select>
          </div>
        </Card>

        {/* Knowledge Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredKnowledge.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-t-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant={
                        item.type.toLowerCase() as
                          | "healthy"
                          | "disease"
                          | "pest"
                      }
                    >
                      <div className="flex items-center space-x-1">
                        {getTypeIcon(item.type)}
                        <span>{item.type}</span>
                      </div>
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Causes */}
                    {item.causes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Causes
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {item.causes.slice(0, 2).map((cause, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{cause}</span>
                            </li>
                          ))}
                          {item.causes.length > 2 && (
                            <li className="text-gray-500 text-xs">
                              +{item.causes.length - 2} more causes
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Symptoms */}
                    {item.symptoms.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Symptoms
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {item.symptoms.slice(0, 2).map((symptom, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{symptom}</span>
                            </li>
                          ))}
                          {item.symptoms.length > 2 && (
                            <li className="text-gray-500 text-xs">
                              +{item.symptoms.length - 2} more symptoms
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Treatment */}
                    {item.treatment.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Treatment
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {item.treatment.slice(0, 2).map((treatment, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{treatment}</span>
                            </li>
                          ))}
                          {item.treatment.length > 2 && (
                            <li className="text-gray-500 text-xs">
                              +{item.treatment.length - 2} more treatments
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredKnowledge.length === 0 && (
          <Card className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No knowledge articles found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
