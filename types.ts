
export enum Screen {
  ONBOARDING = 'ONBOARDING',
  FEED = 'FEED',
  POST = 'POST',
  INTERRUPT = 'INTERRUPT',
  FEEDBACK = 'FEEDBACK',
  PROFILE = 'PROFILE'
}

export enum FeedTab {
  REAL_TIME = 'REAL_TIME',
  OFFICIAL_COMIC = 'OFFICIAL_COMIC'
}

export interface User {
  id: string;
  title: string;
  mantra: string;
  avatarSeed: string;
}

export interface Moment {
  id: string;
  author: string;
  avatar: string;
  location: string;
  contentUrl: string;
  description: string;
  timestamp: string;
  type: 'image' | 'video' | 'audio';
}

export interface FeedbackOption {
  id: string;
  icon: string;
  label: string;
  isAction?: boolean;
}
