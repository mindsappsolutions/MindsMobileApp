import React, { createContext, useState, useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Nointernet from '../components/common/Nointernet';


const NetworkContext = createContext({
    isConnected: true,
    isInternetReachable: true,
});

export const NetworkProvider = ({ children }) => {
    const [networkState, setNetworkState] = useState({
        isConnected: true,
        isInternetReachable: true,
    });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setNetworkState({
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
            });
        });

        return () => unsubscribe();
    }, []);

    const { isConnected, isInternetReachable } = networkState;

    const hasInternet = isConnected && isInternetReachable;

    return (
        <NetworkContext.Provider value={networkState}>
            {hasInternet ? children : <Nointernet></Nointernet>}
        </NetworkContext.Provider>
    );
};

export const useNetwork = () => useContext(NetworkContext);
