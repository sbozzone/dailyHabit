import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

type Props = {
  done: number;
  total: number;
  streak: number;
};

export function ProgressCard({ done, total, streak }: Props) {
  const [barWidth, setBarWidth] = useState(0);
  const coverLeft = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (barWidth > 0) {
      const fillW = total > 0 ? (done / total) * barWidth : 0;
      Animated.timing(coverLeft, {
        toValue: fillW,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [done, total, barWidth]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== barWidth) {
      setBarWidth(w);
      // Snap to current value without animation on first layout
      coverLeft.setValue(total > 0 ? (done / total) * w : 0);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>TODAY'S PROGRESS</Text>
        <Text style={styles.count}>
          {done}
          <Text style={styles.countSub}>/{total}</Text>
        </Text>
      </View>

      <View style={styles.barBg} onLayout={handleLayout}>
        <LinearGradient
          colors={[Colors.spiritual, Colors.mind]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Gray overlay slides right as progress increases */}
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.barCover, { left: coverLeft }]}
        />
      </View>

      {streak > 0 && (
        <Text style={styles.streak}>◆ {streak}-day streak</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 28,
    marginBottom: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  label: {
    fontFamily: 'CourierPrime_400Regular',
    fontSize: 10,
    letterSpacing: 2.5,
    color: Colors.textMuted,
  },
  count: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  countSub: {
    fontFamily: 'CormorantGaramond_300Light',
    color: '#C0B8A8',
    fontSize: 16,
  },
  barBg: {
    height: 4,
    backgroundColor: Colors.progressBarBg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barCover: {
    backgroundColor: Colors.progressBarBg,
    borderRadius: 2,
  },
  streak: {
    marginTop: 10,
    fontFamily: 'CourierPrime_400Regular',
    fontSize: 11,
    color: Colors.spiritual,
    letterSpacing: 1.5,
  },
});
