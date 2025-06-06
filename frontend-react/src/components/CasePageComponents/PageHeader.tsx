import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  caseData: {
    title: string;
    createdAt: string;
    // add other fields as needed
  };
}

const PageHeader: React.FC<{ caseData: any}> = ({ caseData }) => {
  return (
    <header className="backdrop-blur-sm bg-white/80 border-b border-white/20 shadow-lg relative z-10">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link to={'/home'}>
            <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-white/50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
          </Link>
          
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">{caseData.title}</h1>
                <p className="text-sm text-slate-600">Created on {new Date(caseData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
        <Badge className="bg-blue-100/80 text-blue-800 border-blue-200/50 backdrop-blur-sm">
          In Progress
        </Badge>
      </div>
    </header>
  );
};

export default PageHeader;