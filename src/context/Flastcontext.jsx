import React, { createContext, useContext, useState, useCallback } from 'react';
import FlashMessage from '../components/FlashMessage';

const FlashContext = createContext();

let externalShowMessage = () => { };

export const FlashMessageProvider = ({ children }) => {
    const [message, setMessage] = useState(null);

    const showMessage = useCallback((text, type = 'info', duration = 3000) => {
        setMessage({ text, type });

        setTimeout(() => {
            setMessage(null);
        }, duration);
    }, []);

    externalShowMessage = showMessage;

    return (
        <FlashContext.Provider value={{ showMessage }}>
            {children}
            <FlashMessage message={message} />
        </FlashContext.Provider>
    );
};


export const useFlash = () => useContext(FlashContext);


export const showMessage = (text, type = 'info', duration = 3000) =>
    externalShowMessage(text, type, duration);
