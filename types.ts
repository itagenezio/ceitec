

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

<<<<<<< HEAD
export type ViewState = 'home' | 'landing' | 'success' | 'justified' | 'chat' | 'admin' | 'create-event' | 'auth';
=======
export type ViewState = 'home' | 'landing' | 'success' | 'justified' | 'chat' | 'admin' | 'create-event';
>>>>>>> fa5d1125bf8d1413d79539a9512f2452965f6739

export interface Attendance {
  id: string;
  parentName: string;
  studentName?: string;
  entryTime: string;
  photo?: string;
  confirmado: boolean;
  justificativa?: string;
  event_id?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  requirements?: string;
  image_url?: string;
  created_at?: string;
}

