import React, { Component } from 'react';
import { updatePassword } from "firebase/auth";
import {auth, db} from '../../firebase/config';
import { View,
         Text,
         TextInput,
         TouchableOpacity,
        StyleSheet,
        FlatList } from 'react-native';
import Post from '../../components/Post/Post';

class Profile extends Component {
    constructor(){
        super()
        this.state = {
            userPosts: [],
            userName: '',
            currentPassword: '',
            newPassword: '',
            bio:'',
            userId:'',
            editSucces: false
        }
    }

   componentDidMount() {
        this.getUserPosts.bind(this);
        this.getUserInfo();
        this.getUserPosts();
   }

   getUserInfo() {
        db.collection('users').where('owner', '==', auth.currentUser.email).onSnapshot(
            docs => {
                docs.forEach(doc => {
                    const user = doc.data();
                    this.setState({
                        userId: doc.id,
                        userName: user.userName,
                        email: user.owner,
                        bio: user.bio
                    })
                });
            }
        )
   }

   getUserPosts() {
        db.collection('posts').where('owner', '==', auth.currentUser.email).orderBy('createdAt', 'desc').onSnapshot(
            docs => {
                let posts = [];
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    })
                    this.setState({
                        userPosts: posts
                    })
                })
            }
        )
   }

   updateProfileInfo() {
        db.collection('users')
        .doc(this.state.userId) //identificar el documento
        .update({
            userName: this.state.userName,
            bio: this.state.bio,
        })
        .then(
            this.getUserInfo()
        )
        .catch(e => console.log(e))
   }

   reauthenticate = (user, currentPassword) => {
        auth.signInWithEmailAndPassword(user.email, currentPassword).then((cred) => {
            console.log(cred);
            return user.reauthenticateWithCredential(cred);
        }) 
    }
     
    editProfile() {
        if (this.state.password !== '') {
            const user = auth.currentUser;
            // this.reauthenticate(user, this.state.currentPassword)
            //     .then(() => {
            //         user.updatePassword(this.state.newPassword).then(() => {
            //             this.updateProfileInfo();
            //         }).catch((e) => console.log(e))
            //     }).catch((e) => console.log(e))
        } else {
            this.updateProfileInfo();
        }
    }


    render(){
        return(
            <> 
                <Text>My Profile</Text>
                <Text>{this.state.userName}</Text>
                <Text>{this.state.email}</Text>
                <Text>{this.state.bio}</Text>


                <Text>Cantidad de posteos: {this.state.userPosts.length}</Text>
                <FlatList 
                    data={this.state.userPosts}
                    keyExtractor={ onePost => onePost.id.toString()}
                    renderItem={({ item }) => <Post postData={item} irAComments={() => {}} refrescarPosts={this.getUserPosts} />}
                />   

                <Text>Editar Perfil</Text>
                <TextInput
                    placeholder='Nombre de usuario'
                    keyboardType='default'
                    onChangeText={ text => this.setState({userName: text}) }
                    value={this.state.userName}
                />
                <TextInput
                    placeholder='Bio'
                    keyboardType='default'
                    onChangeText={ text => this.setState({bio: text}) }
                    value={this.state.bio}
                />
                <TextInput
                    placeholder='ingresar actual contraseña'
                    keyboardType='default'
                    secureTextEntry
                    onChangeText={ text => this.setState({currentPassword: text}) }
                    value={this.state.currentPassword}
                />
                <TextInput
                    placeholder='nueva contraseña'
                    keyboardType='default'
                    secureTextEntry
                    onChangeText={ text => this.setState({newPassword: text}) }
                    value={this.state.newPassword}
                />
                 <TouchableOpacity onPress={() => this.editProfile()}>
                    <Text>Editar</Text>
                </TouchableOpacity>
            </>
        )
    }
    
}


export default Profile;