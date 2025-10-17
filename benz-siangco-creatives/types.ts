
export enum Platform {
  Upwork = 'Upwork',
  OnlineJobsPH = 'OnlineJobs.ph',
  Facebook = 'Facebook',
  Discord = 'Discord',
  Other = 'Other',
}

export enum ProjectType {
  GraphicDesign = 'Graphic Design',
  VideoEditing = 'Video Editing',
}

export enum ContentForm {
  LongForm = 'Long Form',
  ShortForm = 'Short Form',
}

export enum ProjectStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Revisions = 'Revisions',
  Completed = 'Completed',
  OnHold = 'On Hold',
  Cancelled = 'Cancelled',
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  platform: Platform;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  type: ProjectType;
  form: ContentForm;
  status: ProjectStatus;
  budget: number;
  dueDate: string; // YYYY-MM-DD
  description: string;
  outputUrl?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}
