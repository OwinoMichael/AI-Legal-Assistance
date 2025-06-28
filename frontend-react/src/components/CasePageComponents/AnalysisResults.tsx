import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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
  Flag,
  Target,
  TrendingUp,
  Info,
  User,
  AlertCircle
} from 'lucide-react';

// Enhanced types matching your system schema
interface Risk {
  level: string;
  title: string;
  description: string;
  confidence: number;
  category?: string;
  severity_score?: number;
}

interface Clause {
  type: string;
  title: string;
  content: string;
  significance: string;
  location?: number;
  key_points?: string[];
}

interface KeyTerm {
  term: string;
  definition: string;
  category: string;
  context?: string;
  importance?: string;
}

interface ActionItem {
  id: string;
  task: string;
  deadline?: string;
  priority: string;
  status: string;
  description?: string;
  assigned_to?: string;
}

interface FinancialItem {
  type: string;
  description: string;
  amount?: string;
  frequency?: string;
  due_date?: string;
  currency?: string;
  is_recurring?: boolean;
}

interface ComplianceItem {
  requirement: string;
  status: string;
  deadline?: string;
  responsible_party?: string;
  consequences?: string;
}

interface ComprehensiveAnalysis {
  summary: string;
  risks: Risk[];
  clauses: Clause[];
  key_terms: KeyTerm[];
  action_items: ActionItem[];
  financial_impact: FinancialItem[];
  compliance_items: ComplianceItem[];
  recommendations: string[];
  confidence_score: number;
  analysis_metadata?: Record<string, any>;
}

