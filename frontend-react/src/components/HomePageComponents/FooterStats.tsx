// components/FooterStats.jsx
import React from 'react';
import { Card } from '@/components/ui/card';

const FooterStats = ({ filteredCases, totalCases }) => {
  if (totalCases === 0) return null;

  return (
    <Card className="mt-6 p-4 backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl">
      <div className="text-sm text-slate-600 text-center">
        Showing <span className="font-medium text-blue-600">{filteredCases.length}</span> of <span className="font-medium text-blue-600">{totalCases}</span> cases
      </div>
    </Card>
  );
};

export default FooterStats;