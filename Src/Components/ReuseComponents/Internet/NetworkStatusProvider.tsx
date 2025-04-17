import React, { createContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkStatusContext = createContext({ isConnected: true });

export const NetworkStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, [isConnected]);

  console.log("isConnected",isConnected);
  

  return (
    <NetworkStatusContext.Provider value={{ isConnected }}>
      {children}
    </NetworkStatusContext.Provider>
  );
};
