import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';

import {auth, db} from '../../firebase/config';
import firebase from 'firebase';


class Post extends Component {
    constructor(props){
        super(props)
        this.state = {
            cantidadDeLikes:this.props.postData.data.likes.length, //length del array de likes.
            miLike:false
        }
    }

    componentDidMount(){
        //chequear si el email del usuario logueado está en el array. El usuario logueado se obtiene de auth.currentUser.email. Chequear que este importado auth.
        //Si está voy a cambiar el estado miLike.
        if(this.props.postData.data.likes.includes(auth.currentUser.email)){ 
            this.setState({
                miLike:true
            })
        }
    }

    like(){
        //agregar el email del usuario logueado a un array en el posteo.
        db.collection('posts')
            .doc(this.props.postData.id) //identificar el documento
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) //traer el email del usuario logueado con auth.currentUser.email. Chequear que este importado auth.
            })
            .then(()=> this.setState({
                cantidadDeLikes: this.state.cantidadDeLikes +1,
                miLike: true, 
                })
            )
            .catch(e=>console.log(e))
    }

    unlike(){
        db.collection('posts')
            .doc(this.props.postData.id) //identificar el documento
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email) //traer el email del usuario logueado con auth.currentUser.email. Chequear que este importado auth.
            })
            .then(()=> this.setState({
                cantidadDeLikes: this.state.cantidadDeLikes - 1,
                miLike: false, 
                })
            )
            .catch(e=>console.log(e))
    } 

    render(){
        return(
            <View style={styles.fondo}>
                <Image 
                    style={styles.photo}
                    source={{uri: this.props.postData.data.photo}}
                    resizeMode='cover'
                />
                
                <Text style={styles.titulitos}> {this.props.postData.data.userName} </Text>
                <Text style={styles.titulitos}> {this.props.postData.data.textoPost} </Text>
                <Text style={styles.titulitos}> Cantidad de Likes: {this.state.cantidadDeLikes} </Text>
                { this.state.miLike ? 
                    <TouchableOpacity onPress={ ()=> this.unlike() }>
                        <Text style={styles.titulitos}>No me gusta más</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={ ()=> this.like() }>
                        <Text style={styles.titulitos}>Me gusta</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    photo:{
        height:550,
        width: 600,
        marginLeft: 430

    }, 
    fondo:{
        backgroundColor: 'rgb(0,0,0)'
    },
    titulitos: {
        color: 'white'
    }


}) 

export default Post;