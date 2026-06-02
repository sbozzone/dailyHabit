import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/theme';

const CONFETTI_COUNT = 18;
const CONFETTI_COLORS = ['#38BDF8', '#0891B2', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#ffffff'];

interface ConfettiPiece {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
}

function makeConfetti(): ConfettiPiece[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    rotate: new Animated.Value(0),
    opacity: new Animated.Value(0),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 8 + Math.random() * 8,
  }));
}

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export function CelebrationOverlay({ visible, onDismiss }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const confetti = useRef<ConfettiPiece[]>(makeConfetti()).current;

  useEffect(() => {
    if (!visible) {
      Animated.timing(overlayOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      return;
    }

    // Entrance
    overlayOpacity.setValue(0);
    scale.setValue(0.5);
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
    ]).start();

    // Confetti burst
    confetti.forEach((piece, i) => {
      piece.opacity.setValue(1);
      const angle = (i / CONFETTI_COUNT) * Math.PI * 2;
      const distance = 120 + Math.random() * 80;
      Animated.parallel([
        Animated.timing(piece.x, {
          toValue: Math.cos(angle) * distance,
          duration: 900 + Math.random() * 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(piece.y, {
          toValue: Math.sin(angle) * distance,
          duration: 900 + Math.random() * 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotate, {
          toValue: (Math.random() > 0.5 ? 1 : -1) * 4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(700),
          Animated.timing(piece.opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
      ]).start();
    });

    // Auto-dismiss after 3.5s
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.backdrop, { opacity: overlayOpacity }]}>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} activeOpacity={1} />

      {/* Confetti pieces */}
      <View style={styles.confettiCenter} pointerEvents="none">
        {confetti.map((piece, i) => (
          <Animated.View
            key={i}
            style={[
              styles.confettiPiece,
              {
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: piece.size / 4,
                opacity: piece.opacity,
                transform: [
                  { translateX: piece.x },
                  { translateY: piece.y },
                  {
                    rotate: piece.rotate.interpolate({
                      inputRange: [-4, 4],
                      outputRange: ['-720deg', '720deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Card */}
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.title}>Goal Complete!</Text>
        <Text style={styles.subtitle}>
          You crushed your daily hydration goal!{'\n'}Great work staying ahead of pace.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onDismiss}>
          <Text style={styles.buttonText}>Keep it up! 💧</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14, 116, 144, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  confettiCenter: {
    position: 'absolute',
    top: '45%',
    left: '50%',
  },
  confettiPiece: {
    position: 'absolute',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 32,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  trophy: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