interface AnalysisResultsProps {
  analysisData: ComprehensiveAnalysis;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisData }) => {
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-red-50/80 text-red-800 border-red-200/50 backdrop-blur-sm';
      case 'medium': return 'bg-yellow-50/80 text-yellow-800 border-yellow-200/50 backdrop-blur-sm';
      case 'low': return 'bg-green-50/80 text-green-800 border-green-200/50 backdrop-blur-sm';
      default: return 'bg-gray-50/80 text-gray-800 border-gray-200/50 backdrop-blur-sm';
    }
  };

  const getClauseIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'compensation': return <Scale className="w-4 h-4" />;
      case 'termination': return <AlertTriangle className="w-4 h-4" />;
      case 'confidentiality': return <Shield className="w-4 h-4" />;
      case 'intellectual-property': return <BookOpen className="w-4 h-4" />;
      case 'non-compete': return <Flag className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'legal': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'operational': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFinancialTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cost': return 'text-red-600';
      case 'fee': return 'text-orange-600';
      case 'penalty': return 'text-red-700';
      case 'benefit': return 'text-green-600';
      case 'salary': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="flex-1 backdrop-blur-sm bg-white/90 border-white/30 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
      <CardHeader className="relative z-10 pb-4 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-slate-800">
          <div className="flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            Comprehensive Analysis Results
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Confidence:</span>
            <span className={`font-semibold ${getConfidenceColor(analysisData.confidence_score)}`}>
              {Math.round(analysisData.confidence_score * 100)}%
            </span>
            <Progress 
              value={analysisData.confidence_score * 100} 
              className="w-16 h-2"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 pt-0 flex-1 flex flex-col">
        <Tabs defaultValue="summary" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-8 bg-white/60 backdrop-blur-sm border border-white/30 text-xs h-12 flex-shrink-0">
            <TabsTrigger value="summary" className="flex items-center data-[state=active]:bg-white/90 data-[state=active]:shadow-sm transition-all duration-200">
              <BookOpen className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center data-[state=active]:bg-white/90 data-[state=active]:shadow-sm transition-all duration-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Risks</span>
            </TabsTrigger>
            <TabsTrigger value="clauses" className="flex items-center data-[state=active]:bg-white/90 data-[state=active]:shadow-sm transition-all duration-200">
              <Scale className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Clauses</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center data-[state=active]:bg-white/90 data-[state=active]:shadow-sm transition-all duration-200">
              <BookOpenCheck className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Terms</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center data-[state=active]:bg-white/90 data-[state=active]:shadow-sm transition-all duration-200">
              <CheckSquare className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Actions</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center data-[state=active]:bg-white/90 data-[state=active]:shadow-sm transition-all duration-200">
              <DollarSign className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center data-[state=active]:bg-white/90 data-[state=active]:shadow-sm transition-all duration-200">
              <Target className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center data-[state=active]:bg-white/90 data-[state=active]:shadow-sm transition-all duration-200">
              <Lightbulb className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Tips</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 flex-1 overflow-auto">
            <TabsContent value="summary" className="mt-0">
              <div className="prose max-w-none p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/50 transition-all duration-300">
                <p className="text-slate-700 leading-relaxed m-0">{analysisData.summary}</p>
                
                {analysisData.analysis_metadata && (
                  <div className="mt-4 pt-4 border-t border-white/40">
                    <h4 className="text-sm font-medium text-slate-600 mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      Analysis Metadata
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(analysisData.analysis_metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-slate-700">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="risks" className="mt-0">
              <div className="space-y-3 h-full overflow-auto">
                {analysisData.risks.map((risk, index) => (
                  <Alert key={index} className={`${getRiskColor(risk.level)} hover:scale-[1.01] transition-all duration-200`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium">{risk.title}</div>
                        <div className="flex items-center space-x-2">
                          {risk.category && (
                            <Badge variant="outline" className="text-xs">
                              {risk.category}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {Math.round(risk.confidence * 100)}% confidence
                          </Badge>
                          {risk.severity_score && (
                            <Badge variant="outline" className="text-xs">
                              Severity: {risk.severity_score}/10
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm">{risk.description}</div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="clauses" className="mt-0">
              <div className="space-y-3 h-full overflow-auto">
                {analysisData.clauses.map((clause, index) => (
                  <div key={index} className="border border-white/30 rounded-xl p-4 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:scale-[1.01] transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {getClauseIcon(clause.type)}
                        <h4 className="font-medium ml-2 text-slate-800">{clause.title}</h4>
                      </div>
                      {clause.location && (
                        <Badge variant="outline" className="text-xs">
                          Section {clause.location}
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-700 mb-3 leading-relaxed">{clause.content}</p>
                    {clause.key_points && clause.key_points.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-slate-600 mb-1">Key Points:</h5>
                        <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                          {clause.key_points.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-sm text-slate-600 italic">{clause.significance}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="terms" className="mt-0">
              <div className="space-y-3 h-full overflow-auto">
                {analysisData.key_terms.map((term, index) => (
                  <div key={index} className="border border-white/30 rounded-xl p-4 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:scale-[1.01] transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-slate-800">{term.term}</h4>
                      <div className="flex space-x-2">
                        <Badge className={getCategoryColor(term.category)}>
                          {term.category}
                        </Badge>
                        {term.importance && (
                          <Badge variant="outline" className="text-xs">
                            {term.importance}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed mb-2">{term.definition}</p>
                    {term.context && (
                      <p className="text-xs text-slate-600 italic">Context: {term.context}</p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="mt-0">
              <div className="space-y-3 h-full overflow-auto">
                {analysisData.action_items.map((action) => (
                  <div key={action.id} className="border border-white/30 rounded-xl p-4 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:scale-[1.01] transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="w-4 h-4 text-slate-600" />
                        <h4 className="font-medium text-slate-800">{action.task}</h4>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                        <Badge className={getStatusColor(action.status)}>
                          {action.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                      {action.deadline && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className={isOverdue(action.deadline) ? 'text-red-600 font-medium' : ''}>
                            Due: {formatDate(action.deadline)}
                          </span>
                        </div>
                      )}
                      {action.assigned_to && (
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Assigned to: {action.assigned_to}</span>
                        </div>
                      )}
                      {action.deadline && isOverdue(action.deadline) && action.status === 'pending' && (
                        <Badge className="bg-red-100 text-red-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    {action.description && (
                      <p className="text-slate-700 text-sm leading-relaxed">{action.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="financial" className="mt-0">
              <div className="space-y-3 h-full overflow-auto">
                {analysisData.financial_impact.map((item, index) => (
                  <div key={index} className="border border-white/30 rounded-xl p-4 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:scale-[1.01] transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <DollarSign className={`w-4 h-4 ${getFinancialTypeColor(item.type)}`} />
                        <h4 className="font-medium text-slate-800 capitalize">{item.type}</h4>
                        {item.is_recurring && (
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Recurring
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        {item.amount && (
                          <div className={`font-semibold text-lg ${getFinancialTypeColor(item.type)}`}>
                            {item.currency && item.currency !== 'USD' ? `${item.amount} ${item.currency}` : item.amount}
                          </div>
                        )}
                        {item.frequency && (
                          <div className="text-xs text-slate-500 capitalize">
                            {item.frequency}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-700 text-sm mb-3 leading-relaxed">{item.description}</p>
                    
                    {item.due_date && (
                      <div className="flex items-center space-x-1 text-xs text-slate-600">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {formatDate(item.due_date)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-0">
              <div className="space-y-3 h-full overflow-auto">
                {analysisData.compliance_items.map((item, index) => (
                  <div key={index} className="border border-white/30 rounded-xl p-4 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:scale-[1.01] transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-slate-600" />
                        <h4 className="font-medium text-slate-800">{item.requirement}</h4>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                      {item.deadline && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className={isOverdue(item.deadline) ? 'text-red-600 font-medium' : ''}>
                            Due: {formatDate(item.deadline)}
                          </span>
                        </div>
                      )}
                      {item.responsible_party && (
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Responsible: {item.responsible_party}</span>
                        </div>
                      )}
                    </div>
                    
                    {item.consequences && (
                      <Alert className="mt-3 bg-amber-50/60 border-amber-200/50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <span className="font-medium">Consequences: </span>
                          {item.consequences}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-0">
              <div className="space-y-3 h-full overflow-auto">
                {analysisData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50/60 backdrop-blur-sm rounded-xl border border-blue-200/40 hover:bg-blue-50/80 hover:scale-[1.01] transition-all duration-300">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-700 leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Mock data matching your system schema
const mockAnalysisData: ComprehensiveAnalysis = {
  summary: "This employment contract is for a Senior Software Engineer position at TechCorp Inc. The contract includes standard employment terms with a competitive salary, benefits package, and intellectual property clauses. The agreement is structured as an at-will employment contract with a 3-month probationary period.",
  
  risks: [
    {
      level: "high",
      title: "Broad Non-Compete Clause",
      description: "The non-compete clause extends to 18 months post-termination and covers a wide geographic area, which may limit future employment opportunities.",
      confidence: 0.92,
      category: "legal",
      severity_score: 8
    },
    {
      level: "medium",
      title: "Intellectual Property Assignment",
      description: "All work-related inventions, even those created outside of work hours, may be assigned to the company.",
      confidence: 0.78,
      category: "legal",
      severity_score: 6
    }
  ],

  clauses: [
    {
      type: "compensation",
      title: "Salary and Benefits",
      content: "Annual salary of $120,000 with health insurance, 401k matching up to 4%, and 3 weeks PTO.",
      significance: "Standard compensation package for the role level.",
      location: 3,
      key_points: ["Base salary: $120,000", "Health insurance included", "401k matching up to 4%", "3 weeks PTO"]
    },
    {
      type: "non-compete",
      title: "Non-Compete Agreement",
      content: "Employee agrees not to work for competitors within 50 miles for 18 months after termination.",
      significance: "This is broader than typical non-compete clauses and may limit future opportunities.",
      location: 8,
      key_points: ["18-month restriction period", "50-mile geographic limitation", "Applies to direct competitors"]
    }
  ],

  key_terms: [
    {
      term: "At-Will Employment",
      definition: "Either party can terminate the employment relationship at any time, with or without cause, and with or without notice.",
      category: "legal",
      context: "Section 2.1 of the employment agreement",
      importance: "high"
    },
    {
      term: "Probationary Period",
      definition: "A 3-month initial period during which the employer can terminate employment with reduced notice requirements.",
      category: "operational",
      context: "Section 1.3 of the employment agreement",
      importance: "medium"
    },
    {
      term: "Vesting Schedule",
      definition: "The timeline over which stock options or retirement benefits become fully owned by the employee, typically over 4 years with a 1-year cliff.",
      category: "financial",
      context: "Appendix B - Stock Option Agreement",
      importance: "high"
    }
  ],

  action_items: [
    {
      id: "1",
      task: "Review and sign employment contract",
      deadline: "2025-06-30",
      priority: "high",
      status: "pending",
      description: "Carefully review all terms and conditions before signing. Consider consulting with a lawyer if needed.",
      assigned_to: "Employee"
    },
    {
      id: "2",
      task: "Set up direct deposit for salary",
      deadline: "2025-07-15",
      priority: "medium",
      status: "pending",
      description: "Provide banking information to HR for salary direct deposit setup.",
      assigned_to: "Employee"
    },
    {
      id: "3",
      task: "Complete I-9 employment verification",
      deadline: "2025-07-01",
      priority: "high",
      status: "pending",
      description: "Bring required documentation to verify employment eligibility within 3 days of start date.",
      assigned_to: "HR Department"
    }
  ],

  financial_impact: [
    {
      type: "salary",
      description: "Base annual salary",
      amount: "$120,000",
      frequency: "annually",
      currency: "USD",
      is_recurring: true
    },
    {
      type: "benefit",
      description: "401(k) company matching (up to 4% of salary)",
      amount: "$4,800",
      frequency: "annually",
      currency: "USD",
      is_recurring: true
    },
    {
      type: "benefit",
      description: "Health insurance premium coverage",
      amount: "$8,400",
      frequency: "annually",
      currency: "USD",
      is_recurring: true
    },
    {
      type: "penalty",
      description: "Early termination of non-compete agreement",
      amount: "$10,000",
      frequency: "one-time",
      currency: "USD",
      is_recurring: false
    }
  ],

  compliance_items: [
    {
      requirement: "I-9 Employment Eligibility Verification",
      status: "pending",
      deadline: "2025-07-03",
      responsible_party: "Employee & HR",
      consequences: "Failure to complete within 3 days may result in employment termination"
    },
    {
      requirement: "Confidentiality Agreement Acknowledgment",
      status: "pending",
      deadline: "2025-07-01",
      responsible_party: "Employee",
      consequences: "Required before accessing proprietary information"
    },
    {
      requirement: "Annual Ethics Training",
      status: "compliant",
      deadline: "2025-12-31",
      responsible_party: "Employee",
      consequences: "Non-completion may affect performance review"
    }
  ],

  recommendations: [
    "Consider negotiating the non-compete clause to reduce the time period from 18 to 12 months",
    "Request clarification on intellectual property rights for personal projects",
    "Negotiate for additional PTO days based on your experience level",
    "Ask for a signing bonus to offset the risks associated with the non-compete clause",
    "Ensure compliance deadlines are met to avoid employment complications"
  ],

  confidence_score: 0.87,
  
  analysis_metadata: {
    "document_type": "employment_contract",
    "pages_analyzed": 12,
    "processing_time": "2.3 seconds",
    "model_version": "v2.1.0",
    "risk_factors_identified": 15,
    "clauses_extracted": 8,
    "legal_terms_found": 23
  }
};

// Export the component with mock data
export default function App() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 flex p-4">
      <AnalysisResults analysisData={mockAnalysisData} />
    </div>
  );
}