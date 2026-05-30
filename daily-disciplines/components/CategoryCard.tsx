import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Category } from '../constants/habits';
import { HabitItem } from './HabitItem';

type Props = {
  category: Category;
  checkedIds: { [id: string]: boolean };
  onToggle: (id: string) => void;
};

export function CategoryCard({ category, checkedIds, onToggle }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: category.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.icon, { color: category.color }]}>{category.icon}</Text>
        <Text style={[styles.label, { color: category.color }]}>{category.label}</Text>
      </View>
      {category.habits.map((habit) => (
        <HabitItem
          key={habit.id}
          label={habit.label}
          checked={!!checkedIds[habit.id]}
          onToggle={() => onToggle(habit.id)}
          color={category.color}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingBottom: 8,
    paddingTop: 4,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 6,
  },
  icon: {
    fontSize: 13,
  },
  label: {
    fontFamily: 'CourierPrime_400Regular',
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
