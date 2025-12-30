export interface Student {
  id: string;
  name: string;
  preferences: string[];
}

export interface Group {
  id: string;
  students: Student[];
  commonPreferences: string[];
}
