// App.jsx
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';

import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import AsyncStorage from '@react-native-async-storage/async-storage';

import AttendanceScreen from './src/components/AttendanceScreen';
import HomeScreen from './src/components/HomeScreen';
import SubjectManagementScreen from './src/components/SubjectManagementScreen';
import AddAttendance from './src/components/AddAttendance';

import {
  initialSubjects,
  initialAttendanceRecords,
} from './src/data';

const Drawer = createDrawerNavigator();

const SUBJECTS_STORAGE_KEY = '@attendance_app:subjects';
const ATTENDANCE_STORAGE_KEY = '@attendance_app:attendanceRecords';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        translucent={false}
      />
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [subjects, setSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored data
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSubjects = await AsyncStorage.getItem(SUBJECTS_STORAGE_KEY);
        const storedAttendance = await AsyncStorage.getItem(ATTENDANCE_STORAGE_KEY);

        setSubjects(storedSubjects ? JSON.parse(storedSubjects) : initialSubjects);
        setAttendanceRecords(storedAttendance ? JSON.parse(storedAttendance) : initialAttendanceRecords);

      } catch (error) {
        console.error('Failed to load data:', error);
        setSubjects(initialSubjects);
        setAttendanceRecords(initialAttendanceRecords);

      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-save subjects
  useEffect(() => {
    if (isLoading) return;

    AsyncStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects)).catch(err =>
      console.log('Save subjects error:', err)
    );
  }, [subjects, isLoading]);

  // Auto-save attendance
  useEffect(() => {
    if (isLoading) return;

    AsyncStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendanceRecords)).catch(err =>
      console.log('Save attendance error:', err)
    );
  }, [attendanceRecords, isLoading]);

  // CRUD handlers
  const handleAddSubject = (newSubject) => {
    setSubjects(prev => [...prev, newSubject]);
  };

  const handleRemoveSubject = (subjectId) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    setAttendanceRecords(prev => prev.filter(a => a.subjectId !== subjectId));
  };

  const handleEditSubject = (updated) => {
    setSubjects(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  const handleUpdateAttendance = (subjectId, date, isPresent) => {
    setAttendanceRecords(prev => {
      const idx = prev.findIndex(r => r.subjectId === subjectId && r.date === date);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { subjectId, date, isPresent };
        return updated;
      }
      return [...prev, { subjectId, date, isPresent }];
    });
  };

  const handleAddAttendance = (record) => {
    setAttendanceRecords(prev => [...prev, record]);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: '#007bff',
          drawerInactiveTintColor: 'gray',
        }}
        drawerContent={CustomDrawerContent}
      >
        <Drawer.Screen
          name="Home"
          children={() => (
            <HomeScreen
              subjects={subjects}
              attendanceRecords={attendanceRecords}
              onUpdateAttendance={handleUpdateAttendance}
            />
          )}
        />

        <Drawer.Screen
          name="Subjects"
          children={() => (
            <SubjectManagementScreen
              subjects={subjects}
              onAddSubject={handleAddSubject}
              onRemoveSubject={handleRemoveSubject}
              onEditSubject={handleEditSubject}
            />
          )}
        />

        <Drawer.Screen
          name="Overview"
          children={() => (
            <AttendanceScreen
              attendanceRecords={attendanceRecords}
              subjects={subjects}
            />
          )}
        />

        <Drawer.Screen
          name="Add Record"
          children={() => (
            <AddAttendance
              onAddAttendance={handleAddAttendance}
              subjects={subjects}
            />
          )}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
