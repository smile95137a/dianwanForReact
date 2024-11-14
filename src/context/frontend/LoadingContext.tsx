import Loading from '@/components/common/Loading';
import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const defaultValue: LoadingContextType = {
  loading: false,
  setLoading: () => {},
};

const LoadingContext = createContext<LoadingContextType>(defaultValue);

export const useLoading = () => {
  return useContext(LoadingContext);
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        {children}
      </LoadingContext.Provider>
      {loading && <Loading />}
    </>
  );
};
