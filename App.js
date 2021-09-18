import 'react-native-get-random-values';
import Realm from 'realm';
import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';
import {createRealmContext} from '@realm.io/react';

const appId = 'realmsync-fdltv';
const appConfig = {id: appId, timeout: 10000};

const TodoSchema = {
    name: 'Todo',
    properties: {
        _id: 'objectId',
        _partition: 'string',
        text: 'string'
    },
    primaryKey: '_id',
};

const AppWrapper = () => {
    console.log("==> AppWrapper");
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const {RealmProvider, useRealm, useQuery} = createRealmContext({schema: [TodoSchema]});

    const login = async () => {
        console.log("Login function")
        const app = new Realm.App(appConfig);
        console.log("=> App not null", app !== undefined);
        const credentials = Realm.Credentials.anonymous();
        setUser(await app.logIn(credentials));
    };

    return user ? <RealmProvider config={{schema: [TodoSchema], sync: {user, partitionValue: username}}}>
        <App useRealm={useRealm} useQuery={useQuery} username={username}/>
    </RealmProvider> : <Login login={login} username={username} setUsername={setUsername}/>;
}

const Login = ({login, username, setUsername}) => {
    return <View>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} />
        <Button title='Login' onPress={login}/>
    </View>
}

const Todos = ({todos, deleteTodo}) => {
    console.log('TODOS ', todos)
    return <ScrollView style={styles.todos}>
        {todos ? todos.map(t => {
            return <View key={t._id} style={styles.todo}>
                <Text style={styles.text}>{t.text}</Text>
                <Button color='red' title='X' onPress={() => deleteTodo(t._id)}/>
            </View>
        }) : <Text style={styles.text}>No Todos...</Text>}
    </ScrollView>
};

const CreateTodo = ({addTodo}) => {
    const [task, setTask] = useState("");

    return <View style={styles.create}>
        <TextInput style={styles.input} value={task} onChangeText={setTask}/>
        <Button title="+" onPress={() => {
            addTodo(task);
            setTask("");
        }}/>
    </View>
};

const App = ({useRealm, useQuery, username}) => {
    const realm = useRealm();
    const {data: todos} = useQuery('Todo');

    const addTodo = (task) => {
        realm.write(() => {
            realm.create("Todo", {_id: new Realm.BSON.ObjectId(), text: task, _partition: username});
        });
    }

    const deleteTodo = (id) => {
        realm.write(() => {
            realm.delete(realm.objectForPrimaryKey("Todo", id));
        });
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
        width: '100%'
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

export default AppWrapper;
