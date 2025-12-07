// AddAttendance.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

const AddAttendance = ({ onAddAttendance, subjects }) => {
  const navigation = useNavigation();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPresent, setIsPresent] = useState(true);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleAddRecord = () => {
    if (!selectedSubject) {
      console.log('Error', 'Please select a subject.');
      return;
    }

    const newRecord = {
      subjectId: selectedSubject,
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      isPresent,
    };
    onAddAttendance(newRecord);
    console.log('Success', 'Attendance record added!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
          <Ionicons name="menu" size={30} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Attendance</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject:</Text>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
        >
          {subjects.map((subject) => (
            <Picker.Item key={subject.id} label={subject.name} value={subject.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Status:</Text>
        <TouchableOpacity
          style={[styles.statusButton, isPresent ? styles.presentButton : styles.absentButton]}
          onPress={() => setIsPresent(!isPresent)}
        >
          <Text style={styles.statusButtonText}>{isPresent ? 'Present' : 'Absent'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddRecord}>
        <Text style={styles.addButtonText}>Add Attendance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
    marginLeft: -30, // Adjust for menu icon
  },
  menuIcon: {
    position: 'absolute',
    left: 10,
    top: 0,
    zIndex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  statusButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  presentButton: {
    backgroundColor: '#28a745',
  },
  absentButton: {
    backgroundColor: '#dc3545',
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddAttendance;
