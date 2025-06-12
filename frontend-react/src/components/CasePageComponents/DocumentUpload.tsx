import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  Eye, 
  Download, 
  Trash2,
  AlertCircle 
} from 'lucide-react';
import axios from 'axios';
import type { Document } from './types';

interface DocumentUploadProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  caseId: string | number; // Add caseId prop
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ documents, setDocuments, caseId }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<{[key: number]: string}>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const uploadFileToServer = async (file: File, documentId: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId.toString());

    try {
      const response = await axios.post('http://localhost:8080/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDocuments(prev => prev.map(doc => 
              doc.id === documentId 
                ? { ...doc, analysisProgress: Math.min(percentCompleted, 90) } 
                : doc
            ));
          }
        },
      });

      // Update document with server response
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status: "analyzed", 
              analysisProgress: 100,
              serverId: response.data.id, // Store server-side document ID
              filePath: response.data.filePath // Store file path for download
            } 
          : doc
      ));

      // Clear any previous errors
      setUploadErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[documentId];
        return newErrors;
      });

      // Show success toast
      toast.success(`${file.name} uploaded and analyzed successfully`);

      return response.data;
    } catch (error) {
      console.error('Upload failed:', error);
      
      // Update document status to failed
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: "failed", analysisProgress: 0 } 
          : doc
      ));

      // Store error message
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : 'Upload failed';
      
      setUploadErrors(prev => ({
        ...prev,
        [documentId]: errorMessage
      }));

      // Show error toast
      toast.error(`Failed to upload ${file.name}: ${errorMessage}`);

      throw error;
    }
  };

  const handleDownloadDocument = async (documents: Document) => {
    if (!documents.filePath && !documents.serverId) {
      console.error('No file path or server ID available for download');
      toast.error("No file path or server ID available for download");
      return;
    }

    try {
      // Use filePath if available (from upload response), otherwise use document name
      const fileName = documents.filePath;
      
      const response = await axios.get(`http://localhost:8080/documents/download/${fileName}`, {
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documents.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Show success toast
      toast.success(`${documents.name} is being downloaded`);
    } catch (error) {
      console.error('Download failed:', error);
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : 'Download failed';
      
      toast.error(`Failed to download ${documents.name}: ${errorMessage}`);
    }
  };

  const handleDeleteDocument = async (documents: Document) => {
    if (!documents.serverId) {
      // If it's not uploaded yet, just remove from UI
      handleRemoveDocument(documents.id);
      return;
    }

    // Show confirmation dialog instead of window.confirm
    setDocumentToDelete(documents);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      await axios.delete(`http://localhost:8080/documents/${documentToDelete.serverId}`);
      
      // Remove from UI after successful deletion
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
      
      // Clear any errors
      setUploadErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[documentToDelete.id];
        return newErrors;
      });

      // Show success toast
      toast.success(`${documentToDelete.name} has been deleted successfully`);
    } catch (error) {
      console.error('Delete failed:', error);
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : 'Delete failed';
      
      toast.error(`Failed to delete ${documentToDelete.name}: ${errorMessage}`);
    } finally {
      // Close dialog and clear state
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const cancelDeleteDocument = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleViewDocument = (document: Document) => {
    // For now, we'll download the document to view it
    // In a more advanced implementation, you might have a document viewer
    handleDownloadDocument(document);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    const newDocuments: Document[] = [];
    
    // Add all files to state first
    Array.from(files).forEach((file, index) => {
      const newDoc: Document = {
        id: Date.now() + index, // Use timestamp to ensure unique IDs
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: "uploading",
        analysisProgress: 0
      };
      newDocuments.push(newDoc);
    });

    setDocuments(prev => [...prev, ...newDocuments]);

    // Show initial toast for multiple files
    if (files.length > 1) {
      toast.info(`Uploading ${files.length} documents...`);
    }

    // Upload files one by one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const document = newDocuments[i];
      
      try {
        await uploadFileToServer(file, document.id);
      } catch (error) {
        // Error handling is done in uploadFileToServer
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }
  };

  const handleRetryUpload = async (documentId: number) => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return;

    // Reset document status
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: "uploading", analysisProgress: 0 } 
        : doc
    ));

    // Clear error
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[documentId];
      return newErrors;
    });

    // Show retry toast
    toast.info(`Retrying upload for ${document.name}...`);

    // Note: In a real implementation, you'd need to store the original File object
    // to retry the upload. For now, we'll just show the retry functionality structure.
    console.log(`Retry upload for document: ${document.name}`);
  };

  const handleRemoveDocument = (documentId: number) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document && document.serverId) {
      // If document exists on server, use delete function
      handleDeleteDocument(document);
    } else {
      // If it's just a local document (not uploaded yet), remove from UI
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setUploadErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[documentId];
        return newErrors;
      });

      // Show removal toast
      toast.success(`${document?.name || 'Document'} has been removed from the list`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const getStatusBadge = (doc: Document) => {
    const error = uploadErrors[doc.id];
    
    if (error) {
      return (
        <Badge className="bg-red-100/80 text-red-800 border-red-200/50 backdrop-blur-sm">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    }

    switch (doc.status) {
      case "analyzed":
        return (
          <Badge className="bg-green-100/80 text-green-800 border-green-200/50 backdrop-blur-sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Analyzed
          </Badge>
        );
      case "uploading":
        return (
          <div className="flex items-center space-x-2">
            <Progress value={doc.analysisProgress} className="w-20" />
            <Badge className="bg-blue-100/80 text-blue-800 border-blue-200/50 backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1" />
              Uploading
            </Badge>
          </div>
        );
      default:
        return (
          <Badge className="bg-slate-100/80 text-slate-800 border-slate-200/50 backdrop-blur-sm">
            <Upload className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
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
            {documents.map((doc) => {
              const error = uploadErrors[doc.id];
              return (
                <div key={doc.id} className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:bg-white/70 transition-all duration-200">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm text-slate-800">{doc.name}</p>
                        <p className="text-xs text-slate-600">{doc.size} • {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(doc)}
                      {doc.status === "analyzed" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-white/50"
                            onClick={() => handleViewDocument(doc)}
                            title="View document"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-white/50"
                            onClick={() => handleDownloadDocument(doc)}
                            title="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {error && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:bg-blue-50/50"
                          onClick={() => handleRetryUpload(doc.id)}
                        >
                          Retry
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:bg-red-50/50"
                        onClick={() => handleRemoveDocument(doc.id)}
                        title={doc.serverId ? "Delete document" : "Remove from list"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <div className="px-4 pb-4">
                      <p className="text-xs text-red-600 bg-red-50/50 p-2 rounded">
                        Error: {error}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600 font-semibold text-lg">
              <AlertCircle className="w-5 h-5 mr-2" />
              Delete Document
            </DialogTitle>
            <DialogDescription className="text-gray-700 mt-2 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-medium text-gray-900">"{documentToDelete?.name}"</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={cancelDeleteDocument}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteDocument}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentUpload;