import SQLite, {SQLiteDatabase, Transaction} from 'react-native-sqlite-storage';

const database_name = 'recipes.db';
const database_version = '1.0';
const database_displayname = 'Recipes SQLite Database';
const database_size = 200000;

import Recipe from '../classes/Recipe';

export default class DBHelper {
  db: SQLiteDatabase | null = null;

  initDB(): Promise<SQLiteDatabase> {
    return new Promise((resolve, reject) => {
      SQLite.openDatabase(
        {
          name: database_name,
          version: database_version,
          displayName: database_displayname,
          size: database_size,
        },
        (db: SQLiteDatabase) => {
          this.db = db;
          this.createTable()
            .then(() => resolve(this.db as SQLiteDatabase))
            .catch(error => reject(error));
        },
        (error: Error) => {
          console.log(`DB Error: ${error}`);
          reject(error);
        },
      );
    });
  }

  createTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const query = `CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        image TEXT,
        ingredients TEXT,
        instructions TEXT,
        glass TEXT,
        garnish TEXT,
        category TEXT,
        alcohol TEXT
      );`;

      this.db.transaction((tx: Transaction) => {
        tx.executeSql(
          query,
          [],
          () => {
            console.log('Table created');
            resolve();
          },
          (_, error: Error) => {
            console.log(`Table not created: ${error.message}`);
            reject(error);
          },
        );
      });
    });
  }

  insertRecipe(
    id: number,
    title: string,
    image: string,
    ingredients: string,
    instructions: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const query = `INSERT INTO recipes (id, title, description, image, ingredients, instructions, glass, garnish, category, alcohol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

      this.db.transaction((tx: Transaction) => {
        tx.executeSql(
          query,
          [id, title, image, ingredients, instructions],
          () => {
            console.log('Recipe inserted');
            resolve();
          },
          (_, error: Error) => {
            console.log(`Recipe not inserted: ${error.message}`);
            reject(error);
          },
        );
      });
    });
  }

  getAllRecipes(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not initialized');
        return;
      }

      const query = `SELECT * FROM recipes;`;

      this.db.transaction((tx: Transaction) => {
        tx.executeSql(
          query,
          [],
          (_, result) => {
            const len = result.rows.length;
            const recipes: Recipe[] = [];
            for (let i = 0; i < len; i++) {
              const row = result.rows.item(i);
              const {
                id,
                title,
                description,
                image,
                ingredients,
                instructions,
                glass,
                garnish,
                category,
                alcohol,
              } = row;
              recipes.push({
                id,
                title,
                description,
                image,
                ingredients,
                instructions,
                glass,
                garnish,
                category,
                alcohol,
              });
            }
            resolve(recipes);
          },
          (_, error: Error) => {
            console.log(`Recipes not retrieved: ${error.message}`);
            reject(error);
          },
        );
      });
    });
  }

  // Add other functions for managing the database such as insert, update, delete, and select here
}
