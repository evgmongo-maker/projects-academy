export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  likes: number;
  dislikes: number;
}

export interface ProjectComment {
  id: number;
  projectId: number;
  text: string;
  author: string;
  createdAt: string;
}
