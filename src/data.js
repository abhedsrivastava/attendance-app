
export const initialSubjects = [
  { id: '1', name: 'Mathematics', classDays: [1, 3, 5] }, // Monday, Wednesday, Friday
  { id: '2', name: 'Physics', classDays: [2, 4] }, // Tuesday, Thursday
  { id: '3', name: 'Chemistry', classDays: [1, 4] }, // Monday, Thursday
  { id: '4', name: 'Computer Science', classDays: [2, 5] }, // Tuesday, Friday
];

export const getDayName = (dayNumber) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
};

export const initialAttendanceRecords = [
  { id: 'rec1', subjectId: '1', date: '2025-11-01', isPresent: true },
  { id: 'rec2', subjectId: '1', date: '2025-11-02', isPresent: false },
  { id: 'rec3', subjectId: '2', date: '2025-11-01', isPresent: true },
  { id: 'rec4', subjectId: '3', date: '2025-11-01', isPresent: true },
  { id: 'rec5', subjectId: '4', date: '2025-11-01', isPresent: false },
];
