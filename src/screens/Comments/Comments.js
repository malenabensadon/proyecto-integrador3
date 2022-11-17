import React, { Component } from 'react';
import { auth, db } from '../../firebase/config';
import { Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { StyleSheet } from 'react-native-web';
import firebase from 'firebase';

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            text: '',
            email: '',
            userName: '',
            owner: '',
            profilePicture: ''
        }
    };

    componentDidMount() {
        this.getUserInfo();
        this.getComments();
    }

    getComments() {
        db.collection('posts').doc(this.props.route.params.postId).onSnapshot(
            doc => {
                const postData = doc.data();
                this.setState({
                    comments: postData.comments,
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
                        userName: user.userName,
                        profilePicture: user.foto
                    })
                });
            }
        )
        
    }

    createComment(text) {
        // db.collection('users').where('owner', '==', this.state.owner).onSnapshot(
        //     docs => {
        //         docs.forEach(doc => {
        //             const user = doc.data();
        //             this.setState({
        //                 profilePicture: user.foto
        //             })
        //         });
        //     }
        // )
        db.collection('posts')
            .doc(this.props.route.params.postId) //identificar bien el documento porque trae siempre el mismo
            .update({
                comments: firebase.firestore.FieldValue.arrayUnion({
                    comment: text,
                    owner: this.state.email,
                    username: this.state.userName,
                    profilePic: this.state.profilePicture,
                    createdAt: Date.now()

                })
            })
            .then(() => {
                this.getComments();
                this.setState({
                    //cantComments: this.state.cantComments + 1, 
                    text: '',
                })
            })
            .catch(e => console.log(e))
    }


    render() {
        return (
            <View style={style.container}>
                <FlatList style={style.comentarios}
                    data={this.state.comments}
                    keyExtractor={onePost => onePost.createdAt}
                    renderItem={({ item }) => 
                //  console.log (item.owner)
                        <View style={style.comentar}>
                            {item.profilePic !== '' ?
                            <Image
                                style={style.profilePic}
                                source={{ uri: item.profilePic }}
                                resizeMode='cover'
                            />:
                            <Image 
                                style={style.profilePic}
                                source={require("../../../assets/noProfilePicture.svg")}
                                resizeMode='cover' 
                            />
                             }               
                            <Text style={style.comentario} onPress={() => this.props.navigation.navigate('Profile', {
                                email: item.owner
                            })}>{item.username}: {item.comment}</Text>
                        </View>


                     }
                    
                
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
    }
});


export default Comments;