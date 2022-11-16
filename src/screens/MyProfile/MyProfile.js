import React, { Component } from 'react';
import firebase from 'firebase';
import { auth, db } from '../../firebase/config';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image
} from 'react-native';
import Post from '../../components/Post/Post';

class MyProfile extends Component {
    constructor() {
        super()
        this.state = {
            userPosts: [],
            userName: '',
            currentPassword: '',
            newPassword: '',
            foto: '',
            bio: '',
            userId: '',
            editSucces: false,
            err: ''
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
                        bio: user.bio,
                        foto: user.foto
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
    logout() {
        auth.signOut()
            .then(() => this.props.navigation.navigate("Login"))
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

    editProfile() {
        if (this.state.newPassword !== '') {
            auth.signInWithEmailAndPassword(auth.currentUser.email, this.state.currentPassword)
                .then(res => {
                    const user = auth.currentUser;

                    user.updatePassword(this.state.newPassword)
                        .then(res => {
                            this.updateProfileInfo();
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => this.setState({
                    err: err.message
                }))

        } else {
            this.updateProfileInfo();
        }

    }


    render() {
        //   console.log(this.state.newPassword);
        return (
            <>
                <View >
                    <View >
                        <Image

                            source={this.state.foto}
                            resizeMode='small'
                        />

                        <View >

                            <Text >{this.state.userName}</Text>
                            <Text >{this.state.email}</Text>
                            <Text >Cantidad de posteos: {this.state.userPosts.length}</Text>
                            <Text>{this.state.bio}</Text>
                        </View>
                    </View>


                    <FlatList
                        data={this.state.userPosts}
                        keyExtractor={onePost => onePost.id.toString()}
                        renderItem={({ item }) => <Post postData={item} irAComments={() => { }} refrescarPosts={this.getUserPosts} />}
                    />

                    <Text >Ingresa lo datos que quieras editar</Text>
                    <TextInput
                        placeholder='Ingresa tu nuevo nombre de usuario'
                        keyboardType='default'
                        onChangeText={text => this.setState({ userName: text })}
                        value={this.state.userName}
                    />
                    <TextInput
                        placeholder='Ingresa tu nueva biografia'
                        keyboardType='default'
                        onChangeText={text => this.setState({ bio: text })}
                        value={this.state.bio}
                    />
                    <TextInput
                        placeholder='Ingresa tu actual contraseña'
                        keyboardType='default'
                        secureTextEntry
                        onChangeText={text => this.setState({ currentPassword: text })}
                        value={this.state.currentPassword}
                    />
                    <TextInput
                        placeholder='Ingresa tu nueva contraseña'
                        keyboardType='default'
                        secureTextEntry
                        onChangeText={text => this.setState({ newPassword: text })}
                        value={this.state.newPassword}
                    />
                    <Text >{this.state.err}</Text>
                    <TouchableOpacity onPress={() => this.editProfile()}>
                        <Text >Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.logout()} >
                        <Text >Log out</Text>
                    </TouchableOpacity>


                </View>

            </>
        )

    }

}

const styles = StyleSheet.create({
    textos: {
        color: 'white',
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
    }
})


export default MyProfile;