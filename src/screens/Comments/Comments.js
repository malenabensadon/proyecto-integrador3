import React, { Component } from 'react';
import { auth, db } from '../../firebase/config';
import { Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { StyleSheet } from 'react-native-web';

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            cantComments: this.props
            // .data.comments.length
        }
    };

    createComment() {
        //agregar el email del usuario logueado a un array en el posteo.
        db.collection('posts')
            .doc(this.props.postData.id) //identificar el documento
            .update({
                comments: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email) //traer el email del usuario logueado con auth.currentUser.email. Chequear que este importado auth.
            })
            .then(() => this.setState({
                cantComments: this.state.cantComments + 1
            })
            )
            .catch(e => console.log(e))
    }
    render() {
        console.log(this.props.comment)
        return (
            <View >
                 <TextInput 
                            placeholder='Agregar comentario'
                            keyboardType='default'
                            //poner propiedad para transformarlo en textArea
                            onChangeText={ text => this.setState({comments: text}) }
                            value={this.state.comments}
                    /> 
                     <TouchableOpacity onPress={()=> this.createComment(this.state.comments)}>
                        <Text> Commentar </Text>
                    </TouchableOpacity>
            </View>
            
        )
    };
}


export default Comments;