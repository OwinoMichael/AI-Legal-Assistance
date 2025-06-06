import { useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AuthService from '@/services/AuthService';
import { useNavigate } from 'react-router-dom';

const ActionsBar = ({
  searchTerm,
  setSearchTerm,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  newCase,
  setNewCase,
  onCaseCreated // Callback to refresh cases list
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateCase = async () => {
    if (!newCase.name.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const currentUser = AuthService.getCurrentUser(); 
      if (!currentUser || !currentUser.token) {
        throw new Error('User not authenticated');
      }

      const caseData = {
        title: newCase.name.trim(),  // ✅ Changed from 'name' to 'title'
        description: newCase.description.trim() || '',
        userId: currentUser.id,  
      };
      
      console.log('Sending case data:', JSON.stringify(caseData, null, 2)); // Detailed logging
      console.log('Current user:', JSON.stringify(currentUser, null, 2)); // Check user object
      
      const response = await axios.post('http://localhost:8080/cases/create-case', caseData, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Success - close dialog and reset form
      setIsCreateDialogOpen(false);
      setNewCase({ name: '', description: '' });

      // ✅ Fixed: Use response.data instead of undefined createdCase
      const createdCase = response.data;
      console.log('Created case:', createdCase);
      
      // Navigate to the created case page
      navigate(`/cases/${createdCase.id}`);
      
      // Notify parent to refresh cases list
      if (onCaseCreated) {
        onCaseCreated(createdCase);
      }
      
    } catch (err) {
      console.error('Error creating case:', err);
      setError(err.response?.data?.message || 'Failed to create case. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                  {error}
                </div>
              )}
            </div>
            <DialogFooter className="border-t border-gray-100 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCase} 
                disabled={!newCase.name.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Case'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default ActionsBar;