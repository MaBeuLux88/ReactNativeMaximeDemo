import 'react-native-get-random-values';
import Realm from 'realm';
import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';

const AppWrapper = () => {
    const [username, setUsername] = useState('');

    const login = async (name) => {
        setUsername(name);
    };

    const logout = () => {
        setUsername('');
    }

    return username ? <App username={username} logout={logout}/>
        : <Login login={login} setUsername={setUsername}/>;
}

const Login = ({login}) => {
    const [name, setName] = useState();

    return <View style={s.login}>
        <TextInput style={s.inputLogin} value={name} onChangeText={setName}/>
        <Button title='Login' onPress={() => login(name)}/>
    </View>
}

const Header = ({username, logout}) => {
    return <View style={s.header}>
        <Text style={s.username}>{username}'s Todos</Text>
        <View style={s.logout}>
            <Button title='Logout' color='orange' onPress={logout}/>
        </View>
    </View>
}

const Todos = ({todos, deleteTodo}) => {
    return <View style={s.todos}>
        <ScrollView>
            {todos.map(t => {
                return <View key={t._id} style={s.todo}>
                    <Text style={s.text}>{t.text}</Text>
                    <Button color='red' title='X' onPress={() => deleteTodo(t._id)}/>
                </View>
            })}
        </ScrollView>
    </View>
};

const CreateTodo = ({addTodo}) => {
    const [task, setTask] = useState('');

    return <View style={s.create}>
        <TextInput style={s.inputTask} value={task} onChangeText={setTask}/>
        <Button title='+' onPress={() => {
            addTodo(task);
            setTask('');
        }}/>
    </View>
};

const App = ({username, logout}) => {
    const [todos, setTodos] = useState([])

    const addTodo = (task) => {
        let array = todos.slice();
        array.push({_id: new Realm.BSON.ObjectID(), text: task});
        setTodos(array);
    }

    const deleteTodo = (id) => {
        let array = todos.slice();
        array = array.filter(t => t._id !== id);
        setTodos(array);
    }

    return <View style={s.container}>
        <Header username={username} logout={logout}/>
        <Todos todos={todos} deleteTodo={deleteTodo}/>
        <CreateTodo addTodo={addTodo}/>
    </View>
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 50,
        maxHeight: 50,
        backgroundColor: '#13AA52'
    },
    username: {
        fontSize: 25,
        color: 'white'
    },
    logout: {
        position: 'absolute',
        right: 5
    },
    todos: {
        flex: 13,
        width: '100%',
        backgroundColor: '#13AA52'
    },
    todo: {
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: 'space-between',
        margin: 5,
        padding: 10,
        backgroundColor: 'lightblue',
        elevation: 4
    },
    create: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        width: '100%',
        minHeight: 60,
        maxHeight: 60,
        backgroundColor: '#13AA52'
    },
    text: {
        fontSize: 25,
        maxWidth: '92%'
    },
    inputTask: {
        borderWidth: 1,
        borderRadius: 5,
        width: '90%',
        marginRight: 10,
        padding: 5,
        fontSize: 20,
        backgroundColor: '#fff'
    },
    inputLogin: {
        borderWidth: 1,
        borderRadius: 5,
        width: '70%',
        marginRight: 10,
        padding: 5,
        fontSize: 20,
        backgroundColor: '#fff'
    },
    login: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#13AA52'
    }
});

export default AppWrapper;
