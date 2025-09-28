import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, FileText, Brain, Calendar, Image } from 'lucide-react';

export default function LabUpload() {
  const { patients, addLabResult } = useData();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const patient = patients.find(p => p.id === user?.id);
  
  if (!patient) return <div>Patient not found</div>;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const generateAISummary = (fileName: string): string => {
    // Simulate AI processing of lab results
    const summaries = [
      "Lab results show normal glucose levels (95 mg/dL), cholesterol within acceptable range (180 mg/dL). Continue current medication regimen. Follow up in 3 months.",
      "Blood pressure readings indicate good control (120/80). Kidney function tests normal. Liver enzymes within range. Continue lifestyle modifications.",
      "Complete blood count shows no abnormalities. Hemoglobin levels optimal (14.2 g/dL). Iron levels adequate. No action required.",
      "Lipid panel reveals slight elevation in LDL cholesterol (145 mg/dL). Consider dietary modifications and increased exercise. Recheck in 6 weeks.",
      "Thyroid function tests normal. TSH levels within range (2.1 mIU/L). Continue current thyroid medication dosage."
    ];
    
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    // Simulate upload and AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const aiSummary = generateAISummary(selectedFile.name);
    
    addLabResult({
      patientId: patient.id,
      fileName: selectedFile.name,
      uploadDate: new Date().toISOString(),
      aiSummary,
      imageUrl: URL.createObjectURL(selectedFile)
    });
    
    setSelectedFile(null);
    setUploading(false);
    
    // Reset the file input
    const fileInput = document.getElementById('lab-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Upload className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Lab Results</h2>
        </div>

        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <div className="flex flex-col items-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Image className="h-8 w-8 text-blue-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Lab Results</h3>
            <p className="text-gray-600 mb-6">
              Take a photo or upload an image of your lab results for AI analysis
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                id="lab-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="lab-upload"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Choose File
              </label>
              
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? 'Processing with AI...' : 'Upload & Analyze'}
              </button>
            )}

            {uploading && (
              <div className="mt-4 flex items-center space-x-3 text-blue-600">
                <Brain className="h-5 w-5 animate-pulse" />
                <span className="text-sm">AI is analyzing your lab results...</span>
              </div>
            )}
          </div>
        </div>

        {/* Previous Lab Results */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Results</h3>
          
          {patient.labResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No lab results uploaded yet</p>
              <p className="text-sm">Upload your first lab result to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patient.labResults.map((result) => (
                <div key={result.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{result.fileName}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(result.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900 mb-2">AI Analysis Summary</h5>
                        <p className="text-sm text-blue-800">{result.aiSummary}</p>
                      </div>
                    </div>
                  </div>

                  {result.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={result.imageUrl}
                        alt="Lab result"
                        className="max-w-full h-auto rounded-lg border border-gray-200 max-h-64 object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}