import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const PageHeader = () => {
  return (
    <div className="mb-8">
      <Card className="p-6 backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Cases</h2>
        <p className="text-slate-600">Manage and track your legal document analyses with advanced AI insights</p>
        
        {/* Trust indicators */}
        <div className="flex items-center gap-6 mt-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>Secure & encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>AI-powered analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>Privacy protected</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PageHeader;