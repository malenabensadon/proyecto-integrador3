import React, { Component } from 'react';
import { auth, db } from '../../firebase/config';
import { Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { StyleSheet } from 'react-native-web';
import firebase from 'firebase';

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            text: '',
            cantComments: 0,
            postID: '',
            data: {},
            username: ''
            // .data.comments.length
        }
    };

    componentDidMount() {
        this.setState({
            comments: this.props.route.params.data.data.comments,
            postID: this.props.route.params.data.id
            //comments: doc.data().comments
        })

        

    }

    createComment(text) {
        db.collection('users')
            .doc(auth.currentUser.id)
            .then(() => this.setState({
                username: auth.currentUser.userName //arreglar el estado como para que nos traiga la length del array
            }))


        db.collection('posts')
            .doc(this.state.postID) //identificar bien el documento porque trae siempre el mismo
            .update({
                comments: firebase.firestore.FieldValue.arrayUnion({
                    comment: text,
                    username: auth.currentUser.email, //en realidad, mejor traer el username 
                    createdAt: Date.now()
                })
            })
            .then(() => this.setState({
                cantComments: this.state.cantComments + 1 //arreglar el estado como para que nos traiga la length del array
            })
            )
            .catch(e => console.log(e))
    }


    render() {
        console.log(this.props)
        console.log(this.state)
        console.log(this.state.username)
        console.log(auth.currentUser)
        return (
            <View style={style.container}>

            <FlatList 
                data={this.state.comments}
                keyExtractor={onePost => onePost.toString()}
                renderItem={({ item }) => <Text onPress={()=> this.props.navigation.navigate('Profile')}>{item.username}: {item.comment}</Text>}
            />

                <TextInput style={style.input}
                    placeholder='Add a comment'
                    keyboardType='default'
                    //poner propiedad para transformarlo en textArea
                    onChangeText={text => this.setState({ text: text })}
                    value={this.state.text}
                />
                <TouchableOpacity onPress={() => this.createComment(this.state.text)}>
                    <Text style={style.btnLogin}> Comment </Text>
                </TouchableOpacity>
            </View>

        )
    };
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        color: 'rgb(255,255,255)',
        padding: 15,
        justifyContent: 'center',
        textAlign: 'center',
    },
    btnLogin: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(180, 37, 130)',
        backgroundColor: 'rgb(0,0,0)',
        margin: 10,
        padding: 10,
        textAlign: 'center',
        color: 'white'
    },
    input: {
        color: 'rgb(0,0,0)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(0,0,0)',
        backgroundColor: 'rgb(255,255,255)',
        padding: 10,
        margin: 10
    }
});


export default Comments;