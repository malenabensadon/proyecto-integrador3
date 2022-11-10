import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';

import { auth, db } from '../../firebase/config';
import firebase from 'firebase';


class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cantidadDeLikes: this.props.postData.data.likes.length, //length del array de likes.
            miLike: false,
            cantidadDeComments: this.props.postData.data.comments.length,
            comments: []
        }
    }

    componentDidMount() {
        //chequear si el email del usuario logueado está en el array. El usuario logueado se obtiene de auth.currentUser.email. Chequear que este importado auth.
        //Si está voy a cambiar el estado miLike.
        if (this.props.postData.data.likes.includes(auth.currentUser.email)) {
            this.setState({
                miLike: true
            })
        }
    }

    like() {
        //agregar el email del usuario logueado a un array en el posteo.
        db.collection('posts')
            .doc(this.props.postData.id) //identificar el documento
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) //traer el email del usuario logueado con auth.currentUser.email. Chequear que este importado auth.
            })
            .then(() => this.setState({
                cantidadDeLikes: this.state.cantidadDeLikes + 1,
                miLike: true,
            })
            )
            .catch(e => console.log(e))
    }

    unlike() {
        db.collection('posts')
            .doc(this.props.postData.id) //identificar el documento
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email) //traer el email del usuario logueado con auth.currentUser.email. Chequear que este importado auth.
            })
            .then(() => this.setState({
                cantidadDeLikes: this.state.cantidadDeLikes - 1,
                miLike: false,
            })
            )
            .catch(e => console.log(e))
    }

    render() {
        return (
            <View style={styles.fondo}>
                <Image
                    style={styles.photo}
                    source={{ uri: this.props.postData.data.photo }}
                    resizeMode='cover'
                />
                <Text style={styles.first}>{this.props.postData.data.userName}:</Text>
                <Text style={styles.second}>{this.props.postData.data.textoPost}</Text>
                <Text style={styles.third}>Likes: {this.state.cantidadDeLikes}</Text>
                {this.state.miLike ?
                    <TouchableOpacity onPress={() => this.unlike()}>
                        <Text style={styles.fourth}>DISLIKE</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => this.like()}>
                        <Text style={styles.fourth}>LIKE</Text>
                    </TouchableOpacity>
                }

                <TouchableOpacity onPress={this.props.irAComments}>
                    <Text style={styles.first}>{this.props.postData.data.comments.length} Comentarios...</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    photo: {
        height: 250,
        width: 335,
        alignContent: 'center',
        marginLeft: 10,
        marginBottom: 15,
        borderRadius: 8

    },

    fondo: {
        backgroundColor: 'rgb(0,0,0)',
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        margin: 15,
    },
    first: {
        color: 'white',
        alignContent: 'center',
        marginLeft: 80,
        flex: 1,
        flexDirection: 'row'

    },
    second: {
        color: 'white',
        alignContent: 'center',
        marginLeft: 80,
        flex: 2,
        flexDirection: 'row'

    },
    third: {
        color: 'white',
        alignContent: 'center',
        marginLeft: 80,
    },
    fourth: {
        color: 'white',
        alignContent: 'center',
        marginLeft: 80,
    }


})

export default Post;