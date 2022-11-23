import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { StyleSheet } from 'react-native-web';

import firebase from 'firebase';
import { auth, db } from '../../firebase/config';

import { FontAwesome } from '@expo/vector-icons';

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            text: '',
            email: '',
            username: '',
            owner: '',
            profilePicture: ''
        }
    };

    componentDidMount() {
        this.getComments();
        this.getUserInfo();
    }

    getComments() {
        db.collection('posts').doc(this.props.route.params.postId).onSnapshot(
            doc => {
                const postData = doc.data();
                this.setState({
                    comments: postData.comments.sort((postA, postB) => {
                        return postB.createdAt - postA.createdAt
                    }),
                    owner: postData.owner
                })
            }
        )
    }

    getUserInfo() {
        db.collection('users').where('owner', '==', auth.currentUser.email).onSnapshot(
            docs => {
                docs.forEach(doc => {
                    const user = doc.data();
                    this.setState({
                        email: user.owner,
                        username: user.userName,
                        profilePicture: user.foto
                    })
                });
            }
        )
        
    }

    createComment(text) {
        db.collection('posts')
            .doc(this.props.route.params.postId)
            .update({
                comments: firebase.firestore.FieldValue.arrayUnion({
                    comment: text,
                    owner: this.state.email,
                    username: this.state.username,
                    profilePic: this.state.profilePicture,
                    createdAt: Date.now()
                    //variables que usamos para crear el array de comentarios
                })
            })
            .then(() => {
                this.getComments();
                this.setState({
                    text: '',
                })
            })
            .catch(e => console.log(e))
    }


    render() {
        return (
            <View style={styles.container}>

                <TouchableOpacity style={styles.arrow} onPress={() => this.props.navigation.navigate('Home')}>
                    <FontAwesome name="arrow-left" size={20}/>
                </TouchableOpacity>

                {this.state.comments.length >= 1 ?
                <FlatList style={styles.comentarios}
                    data={this.state.comments}
                    keyExtractor={onePost => onePost.createdAt.toString()}
                    renderItem={({ item }) => 
                            <View style={styles.comentar}>
                                {item.profilePic !== '' ?
                                <Image
                                    style={styles.profilePic}
                                    source={{ uri: item.profilePic }}
                                    resizeMode='cover'
                                />:
                                <Image 
                                    style={styles.profilePic}
                                    source={require("../../../assets/noProfilePicture.svg")}
                                    resizeMode='cover' 
                                />
                                }               
                                <Text style={styles.comentario} onPress={() => this.props.navigation.navigate('HomeProfile', {
                                    email: item.owner
                                })}>{item.username}: {item.comment}</Text>
                            </View>
                            }
                />
                :
                <Text style={styles.noComments}> Aún no hay comentarios</Text>
                }

                <TextInput style={styles.input}
                    placeholder='Add a comment'
                    keyboardType='default'
                    //poner propiedad para transformarlo en textArea
                    onChangeText={text => this.setState({ text: text })}
                    value={this.state.text}
                />
                <TouchableOpacity onPress={() => this.createComment(this.state.text)}  disabled={this.state.text === ''}>
                    <Text style={[styles.btnLogin, {opacity: (this.state.text === '') ? 0.5 : 1,}]}> Comment </Text>
                </TouchableOpacity>

            </View>
            )
        };
}


const styles = StyleSheet.create({
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
        backgroundColor: 'rgb(0,0,0)',
        margin: 10,
        padding: 10,
        textAlign: 'center',
        color: 'white',
        borderRadius: 8,

    },
    comentarios: {
        padding: 10,
        flexDirection: 'column',
        flex: 10,
    },
    comentar: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        margin: 7,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    comentario: {
        alignItems: 'center',
        paddingLeft: 10
    },
    input: {
        color: 'rgb(0,0,0)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(0,0,0)',
        backgroundColor: 'rgb(255,255,255)',
        padding: 10,
        margin: 10
    },
    profilePic: {
        height: 40,
        width: 40,
        alignContent: 'center',
        borderRadius: 90,
    },
    noComments: {
        color: 'gray',
        fontSize: 20,
        marginBottom: 400,
        fontStyle: 'italic'

    },
    arrow: {
        alignItems: 'start'
    }
});

export default Comments;