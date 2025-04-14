export type Flashcard = {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
  subject?: string;
  tags?: string[];
};

export type User = {
  id: string;
  email: string;
  created_at: string;
};
