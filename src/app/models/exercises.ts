export interface Exercise {
  id: number;
  name: string;
  categoryId: number;
  color?: string;
}

export interface ExercisesData {
  exercises: Exercise[];
}