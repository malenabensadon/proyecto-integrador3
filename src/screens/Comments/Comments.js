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
            // .data.comments.length
        }
    };

    componentDidMount(){
        db
        .collection('posts')
        .doc(this.props.route.params.id) //tenemos que trer bien el id 
        .onSnapshot(
            doc => {
                console.log(doc.data()) //me trae siempre la info del mismo post 
                this.setState({
                    data: doc.data(),
                    postID: doc.id
                    //comments: doc.data().comments
                })

            }
        )

    }

    createComment(text) {
        db
        .collection('posts')
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
        console.log(this.props.route.params.id)
        console.log(this.state.postID)
        console.log(this.state.comments)
        return (
            <View >
                 <TextInput 
                            placeholder='Add a comment'
                            keyboardType='default'
                            //poner propiedad para transformarlo en textArea
                            onChangeText={ text => this.setState({text: text}) }
                            value={this.state.text}
                    /> 
                    <TouchableOpacity onPress={()=> this.createComment(this.state.text)}>
                        <Text> Comment </Text>
                    </TouchableOpacity>
            </View>
            
        )
    };
}


export default Comments;