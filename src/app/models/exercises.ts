export interface Exercise {
  id: number;
  name: string;
  categoryId: number;
  color?: string;
  repeticiones?: string;
}

export interface ExercisesData {
  exercises: Exercise[];
}