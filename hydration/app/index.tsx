import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { loadSettings } from '../utils/storage';

export default function SplashGate() {
  const [ready, setReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dropAnim = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    loadSettings().then((s) => {
      setOnboardingDone(s.onboardingComplete);
    });

    // Splash animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(dropAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]),
      Animated.delay(1000),
    ]).start(() => setReady(true));
  }, []);

  if (ready) {
    return <Redirect href={onboardingDone ? '/(tabs)' : '/onboarding'} />;
  }

  return (
    <LinearGradient
      colors={[colors.backgroundDeep, colors.background, '#F0FAFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.inner}>
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Animated.Text
            style={[styles.dropEmoji, { transform: [{ translateY: dropAnim }] }]}
          >
            💧
          </Animated.Text>
          <Text style={styles.appName}>Daily Hydration</Text>
        </Animated.View>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Drink earlier. Sleep better. Feel great.
        </Animated.Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 8,
  },
  dropEmoji: {
    fontSize: 72,
  },
  appName: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 17,
    color: colors.textSoft,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
});
