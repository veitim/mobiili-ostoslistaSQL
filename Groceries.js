import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Text, Button, View, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

export default function Groceries() {

    const [product, setProduct] = useState('');
    const [amount, setAmount] = useState('');
    const [groceries, setGroceries] = useState([]);

  const db = SQLite.useSQLiteContext();

  const initialize = async (db) => {
    try {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS grocery (id INTEGER PRIMARY KEY NOT NULL, product TEXT, amount TEXT);`);
      // Todo: update the course list
    } catch (error) {
      console.error('Could not open database', error);
    }
  }
  
  useEffect(() => { updateList() }, []);

  const saveItem = async () => {
    try {
      await db.runAsync('INSERT INTO grocery VALUES (?, ?, ?)', null, product, amount);
      // Todo: update the course list
      updateList();
    } catch (error) {
      console.error('Could not add item', error);
    }
  };

  const updateList = async () => {
    try {
      const list = await db.getAllAsync('SELECT * from grocery');
      setGroceries(list);
    } catch (error) {
      console.error('Could not get items', error);
    }
  }

  const deleteItem = async (id) => {
    console.log('deleteItem')
    try {
      await db.runAsync('DELETE FROM grocery WHERE id=?', id);
      await updateList();
    }
    catch (error) {
      console.error('Could not delete item', error);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder='Product' 
        onChangeText={product => setProduct(product)}
        value={product}/> 
      <TextInput 
        style={styles.input}
        placeholder='Amount' 
        keyboardType='numeric' 
        onChangeText={amount => setAmount(amount)}
        value={amount}/>
      <View style={styles.buttons}>
        <Button onPress={saveItem} title="Save" />
      </View>
      <View style= {styles.list}>
        <Text style= {styles.header}>Shopping list</Text>
        <FlatList
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) =>
            <View>
                <Text>
                    {item.product}, 
                    {item.amount} 
                    <Text style={{ color: '#0000ff' }} 
                        onPress={() => deleteItem(item.id)}>   Bought
                    </Text>
                </Text>
            </View>}
            data={groceries}
            />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 70,
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttons: {
      paddingTop: 10,
      paddingBottom: 30,
      alignItems: 'center',
      flexDirection: 'row',
    },
    list: {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    input: {
      width: 200, 
      borderColor: 'gray', 
      borderWidth: 1,
    },
    header: {
      fontSize: 14,
    }
  });
  
