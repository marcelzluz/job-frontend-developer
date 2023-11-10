'useclient';
import React from 'react';
import { Search } from 'lucide-react';

export const SearchForm = ({ searchTerm, setSearchTerm, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search for a band"
      className="p-2 border border-gray-300 rounded-md mt-2"
    />
    <button type="submit" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
      <Search />
    </button>
  </form>
);