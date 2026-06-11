import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const LOGO_SIZE = 100;
const CIRCLE_SIZE = 130;

export default function SplashScreen() {
  const router = useRouter();

  // Brand block fade-in
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandScale = useRef(new Animated.Value(0.98)).current;
  const brandTranslateY = useRef(new Animated.Value(10)).current;

  // Container fade-out
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(brandOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(brandScale, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(brandTranslateY, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.timing(containerOpacity, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/marketing');
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        style={[
          styles.splashContainer,
          { opacity: containerOpacity },
        ]}
      >
        <StatusBar style="light" />

        <View style={styles.splashScreen}>
          <Animated.View
            style={[
              styles.brandBlock,
              {
                opacity: brandOpacity,
                transform: [
                  { scale: brandScale },
                  { translateY: brandTranslateY },
                ],
              },
            ]}
          >
            {/* Logo Circle */}
            <View style={styles.logoCircle}>
              <Image
                source={require('../src/assets/images/Heali.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text style={styles.splashTitle}>Telehealings</Text>

            {/* Subtitle */}
            <Text style={styles.splashSubtitle}>
              Continuity-First Wellness Care Platform
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#387bd5',
  },
  splashScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBlock: {
    alignItems: 'center',
  },
  logoCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginTop: -60,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  splashTitle: {
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.01,
  },
  splashSubtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.06,
    color: '#E2EFFB',
    opacity: 0.85,
  },
});
