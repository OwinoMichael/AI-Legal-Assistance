// components/UpdateAccountDialog.jsx
import React from 'react';
import { Building, Mail, Settings, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';

const AccountInfo = ({ accountInfo }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Account Information</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-sm">
          <UserCircle className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Name:</span>
          <span className="text-gray-900 font-medium">{accountInfo.name}</span>
        </div>
        
        <div className="flex items-center space-x-3 text-sm">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Email:</span>
          <span className="text-gray-900 font-medium">{accountInfo.email}</span>
        </div>
        
        {/* <div className="flex items-center space-x-3 text-sm">
          <Building className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Company:</span>
          <span className="text-gray-900 font-medium">{accountInfo.company}</span>
        </div> */}
      </div>
    </div>
  );
};

export default AccountInfo;