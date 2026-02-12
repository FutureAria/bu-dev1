// src/types.ts (새 파일)
export type User = { 
  id: number; name: string, email?: string 
};

export type Post = { 
  id: number; 
  title: string; 
  content: string; 
  category: Category;
  author_id: number;
  author_name: string;
  created_at: string;
  views: number;
};


export type Category = 'All' | 'Free' | 'Question' | 'Review';
export type View = 'List' | 'Detail' | 'Create';

// dummy data for testing
export const dummyUser: User = {
  id: 1,
  name: '테스트유저',
  email: 'test@example.com'
};


