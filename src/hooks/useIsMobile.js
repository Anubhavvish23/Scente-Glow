import { useEffect, useState } from "react";

const mobile_breakpoint = 860;

export function useIsMobile() {
  const [is_mobile, set_is_mobile] = useState(
    () => window.innerWidth <= mobile_breakpoint
  );

  useEffect(() => {
    const media_query = window.matchMedia(`(max-width: ${mobile_breakpoint}px)`);

    const update = () => set_is_mobile(media_query.matches);
    update();
    media_query.addEventListener("change", update);

    return () => media_query.removeEventListener("change", update);
  }, []);

  return is_mobile;
}

export const MOBILE_BREAKPOINT = mobile_breakpoint;
