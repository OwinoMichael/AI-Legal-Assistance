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
  Shield,
  Calendar,
  CheckSquare,
  DollarSign,
  BookOpenCheck,
  Clock,
  Target,
  Flag
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

interface AnalysisResultsProps {
  analysisData: EnhancedAnalysisData;
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
      case 'intellectual-property': return <BookOpen className="w-4 h-4" />;
      case 'non-compete': return <Flag className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: KeyTerm['category']) => {
    switch (category) {
      case 'legal': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'operational': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: ActionItem['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFinancialTypeColor = (type: FinancialItem['type']) => {
    switch (type) {
      case 'cost': return 'text-red-600';
      case 'fee': return 'text-orange-600';
      case 'penalty': return 'text-red-700';
      case 'benefit': return 'text-green-600';
      case 'salary': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
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
          <TabsList className="grid w-full grid-cols-7 bg-white/50 backdrop-blur-sm border border-white/20 text-xs">
            <TabsTrigger value="summary" className="flex items-center data-[state=active]:bg-white/80">
              <BookOpen className="w-3 h-3 mr-1" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center data-[state=active]:bg-white/80">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Risks
            </TabsTrigger>
            <TabsTrigger value="clauses" className="flex items-center data-[state=active]:bg-white/80">
              <Scale className="w-3 h-3 mr-1" />
              Clauses
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center data-[state=active]:bg-white/80">
              <BookOpenCheck className="w-3 h-3 mr-1" />
              Key Terms
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center data-[state=active]:bg-white/80">
              <CheckSquare className="w-3 h-3 mr-1" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center data-[state=active]:bg-white/80">
              <DollarSign className="w-3 h-3 mr-1" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center data-[state=active]:bg-white/80">
              <Lightbulb className="w-3 h-3 mr-1" />
              Tips
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

          <TabsContent value="terms" className="mt-4">
            <div className="space-y-4">
              <div className="grid gap-4">
                {analysisData.keyTerms.map((term, index) => (
                  <div key={index} className="border border-white/20 rounded-xl p-4 bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800">{term.term}</h4>
                      <Badge className={getCategoryColor(term.category)}>
                        {term.category}
                      </Badge>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <div className="space-y-4">
              {analysisData.actionItems.map((action) => (
                <div key={action.id} className="border border-white/20 rounded-xl p-4 bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-200">
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
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span className={isOverdue(action.deadline) ? 'text-red-600 font-medium' : ''}>
                        Due: {formatDate(action.deadline)}
                      </span>
                    </div>
                    {isOverdue(action.deadline) && action.status === 'pending' && (
                      <Badge className="bg-red-100 text-red-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                  
                  {action.description && (
                    <p className="text-slate-700 text-sm">{action.description}</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="financial" className="mt-4">
            <div className="space-y-4">
              <div className="grid gap-4">
                {analysisData.financialImpact.map((item, index) => (
                  <div key={index} className="border border-white/20 rounded-xl p-4 bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign className={`w-4 h-4 ${getFinancialTypeColor(item.type)}`} />
                        <h4 className="font-medium text-slate-800 capitalize">{item.type}</h4>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getFinancialTypeColor(item.type)}`}>
                          {item.amount}
                        </div>
                        {item.frequency && (
                          <div className="text-xs text-slate-500 capitalize">
                            {item.frequency}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-700 text-sm mb-2">{item.description}</p>
                    
                    {item.dueDate && (
                      <div className="flex items-center space-x-1 text-xs text-slate-600">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {formatDate(item.dueDate)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

// Mock data for demonstration
const mockAnalysisData: EnhancedAnalysisData = {
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
      description: "All work-related inventions, even those created outside of work hours, may be assigned to the company."
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
      type: "non-compete",
      title: "Non-Compete Agreement",
      content: "Employee agrees not to work for competitors within 50 miles for 18 months after termination.",
      significance: "This is broader than typical non-compete clauses and may limit future opportunities."
    }
  ],

  keyTerms: [
    {
      term: "At-Will Employment",
      definition: "Either party can terminate the employment relationship at any time, with or without cause, and with or without notice.",
      category: "legal"
    },
    {
      term: "Probationary Period",
      definition: "A 3-month initial period during which the employer can terminate employment with reduced notice requirements.",
      category: "operational"
    },
    {
      term: "Vesting Schedule",
      definition: "The timeline over which stock options or retirement benefits become fully owned by the employee, typically over 4 years with a 1-year cliff.",
      category: "financial"
    },
    {
      term: "Confidential Information",
      definition: "Any proprietary information, trade secrets, client lists, or business strategies that must not be disclosed to third parties.",
      category: "legal"
    }
  ],

  actionItems: [
    {
      id: "1",
      task: "Review and sign employment contract",
      deadline: "2025-06-30",
      priority: "high",
      status: "pending",
      description: "Carefully review all terms and conditions before signing. Consider consulting with a lawyer if needed."
    },
    {
      id: "2",
      task: "Set up direct deposit for salary",
      deadline: "2025-07-15",
      priority: "medium",
      status: "pending",
      description: "Provide banking information to HR for salary direct deposit setup."
    },
    {
      id: "3",
      task: "Complete I-9 employment verification",
      deadline: "2025-07-01",
      priority: "high",
      status: "pending",
      description: "Bring required documentation to verify employment eligibility within 3 days of start date."
    },
    {
      id: "4",
      task: "Enroll in health insurance benefits",
      deadline: "2025-07-30",
      priority: "medium",
      status: "completed",
      description: "Select health insurance plan and enroll dependents if applicable during open enrollment period."
    }
  ],

  financialImpact: [
    {
      type: "salary",
      description: "Base annual salary",
      amount: "$120,000",
      frequency: "annually"
    },
    {
      type: "benefit",
      description: "401(k) company matching (up to 4% of salary)",
      amount: "$4,800",
      frequency: "annually"
    },
    {
      type: "benefit",
      description: "Health insurance premium coverage",
      amount: "$8,400",
      frequency: "annually"
    },
    {
      type: "penalty",
      description: "Early termination of non-compete agreement",
      amount: "$10,000",
      frequency: "one-time"
    },
    {
      type: "fee",
      description: "Professional development allowance",
      amount: "$2,000",
      frequency: "annually"
    }
  ],

  recommendations: [
    "Consider negotiating the non-compete clause to reduce the time period from 18 to 12 months",
    "Request clarification on intellectual property rights for personal projects",
    "Negotiate for additional PTO days based on your experience level",
    "Ask for a signing bonus to offset the risks associated with the non-compete clause"
  ]
};

// Export the component with mock data
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <AnalysisResults analysisData={mockAnalysisData} />
      </div>
    </div>
  );
}