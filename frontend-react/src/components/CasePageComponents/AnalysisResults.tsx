import React from 'react';
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
  Shield
} from 'lucide-react';
import type { AnalysisData, Risk, Clause } from './types';

interface AnalysisResultsProps {
  analysisData: AnalysisData;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisData }) => {
  const getRiskColor = (level: Risk['level']) => {
    switch (level) {
      case 'high': return 'bg-red-50/80 text-red-800 border-red-200/50 backdrop-blur-sm';
      case 'medium': return 'bg-yellow-50/80 text-yellow-800 border-yellow-200/50 backdrop-blur-sm';
      case 'low': return 'bg-green-50/80 text-green-800 border-green-200/50 backdrop-blur-sm';
      default: return 'bg-gray-50/80 text-gray-800 border-gray-200/50 backdrop-blur-sm';
    }
  };

  const getClauseIcon = (type: Clause['type']) => {
    switch (type) {
      case 'compensation': return <Scale className="w-4 h-4" />;
      case 'termination': return <AlertTriangle className="w-4 h-4" />;
      case 'confidentiality': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
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
  );
};

export default AnalysisResults;