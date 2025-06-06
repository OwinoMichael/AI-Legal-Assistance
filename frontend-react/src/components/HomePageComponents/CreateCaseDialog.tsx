// components/CreateCaseDialog.jsx
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogTrigger,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';

const CreateCaseDialog = ({ 
  isOpen, 
  onOpenChange, 
  newCase, 
  onNewCaseChange, 
  onCreateCase 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onChange={(e) => onNewCaseChange({ ...newCase, name: e.target.value })}
              className="bg-white border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caseDescription" className="text-gray-700 font-medium">Description</Label>
            <Textarea
              id="caseDescription"
              placeholder="Brief description of the case..."
              value={newCase.description}
              onChange={(e) => onNewCaseChange({ ...newCase, description: e.target.value })}
              rows={3}
              className="bg-white border-gray-300"
            />
          </div>
        </div>
        <DialogFooter className="border-t border-gray-100 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={onCreateCase} 
            disabled={!newCase.name.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Create Case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCaseDialog;