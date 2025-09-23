import React, { useEffect, useState } from 'react';
import { 
  FileText, User, Search, Filter, Plus, MoreHorizontal, Eye, Edit, Upload, Trash2,
  Loader2, CheckCircle, X,
  Settings,
  LogOut,
  Building,
  Mail,
  UserCircle
} from 'lucide-react';

// Import actual shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import MainContent from "../components/HomePageComponents/MainContent"
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
import BackgroundBlobs from '@/components/HomePageComponents/BackgroundEffect';
import Header from '@/components/HomePageComponents/Header';
import UpdateAccountDialog from '@/components/HomePageComponents/UpdateAccountDialog';
import axios from 'axios';
import AuthService from '@/services/AuthService';

const LegalWebApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateAccountOpen, setIsUpdateAccountOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCases, setSelectedCases] = useState([]);
  const [newCase, setNewCase] = useState({ name: '', description: '' });
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  
  // Account information state - start with empty state
  const [accountInfo, setAccountInfo] = useState({
    name: '',
    email: '',
    
  });

  // Fetch user account info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserLoading(true);
        const currentUser = AuthService.getCurrentUser();
        
        if (!currentUser || !currentUser.id) {
          console.error('No current user found');
          // Redirect to login or handle authentication error
          return;
        }

        const response = await axios.get(`http://localhost:8080/users/${currentUser.id}`);
        
        // Map the User entity to your accountInfo state structure
        setAccountInfo({
          name: response.data.name || `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim(),
          email: response.data.email || '',
          
        });
        
        console.log('User info loaded:', response.data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        // Handle error - maybe redirect to login if 401/403
        if (error.response?.status === 401 || error.response?.status === 403) {
          AuthService.logout();
          // Redirect to login
        }
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserInfo();
  }, []);


  useEffect(() => {
  const fetchCases = async () => {
    try {
      const response = await axios.get("http://localhost:8080/cases/");
      // Extract the content array from the Page object
      setCases(response.data.content || []); 
    } catch (error) {
      console.error();
    } finally {
      setLoading(false);
    }
  };

  fetchCases();
}, []);

  
  

  const filteredCases = cases
  .map((case_) => ({
    ...case_,
    status: case_.status || "In Progress", // Fallback if status is missing
  }))
  .filter((case_) =>
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

  const handleUpdateAccount = () => {
    console.log('Account updated:', accountInfo);
    setIsUpdateAccountOpen(false);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleOpenUpdateAccount = () => {
    setIsUpdateAccountOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative">
      <BackgroundBlobs />
      
      <Header 
        accountInfo={accountInfo}
        cases={cases}
        onUpdateAccount={handleOpenUpdateAccount}
        onLogout={handleLogout}
      />

      <UpdateAccountDialog 
        isOpen={isUpdateAccountOpen}
        onClose={() => setIsUpdateAccountOpen(false)}
        accountInfo={accountInfo}
        setAccountInfo={setAccountInfo}
        onSave={handleUpdateAccount}
      />

      {/* Main Content with proper z-index */}
      <MainContent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        selectAll={selectAll}
        selectedCases={selectedCases}
        newCase={newCase}
        setNewCase={setNewCase}
        cases={cases}
        filteredCases={filteredCases}
        handleSelectAll={handleSelectAll}
        handleSelectCase={handleSelectCase}
        handleCreateCase={handleCreateCase}
        getStatusBadgeVariant={getStatusBadgeVariant}
      />
    </div>
  );
};

export default LegalWebApp;