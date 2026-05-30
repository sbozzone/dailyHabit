import React, { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

type Props = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  color: string;
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function HabitItem({ label, checked, onToggle, color }: Props) {
  const anim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: checked ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [checked]);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.45] });
  const checkboxBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', color],
  });
  const checkboxBorder = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [hexToRgba(color, 0.38), color],
  });

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.85}>
      <Animated.View style={[styles.container, { opacity }]}>
        <Animated.View
          style={[
            styles.checkbox,
            { backgroundColor: checkboxBg as unknown as string, borderColor: checkboxBorder as unknown as string },
          ]}
        >
          {checked && <Text style={styles.check}>✓</Text>}
        </Animated.View>
        <Text style={[styles.label, checked && styles.labelChecked]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 18,
    color: Colors.textPrimary,
    flex: 1,
  },
  labelChecked: {
    textDecorationLine: 'line-through',
    textDecorationColor: '#B0A898',
    fontFamily: 'CormorantGaramond_300Light',
  },
});
