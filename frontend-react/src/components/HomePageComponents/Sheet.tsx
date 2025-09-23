import React from 'react';
import { User, Settings, LogOut, Building, Mail, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  Sheet,
  SheetTrigger
} from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import AccountInfo from './AccountInfo';
import AccountActions from './AccountActions';
import AccountStats from './AccountStats';
import AuthService from '@/services/AuthService';
import { useNavigate } from 'react-router-dom';

const ProfileSheet = ({ accountInfo, cases, onUpdateAccount, onLogout }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const handleUpdate = () => {
    // your update logic
  };

  return (
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
      <SheetContent className="z-50 bg-white border-l border-gray-200 shadow-2xl w-80">
        <SheetHeader className="border-b border-gray-100 pb-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-xl">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-gray-900 text-left">{accountInfo.name}</SheetTitle>
              <SheetDescription className="text-gray-600 text-left">
                {accountInfo.email}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <AccountInfo accountInfo={accountInfo} />
          <AccountActions onUpdateAccount={onUpdateAccount} onLogout={handleLogout} />
          <AccountStats cases={cases} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSheet;