import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, TextInput, Button, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import Groceries from './Groceries';

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [groceries, setGroceries] = useState([]);

  const db = SQLite.openDatabaseSync('grocerydb');

  const initialize = async (db) => {
    try {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS grocery (id INTEGER PRIMARY KEY NOT NULL, product TEXT, amount TEXT);`);
      // Todo: update the course list
    } catch (error) {
      console.error('Could not open database', error);
    }
  }

  return (
    <SQLiteProvider
      databaseName='grocerydb.db'
      onInit={initialize}
      onError={error => console.error('Could not open database', error)}
    >
      <Groceries />
    </SQLiteProvider>
  );
}

