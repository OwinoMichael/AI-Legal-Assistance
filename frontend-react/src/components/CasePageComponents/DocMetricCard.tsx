import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bot,
  BookOpen,
  AlertTriangle,
  Scale,
  Lightbulb,
  FileText,
  Shield,
  Calendar,
  CheckSquare,
  DollarSign,
  BookOpenCheck,
  Clock,
  Target,
  Flag,
  BarChart3,
  TrendingUp,
  Activity,
  PieChart,
  Zap,
  Award
} from 'lucide-react';

// Enhanced types
interface KeyTerm {
  term: string;
  definition: string;
  category: 'legal' | 'financial' | 'operational' | 'general';
}

interface ActionItem {
  id: string;
  task: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue';
  description?: string;
}

interface FinancialItem {
  type: 'cost' | 'fee' | 'penalty' | 'benefit' | 'salary';
  description: string;
  amount: string;
  frequency?: 'one-time' | 'monthly' | 'annually' | 'per-occurrence';
  dueDate?: string;
}

interface Risk {
  level: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

interface Clause {
  type: 'compensation' | 'termination' | 'confidentiality' | 'intellectual-property' | 'non-compete';
  title: string;
  content: string;
  significance: string;
}

interface EnhancedAnalysisData {
  summary: string;
  risks: Risk[];
  clauses: Clause[];
  recommendations: string[];
  keyTerms: KeyTerm[];
  actionItems: ActionItem[];
  financialImpact: FinancialItem[];
}

interface DocumentAnalysisMetrics {
  id: number;
  documentId: number;
  summary: string;
  confidenceScore: number;
  riskCount: number;
  clauseCount: number;
  keyTermCount: number;
  actionItemCount: number;
  financialItemCount: number;
}

// Animated Counter Component
const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ 
  end, 
  duration = 1000, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

// Document Analysis Metrics Card Component
const DocumentAnalysisMetricsCard: React.FC<{ metrics: DocumentAnalysisMetrics }> = ({ metrics }) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Review';
  };

  const getRiskSeverity = (riskCount: number) => {
    if (riskCount >= 5) return { color: 'text-red-600', label: 'High Risk', bg: 'bg-red-50' };
    if (riskCount >= 3) return { color: 'text-yellow-600', label: 'Medium Risk', bg: 'bg-yellow-50' };
    return { color: 'text-green-600', label: 'Low Risk', bg: 'bg-green-50' };
  };

  const riskSeverity = getRiskSeverity(metrics.riskCount);

  return (
    <Card className="backdrop-blur-sm bg-white/90 border-white/30 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="flex items-center text-slate-800">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Document Analysis Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6">
        {/* Confidence Score - Prominent Display */}
        <div className={`p-6 rounded-xl border-2 ${getConfidenceColor(metrics.confidenceScore)} border-opacity-20 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Award className={`w-5 h-5 ${getConfidenceColor(metrics.confidenceScore).split(' ')[0]}`} />
                <span className="font-medium text-slate-700">Confidence Score</span>
              </div>
              <Badge className={getConfidenceColor(metrics.confidenceScore)}>
                {getConfidenceLabel(metrics.confidenceScore)}
              </Badge>
            </div>
            <div className="flex items-end space-x-2">
              <span className={`text-3xl font-bold ${getConfidenceColor(metrics.confidenceScore).split(' ')[0]}`}>
                <AnimatedCounter end={metrics.confidenceScore} suffix="%" />
              </span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getConfidenceColor(metrics.confidenceScore).split(' ')[0].replace('text-', 'bg-')}`}
                  style={{ 
                    width: `${metrics.confidenceScore}%`,
                    animation: 'slideIn 1s ease-out'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Risk Count */}
          <div className={`p-4 rounded-xl ${riskSeverity.bg} border border-opacity-20 hover:scale-105 transition-all duration-300 group cursor-pointer`}>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className={`w-4 h-4 ${riskSeverity.color}`} />
              <span className="text-sm font-medium text-slate-700">Risks</span>
            </div>
            <div className={`text-2xl font-bold ${riskSeverity.color} mb-1`}>
              <AnimatedCounter end={metrics.riskCount} />
            </div>
            <Badge className={`${riskSeverity.color} ${riskSeverity.bg} text-xs`}>
              {riskSeverity.label}
            </Badge>
          </div>

          {/* Clause Count */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center space-x-2 mb-2">
              <Scale className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Clauses</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              <AnimatedCounter end={metrics.clauseCount} />
            </div>
            <div className="text-xs text-blue-600">Analyzed</div>
          </div>

          {/* Key Terms */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpenCheck className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">Key Terms</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              <AnimatedCounter end={metrics.keyTermCount} />
            </div>
            <div className="text-xs text-purple-600">Identified</div>
          </div>

          {/* Action Items */}
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center space-x-2 mb-2">
              <CheckSquare className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-slate-700">Actions</span>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              <AnimatedCounter end={metrics.actionItemCount} />
            </div>
            <div className="text-xs text-orange-600">Required</div>
          </div>

          {/* Financial Items */}
          <div className="p-4 rounded-xl bg-green-50 border border-green-200/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Financial</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              <AnimatedCounter end={metrics.financialItemCount} />
            </div>
            <div className="text-xs text-green-600">Items Found</div>
          </div>

          {/* Processing Status */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200/20 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">Status</span>
            </div>
            <div className="text-sm font-bold text-indigo-600 mb-1">
              Complete
            </div>
            <div className="text-xs text-indigo-600">
              <Zap className="w-3 h-3 inline mr-1" />
              Ready
            </div>
          </div>
        </div>

        {/* Summary Preview */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/80 transition-all duration-300">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Analysis Summary</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
            {metrics.summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentAnalysisMetricsCard;