import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from "../../firebase/config"
import firebase from 'firebase'
import { WhiteBalance } from 'expo-camera'


class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            userFilter: [],
            userText: '',
            search: false
        }
    }
    componentDidMount() {
        db.collection('users').onSnapshot(
            docs => {
                let user = [];
                docs.forEach(doc => {
                    user.push({
                        id: doc.id,
                        data: doc.data()
                    })
                    this.setState({
                        users: user
                    })
                })
            }
        )
    }

    evitarSubmit(event) {
        event.preventDefault()

        this.setState({
            userFilter: this.state.users.filter(users => users.data.userName.toLowerCase().includes(this.state.userText.toLowerCase())),
            search: true,
        })
    }

    changes(event) {
        this.setState({
            userText: event.target.value
        })
    }

    borrarBuscador() {
        this.setState({
            userFilter: '',
            userText: ''
        })
    }

    render() {
        console.log(this.state.users)
        console.log(this.state.userFilter)
        return (
            <View style={style.container}>
                <TextInput style={style.input}
                    placeholder='Search'
                    keyboardType='default'
                    onChangeText={text => this.setState({ userText: text })}
                    value={this.state.userText}
                    onChange={(event) => this.changes(event)}
                />

                {
                    this.state.userText == '' ?
                        <Text style={style.msj}>Fill in the empty field</Text> :
                        <View>
                            <TouchableOpacity onPress={(event) => this.evitarSubmit(event)}>
                                <Text style={style.boton}>SEARCH</Text>
                            </TouchableOpacity>
                        </View>
                }
                {this.state.userFilter.length == 0 && this.state.search == true ?
                    <Text style={style.msj}>No results matching your search</Text> :
                    <View>
                        <FlatList
                            data={this.state.userFilter}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) =>
                                <Text style={style.text} onPress={() => this.props.navigation.navigate('Profile', { email: item.data.email })}>{item.data.userName} </Text>
                            }
                        />

                    </View>

                }

            </View>
        )
    }

}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        color: 'rgb(255,255,255)',
        padding: 15,
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'white',
    },
    input: {
        color: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'rgb(255,255,255)',
        padding: 10,
        margin: 10
    },
    boton: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(180, 37, 130)',
        backgroundColor: 'white',
        margin: 10,
        padding: 10,
        textAlign: 'center',
        color: 'black'
    },
    msj: {
        color: 'red'
    }
});

export default Search 