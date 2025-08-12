import React, { useState } from "react";
import axios from "axios";
import { CloudUpload, CheckCircle } from "lucide-react";
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
import { FaTools } from "react-icons/fa";

// Gemini Feedback Section Parser
function extractGeminiSections(feedback: string): {
  overall?: string;
  strengths?: string;
  weaknesses?: string;
  suggestions?: string;
} {
  // Default section keys and their possible header matches (expanded for robustness)
  const sectionMap = {
    overall: [
      "Overall Assessment",
      "Overall Summary",
      "overall_analysis",
      "Overall Assessment:",
    ],
    strengths: [
      "Key Strengths",
      "strengths",
      "Positive Aspects",
      "What Went Well",
    ],
    weaknesses: [
      "Missing Elements & Weaknesses",
      "weaknesses",
      "Missing Elements",
      "Areas for Improvement",
      "Missing Elements/Areas for Improvement",
      "Areas Needing Improvement",
      "Limitations",
      "Concerns",
    ],
    suggestions: [
      "Suggestions for Improvement",
      "suggestions",
      "Specific Suggestions",
      "Recommendations",
      "Improvements",
      "Improvement Suggestions",
      "Advice",
    ],
  };
  // Prepare regex for each section (case-insensitive, allow /, &, and whitespace, and optional asterisks/colons)
  const sectionRegex = Object.fromEntries(
    Object.entries(sectionMap).map(([key, headers]) => [
      key,
      new RegExp(
        `(?:\\*\\*\\s*)?(${headers
          .map((h) =>
            h
              .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
              .replace(/[&/]/g, "[&/and]+")
          )
          .join("|")})(?:\\s*\\*\\*)?\\s*:?`,
        "i"
      ),
    ])
  );

  // Find all section headers and their indices
  const lines = feedback.split(/\n|<br\s*\/?>(?![^<]*<\/(?:h\d|li|ul|ol)>)/g);
  const sectionIndices = {};
  lines.forEach((line, idx) => {
    for (const [key, regex] of Object.entries(sectionRegex)) {
      if (regex.test(line.trim())) {
        sectionIndices[key] = idx;
      }
    }
  });

  // Sort section keys by their appearance in the text
  const orderedSections = Object.entries(sectionIndices)
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map(([key]) => key);

  // Extract section content
  const sectionContent = {};
  for (let i = 0; i < orderedSections.length; i++) {
    const key = orderedSections[i];
    const startIdx = sectionIndices[key];
    const endIdx =
      i + 1 < orderedSections.length
        ? sectionIndices[orderedSections[i + 1]]
        : lines.length;
    sectionContent[key] = lines
      .slice(startIdx + 1, endIdx)
      .join("\n")
      .trim();
  }

  return sectionContent;
}

// Renders section content as a bulleted list
function renderSectionContentAsList(sectionText) {
  if (!sectionText || !sectionText.trim()) {
    return <div className="text-gray-400 italic">No data for this section.</div>;
  }

  // Helper to remove markdown markers for clean text display
  const cleanText = (text) => {
    return text
      .trim()
      .replace(/^\*\s*/, '') // Remove leading asterisk and space
      .replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold markdown
  };

  const lines = sectionText.split('\n').filter(line => line.trim() !== '');

  // If the section is a single line without a bullet, render it as a paragraph.
  // This is common for the 'Overall' section.
  if (lines.length === 1 && !lines[0].trim().startsWith('*')) {
    return <p className="text-white leading-relaxed">{cleanText(lines[0])}</p>;
  }

  // Otherwise, render as a bulleted list
  return (
    <ul className="space-y-2 list-disc list-inside text-white">
      {lines.map((line, index) => (
        <li key={index} className="leading-relaxed">
          {cleanText(line)}
        </li>
      ))}
    </ul>
  );
}


