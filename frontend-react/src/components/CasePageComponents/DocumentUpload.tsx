import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  Eye, 
  Download, 
  Trash2 
} from 'lucide-react';
import type { Document } from './types';

interface DocumentUploadProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ documents, setDocuments }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const newDoc: Document = {
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  return (
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
  );
};

export default DocumentUpload;