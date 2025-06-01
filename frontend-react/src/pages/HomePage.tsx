import React, { useState } from 'react';
import { 
  FileText, User, Search, Filter, Plus, MoreHorizontal, Eye, Edit, Upload, Trash2,
  Loader2, CheckCircle, X
} from 'lucide-react';

// Import actual shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';

const LegalWebApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCases, setSelectedCases] = useState([]);
  const [newCase, setNewCase] = useState({ name: '', description: '' });

  // Sample data
  const [cases, setCases] = useState([
    {
      id: 1,
      title: "Contract Review - TechCorp",
      description: "Analysis of software licensing agreement with TechCorp for potential risks and compliance issues.",
      status: "In Progress",
      documentCount: 3,
      dateCreated: "2024-03-15",
      dateUpdated: "2024-03-20"
    },
    {
      id: 2,
      title: "Employment Dispute - Smith vs. ABC Inc",
      description: "Review of employment termination case and related documentation for wrongful dismissal claims.",
      status: "Completed",
      documentCount: 7,
      dateCreated: "2024-03-10",
      dateUpdated: "2024-03-18"
    },
    {
      id: 3,
      title: "Merger Due Diligence - XYZ Acquisition",
      description: "Comprehensive legal document review for proposed merger between XYZ Corp and subsidiary.",
      status: "Review",
      documentCount: 12,
      dateCreated: "2024-03-05",
      dateUpdated: "2024-03-19"
    }
  ]);

  const filteredCases = cases.filter(case_ => 
    case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Completed": return "default";
      case "In Progress": return "secondary";
      case "Review": return "destructive";
      case "Draft": return "outline";
      default: return "default";
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCases([]);
    } else {
      setSelectedCases(filteredCases.map(case_ => case_.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectCase = (caseId) => {
    if (selectedCases.includes(caseId)) {
      setSelectedCases(selectedCases.filter(id => id !== caseId));
    } else {
      setSelectedCases([...selectedCases, caseId]);
    }
  };

  const handleCreateCase = () => {
    if (newCase.name.trim()) {
      const newCaseData = {
        id: cases.length + 1,
        title: newCase.name,
        description: newCase.description,
        status: "Draft",
        documentCount: 0,
        dateCreated: new Date().toISOString().split('T')[0],
        dateUpdated: new Date().toISOString().split('T')[0]
      };
      setCases([...cases, newCaseData]);
      setNewCase({ name: '', description: '' });
      setIsCreateDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-lg opacity-20 animate-pulse delay-3000"></div>
      </div>

      {/* Header with proper z-index */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-white/20 shadow-lg sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">LegalMind</h1>
            </div>
            
            {/* Profile Sheet with proper z-index */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-white/50 backdrop-blur-sm">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent className="z-50 bg-white border-l border-gray-200 shadow-2xl">
                <SheetHeader className="border-b border-gray-100 pb-4">
                  <SheetTitle className="text-gray-900">Account Settings</SheetTitle>
                  <SheetDescription className="text-gray-600">
                    Manage your account information and preferences.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-gray-700 font-medium">Name</Label>
                    <Input id="name" defaultValue="John Doe" className="col-span-3 bg-white border-gray-300" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right text-gray-700 font-medium">Email</Label>
                    <Input id="email" defaultValue="john@example.com" className="col-span-3 bg-white border-gray-300" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right text-gray-700 font-medium">Company</Label>
                    <Input id="company" defaultValue="Acme Corp" className="col-span-3 bg-white border-gray-300" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                  <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">Save Changes</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content with proper z-index */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Page Header */}
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

        {/* Actions Bar */}
        <Card className="mb-6 p-4 backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-4 h-4" />
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white/70 backdrop-blur-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="backdrop-blur-sm bg-white/50 border border-gray-300 text-gray-700 hover:bg-white/70 hover:border-gray-400"
              >
                <Filter className="w-4 h-4 mr-2 text-gray-600" />
                Filter
              </Button>
            </div>



            {/* Create Case Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-white">
                  <Plus className="w-4 h-4 mr-2 text-white" />
                  Create Case
                </Button>

              </DialogTrigger>
              <DialogContent className="z-50 bg-white border border-gray-200 shadow-2xl">
                <DialogHeader className="border-b border-gray-100 pb-4">
                  <DialogTitle className="text-gray-900">Create New Case</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Start a new legal document analysis case. You can add documents after creating the case.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-6 px-1">
                  <div className="space-y-2">
                    <Label htmlFor="caseName" className="text-gray-700 font-medium">Case Name</Label>
                    <Input
                      id="caseName"
                      placeholder="Enter case name..."
                      value={newCase.name}
                      onChange={(e) => setNewCase({ ...newCase, name: e.target.value })}
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caseDescription" className="text-gray-700 font-medium">Description</Label>
                    <Textarea
                      id="caseDescription"
                      placeholder="Brief description of the case..."
                      value={newCase.description}
                      onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                      rows={3}
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
                <DialogFooter className="border-t border-gray-100 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateCase} 
                    disabled={!newCase.name.trim()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Create Case
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Cases Data Table */}
        <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-white/20">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-slate-700">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">Case Title</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Documents</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1">Updated</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/20">
            {filteredCases.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500">
                {searchTerm ? 'No cases found matching your search.' : 'No cases yet. Create your first case to get started.'}
              </div>
            ) : (
              filteredCases.map((case_) => (
                <div key={case_.id} className="px-6 py-4 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCases.includes(case_.id)}
                        onChange={() => handleSelectCase(case_.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">
                        {case_.title}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="text-slate-600 text-sm truncate">
                        {case_.description}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Badge 
                        variant={getStatusBadgeVariant(case_.status)} 
                        className={`text-xs font-medium ${
                          case_.status === 'Completed' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : case_.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : case_.status === 'Review'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {case_.status}
                      </Badge>
                    </div>
                    <div className="col-span-1">
                      <div className="text-slate-600 text-sm font-medium">
                        {case_.documentCount}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-slate-600 text-sm">
                        {new Date(case_.dateCreated).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-slate-600 text-sm">
                        {new Date(case_.dateUpdated).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="z-50 bg-white border border-gray-200 shadow-lg">
                          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-100">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-100">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Case
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-100">
                            <Upload className="mr-2 h-4 w-4" />
                            Add Document
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Case
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Footer Stats */}
        {cases.length > 0 && (
          <Card className="mt-6 p-4 backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl">
            <div className="text-sm text-slate-600 text-center">
              Showing <span className="font-medium text-blue-600">{filteredCases.length}</span> of <span className="font-medium text-blue-600">{cases.length}</span> cases
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default LegalWebApp;