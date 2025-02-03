import { useEffect, useRef, useState } from 'react';

export function useFetch(
  input: Parameters<typeof fetch>[0],
  options?: Parameters<typeof fetch>[1],
): {
  data?: string;
  error?: Error;
  cancel: (reason?: string) => void;
} {
  const abortController = useRef<AbortController>();
  const fetchPromise = useRef<Promise<void>>();
  const [data, setData] = useState<string>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    abortController.current = new AbortController();
    fetchPromise.current = fetch(input, {
      ...options,
      signal: abortController.current.signal,
    })
      .then(res => res.text())
      .then(res => setData(res))
      .catch((err: unknown) => {
        const error = err instanceof Error ? err : new Error(JSON.stringify(err));
        setError(error);
      });

    return () => {
      abortController.current?.abort('useEffect cleanup');
    };
  }, [input, options]);

  return {
    data,
    error,
    cancel: () => abortController.current?.abort(),
  };
}
