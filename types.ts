
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export type ViewState = 'landing' | 'success' | 'justified' | 'chat' | 'admin';

export interface Attendance {
  id: string;
  parentName: string;
  studentName: string;
  entryTime: string;
  photo: string;
}
