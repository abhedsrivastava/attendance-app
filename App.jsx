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
import SubjectDetailScreen from './src/components/SubjectDetailScreen';
import SettingsScreen from './src/components/SettingsScreen';

import {
  initialSubjects,
  initialAttendanceRecords,
} from './src/data';

const Drawer = createDrawerNavigator();

const SUBJECTS_STORAGE_KEY = '@attendance_app:subjects';
const ATTENDANCE_STORAGE_KEY = '@attendance_app:attendanceRecords';
const ATTENDANCE_LIMITS_STORAGE_KEY = '@attendance_app:attendanceLimits';

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
  const [attendanceLimits, setAttendanceLimits] = useState({ lower: 65, upper: 75 });
  const [isLoading, setIsLoading] = useState(true);

  // Load stored data
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSubjects = await AsyncStorage.getItem(SUBJECTS_STORAGE_KEY);
        const storedAttendance = await AsyncStorage.getItem(ATTENDANCE_STORAGE_KEY);
        const storedLimits = await AsyncStorage.getItem(ATTENDANCE_LIMITS_STORAGE_KEY);

        setSubjects(storedSubjects ? JSON.parse(storedSubjects) : initialSubjects);
        setAttendanceRecords(storedAttendance ? JSON.parse(storedAttendance) : initialAttendanceRecords);
        setAttendanceLimits(storedLimits ? JSON.parse(storedLimits) : { lower: 65, upper: 75 });

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

  // Auto-save attendance limits
  useEffect(() => {
    if (isLoading) return;

    AsyncStorage.setItem(ATTENDANCE_LIMITS_STORAGE_KEY, JSON.stringify(attendanceLimits)).catch(err =>
      console.log('Save attendance limits error:', err)
    );
  }, [attendanceLimits, isLoading]);

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

  const handleUpdateAttendance = (subjectId, date, isPresent, entryId = null) => {
    setAttendanceRecords(prev => {
      if (entryId) {
        // Update existing entry
        return prev.map(record =>
          record.id === entryId ? { ...record, isPresent } : record
        );
      } else {
        // Add new entry
        return [...prev, { id: Date.now().toString(), subjectId, date, isPresent }];
      }
    });
  };

  const handleSaveAttendanceLimits = (lower, upper) => {
    setAttendanceLimits({ lower, upper });
  };

  const handleResetAttendanceForDate = (subjectId, date) => {
    setAttendanceRecords(prev =>
      prev.filter(record => !(record.subjectId === subjectId && record.date === date))
    );
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
              attendanceLimits={attendanceLimits}
            />
          )}
        />

        <Drawer.Screen
          name="SubjectDetail"
          children={() => (
            <SubjectDetailScreen
              attendanceRecords={attendanceRecords}
              onUpdateAttendance={handleUpdateAttendance}
              onResetAttendanceForDate={handleResetAttendanceForDate}
            />
          )}
          options={{ drawerLabel: () => null }} // Hide from drawer menu
        />

        <Drawer.Screen
          name="Settings"
          children={() => (
            <SettingsScreen
              onSaveLimits={handleSaveAttendanceLimits}
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
