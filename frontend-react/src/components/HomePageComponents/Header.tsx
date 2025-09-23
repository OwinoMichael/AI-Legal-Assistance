// components/Header.jsx
import React from 'react';
import { FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProfileSheet from './Sheet';


const Header = ({ accountInfo, cases, onUpdateAccount, onLogout }) => {
  return (
    <header className="backdrop-blur-sm bg-white/80 border-b border-white/20 shadow-lg sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">LegalMind</h1>
          </div>
          
          <ProfileSheet 
            accountInfo={accountInfo} 
            cases={cases} 
            onUpdateAccount={onUpdateAccount}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;