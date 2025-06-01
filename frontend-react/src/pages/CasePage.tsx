import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft,
  Upload,
  FileText,
  Send,
  Bot,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Trash2,
  Eye,
  MessageSquare,
  Shield,
  Scale,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CaseDetailPage = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Employment_Contract_v2.pdf",
      size: "1.2 MB",
      uploadDate: "2024-01-15",
      status: "analyzed",
      analysisProgress: 100
    }
  ]);
  
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      message: "Hello! I've analyzed your employment contract. Feel free to ask me any questions about the document's terms, risks, or recommendations.",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Mock analysis data
  const analysisData = {
    summary: "This employment contract is for a Senior Software Engineer position at TechCorp Inc. The contract includes standard employment terms with a competitive salary, benefits package, and intellectual property clauses. The agreement is structured as an at-will employment contract with a 3-month probationary period.",
    
    risks: [
      {
        level: "high",
        title: "Broad Non-Compete Clause",
        description: "The non-compete clause extends to 18 months post-termination and covers a wide geographic area, which may limit future employment opportunities."
      },
      {
        level: "medium", 
        title: "Intellectual Property Assignment",
        description: "All inventions and ideas, even those created outside work hours, are assigned to the company. This could affect personal projects."
      },
      {
        level: "low",
        title: "Termination Notice Period",
        description: "Only 2 weeks notice required for termination, which is standard but provides limited job security."
      }
    ],

    clauses: [
      {
        type: "compensation",
        title: "Salary and Benefits",
        content: "Annual salary of $120,000 with health insurance, 401k matching up to 4%, and 3 weeks PTO.",
        significance: "Standard compensation package for the role level."
      },
      {
        type: "termination",
        title: "At-Will Employment",
        content: "Either party may terminate employment at any time with or without cause, with 2 weeks written notice.",
        significance: "Provides flexibility but limited job security."
      },
      {
        type: "confidentiality",
        title: "Confidentiality Agreement",
        content: "Employee agrees to maintain confidentiality of proprietary information during and after employment.",
        significance: "Standard protection for company trade secrets."
      }
    ],

    recommendations: [
      "Consider negotiating the non-compete clause to reduce the time period from 18 to 12 months",
      "Request clarification on intellectual property rights for personal projects",
      "Negotiate for a longer notice period or severance package",
      "Consider adding a clause for remote work arrangements if applicable",
      "Review the benefits package and compare with industry standards"
    ]
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleFileUpload = (files) => {
    Array.from(files).forEach(file => {
      const newDoc = {
        id: documents.length + 1,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: "uploading",
        analysisProgress: 0
      };
      
      setDocuments(prev => [...prev, newDoc]);
      
      // Simulate upload and analysis
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id ? { ...doc, status: "analyzing", analysisProgress: 25 } : doc
        ));
        
        setTimeout(() => {
          setDocuments(prev => prev.map(doc => 
            doc.id === newDoc.id ? { ...doc, analysisProgress: 75 } : doc
          ));
          
          setTimeout(() => {
            setDocuments(prev => prev.map(doc => 
              doc.id === newDoc.id ? { ...doc, status: "analyzed", analysisProgress: 100 } : doc
            ));
          }, 1500);
        }, 1500);
      }, 1000);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: "ai",
        message: "Based on the contract analysis, I can help clarify that specific clause. The non-compete section in your contract is indeed quite broad and may impact your future career options. Would you like me to explain the specific terms or suggest negotiation strategies?",
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-50/80 text-red-800 border-red-200/50 backdrop-blur-sm';
      case 'medium': return 'bg-yellow-50/80 text-yellow-800 border-yellow-200/50 backdrop-blur-sm';
      case 'low': return 'bg-green-50/80 text-green-800 border-green-200/50 backdrop-blur-sm';
      default: return 'bg-gray-50/80 text-gray-800 border-gray-200/50 backdrop-blur-sm';
    }
  };

  const getClauseIcon = (type) => {
    switch (type) {
      case 'compensation': return <Scale className="w-4 h-4" />;
      case 'termination': return <AlertTriangle className="w-4 h-4" />;
      case 'confidentiality': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative overflow-hidden pt-7">
      {/* Background blobs - matching login page */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse delay-3000 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header with glassmorphism */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-white/20 shadow-lg relative z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-white/50 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cases
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-800">Employment Contract Review</h1>
                  <p className="text-sm text-slate-600">Created on January 15, 2024</p>
                </div>
              </div>
            </div>
          </div>
          <Badge className="bg-blue-100/80 text-blue-800 border-blue-200/50 backdrop-blur-sm">
            In Progress
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="2xl:col-span-2 space-y-6">
            {/* Document Upload Section with glassmorphism */}
            <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center text-slate-800">
                  <Upload className="w-5 h-5 mr-2" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                    isDragOver 
                      ? 'border-blue-400 bg-blue-50/50 backdrop-blur-sm transform scale-105' 
                      : 'border-slate-300/50 bg-white/30 backdrop-blur-sm hover:bg-white/50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                >
                  <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 mb-2">Drag and drop files here, or</p>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/90 transition-all duration-200"
                  >
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Supported formats: PDF, DOC, DOCX (Max 10MB each)
                  </p>
                </div>

                {/* Document List */}
                {documents.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-slate-800">Uploaded Documents</h4>
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:bg-white/70 transition-all duration-200">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm text-slate-800">{doc.name}</p>
                            <p className="text-xs text-slate-600">{doc.size} • {doc.uploadDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.status === "analyzed" ? (
                            <Badge className="bg-green-100/80 text-green-800 border-green-200/50 backdrop-blur-sm">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Analyzed
                            </Badge>
                          ) : doc.status === "analyzing" ? (
                            <div className="flex items-center space-x-2">
                              <Progress value={doc.analysisProgress} className="w-20" />
                              <Badge className="bg-blue-100/80 text-blue-800 border-blue-200/50 backdrop-blur-sm">
                                <Clock className="w-3 h-3 mr-1" />
                                Analyzing
                              </Badge>
                            </div>
                          ) : (
                            <Badge className="bg-slate-100/80 text-slate-800 border-slate-200/50 backdrop-blur-sm">
                              <Upload className="w-3 h-3 mr-1" />
                              Uploading
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm" className="hover:bg-white/50">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-white/50">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50/50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results with glassmorphism */}
            {documents.some(doc => doc.status === "analyzed") && (
              <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center text-slate-800">
                    <Bot className="w-5 h-5 mr-2" />
                    AI Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm border border-white/20">
                      <TabsTrigger value="summary" className="flex items-center data-[state=active]:bg-white/80">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Summary
                      </TabsTrigger>
                      <TabsTrigger value="risks" className="flex items-center data-[state=active]:bg-white/80">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Risks
                      </TabsTrigger>
                      <TabsTrigger value="clauses" className="flex items-center data-[state=active]:bg-white/80">
                        <Scale className="w-4 h-4 mr-1" />
                        Clauses
                      </TabsTrigger>
                      <TabsTrigger value="recommendations" className="flex items-center data-[state=active]:bg-white/80">
                        <Lightbulb className="w-4 h-4 mr-1" />
                        Recommendations
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="mt-4">
                      <div className="prose max-w-none p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
                        <p className="text-slate-700 leading-relaxed">{analysisData.summary}</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="risks" className="mt-4">
                      <div className="space-y-4">
                        {analysisData.risks.map((risk, index) => (
                          <Alert key={index} className={getRiskColor(risk.level)}>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="font-medium mb-1">{risk.title}</div>
                              <div className="text-sm">{risk.description}</div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="clauses" className="mt-4">
                      <div className="space-y-4">
                        {analysisData.clauses.map((clause, index) => (
                          <div key={index} className="border border-white/20 rounded-xl p-4 bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-200">
                            <div className="flex items-center mb-2">
                              {getClauseIcon(clause.type)}
                              <h4 className="font-medium ml-2 text-slate-800">{clause.title}</h4>
                            </div>
                            <p className="text-slate-700 mb-2">{clause.content}</p>
                            <p className="text-sm text-slate-600 italic">{clause.significance}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="recommendations" className="mt-4">
                      <div className="space-y-3">
                        {analysisData.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50/50 backdrop-blur-sm rounded-xl border border-blue-200/30 hover:bg-blue-50/70 transition-all duration-200">
                            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Sidebar with glassmorphism */}
          <div className="2xl:col-span-1 w-full">
            <Card className="h-[700px] flex flex-col backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="flex items-center text-slate-800">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 relative z-10">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-4 pb-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-xl transition-all duration-200 ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                              : 'bg-white/70 backdrop-blur-sm text-slate-800 border border-white/20 shadow-lg'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.type === 'ai' && (
                              <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="text-sm">{message.message}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="border-t border-white/20 p-4 bg-white/20 backdrop-blur-sm">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask about the contract..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-white/70 backdrop-blur-sm border-white/30 hover:border-white/50 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseDetailPage;