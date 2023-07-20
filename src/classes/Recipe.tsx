export default interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  ingredients: [];
  instructions: [];
  glass: string;
  garnish: string;
  category: string | null;
  alcohol: string | null;
}
