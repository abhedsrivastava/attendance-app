import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Calendar } from 'react-native-calendars';

const SubjectDetailScreen = ({ attendanceRecords, onUpdateAttendance }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { subjectId, subjectName } = route.params;

  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAttendanceStatus, setCurrentAttendanceStatus] = useState(null);

  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const filteredAttendance = attendanceRecords.filter(record => record.subjectId === subjectId);
      setSubjectAttendance(filteredAttendance);

      const newMarkedDates = filteredAttendance.reduce((acc, record) => {
        acc[record.date] = {
          selected: true,
          marked: true,
          dotColor: record.isPresent === true ? 'green' : record.isPresent === false ? 'red' : 'yellow',
          selectedColor: record.isPresent === true ? 'green' : record.isPresent === false ? 'red' : 'yellow',
        };
        return acc;
      }, {});
      setMarkedDates(newMarkedDates);
    }, [attendanceRecords, subjectId])
  );

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    const record = subjectAttendance.find(rec => rec.date === day.dateString);
    setCurrentAttendanceStatus(record ? record.isPresent : null);
    setModalVisible(true);
  };

  const handleUpdateStatus = (status) => {
    onUpdateAttendance(subjectId, selectedDate, status);
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
            <Text style={styles.modalHeader}>Update Attendance for {selectedDate}</Text>
            <TouchableOpacity
              style={[styles.statusButton, currentAttendanceStatus === true && styles.statusButtonPresent]}
              onPress={() => handleUpdateStatus(true)}
            >
              <Text style={styles.statusButtonText}>Present</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, currentAttendanceStatus === false && styles.statusButtonAbsent]}
              onPress={() => handleUpdateStatus(false)}
            >
              <Text style={styles.statusButtonText}>Absent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, currentAttendanceStatus === null && styles.statusButtonNoClass]}
              onPress={() => handleUpdateStatus(null)}
            >
              <Text style={styles.statusButtonText}>No Class</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    color: 'white',
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
});

export default SubjectDetailScreen;
