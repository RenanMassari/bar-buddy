import SQLite, {SQLiteDatabase, Transaction} from 'react-native-sqlite-storage';

const database_name = 'recipes.db';
const database_version = '1.0';
const database_displayname = 'Recipes SQLite Database';
const database_size = 200000;

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

  // Add other functions for managing the database such as insert, update, delete, and select here
}
