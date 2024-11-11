import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SlidebarContextType {
  isOpen: boolean;
  toggleSlidebar: () => void;
  closeSlidebar: () => void;
}

const SlidebarContext = createContext<SlidebarContextType | undefined>(
  undefined
);

interface SlidebarProviderProps {
  children: ReactNode;
}

export const SlidebarProvider: React.FC<SlidebarProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSlidebar = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  const closeSlidebar = () => {
    setIsOpen(false);
  };

  return (
    <SlidebarContext.Provider value={{ isOpen, toggleSlidebar, closeSlidebar }}>
      {children}
    </SlidebarContext.Provider>
  );
};

export const useSlidebar = (): SlidebarContextType => {
  const context = useContext(SlidebarContext);
  if (!context) {
    throw new Error('useSlidebar 必須在 SlidebarProvider 中使用');
  }
  return context;
};
