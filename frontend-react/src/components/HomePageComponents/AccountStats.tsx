import React from 'react';

const AccountStats = ({ cases }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold text-gray-900">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Total Cases:</span>
          <div className="font-semibold text-blue-600">{cases.length}</div>
        </div>
        <div>
          <span className="text-gray-600">Active Cases:</span>
          <div className="font-semibold text-green-600">
            {cases.filter(c => c.status === 'In Progress').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStats;