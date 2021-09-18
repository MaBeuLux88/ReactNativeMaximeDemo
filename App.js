import 'react-native-get-random-values';
import Realm from 'realm';
import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';

const Todos = ({todos, deleteTodo}) => {
    console.log('TODOS ', todos)
    return <ScrollView style={styles.todos}>
        {todos.map(t => {
            return <View key={t._id} style={styles.todo}>
                <Text style={styles.text}>{t.text}</Text>
                <Button color='red' title='X' onPress={() => deleteTodo(t._id)}/>
            </View>
        })}
    </ScrollView>
};

const CreateTodo = ({addTodo}) => {
    const [task, setTask] = useState("");

    return <View style={styles.create}>
        <TextInput style={styles.input} value={task} onChangeText={t => setTask(t)}/>
        <Button title="+" onPress={() => addTodo(task)}/>
    </View>
};

const App = () => {
    const [todos, setTodos] = useState([])

    const addTodo = (task) => {
        console.log("Adding ", task);
        let array = todos.slice();
        array.push({_id: new Realm.BSON.ObjectID(), text: task, _partition: "Max"});
        setTodos(array);
    }

    const deleteTodo = (id) => {
        let array = todos.slice();
        array = array.filter(t => t._id !== id);
        setTodos(array);
    }

    return <View style={styles.container}>
        <Todos todos={todos} deleteTodo={deleteTodo}/>
        <CreateTodo addTodo={addTodo}/>
    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    todos: {
        marginTop: 20,
        width: '100%',
    },
    todo: {
        flexDirection: "row",
        borderStyle: "solid",
        borderColor: "blue",
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: "space-between",
        margin: 10,
        padding: 10
    },
    create: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
        padding: 10,
        width: '100%'
    },
    text: {
        fontSize: 25
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        width: '90%',
        marginRight: 10,
        padding: 5,
        fontSize: 20
    }
});

export default App;
