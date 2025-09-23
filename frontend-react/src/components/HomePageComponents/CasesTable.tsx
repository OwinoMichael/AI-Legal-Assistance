import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Upload, Trash2} from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CasesTable = ({
  filteredCases,
  searchTerm,
  selectAll,
  selectedCases,
  handleSelectAll,
  handleSelectCase,
  getStatusBadgeVariant
}) => {


  return (
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
                  <Link to={`/cases/${case_.id}`}>
                    <div className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">
                      {case_.title}
                    </div>
                  </Link>
                  
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
                    {case_.documents}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-600 text-sm">
                    {new Date(case_.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="text-slate-600 text-sm">
                    {new Date(case_.updatedAt).toLocaleDateString()}
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
  );
};

export default CasesTable;