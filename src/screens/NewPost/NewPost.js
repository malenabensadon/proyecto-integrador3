import React, { Component } from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { auth, db, storage } from '../../firebase/config';
import MyCamera from '../../components/MyCamera/MyCamera';


class NewPost extends Component {
    constructor() {
        super()
        this.state = {
            textoPost: '',
            createdAt: '',
            photo: '',
            showCamera: true,
            imagePickerError: '',
        }
    }

    createPost(texto, photo) {
        db.collection('users').where('owner', '==', auth.currentUser.email)
            .onSnapshot(users => {
                if (users.docs.length > 0) {
                    db.collection('posts').add({
                        owner: auth.currentUser.email,
                        userName: users.docs[0].data().userName,
                        textoPost: texto,
                        photo: photo,
                        likes: [],
                        comments: [],
                        createdAt: Date.now()
                    })
                        .then(() => {
                            this.setState({
                                textoPost: '',
                                showCamera: true,
                            })
                            this.props.navigation.navigate('Home')
                        })
                        .catch(e => console.log(e))
                }
            })
    }

    onImageUpload(url) {
        this.setState({
            photo: url,
            showCamera: false,
        })
    }

    render() {
        console.log(auth.currentUser.email);
        return (
            <View style={style.container}>
                {
                    this.state.showCamera ?
                        <MyCamera style={style.camara} onImageUpload={url => this.onImageUpload(url)} />
                        :
                        <View style={style.container}>
                            <Text style={style.title}>New Post</Text>
                            <View style={style.container}>
                                <TextInput style={style.description}
                                    placeholder='Escribe lo que quieras compartir'
                                    keyboardType='default'
                                    //poner propiedad para transformarlo en textArea
                                    onChangeText={text => this.setState({ textoPost: text })}
                                    value={this.state.textoPost}
                                />
                                <TouchableOpacity style={style.mostrarCamara} onPress={() => this.createPost(this.state.textoPost, this.state.photo)}>
                                    <Text style={style.textBtn}>GUARDAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
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
        justifyContent: 'center'
    },
   
    description: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        padding: 20,
        fontSize: 16,
        marginVertical: 15
    },
    title: {
        fontSize: 22,
        fontWeight: '600'
    },
    btnPost: {
        border: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(150,150,150)',
        borderStyle: 'solid',
        borderRadius: 8,
        padding: 7.5,
        width: '30%',
    },
    textBtn: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white'
    },
    mostrarCamara: {
        backgroundColor: 'rgb(213, 42, 153)',
        borderWidth: 1,
        padding: 10,
        borderRadius:8,
        marginBottom: 15,
    },
    mostrarCamaraTxt: {
        color: 'white',
        fontWeight: 'bold'
    },
    image: {
        width: 400,
        height: 400
    }
})

export default NewPost;