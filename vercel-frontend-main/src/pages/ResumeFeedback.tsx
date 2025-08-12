import React, { useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import './ResumeFeedback.css';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

const ResumeFeedback: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [staticFeedback, setStaticFeedback] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('overall');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFileUploaded(true);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      setIsUploading(true);
      setFeedback(null);
      setStaticFeedback([]);
      const res = await fetch('http://localhost:5000/api/resume-feedback', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await res.json();
      setFeedback(data.feedback);
      setStaticFeedback(data.staticFeedback || []);
      // Reset file uploaded state after successful analysis
      setFileUploaded(false);
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 text-white flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl mt-8 md:mt-12">
        {/* Page Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
            AI-Powered Resume Analysis
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload your resume to get detailed AI feedback on how to optimize it
          </p>
        </div>

        {/* Upload Section */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-2xl mb-10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-green-500/10">
          <CardHeader className="pb-4 pt-6 text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              Upload Your Resume
            </CardTitle>
            <p className="text-gray-400 mt-2">Get AI-powered insights to optimize your resume</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center mb-8 p-4">
              {/* Resume Upload Box */}
              <div className="group relative">
                <label className="cursor-pointer border-2 border-dashed border-green-500/50 p-8 rounded-2xl w-64 h-56 md:w-72 md:h-60 flex flex-col items-center justify-center transition-all duration-300 hover:border-green-400 hover:bg-gray-700/30 hover:shadow-lg hover:shadow-green-500/20">
                  <div className="bg-gray-700/50 p-4 rounded-full mb-4 group-hover:bg-gray-600/50 transition-colors duration-300">
                    <UploadCloud className="w-10 h-10 text-green-400" />
                  </div>
                  <span className="text-lg font-medium mb-1">Resume</span>
                  <span className="text-sm text-gray-400 text-center">
                    Click to upload PDF
                  </span>
                  {fileUploaded && (
                    <div className="absolute top-2 right-2 text-green-500">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <div className="absolute -top-2 -right-2 bg-green-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                  PDF
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <motion.button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  isUploading || !selectedFile
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-gray-900 shadow-green-500/30'
                }`}
                whileHover={{ scale: !isUploading && selectedFile ? 1.05 : 1 }}
                whileTap={{ scale: !isUploading && selectedFile ? 0.95 : 1 }}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Get AI Feedback"
                )}
              </motion.button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {feedback && (
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-2xl rounded-2xl mb-10 overflow-hidden animate-fade-in">
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-2xl font-bold text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                  Analysis Results
                </span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
            

              {/* AI Feedback Section */}
              <div className="mt-8 animate-fade-in">
                
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="flex flex-wrap justify-center items-center w-full gap-460 bg-gray-800/50 backdrop-blur-sm md:gap-4 shadow-lg mb-6">
                    <TabsTrigger
                      value="overall"
                      className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      ✅ Overall
                    </TabsTrigger>
                    <TabsTrigger
                      value="strengths"
                      className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      🧠 Strengths
                    </TabsTrigger>
                    <TabsTrigger
                      value="improvements"
                      className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      ⚠️ Improvements
                    </TabsTrigger>
                    <TabsTrigger
                      value="sections"
                      className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      🔍 Sections
                    </TabsTrigger>
                    <TabsTrigger
                      value="suggestions"
                      className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      📌 Suggestions
                    </TabsTrigger>
                    <TabsTrigger
                      value="ats"
                      className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      🧠 ATS Check
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overall">
                    <Card className="bg-gray-800/50 backdrop-blur-sm mt-4 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-green-500/10">
                      <CardHeader className="pb-4 pt-6 bg-gradient-to-r from-gray-800/50 to-gray-800/30">
                        <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                          <span className="text-2xl">✅</span> Overall Impression
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-gray-300 whitespace-pre-line">{feedback.overall_impression}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="strengths">
                    <Card className="bg-gray-800/50 backdrop-blur-sm mt-4 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-green-500/10">
                      <CardHeader className="pb-4 pt-6 bg-gradient-to-r from-green-900/30 to-gray-800/30">
                        <CardTitle className="text-green-400 text-xl font-bold flex items-center gap-2">
                          <span className="text-2xl">🧠</span> Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {feedback.strengths && feedback.strengths.map((strength: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="text-green-400 mr-2 mt-1">•</span>
                              <span className="text-gray-300">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="improvements">
                    <Card className="bg-gray-800/50 backdrop-blur-sm mt-4 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-amber-500/10">
                      <CardHeader className="pb-4 pt-6 bg-gradient-to-r from-amber-900/30 to-gray-800/30">
                        <CardTitle className="text-amber-400 text-xl font-bold flex items-center gap-2">
                          <span className="text-2xl">⚠️</span> Areas for Improvement
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {feedback.areas_for_improvement && feedback.areas_for_improvement.map((improvement: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="text-amber-400 mr-2 mt-1">•</span>
                              <span className="text-gray-300">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="sections">
                    <Card className="bg-gray-800/50 backdrop-blur-sm mt-4 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-blue-500/10">
                      <CardHeader className="pb-4 pt-6 bg-gradient-to-r from-blue-900/30 to-gray-800/30">
                        <CardTitle className="text-blue-400 text-xl font-bold flex items-center gap-2">
                          <span className="text-2xl">🔍</span> Section-by-Section Feedback
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {feedback.section_feedback && feedback.section_feedback.map((feedbackItem: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="text-blue-400 mr-2 mt-1">•</span>
                              <span className="text-gray-300">{feedbackItem}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="suggestions">
                    <Card className="bg-gray-800/50 backdrop-blur-sm mt-4 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-purple-500/10">
                      <CardHeader className="pb-4 pt-6 bg-gradient-to-r from-purple-900/30 to-gray-800/30">
                        <CardTitle className="text-purple-400 text-xl font-bold flex items-center gap-2">
                          <span className="text-2xl">📌</span> Suggestions & Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {feedback.suggestions && feedback.suggestions.map((suggestion: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="text-purple-400 mr-2 mt-1">•</span>
                              <span className="text-gray-300">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ats">
                    <Card className="bg-gray-800/50 backdrop-blur-sm mt-4 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-500/10">
                      <CardHeader className="pb-4 pt-6 bg-gradient-to-r from-cyan-900/30 to-gray-800/30">
                        <CardTitle className="text-cyan-400 text-xl font-bold flex items-center gap-2">
                          <span className="text-2xl">🧠</span> ATS & Recruiter Readability Check
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-gray-300 whitespace-pre-line">{feedback.ats_readability}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="bg-red-900/30 border border-red-700 rounded-xl p-6 max-w-2xl mx-auto">
            <CardContent>
              <p className="text-red-300 text-center font-medium">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResumeFeedback;
