import { useState, useCallback } from 'react';
import axios from 'axios';
import type { CaseDocument, DocumentResponseDTO } from './../components/CasePageComponents/types';

export const useDocumentOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async (caseId: string | number): Promise<CaseDocument[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<DocumentResponseDTO[]>(`http://localhost:8080/documents/case/${caseId}`);
      
      return response.data.map((doc) => ({
        id: Date.now() + doc.id, // Create unique client-side ID
        serverId: doc.id,
        name: doc.fileName,
        size: `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: doc.createdAt ? new Date(doc.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: "analyzed" as const,
        analysisProgress: 100,
        filePath: doc.filePath
      }));
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to fetch documents';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (
    file: File, 
    caseId: string | number,
    onProgress?: (progress: number) => void
  ): Promise<DocumentResponseDTO> => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId.toString());

    try {
      const response = await axios.post<DocumentResponseDTO>('http://localhost:8080/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(Math.min(percentCompleted, 90));
          }
        },
      });

      return response.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadDocument = useCallback(async (fileName: string, displayName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:8080/documents/download/${fileName}`, {
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', displayName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Download failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (documentId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.delete(`http://localhost:8080/documents/${documentId}`);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Delete failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    clearError,
    fetchDocuments,
    uploadDocument,
    downloadDocument,
    deleteDocument,
  };
};