import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  indexOfFirstUser: number;
  indexOfLastUser: number;
  totalUsers: number;
  setCurrentPage: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  indexOfFirstUser,
  indexOfLastUser,
  totalUsers,
  setCurrentPage
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-white/50 text-sm">
        Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, totalUsers)} of {totalUsers} users
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white/70">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}