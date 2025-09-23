import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Settings, 
  Eye, 
  Check, 
  X, 
  Calendar,
  Building,
  User,
  AlertTriangle,
  Shield,
  DollarSign,
  Clock,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LegalPDFExport = () => {
  const [exportOptions, setExportOptions] = useState({
    includeSummary: true,
    includeRisks: true,
    includeClauses: true,
    includeRecommendations: true,
    includeDocuments: false,
    includeAnalysisDate: true,
    includeWatermark: true
  });

  const [format, setFormat] = useState('detailed');
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      // In real implementation, this would trigger the actual PDF download
      console.log('PDF exported with options:', exportOptions);
    }, 2000);
  };

  const toggleOption = (option) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const formatOptions = [
    { id: 'summary', label: 'Executive Summary', desc: 'Key points only' },
    { id: 'detailed', label: 'Detailed Report', desc: 'Complete analysis' },
    { id: 'custom', label: 'Custom', desc: 'Select sections' }
  ];

  const contentSections = [
    { key: 'includeSummary', label: 'Analysis Summary', icon: FileCheck, color: 'bg-blue-100 text-blue-600' },
    { key: 'includeRisks', label: 'Risk Assessment', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
    { key: 'includeClauses', label: 'Key Clauses', icon: Shield, color: 'bg-green-100 text-green-600' },
    { key: 'includeRecommendations', label: 'Recommendations', icon: User, color: 'bg-purple-100 text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative overflow-hidden">
      {/* Background blobs matching login page */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 w-full p-6 space-y-6">
        {/* Header with glassmorphism */}
        <div className="flex items-center justify-between backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl rounded-2xl p-6 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">Export Analysis Report</h1>
              <p className="text-slate-600">Employment Contract Review - Created Jan 15, 2024</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2 bg-white/70 backdrop-blur-sm border-slate-200 hover:border-slate-300 hover:bg-white/90 transition-all duration-200 relative z-10"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* Export Configuration */}
          <div className="2xl:col-span-2 space-y-6">
            {/* Format Selection with glassmorphism */}
            <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Settings className="w-5 h-5" />
                  Export Format
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {formatOptions.map((fmt) => (
                    <Card 
                      key={fmt.id}
                      className={`cursor-pointer transition-all hover:shadow-lg backdrop-blur-sm bg-white/60 border-white/30 hover:bg-white/80 ${
                        format === fmt.id ? 'ring-2 ring-blue-500 bg-white/90' : ''
                      }`}
                      onClick={() => setFormat(fmt.id)}
                    >
                      <CardContent className="p-4">
                        <div className="font-medium text-slate-800">{fmt.label}</div>
                        <div className="text-sm text-slate-600">{fmt.desc}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Selection with glassmorphism */}
            {format === 'custom' && (
              <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-slate-800">Select Content</CardTitle>
                  <CardDescription className="text-slate-600">Choose which sections to include in your report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  {contentSections.map((item) => (
                    <div key={item.key} className="flex items-center space-x-3 p-3 rounded-lg border border-white/30 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-200">
                      <div className={`p-2 rounded-md ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <Label htmlFor={item.key} className="flex-1 font-medium cursor-pointer text-slate-700">
                        {item.label}
                      </Label>
                      <Checkbox
                        id={item.key}
                        checked={exportOptions[item.key]}
                        onCheckedChange={() => toggleOption(item.key)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Advanced Options with glassmorphism */}
            <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
              <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/20 transition-all duration-200 relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-800">Advanced Options</CardTitle>
                      {isAdvancedOpen ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeAnalysisDate"
                          checked={exportOptions.includeAnalysisDate}
                          onCheckedChange={() => toggleOption('includeAnalysisDate')}
                        />
                        <Label htmlFor="includeAnalysisDate" className="text-slate-700">Include analysis date</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeWatermark"
                          checked={exportOptions.includeWatermark}
                          onCheckedChange={() => toggleOption('includeWatermark')}
                        />
                        <Label htmlFor="includeWatermark" className="text-slate-700">Add confidential watermark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeDocuments"
                          checked={exportOptions.includeDocuments}
                          onCheckedChange={() => toggleOption('includeDocuments')}
                        />
                        <Label htmlFor="includeDocuments" className="text-slate-700">Attach original documents</Label>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Export Button matching login style */}
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Export PDF Report
                </>
              )}
            </Button>
          </div>

          {/* Preview Panel with glassmorphism */}
          <div className="2xl:col-span-1 space-y-6">
            {/* Export Summary */}
            <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Eye className="w-4 h-4" />
                  Export Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Format:</span>
                  <Badge variant="secondary" className="capitalize bg-blue-100 text-blue-800">{format}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Est. Pages:</span>
                  <Badge variant="outline" className="border-slate-300 text-slate-700">5-7 pages</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">File Size:</span>
                  <Badge variant="outline" className="border-slate-300 text-slate-700">~2.5 MB</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Content Summary */}
            <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-slate-800">Included Sections</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  {format !== 'custom' ? (
                    // Show all sections for non-custom formats
                    [
                      { label: 'Analysis Summary', included: true },
                      { label: 'Risk Assessment', included: format === 'detailed' },
                      { label: 'Key Clauses', included: format === 'detailed' },
                      { label: 'Recommendations', included: true }
                    ].map((section, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {section.included ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400" />
                        )}
                        <span className={section.included ? 'text-slate-800' : 'text-slate-500'}>
                          {section.label}
                        </span>
                      </div>
                    ))
                  ) : (
                    // Show selected sections for custom format
                    contentSections.map((section, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {exportOptions[section.key] ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400" />
                        )}
                        <span className={exportOptions[section.key] ? 'text-slate-800' : 'text-slate-500'}>
                          {section.label}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Document Preview */}
            {showPreview && (
              <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-slate-800">Document Preview</CardTitle>
                  <CardDescription className="text-slate-600">Sample of generated report</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="max-h-96 overflow-y-auto space-y-4 text-sm">
                    <div className="text-center border-b border-slate-200 pb-4">
                      <h2 className="font-bold text-lg text-slate-800">Employment Contract Analysis</h2>
                      <p className="text-slate-600">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Broad Non-Compete Clause:</strong> The non-compete clause extends to 18 months post-termination and covers a wide geographic area...
                      </AlertDescription>
                    </Alert>
                    
                    <div className="p-3 bg-blue-50/80 backdrop-blur-sm rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">💼 Key Clauses</h4>
                      <p className="text-blue-800 text-xs">
                        <strong>Salary and Benefits:</strong> Annual salary of $120,000 with health insurance, 401k matching up to 4%, and 3 weeks PTO...
                      </p>
                    </div>
                    
                    <div className="text-center text-slate-500 text-xs border-t border-slate-200 pt-4">
                      ... additional content continues
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPDFExport;