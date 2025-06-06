import { LogOut, Settings } from "lucide-react";
import { Button } from "../ui/button";
import AuthService from "@/services/AuthService";



const AccountActions = ({ onUpdateAccount, onLogout }) => {

  


  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Account Actions</h3>
      
      <Button
        onClick={onUpdateAccount}
        variant="outline"
        className="w-full justify-start bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <Settings className="w-4 h-4 mr-3" />
        Update Account
      </Button>

      <Button
        onClick={onLogout}
        variant="outline"
        className="w-full justify-start bg-white border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
      >
        <LogOut className="w-4 h-4 mr-3" />
        Logout
      </Button>
    </div>
  );
};

export default AccountActions;