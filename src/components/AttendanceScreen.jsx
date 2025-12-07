import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

const AttendanceScreen = ({ attendanceRecords, subjects, attendanceLimits }) => {
  const navigation = useNavigation();
  const subjectsAttendance = subjects.map((subject) => {
    const records = attendanceRecords.filter((record) => record.subjectId === subject.id);
    const present = records.filter((record) => record.isPresent).length;
    const total = records.length;
    const absent = total - present;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : '0.00';

    return {
      subject,
      present,
      absent,
      total,
      percentage,
    };
  });

  const getPercentageColor = (percentage) => {
    if (percentage >= attendanceLimits.upper) {
      return 'green';
    } else if (percentage >= attendanceLimits.lower) {
      return 'orange';
    } else {
      return 'red';
    }
  };

  const renderSubjectAttendance = ({ item }) => (
    <TouchableOpacity
      style={styles.subjectCard}
      onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.subject.id, subjectName: item.subject.name })}
    >
      <Text style={styles.subjectName}>
        {item.subject.name}: {item.present}/{item.total}
      </Text>
      <Text style={[styles.percentageText, { color: getPercentageColor(parseFloat(item.percentage)) }]}>{item.percentage}%</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
          <Ionicons name="menu" size={30} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance Overview</Text>
      </View>
      <FlatList
        data={subjectsAttendance}
        keyExtractor={(item) => item.subject.id}
        renderItem={renderSubjectAttendance}
        contentContainerStyle={styles.listContent}
      />
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
  },
  menuIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  subjectCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    flex: 1,
  },
  attendanceText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 5,
  },
});

export default AttendanceScreen;
