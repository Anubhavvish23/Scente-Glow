import { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [search_query, set_search_query] = useState("");
  const [search_open, set_search_open] = useState(false);
  const [focus_shop_search, set_focus_shop_search] = useState(false);

  const open_shop_search = () => {
    set_search_open(true);
    set_focus_shop_search(true);
  };

  const close_shop_search = () => {
    set_search_open(false);
    set_focus_shop_search(false);
  };

  const clear_focus_shop_search = () => set_focus_shop_search(false);
  const clear_search = () => set_search_query("");

  return (
    <SearchContext.Provider
      value={{
        search_query,
        set_search_query,
        search_open,
        open_shop_search,
        close_shop_search,
        focus_shop_search,
        clear_focus_shop_search,
        clear_search,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
