import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';

import { auth, db } from '../../firebase/config';
import firebase from 'firebase';
import { FontAwesome } from '@expo/vector-icons';


class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cantidadDeLikes: this.props.postData.data.likes.length, //length del array de likes.
            miLike: false,
            cantidadDeComments: this.props.postData.data.comments.length,
            comments: [],
            isMyPost: false,
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
        this.checkIsMyPost();
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

    checkIsMyPost() {
        this.setState({
            isMyPost: this.props.postData.data.owner === auth.currentUser.email
        })
    }

    borrarPost() {
        db.collection("posts").doc(this.props.postData.id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    render() {
        return (
            <View style={styles.fondo}>
              {/*   <TouchableOpacity style={styles.first} onPress={() => this.props.navigation.navigate('Profile', {email: this.props.postData.data.owner})}>
                 <Image
                    style={styles.photo}
                    source={{ uri: this.props.postData.data.foto }}
                    resizeMode='cover'
                />  // imagen de perfil  
                      <Text style={styles.username}>{this.props.postData.data.userName}</Text>  
                </TouchableOpacity> */}
                <Image
                    style={styles.photo}
                    source={{ uri: this.props.postData.data.photo }}
                    resizeMode='cover'
                />
                <TouchableOpacity style={styles.first} onPress={() => this.props.navigation.navigate('Profile', {email: this.props.postData.data.owner})}>
                    <Text style={styles.first}>{this.props.postData.data.userName}: {this.props.postData.data.textoPost}</Text>
                </TouchableOpacity>
               
                <View style={styles.mg}>
                {this.state.miLike ?
                    <TouchableOpacity style={styles.like} onPress={() => this.unlike()}>
                        <FontAwesome name='heart' color='#E4127E' size={20} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.like} onPress={() => this.like()}>
                        <FontAwesome name='heart-o' color='#E4127E' size={20} />
                    </TouchableOpacity>
                }
                {/* <Text style={styles.third}> {this.state.cantidadDeLikes}</Text>  */}
                {/* <TouchableOpacity style={styles.first} onPress={() => this.props.navigation.navigate('Profile', {email: this.props.postData.data.owner})}>
                    <Text style={styles.first}>{this.props.postData.data.userName}: {this.props.postData.data.textoPost}</Text>
                </TouchableOpacity> */}
                
               
                 <Text style={styles.third}>{this.state.cantidadDeLikes}</Text> 

                 </View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Comments', {
                    postId: this.props.postData.id
                })}>
                    <Text style={styles.fourth}>{this.props.postData.data.comments.length} Comments...</Text>
                </TouchableOpacity>
                {this.state.isMyPost ? (
                    <TouchableOpacity style={styles.trash} onPress={() => this.borrarPost()}>
                        <FontAwesome name='trash' color='white' size={18} />
                    </TouchableOpacity>
                ) : null}
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
        borderRadius: 8,
        marginTop: 10
    },
    mg:{
        flexDirection: 'row',
        justifyContent: 'flex-start'

    },
    like: {
        marginLeft: 15,
        marginBottom: 4,
     //   marginTop: 4,
    },

    fondo: {
        backgroundColor: 'rgb(246, 246, 246)',
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        margin: 15,
        //  borderColor: 'rgb(228, 18, 126)',
        //  borderWidth: 1,

    },
    first: {
        color: 'rgb(59, 59, 59)',
        // textAlign: 'center',
        flex: 1,
        flexDirection: 'row',
        fontWeight: 600,
        marginLeft: 8,
        paddingBottom: 3

    },
    second: {
        color: 'rgb(59, 59, 59)',
        alignContent: 'center',
        marginLeft: 15,
        flex: 2,
        flexDirection: 'row'

    },
    third: {
        color: 'rgb(59, 59, 59)',
        alignContent: 'center',
        marginLeft: 3,
        marginTop: 1,
       // paddingBottom: 10,
    },
    fourth: {
        color: 'rgb(59, 59, 59)',
        alignContent: 'center',
        marginLeft: 15,
        marginBottom: 4,
    },
    trash: {
        marginTop: 3,
        marginLeft: 15,
    },
    username: {
        fontSize: 17,
        color: 'rgb(59, 59, 59)',
        fontWeight: 600
    }


})

export default Post;