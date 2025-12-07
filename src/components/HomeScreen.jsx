// HomeScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = ({ subjects, attendanceRecords, onUpdateAttendance }) => {
  const navigation = useNavigation();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExtraSubject, setSelectedExtraSubject] = useState(subjects[0]?.id || '');
  const [isExtraPresent, setIsExtraPresent] = useState(true);
  const [extraClassModalVisible, setExtraClassModalVisible] = useState(false);

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const todayDay = today.getDay();

  const todaysSubjects = subjects.filter((subject) => subject.classDays.includes(todayDay));

  const getTodaysAttendance = (subjectId) => {
    return attendanceRecords.find(
      (record) => record.subjectId === subjectId && record.date === todayString
    );
  };

  const handleSubjectPress = (subject) => {
    setSelectedSubject(subject);
    setModalVisible(true);
  };

  const handleSubjectLongPress = (subject) => {
    setSelectedSubject(subject);
    setModalVisible(true);
  };

  const handleAttendanceOption = (isPresent) => {
    if (!selectedSubject) return;

    onUpdateAttendance(selectedSubject.id, todayString, isPresent ?? false);

    console.log(
      'Attendance Updated',
      `${selectedSubject.name} marked as ${isPresent === null ? 'No Class' : isPresent ? 'Present' : 'Absent'}`
    );

    setModalVisible(false);
    setSelectedSubject(null);
  };

  const handleExtraClassAttendance = () => {
    if (!selectedExtraSubject) {
      console.log('Error', 'Please select a subject for the extra class.');
      return;
    }

    const selectedSubjectObj = subjects.find((subject) => subject.id === selectedExtraSubject);

    onUpdateAttendance(selectedExtraSubject, todayString, isExtraPresent);

    console.log(
      'Extra Class Recorded',
      `${selectedSubjectObj?.name ?? 'Subject'} marked as ${isExtraPresent ? 'Present' : 'Absent'} for extra class`
    );

    if (subjects.length > 0) {
      setSelectedExtraSubject(subjects[0].id);
    }
    setIsExtraPresent(true);
  };

  const getAttendanceStatus = (subjectId) => {
    const attendance = getTodaysAttendance(subjectId);
    if (!attendance) return 'not-recorded';
    return attendance.isPresent ? 'present' : 'absent';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#28a745';
      case 'absent':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'absent':
        return 'Absent';
      default:
        return 'Not Recorded';
    }
  };

  const renderSubject = ({ item }) => {
    const status = getAttendanceStatus(item.id);
    const statusColor = getStatusColor(status);

    return (
      <TouchableOpacity
        style={[styles.subjectCard, { borderLeftColor: statusColor }]}
        onPress={() => handleSubjectPress(item)}
        onLongPress={() => handleSubjectLongPress(item)}
        delayLongPress={500}
      >
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectName}>{item.name}</Text>
          <Text style={[styles.attendanceStatus, { color: statusColor }]}>{getStatusText(status)}</Text>
        </View>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>Today</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
          <Ionicons name="menu" size={30} color="#333" />
        </TouchableOpacity>

        <View>
          <Text style={styles.dateText}>
          {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
        </View>
      </View>

      {/* Today's subjects */}
      {todaysSubjects.length === 0 ? (
        <View style={styles.noClassesContainer}>
          <Text style={styles.noClassesText}>No classes scheduled for today</Text>
          <Text style={styles.noClassesSubtext}>Enjoy your day off!</Text>
        </View>
      ) : (
        <FlatList data={todaysSubjects} keyExtractor={(item) => item.id} renderItem={renderSubject} contentContainerStyle={styles.listContent} />
      )}



      <TouchableOpacity style={styles.extraClassButton} onPress={() => setExtraClassModalVisible(true)}>
        <Text style={styles.extraClassButtonText}>Record Extra Class</Text>
      </TouchableOpacity>

      {/* Extra Class Modal */}
      <Modal visible={extraClassModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Record Extra Class</Text>
            <Text style={styles.label}>Subject:</Text>
            <Picker selectedValue={selectedExtraSubject} onValueChange={(val) => setSelectedExtraSubject(val)} style={styles.picker}>
              {subjects.map((subject) => (
                <Picker.Item key={subject.id} label={subject.name} value={subject.id} />
              ))}
            </Picker>

            <Text style={styles.label}>Status:</Text>
            <TouchableOpacity
              style={[styles.statusButton, isExtraPresent ? styles.presentButton : styles.absentButton]}
              onPress={() => setIsExtraPresent(!isExtraPresent)}
            >
              <Text style={styles.statusButtonText}>{isExtraPresent ? 'Present' : 'Absent'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleExtraClassAttendance}>
              <Text style={styles.addButtonText}>Add Extra Class Record</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setExtraClassModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Subject Attendance Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedSubject?.name}</Text>
            <Text style={styles.modalSubtitle}>Select Attendance Status</Text>

            <TouchableOpacity style={[styles.optionButton, styles.presentOption]} onPress={() => handleAttendanceOption(true)}>
              <Text style={styles.optionText}>Present</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionButton, styles.absentOption]} onPress={() => handleAttendanceOption(false)}>
              <Text style={styles.optionText}>Absent</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionButton, styles.noClassOption]} onPress={() => handleAttendanceOption(null)}>
              <Text style={styles.optionText}>No Class</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingLeft: 60, // Add left padding to accommodate menu icon
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuIcon: {
    position: 'absolute',
    left: 10,
    top: 20, // Adjust top to align with header content
    zIndex: 2,
  },
  dateText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  dayText: { fontSize: 16, color: '#666' },

  noClassesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noClassesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 10,
  },
  noClassesSubtext: {
    fontSize: 16,
    color: '#6c757d',
  },

  listContent: { padding: 20 },

  extraClassContainer: { backgroundColor: 'white', padding: 20 },
  extraClassHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  label: { fontSize: 16, marginBottom: 5, color: '#555' },

  picker: {
    height: 50,
    marginBottom: 10,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },

  statusButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 10,
  },
  presentButton: { backgroundColor: '#28a745' },
  absentButton: { backgroundColor: '#dc3545' },
  statusButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  subjectCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 6,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  attendanceStatus: { fontSize: 14, fontWeight: '600' },

  timeBadge: { backgroundColor: '#007bff', padding: 8, borderRadius: 16 },
  timeText: { color: '#fff', fontSize: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },

  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },

  optionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },

  presentOption: { backgroundColor: '#28a745' },
  absentOption: { backgroundColor: '#dc3545' },
  noClassOption: { backgroundColor: '#6c757d' },
  optionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  cancelButton: { padding: 12, alignItems: 'center' },
  cancelText: { color: '#007bff', fontWeight: 'bold', fontSize: 16 },

  extraClassButton: {
    backgroundColor: '#17a2b8',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    margin: 20,
  },
  extraClassButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
