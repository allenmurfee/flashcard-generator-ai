export type Flashcard = {
  id: string;
  user_id: string;
  front: string;
  back: string;
  created_at: string;
  updated_at?: string;
  subject?: string;
  tags?: string[];
};

export type User = {
  id: string;
  email: string;
  created_at: string;
};
