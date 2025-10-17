
import { Client, Project, Platform, ProjectType, ContentForm, ProjectStatus } from './types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Innovate Corp',
    contact: 'contact@innovate.com',
    platform: Platform.Upwork,
  },
  {
    id: 'c2',
    name: 'Social Buzz',
    contact: 'Social Buzz FB Page',
    platform: Platform.Facebook,
  },
  {
    id: 'c3',
    name: 'Gamers Guild',
    contact: 'gamerguild#1234',
    platform: Platform.Discord,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Q3 Brand Campaign Graphics',
    clientId: 'c1',
    type: ProjectType.GraphicDesign,
    form: ContentForm.ShortForm,
    status: ProjectStatus.InProgress,
    budget: 2500,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
    description: 'Create a set of social media graphics for the upcoming Q3 brand awareness campaign.',
    notes: 'Client wants a modern and vibrant feel. Focus on blue and yellow brand colors.',
  },
  {
    id: 'p2',
    name: 'Podcast Episode Edit #25',
    clientId: 'c2',
    type: ProjectType.VideoEditing,
    form: ContentForm.LongForm,
    status: ProjectStatus.Completed,
    budget: 800,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
    description: 'Full video and audio edit for the 45-minute podcast episode #25, including intro/outro and color grading.',
    outputUrl: 'https://example.com/podcast-edit-25',
  },
  {
    id: 'p3',
    name: 'YouTube Shorts Compilation',
    clientId: 'c3',
    type: ProjectType.VideoEditing,
    form: ContentForm.ShortForm,
    status: ProjectStatus.Revisions,
    budget: 1200,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    description: 'Compile 10 short-form videos from recent live stream highlights for YouTube Shorts and TikTok.',
  },
  {
    id: 'p4',
    name: 'New Logo Concept',
    clientId: 'c1',
    type: ProjectType.GraphicDesign,
    form: ContentForm.ShortForm,
    status: ProjectStatus.NotStarted,
    budget: 1500,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().split('T')[0],
    description: 'Develop three initial logo concepts for the new "Innovate Labs" sub-brand.',
  },
];