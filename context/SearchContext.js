// Create a new context file, e.g., SearchContext.js
import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, handleSearchInputChange }}>
      {children}
    </SearchContext.Provider>
  );
}
