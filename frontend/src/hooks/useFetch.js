import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Generic fetch hook.
 * @param {Function} fetcher - async fn returning data
 * @param {Array}    deps    - re-fetch when these change
 */
export function useFetch(fetcher, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const mountedRef = useRef(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (mountedRef.current) setData(result);
    } catch (e) {
      if (mountedRef.current) setError(e.message || "Something went wrong");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => { mountedRef.current = false; };
  }, [run]);

  return { data, loading, error, refetch: run };
}

/**
 * Paginated vehicle list hook with filter/sort support.
 */
export function useVehicles(params) {
  const key = JSON.stringify(params);
  return useFetch(
    () => {
      const { vehiclesApi } = require("../services/api");
      return vehiclesApi.list(params);
    },
    [key]
  );
}

/**
 * Debounce hook – delays value update until user stops typing.
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * Window size hook for responsive logic.
 */
export function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const fn = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return size;
}