import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

const GLASS_WIDTH = 150;
const GLASS_HEIGHT = 260;

interface Props {
  fillPercent: number;   // 0–100, how much of the goal is consumed
  pacePercent: number;   // 0–100, where pace line should be
  goalOz: number;
  consumedOz: number;
}

export function WaterGlass({ fillPercent, pacePercent, goalOz, consumedOz }: Props) {
  const animPercent = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animPercent, {
      toValue: Math.min(100, fillPercent),
      tension: 45,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [fillPercent]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Translate Y slides the fill-view (full height) upward from fully hidden to fully shown
  const fillTranslateY = animPercent.interpolate({
    inputRange: [0, 100],
    outputRange: [GLASS_HEIGHT, 0],
  });

  // Wave causes subtle horizontal shimmer at the water surface
  const waveTranslateX = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 6],
  });

  // Position of the pace line from the top of the glass
  const paceLineTop = GLASS_HEIGHT - (pacePercent / 100) * GLASS_HEIGHT;
  const isAhead = fillPercent >= pacePercent;

  // Text color flips once water covers the center
  const textOnWater = fillPercent > 50;

  return (
    <View style={styles.wrapper}>
      {/* Outer glow */}
      <View style={styles.glow} />

      {/* The glass */}
      <View style={styles.glass}>
        {/* Water fill — slides up via translateY on a full-height view */}
        <Animated.View
          style={[styles.waterFill, { transform: [{ translateY: fillTranslateY }] }]}
        >
          <LinearGradient
            colors={[colors.primaryLight, colors.water, colors.waterDeep]}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />
          {/* Shimmer highlight */}
          <Animated.View
            style={[
              styles.shimmer,
              { transform: [{ translateX: waveTranslateX }] },
            ]}
          />
        </Animated.View>

        {/* Pace line */}
        {pacePercent > 0 && pacePercent < 101 && (
          <View
            style={[
              styles.paceLine,
              {
                top: paceLineTop,
                backgroundColor: isAhead
                  ? colors.paceLineAhead
                  : colors.paceLineBehind,
              },
            ]}
          >
            <View style={[styles.paceArrow, { borderRightColor: isAhead ? colors.paceLineAhead : colors.paceLineBehind }]} />
          </View>
        )}

        {/* Center overlay — shows oz and % */}
        <View style={styles.overlay} pointerEvents="none">
          <Text style={[styles.ozText, { color: textOnWater ? '#fff' : colors.primaryDark }]}>
            {Math.round(consumedOz)}
          </Text>
          <Text style={[styles.ozLabel, { color: textOnWater ? 'rgba(255,255,255,0.8)' : colors.textSoft }]}>
            oz
          </Text>
          <Text style={[styles.percentText, { color: textOnWater ? 'rgba(255,255,255,0.7)' : colors.accent }]}>
            {Math.round(fillPercent)}%
          </Text>
        </View>
      </View>

      {/* Pace label — positioned to the right of the glass, aligned with the line */}
      {pacePercent > 0 && pacePercent < 101 && (
        <View style={[styles.paceLabel, { top: paceLineTop + GLASS_HEIGHT * 0.05 }]}>
          <Text style={[styles.paceLabelText, { color: isAhead ? colors.success : colors.warning }]}>
            pace
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: GLASS_WIDTH + 56,
    height: GLASS_HEIGHT + 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: GLASS_WIDTH + 20,
    height: GLASS_HEIGHT + 20,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    opacity: 0.25,
  },
  glass: {
    width: GLASS_WIDTH,
    height: GLASS_HEIGHT,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    backgroundColor: colors.waterGlass,
    position: 'relative',
  },
  waterFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: GLASS_HEIGHT,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: -20,
    width: 40,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
  },
  paceLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2.5,
    borderRadius: 1,
  },
  paceArrow: {
    position: 'absolute',
    right: -12,
    top: -5,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ozText: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 52,
  },
  ozLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: -4,
  },
  percentText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
    opacity: 0.85,
  },
  paceLabel: {
    position: 'absolute',
    right: 0,
  },
  paceLabelText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
