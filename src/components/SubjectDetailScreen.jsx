import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Calendar } from 'react-native-calendars';

const SubjectDetailScreen = ({ attendanceRecords, onUpdateAttendance, onResetAttendanceForDate }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { subjectId, subjectName } = route.params;

  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyEntries, setDailyEntries] = useState([]);

  const [markedDates, setMarkedDates] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const filteredAttendance = attendanceRecords.filter(record => record.subjectId === subjectId);


      const newMarkedDates = filteredAttendance.reduce((acc, record) => {
        const day = record.date;
        if (!acc[day]) {
          acc[day] = { dots: [] };
        }

        let dotColor;
        if (record.isPresent === true) {
          dotColor = 'green';
        } else if (record.isPresent === false) {
          dotColor = 'red';
        } else {
          dotColor = 'yellow';
        }

        acc[day].dots.push({ color: dotColor });
        return acc;
      }, {});
      setMarkedDates(newMarkedDates);
    }, [attendanceRecords, subjectId])
  );

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    const recordsForDay = attendanceRecords.filter(
      (rec) => rec.subjectId === subjectId && rec.date === day.dateString
    );
    setDailyEntries(recordsForDay);
    setModalVisible(true);
  };

  const handleUpdateStatus = (status, entryId = null) => {
    onUpdateAttendance(subjectId, selectedDate, status, entryId);
    // After updating, re-filter daily entries to reflect changes
    const updatedRecords = attendanceRecords.filter(
      (rec) => rec.subjectId === subjectId && rec.date === selectedDate
    );
    setDailyEntries(updatedRecords);
  };

  const handleAddEntry = (status) => {
    onUpdateAttendance(subjectId, selectedDate, status);
    // After adding, re-filter daily entries to reflect changes
    const updatedRecords = attendanceRecords.filter(
      (rec) => rec.subjectId === subjectId && rec.date === selectedDate
    );
    setDailyEntries(updatedRecords);
  };

  const handleResetAttendance = () => {
    onResetAttendanceForDate(subjectId, selectedDate);
    setDailyEntries([]); // Clear daily entries in UI immediately
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuIcon}>
          <Ionicons name="arrow-back" size={30} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subjectName} Attendance</Text>
      </View>

      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        markingType={'dot'}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Attendance for {selectedDate}</Text>

            {dailyEntries.length === 0 ? (
              <Text style={styles.noEntriesText}>No entries for this date.</Text>
            ) : (
              dailyEntries.map((entry) => (
                <View key={entry.id} style={styles.entryContainer}>
                  <Text style={styles.entryText}>
                    Status: {entry.isPresent === true ? 'Present' : entry.isPresent === false ? 'Absent' : 'No Class'}
                  </Text>
                  <View style={styles.entryButtons}>
                    <TouchableOpacity
                      style={[styles.statusButton, styles.statusButtonPresent, entry.isPresent === true && styles.statusButtonSelected]}
                      onPress={() => handleUpdateStatus(true, entry.id)}
                    >
                      <Text style={styles.statusButtonText}>P</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.statusButton, styles.statusButtonAbsent, entry.isPresent === false && styles.statusButtonSelected]}
                      onPress={() => handleUpdateStatus(false, entry.id)}
                    >
                      <Text style={styles.statusButtonText}>A</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.statusButton, styles.statusButtonNoClass, entry.isPresent === null && styles.statusButtonSelected]}
                      onPress={() => handleUpdateStatus(null, entry.id)}
                    >
                      <Text style={styles.statusButtonText}>NC</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            <Text style={styles.modalSubHeader}>Add New Entry:</Text>
            <TouchableOpacity
              style={[styles.statusButton, styles.statusButtonPresent]}
              onPress={() => handleAddEntry(true)}
            >
              <Text style={styles.statusButtonText}>Add Present</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, styles.statusButtonAbsent]}
              onPress={() => handleAddEntry(false)}
            >
              <Text style={styles.statusButtonText}>Add Absent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, styles.statusButtonNoClass]}
              onPress={() => handleAddEntry(null)}
            >
              <Text style={styles.statusButtonText}>Add No Class</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusButton, styles.resetButton]}
              onPress={() => handleResetAttendance()}
            >
              <Text style={styles.statusButtonText}>Reset All for This Day</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
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
  },
  menuIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusButton: {
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusButtonPresent: {
    backgroundColor: 'green',
  },
  statusButtonAbsent: {
    backgroundColor: 'red',
  },
  statusButtonNoClass: {
    backgroundColor: 'yellow',
  },
  statusButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#ffc107', // A warning/reset color
    marginTop: 10,
  },
  noEntriesText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  entryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  entryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  entryButtons: {
    flexDirection: 'row',
  },
  statusButtonSelected: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  modalSubHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
});

export default SubjectDetailScreen;
