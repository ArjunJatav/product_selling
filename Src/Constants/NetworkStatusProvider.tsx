import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';

interface NetworkState {
  isConnected: boolean;
  isSlow: boolean;
}

const NetworkContext = createContext<NetworkState | undefined>(undefined);

export const NetworkStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isSlow: false,
  });

  const checkNetwork = () => {
    NetInfo.fetch().then((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isSlow: state.details?.downlink ? state.details.downlink < 1 : false, // Speed < 1 Mbps → Slow
      });
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      checkNetwork();
    }, [])
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isSlow: state.details?.downlink ? state.details.downlink < 1 : false,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <NetworkContext.Provider value={networkState}>{children}</NetworkContext.Provider>;
};

export const useNetworkStatus = (): NetworkState => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetworkStatus must be used within a NetworkStatusProvider");
  }
  return context;
};
