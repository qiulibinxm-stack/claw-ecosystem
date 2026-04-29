// 龙虾类型定义

export type Element = 'fire' | 'wood' | 'water' | 'earth' | 'metal';

export type AgentStatus = 'online' | 'offline' | 'busy' | 'idle';

export interface Agent {
  id: string;
  name: string;
  role: string;
  element: Element;
  avatar: string;
  status: AgentStatus;
  description: string;
  tags: string[];
  tokenUsage: number;
  currentTask?: string;
  lastOutput?: string;
  syncedAt?: string;
  source?: string;
}

export interface Module {
  id: string;
  name: string;
  type: 'game' | 'bazi' | 'knowledge' | 'tools' | 'custom';
  description: string;
  icon: string;
  author: string;
  downloads: number;
  rating: number;
  version: string;
  installed: boolean;
  category: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
}

export interface Conversation {
  id: string;
  type: 'private' | 'group';
  name?: string;
  avatar?: string;
  members: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  coverImage?: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
}

export interface Video {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  url: string;
  duration: number;
  views: number;
  likes: number;
  category: string;
  tags: string[];
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  downloads: number;
  rating: number;
  version: string;
  size: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  bio?: string;
  joinedAt: string;
  contribution: number;
  followers: number;
  following: number;
}

export interface Notification {
  id: string;
  type: 'friend' | 'group' | 'like' | 'comment' | 'system';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
}