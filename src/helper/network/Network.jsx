import NetInfo from '@react-native-community/netinfo';


export const isConnected = async () => {
    try {
        const state = await NetInfo.fetch();
        return state.isConnected && state.isInternetReachable;
    } catch (error) {
        return false;
    }
};
