import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from "../../firebase/config"
import firebase from 'firebase'
import { WhiteBalance } from 'expo-camera'
import { EvilIcons } from '@expo/vector-icons'; 


class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            userText: ''
        }
    }

    buscar(searchValue) {
        db.collection('users').onSnapshot(
            docs => {
                let user = [];
                docs.forEach(doc => {
                    const userInfo = doc.data();
                    if (userInfo.userName.toLowerCase().startsWith(searchValue)) {
                        user.push({
                            id: doc.id,
                            data: doc.data()
                        })
                    }
                })
                this.setState({
                    userText: searchValue,
                    users: user,
                })
            }
        )
    }

    onChange(event) {
        event.preventDefault()
        this.buscar(event.target.value)
    }

    borrarBuscador() {
        this.buscar('')
        this.setState({
            userText: ''
        })
    }

    render() {
        return (
            <View style={style.container}>
                <TextInput style={style.input}
                
                    placeholder='Search'
                    keyboardType='default'
                    onChange={(event) => this.onChange(event)}
                    value={this.state.userText}
                />
                { this.state.userText !== '' ? (
                   <>
                        {this.state.users.length === 0 ?
                            <Text style={style.msj}>No results matching your search</Text> :
                            <FlatList
                                data={this.state.users}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) =>
                                    <Text style={style.text} onPress={() => this.props.navigation.navigate('SearchProfile', { email: item.data.owner })}>{item.data.userName} </Text>
                                }
                            />
                        }
                   </>
                ) : null}
            </View>
        )
    }

}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        color: 'rgb(255,255,255)',
        padding: 15,
        justifyContent: 'center',
    },
    text: {
        color: 'rgb(84, 84, 84)',
        padding: 10,
        fontWeight: 'bold',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(216, 216, 216)',
    },
    input: {
        color: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        backgroundColor: 'rgb(255,255,255)',
        padding: 10,
        margin: 10
    },
    boton: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(180, 37, 130)',
        backgroundColor: 'black',
        margin: 10,
        padding: 10,
        textAlign: 'center',
        color: 'white'
    },
    msj: {
        color: 'red'
    }
});

export default Search 