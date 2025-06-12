import React, { useState, useRef, useEffect } from 'react';

import type { AnalysisData, ChatMessage } from '@/components/CasePageComponents/types';
import BackgroundEffects from '@/components/CasePageComponents/BackgroundEffects';
import PageHeader from '@/components/CasePageComponents/PageHeader';
import DocumentUpload from '@/components/CasePageComponents/DocumentUpload';
import AnalysisResults from '@/components/CasePageComponents/AnalysisResults';
import ChatSidebar from '@/components/CasePageComponents/ChatSidebar';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CaseDetailPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/cases/${id}`);
        console.log('Fetched case data:', response.data);
        setCaseData(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch case:', error);
        setError('Failed to load case data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCase();
    }
  }, [id]);

  // Fetch documents for this case
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!id) return;
      
      try {
        const response = await axios.get(`http://localhost:8080/documents/case/${id}`);
        const serverDocuments = response.data.map((doc: any) => ({
          id: Date.now() + doc.id, // Create unique client-side ID
          serverId: doc.id, // Store server ID
          name: doc.fileName,
          size: `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB`,
          uploadDate: doc.createdAt ? new Date(doc.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: "analyzed",
          analysisProgress: 100,
          filePath: doc.filePath // Store file path for downloads
        }));
        
        // Replace the mock data with server data
        setDocuments(serverDocuments);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        // If fetch fails, keep the mock data or show empty state
        setDocuments([]);
      }
    };

    if (caseData) {
      fetchDocuments();
    }
  }, [id, caseData]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "ai",
      message: "Hello! I've analyzed your employment contract. Feel free to ask me any questions about the document's terms, risks, or recommendations.",
      timestamp: new Date().toISOString()
    }
  ]);

  // Mock analysis data
  const analysisData = {
    summary: "This employment contract is for a Senior Software Engineer position at TechCorp Inc. The contract includes standard employment terms with a competitive salary, benefits package, and intellectual property clauses. The agreement is structured as an at-will employment contract with a 3-month probationary period.",
    
    risks: [
      {
        level: "high",
        title: "Broad Non-Compete Clause",
        description: "The non-compete clause extends to 18 months post-termination and covers a wide geographic area, which may limit future employment opportunities."
      },
    ],

    clauses: [
      {
        type: "compensation",
        title: "Salary and Benefits",
        content: "Annual salary of $120,000 with health insurance, 401k matching up to 4%, and 3 weeks PTO.",
        significance: "Standard compensation package for the role level."
      },
    ],

    recommendations: [
      "Consider negotiating the non-compete clause to reduce the time period from 18 to 12 months",
    ]
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative overflow-hidden pt-7">
        <BackgroundEffects />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading case data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if case couldn't be loaded
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative overflow-hidden pt-7">
        <BackgroundEffects />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.history.back()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show case not found if caseData is still null after loading
  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative overflow-hidden pt-7">
        <BackgroundEffects />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Case not found</p>
            <button 
              onClick={() => window.history.back()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative overflow-hidden pt-7">
      <BackgroundEffects />
      {/* Only render PageHeader when caseData is available */}
      <PageHeader caseData={caseData} />
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="2xl:col-span-2 space-y-6">
            <DocumentUpload 
              documents={documents}
              setDocuments={setDocuments}
              caseId={id!} // Pass the case ID
            />
            
            {documents.some(doc => doc.status === "analyzed") && (
              <AnalysisResults analysisData={analysisData} />
            )}
          </div>

          {/* Chat Sidebar */}
          <div className="2xl:col-span-1 w-full">
            <ChatSidebar 
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailPage;