import React from "react";
import PageHeader from './PageHeader';
import ActionsBar from './ActionsBar';
import CasesTable from './CasesTable';
import FooterStats from './FooterStats';

const MainContent = ({
  searchTerm,
  setSearchTerm,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  selectAll,
  selectedCases,
  newCase,
  setNewCase,
  cases,
  filteredCases,
  handleSelectAll,
  handleSelectCase,
  onCaseCreated,
  getStatusBadgeVariant
}) => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
      <PageHeader />
      
      <ActionsBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        newCase={newCase}
        setNewCase={setNewCase}
        onCaseCreated={onCaseCreated}
      />

      <CasesTable
        filteredCases={filteredCases}
        searchTerm={searchTerm}
        selectAll={selectAll}
        selectedCases={selectedCases}
        handleSelectAll={handleSelectAll}
        handleSelectCase={handleSelectCase}
        getStatusBadgeVariant={getStatusBadgeVariant}
      />

      <FooterStats
        filteredCases={filteredCases}
        totalCases={cases.length}
      />
    </main>
  );
};

export default MainContent;