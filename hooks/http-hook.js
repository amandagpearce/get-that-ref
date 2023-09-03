import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);

      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortController.signal,
        });

        const responseData = await response.json();

        // clearing the abort controllers that belong to the request that just completed
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortController
        );

        if (!response.ok) {
          // throwing error here since a error response from fetch will not be caught automatically
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // the cleanup function is executed before the next time useEffect runs again
    // or also when the component using this hook unmounts
    return () => {
      // this will prevent errors when leaving the component page before the request finishes
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
