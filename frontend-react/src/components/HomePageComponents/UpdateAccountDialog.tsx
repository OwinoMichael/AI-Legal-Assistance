import React from 'react';
import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const UpdateAccountDialog = ({ isOpen, onClose, accountInfo, setAccountInfo, onSave }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-50 bg-white border border-gray-200 shadow-2xl max-w-md">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-gray-900 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Update Account Information
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update your personal information and account details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="updateName" className="text-gray-700 font-medium">Full Name</Label>
            <Input
              id="updateName"
              value={accountInfo.name}
              onChange={(e) => setAccountInfo({ ...accountInfo, name: e.target.value })}
              className="bg-white border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="updateEmail" className="text-gray-700 font-medium">Email Address</Label>
            <Input
              id="updateEmail"
              type="email"
              value={accountInfo.email}
              onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
              className="bg-white border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="updatePhone" className="text-gray-700 font-medium">Phone Number</Label>
            <Input
              id="updatePhone"
              value={accountInfo.phone}
              onChange={(e) => setAccountInfo({ ...accountInfo, phone: e.target.value })}
              className="bg-white border-gray-300"
            />
          </div>
        </div>
        
        <DialogFooter className="border-t border-gray-100 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAccountDialog;