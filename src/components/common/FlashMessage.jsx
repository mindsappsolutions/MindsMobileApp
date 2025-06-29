import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native';

const { width } = Dimensions.get('window');

const FlashMessage = ({
    message,
    duration = 4000,
    onDismiss,
    position = 'top',
    showCloseButton = false
}) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (message?.text) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                handleDismiss();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleDismiss = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: position === 'top' ? -100 : 100,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onDismiss && onDismiss();
        });
    };

    if (!message?.text) return null;

    const getMessageConfig = (type) => {
        const configs = {
            success: {
                backgroundColor: '#10B981',
                borderColor: '#059669',
                icon: '✓',
                iconColor: '#ECFDF5'
            },
            error: {
                backgroundColor: '#EF4444',
                borderColor: '#DC2626',
                icon: '✕',
                iconColor: '#FEF2F2'
            },
            warning: {
                backgroundColor: '#F59E0B',
                borderColor: '#D97706',
                icon: '⚠',
                iconColor: '#FFFBEB'
            },
            info: {
                backgroundColor: '#3B82F6',
                borderColor: '#2563EB',
                icon: 'ⓘ',
                iconColor: '#EFF6FF'
            }
        };
        return configs[type] || configs.info;
    };

    const config = getMessageConfig(message.type);

    const containerStyle = [
        styles.container,
        {
            backgroundColor: config.backgroundColor,
            borderLeftColor: config.borderColor,
            [position]: position === 'top' ? 50 : 50,
        },
        Platform.OS === 'ios' && styles.shadowIOS,
        Platform.OS === 'android' && styles.shadowAndroid,
    ];

    return (
        <Animated.View
            style={[
                containerStyle,
                {
                    transform: [
                        {
                            translateY: slideAnim,
                        },
                    ],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={[styles.icon, { color: config.iconColor }]}>
                        {config.icon}
                    </Text>
                </View>

                <View style={styles.textContainer}>
                    {message.title && (
                        <Text style={styles.title}>{message.title}</Text>
                    )}
                    <Text style={styles.text}>{message.text}</Text>
                </View>

                {showCloseButton && (
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleDismiss}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Progress bar for auto-dismiss */}
            <View style={styles.progressBarContainer}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: `${100}%`,
                            backgroundColor: config.borderColor,
                        }
                    ]}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        maxWidth: width - 32,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderLeftWidth: 4,
        zIndex: 1000,
        overflow: 'hidden',
    },
    shadowIOS: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    shadowAndroid: {
        elevation: 8,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        paddingVertical: 14,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
        paddingRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 2,
        letterSpacing: 0.3,
    },
    text: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.95)',
        lineHeight: 20,
        fontWeight: '500',
    },
    closeButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
    },
    progressBarContainer: {
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
});

export default FlashMessage;