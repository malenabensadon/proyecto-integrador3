import React, {Component} from 'react'
import {Text, TextInput, TouchableOpacity,View} from 'react-native';
import {auth, db} from '../../firebase/config';
import MyCamera from '../../components/MyCamera/MyCamera';


class NewPost extends Component{
    constructor(){
        super()
        this.state={
            textoPost:'',
            createdAt:'',
            photo:'',
            showCamera: true,
        }
    }

    createPost(texto, photo){
        db.collection('users').where('owner', '==', auth.currentUser.email)
            .onSnapshot(users => {
                if (users.docs.length > 0) {
                    db.collection('posts').add({
                        owner: auth.currentUser.email,
                        userName: users.docs[0].data().userName,
                        textoPost: texto,
                        photo: photo,
                        likes:[],
                        comments:[],
                        createdAt: Date.now()
                    })
                    .then(() => {
                        this.setState({
                            textoPost:'',
                            showCamera: true,
                        })
                        this.props.navigation.navigate('Home')
                    })
                    .catch( e => console.log(e))
                }
            })
    }

    onImageUpload(url){
        this.setState({
            photo: url,
            showCamera: false,
        })
    }

    render(){
        console.log(auth.currentUser.email);
        return(
            <View>
            {
                this.state.showCamera ?
                 <MyCamera onImageUpload={url => this.onImageUpload(url)}/>
                 :
                <View>
                    <Text> New Post</Text>
                    <View>
                        <TextInput  
                            placeholder='texto post'
                            keyboardType='default'
                            //poner propiedad para transformarlo en textArea
                            onChangeText={ text => this.setState({textoPost:text}) }
                            value={this.state.textoPost}
                        /> 
                        <TouchableOpacity onPress={()=>this.createPost(this.state.textoPost, this.state.photo)}>
                            <Text>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            </View>
        )
    }
}

export default NewPost;