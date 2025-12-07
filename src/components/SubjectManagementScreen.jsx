// SubjectManagementScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getDayName } from '../data';

const SubjectManagementScreen = ({ subjects, onAddSubject, onRemoveSubject, onUpdateSubject }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentSubject(null);
    setNewSubjectName('');
    setSelectedDays([]);
    setModalVisible(true);
  };

  const openEditModal = (subject) => {
    setIsEditing(true);
    setCurrentSubject(subject);
    setNewSubjectName(subject.name);
    setSelectedDays(subject.classDays || []);
    setModalVisible(true);
  };

  const handleSaveSubject = () => {
    if (!newSubjectName.trim()) {
      console.log('Error', 'Please enter a subject name.');
      return;
    }

    if (selectedDays.length === 0) {
      console.log('Error', 'Please select at least one class day.');
      return;
    }

    if (isEditing && currentSubject) {
      const updatedSubject = {
        ...currentSubject,
        name: newSubjectName.trim(),
        classDays: [...selectedDays],
      };
      onUpdateSubject(updatedSubject);
      console.log('Success', 'Subject updated successfully!');
    } else {
      const newSubject = {
        id: Date.now().toString(),
        name: newSubjectName.trim(),
        classDays: [...selectedDays],
      };
      onAddSubject(newSubject);
      console.log('Success', 'Subject added successfully!');
    }

    setNewSubjectName('');
    setSelectedDays([]);
    setModalVisible(false);
  };

  const confirmRemoveSubject = (subjectId) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this subject? This will also remove all associated attendance records.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (typeof onRemoveSubject === 'function') {
              onRemoveSubject(subjectId);
            }
          },
        },
      ]
    );
  };

  const toggleDaySelection = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const renderSubject = ({ item }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{item.name}</Text>
        <Text style={styles.classDays}>
          Class days: {item.classDays?.map(day => getDayName(day)).join(', ')}
        </Text>
      </View>
      <View style={styles.subjectActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => confirmRemoveSubject(item.id)}
        >
          <Text style={styles.actionButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
          <Ionicons name="menu" size={30} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subject Management</Text>
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={renderSubject}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No subjects added yet.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={openAddModal}
      >
        <Text style={styles.addButtonText}>Add New Subject</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              {isEditing ? 'Edit Subject' : 'Add New Subject'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Subject Name"
              value={newSubjectName}
              onChangeText={setNewSubjectName}
            />

            <Text style={styles.label}>Select Class Days:</Text>
            <View style={styles.daysContainer}>
              {[0, 1, 2, 3, 4, 5, 6].map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonSelected
                  ]}
                  onPress={() => toggleDaySelection(day)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    selectedDays.includes(day) && styles.dayButtonTextSelected
                  ]}>
                    {getDayName(day).substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addModalButton]}
                onPress={handleSaveSubject}
              >
                <Text style={styles.modalButtonText}>
                  {isEditing ? 'Save Changes' : 'Add Subject'}
                </Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#f5f5f5',
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
    marginLeft: -30, // Adjust for menu icon
  },
  menuIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subjectCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  classDays: {
    fontSize: 14,
    color: '#666',
  },
  subjectActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#ffc107',
  },
  removeButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50,
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
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    width: '14%',
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  dayButtonSelected: {
    backgroundColor: '#007bff',
  },
  dayButtonText: {
    fontSize: 12,
    color: '#333',
  },
  dayButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  addModalButton: {
    backgroundColor: '#007bff',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SubjectManagementScreen;
