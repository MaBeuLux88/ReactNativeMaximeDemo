import 'react-native-get-random-values';
import Realm from 'realm';
import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {createRealmContext} from '@realm.io/react';

const appId = 'realmsync-fdltv';
const appConfig = {id: appId, timeout: 10000};

const TodoSchema = {
    name: 'Todo',
    primaryKey: '_id',
    properties: {
        _id: 'objectId',
        text: 'string'
    }
};

const AppWrapper = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const {RealmProvider, useRealm, useQuery} = createRealmContext({schema: [TodoSchema]});

    const login = async () => {
        const app = new Realm.App(appConfig);
        const credentials = Realm.Credentials.anonymous();
        setUser(await app.logIn(credentials));
    };

    const logout = () => {
        setUser(null);
        setUsername('');
    }

    return user ? <RealmProvider config={{schema: [TodoSchema], sync: {user, partitionValue: username}}}>
        <App useRealm={useRealm} useQuery={useQuery} username={username} logout={logout}/>
    </RealmProvider> : <Login login={login} setUsername={setUsername}/>;
}

const Login = ({login, setUsername}) => {
    return <View style={s.login}>
        <TextInput style={s.inputLogin} onChangeText={setUsername}/>
        <Button title='Login' onPress={login}/>
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

const App = ({useRealm, useQuery, username, logout}) => {
    const realm = useRealm();
    const {data: todos} = useQuery('Todo');

    const addTodo = (task) => {
        realm.write(() => {
            realm.create('Todo', {_id: new Realm.BSON.ObjectId(), text: task});
        });
    }

    const deleteTodo = (id) => {
        realm.write(() => {
            realm.delete(realm.objectForPrimaryKey('Todo', id));
        });
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
