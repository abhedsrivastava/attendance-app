import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ATTENDANCE_LIMITS_STORAGE_KEY = '@attendance_app:attendanceLimits';

const SettingsScreen = ({ onSaveLimits }) => {
  const navigation = useNavigation();
  const [lowerLimit, setLowerLimit] = useState('65');
  const [upperLimit, setUpperLimit] = useState('75');

  useEffect(() => {
    const loadLimits = async () => {
      try {
        const storedLimits = await AsyncStorage.getItem(ATTENDANCE_LIMITS_STORAGE_KEY);
        if (storedLimits) {
          const { lower, upper } = JSON.parse(storedLimits);
          setLowerLimit(String(lower));
          setUpperLimit(String(upper));
        }
      } catch (error) {
        console.error('Failed to load attendance limits:', error);
      }
    };
    loadLimits();
  }, []);

  const handleSave = async () => {
    const parsedLower = parseInt(lowerLimit, 10);
    const parsedUpper = parseInt(upperLimit, 10);

    if (isNaN(parsedLower) || isNaN(parsedUpper) || parsedLower < 0 || parsedUpper > 100 || parsedLower >= parsedUpper) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for attendance limits. Lower limit must be less than upper limit, and both must be between 0 and 100.');
      return;
    }

    try {
      const limitsToSave = { lower: parsedLower, upper: parsedUpper };
      await AsyncStorage.setItem(ATTENDANCE_LIMITS_STORAGE_KEY, JSON.stringify(limitsToSave));
      onSaveLimits(parsedLower, parsedUpper);
      Alert.alert('Success', 'Attendance limits saved successfully!');
    } catch (error) {
      console.error('Failed to save attendance limits:', error);
      Alert.alert('Error', 'Failed to save attendance limits.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
          <Ionicons name="menu" size={30} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Lower Attendance Limit (%)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={lowerLimit}
          onChangeText={setLowerLimit}
          placeholder="e.g., 65"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Upper Attendance Limit (%)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={upperLimit}
          onChangeText={setUpperLimit}
          placeholder="e.g., 75"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Limits</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    position: 'relative',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
    marginRight: 30, // To balance the menu icon on the left
  },
  menuIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