const JDAnalysis = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJD] = useState<File | null>(null);
  const [matchScore, setMatchScore] = useState("");
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFeedbackTab, setActiveFeedbackTab] = useState("overall");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [jdUploaded, setJdUploaded] = useState(false);

  const handleUpload = async () => {
    if (!resume || !jd) {
      alert("Please upload both Resume and JD");
      return;
    }
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jd", jd);
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/match",
        formData
      );
      const data = response.data;
      console.log(data);
      
      let parsedFeedback = data.feedback;
      if (typeof data.feedback === 'string' && data.feedback.startsWith('```json')) {
        try {
          const jsonString = data.feedback
            .replace(/```json\n?/, '')
            .replace(/\n?```/, '');
          const parsed = JSON.parse(jsonString);
          
          parsedFeedback = `📝 Overall Assessment\n${parsed.overall_analysis}\n\n` +
                          `✅ Key Strengths\n${parsed.strengths.map(s => `* ${s}`).join('\n')}\n\n` +
                          `⚠️ Missing Elements & Weaknesses\n${parsed.weaknesses.map(w => `* ${w}`).join('\n')}\n\n` +
                          `💡 Suggestions for Improvement\n${parsed.suggestions.map(s => `* ${s}`).join('\n')}`;
        } catch (parseError) {
          console.error("Error parsing feedback JSON:", parseError);
        }
      }
      
      setMatchScore(data.matchScore);
      setMatchedSkills(data.matchedSkills);
      setMissingSkills(data.missingSkills);
      setFeedback(parsedFeedback);
      // Reset upload indicators after successful analysis
      setResumeUploaded(false);
      setJdUploaded(false);
      setResume(null);
      setJD(null);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error analyzing documents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 text-white flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl mt-8 md:mt-12">
        {/* Page Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
            AI-Powered Resume & JD Analysis
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload your resume and job description to get detailed AI feedback on how to optimize your application
          </p>
        </div>
        
        {/* Tabs Bar */}
        <Tabs defaultValue="skills">
          
          <TabsContent value="skills">
            {/* Upload Section */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-2xl mb-10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-green-500/10">
              <CardHeader className="pb-4 pt-6 text-center">
                <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                  Upload Your Documents
                </CardTitle>
                <p className="text-gray-400 mt-2">Get AI-powered insights to optimize your job application</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-8 items-center justify-center mb-8 p-4">
                  {/* Resume Upload Box */}
                  <div className="group relative">
                    <label className="cursor-pointer border-2 border-dashed border-green-500/50 p-8 rounded-2xl w-64 h-56 md:w-72 md:h-60 flex flex-col items-center justify-center transition-all duration-300 hover:border-green-400 hover:bg-gray-700/30 hover:shadow-lg hover:shadow-green-500/20">
                      <div className="bg-gray-700/50 p-4 rounded-full mb-4 group-hover:bg-gray-600/50 transition-colors duration-300">
                        <CloudUpload className="w-10 h-10 text-green-400" />
                      </div>
                      <span className="text-lg font-medium mb-1">Resume</span>
                      <span className="text-sm text-gray-400 text-center">
                        Click to upload PDF
                      </span>
                      {resumeUploaded && (
                        <div className="absolute top-2 right-2 text-green-500">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setResume(file);
                          setResumeUploaded(!!file);
                        }}
                        className="hidden"
                      />
                    </label>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                      PDF
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="hidden lg:flex items-center justify-center h-32 w-16">
                    <div className="h-px w-full bg-gray-600 relative">
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 px-2 text-gray-400">
                        VS
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex lg:hidden items-center justify-center w-full">
                    <div className="h-px w-32 bg-gray-600 relative">
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 px-2 text-gray-400 text-sm">
                        VS
                      </div>
                    </div>
                  </div>
                  
                  {/* JD Upload Box */}
                  <div className="group relative">
                    <label className="cursor-pointer border-2 border-dashed border-emerald-500/50 p-8 rounded-2xl w-64 h-56 md:w-72 md:h-60 flex flex-col items-center justify-center transition-all duration-300 hover:border-emerald-400 hover:bg-gray-700/30 hover:shadow-lg hover:shadow-emerald-500/20">
                      <div className="bg-gray-700/50 p-4 rounded-full mb-4 group-hover:bg-gray-600/50 transition-colors duration-300">
                        <CloudUpload className="w-10 h-10 text-emerald-400" />
                      </div>
                      <span className="text-lg font-medium mb-1">Job Description</span>
                      <span className="text-sm text-gray-400 text-center">
                        Click to upload PDF
                      </span>
                      {jdUploaded && (
                        <div className="absolute top-2 right-2 text-green-500">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setJD(file);
                          setJdUploaded(!!file);
                        }}
                        className="hidden"
                      />
                    </label>
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                      PDF
                    </div>
                  </div>
                </div>
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleUpload}
                    disabled={loading || !resume || !jd}
                    className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      loading || !resume || !jd
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-gray-900 shadow-green-500/30'
                    }`}
                  >
                    {loading ? (
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
                  </button>
                </div>
              </CardContent>
            </Card>
            {/* Results Section */}
            {matchScore && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-2xl rounded-2xl mb-10 overflow-hidden animate-fade-in">
                <CardHeader className="pb-4 pt-6">
                  <CardTitle className="text-2xl font-bold text-center mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                      Analysis Results
                    </span>
                  </CardTitle>
                  
                  {/* Match Score */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative w-40 h-40 mb-4">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-700 stroke-current"
                          strokeWidth="10"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                        ></circle>
                        <circle
                          className="text-green-500 stroke-current"
                          strokeWidth="10"
                          strokeLinecap="round"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * parseFloat(matchScore)) / 100}
                          transform="rotate(-90 50 50)"
                        ></circle>
                        <text
                          x="53"
                          y="52"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          className="text-xl font-bold fill-white"
                        >
                          {matchScore}
                        </text>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Match Score</h3>
                    <p className="text-gray-400 text-center mt-2 max-w-md">
                      How well your resume matches the job requirements
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Matched Skills */}
                    <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600 hover:border-green-500/50 transition-all duration-300">
                      <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Matched Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {matchedSkills.map((skill, i) => (
                          <Badge
                            key={i}
                            className="bg-green-500/20 text-green-300 hover:bg-green-500/30 px-3 py-1.5 text-sm font-medium rounded-full border border-green-500/30 transition-colors duration-300"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Missing Skills */}
                    <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600 hover:border-amber-500/50 transition-all duration-300">
                      <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                        Missing Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {missingSkills.map((skill, i) => (
                          <Badge
                            key={i}
                            className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-3 py-1.5 text-sm font-medium rounded-full border border-amber-500/30 transition-colors duration-300"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Tools & Technologies */}
                  <div className="mt-8 bg-gray-700/30 p-6 rounded-xl border border-gray-600 hover:border-emerald-500/50 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <FaTools className="text-emerald-400" />
                      Tools & Technologies Required (As per JD)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {['Webpack', 'Jest', 'Redux', 'GitHub', 'Jira', 'Docker', 'Kubernetes', 'AWS'].map((tool, index) => (
                        <Badge 
                          key={index}
                          className="bg-gray-600/50 hover:bg-gray-600 text-gray-200 px-4 py-2 text-base font-medium rounded-full transition-all duration-300 hover:shadow-lg"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {/* AI Feedback Section */}
                  <div className="mt-12 animate-fade-in">
                    <h3 className="text-2xl font-bold text-center mb-8">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                        AI-Powered Feedback
                      </span>
                    </h3>
                    
                    {feedback &&
                      (() => {
                        const sections = extractGeminiSections(feedback);
                        return (
                          <Tabs
                            value={activeFeedbackTab}
                            onValueChange={setActiveFeedbackTab}
                            className="w-full"
                          >
                           <TabsList className="tabs-scroll-container w-full gap-2 md:gap-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg mb-6">

                              <TabsTrigger
                                value="overall"
                                className="px-4 py-2 text-sm md:text-base font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-300"
                              >
                                📝 Overall
                              </TabsTrigger>
                              <TabsTrigger
                                value="strengths"
                                className="px-4 py-2 text-sm md:text-base font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-300"
                              >
                                ✅ Strengths
                              </TabsTrigger>
                              <TabsTrigger
                                value="weaknesses"
                                className="px-4 py-2 text-sm md:text-base font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white transition-all duration-300"
                              >
                                ⚠️ Weaknesses
                              </TabsTrigger>
                              <TabsTrigger
                                value="suggestions"
                                className="px-4 py-2 text-sm md:text-base font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
                              >
                                💡 Suggestions
                              </TabsTrigger>
                            </TabsList>

                          <TabsContent value="overall">
                            <Card className="bg-gray-800/50 backdrop-blur-sm mt-4 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-green-500/10">
                              <CardHeader className="pb-4 pt-6 bg-gradient-to-r from-gray-800/50 to-gray-800/30">
                                <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                                  <span className="text-2xl">📝</span> Overall Assessment
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-6">
                                {renderSectionContentAsList(sections.overall)}
                              </CardContent>
                            </Card>
                          </TabsContent>

                          <TabsContent value="strengths">
                            <Card className="bg-gray-800/50 backdrop-blur-sm mt-4 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-green-500/10">
                              <CardHeader className="pb-4 pt-6 bg-gradient-to-r from-green-900/30 to-gray-800/30">
                                <CardTitle className="text-green-400 text-xl font-bold flex items-center gap-2">
                                  <span className="text-2xl">✅</span> Key Strengths
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-6">
                                {renderSectionContentAsList(sections.strengths)}
                              </CardContent>
                            </Card>
                          </TabsContent>

                          <TabsContent value="weaknesses">
                            <Card className="bg-gray-800/50 backdrop-blur-sm mt-4 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-amber-500/10">
                              <CardHeader className="pb-4 pt-6 bg-gradient-to-r from-amber-900/30 to-gray-800/30">
                                <CardTitle className="text-amber-400 text-xl font-bold flex items-center gap-2">
                                  <span className="text-2xl">⚠️</span> Missing Elements & Weaknesses
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-6">
                                {renderSectionContentAsList(sections.weaknesses)}
                              </CardContent>
                            </Card>
                          </TabsContent>

                          <TabsContent value="suggestions">
                            <Card className="bg-gray-800/50 backdrop-blur-sm mt-4 border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-blue-500/10">
                              <CardHeader className="pb-4 pt-6 bg-gradient-to-r from-blue-900/30 to-gray-800/30">
                                <CardTitle className="text-blue-400 text-xl font-bold flex items-center gap-2">
                                  <span className="text-2xl">💡</span> Suggestions for Improvement
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-6">
                                {renderSectionContentAsList(sections.suggestions)}
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JDAnalysis;