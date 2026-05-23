export interface Ticket {
  id: number;
  category: string;
  tags: string[];
  question: string;
  answer: string;
  related?: number[];
}

export interface PracticeSection {
  id: string;
  title: string;
  content: string;
}

export interface PracticeCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  sections: PracticeSection[];
}
