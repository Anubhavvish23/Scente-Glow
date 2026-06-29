import { createContext, useCallback, useContext, useMemo, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [search_query, set_search_query] = useState("");
  const [search_open, set_search_open] = useState(false);
  const [focus_shop_search, set_focus_shop_search] = useState(false);

  const open_shop_search = useCallback((options = {}) => {
    const { focus = true } = options;

    set_search_open(true);

    if (focus) {
      set_focus_shop_search(true);
    }
  }, []);

  const close_shop_search = useCallback(() => {
    set_search_open(false);
    set_focus_shop_search(false);
  }, []);

  const clear_focus_shop_search = useCallback(() => {
    set_focus_shop_search(false);
  }, []);

  const clear_search = useCallback(() => {
    set_search_query("");
  }, []);

  const value = useMemo(
    () => ({
      search_query,
      set_search_query,
      search_open,
      open_shop_search,
      close_shop_search,
      focus_shop_search,
      clear_focus_shop_search,
      clear_search,
    }),
    [
      search_query,
      search_open,
      open_shop_search,
      close_shop_search,
      focus_shop_search,
      clear_focus_shop_search,
      clear_search,
    ]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
