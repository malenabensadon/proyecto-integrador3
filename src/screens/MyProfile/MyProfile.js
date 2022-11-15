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
            foto:'',
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
        if(this.state.newPassword !== '') {
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
                <View style={styles.container}>
                    <View style={{ backgroundColor: "black" }}>
                        <Text style={styles.titulo}></Text>
                        <Text style={styles.textos}>{this.state.userName}</Text>
                        <Text style={styles.textos2}>{this.state.email}</Text>
                        <Text style={styles.textos2}>{this.state.bio}</Text>
                    </View>
                    <Image
                        style={styles.foto}
                        source={this.state.foto}
                        resizeMode='small'
                    />
                    <Text style={styles.textos2}>Cantidad de posteos: {this.state.userPosts.length}</Text>
                    <FlatList
                        data={this.state.userPosts}
                        keyExtractor={onePost => onePost.id.toString()}
                        renderItem={({ item }) => <Post postData={item} irAComments={() => { }} refrescarPosts={this.getUserPosts} />}
                    />

                    <Text style={styles.textos4}>Ingresa lo datos que quieras editar</Text>
                    <TextInput style={styles.input}
                        placeholder='Ingresa tu nuevo nombre de usuario'
                        keyboardType='default'
                        onChangeText={text => this.setState({ userName: text })}
                        value={this.state.userName}
                    />
                    <TextInput style={styles.input}
                        placeholder='Ingresa tu nueva biografia'
                        keyboardType='default'
                        onChangeText={text => this.setState({ bio: text })}
                        value={this.state.bio}
                    />
                    <TextInput style={styles.input}
                        placeholder='Ingresa tu actual contraseña'
                        keyboardType='default'
                        secureTextEntry
                        onChangeText={text => this.setState({ currentPassword: text })}
                        value={this.state.currentPassword}
                    />
                    <TextInput style={styles.input}
                        placeholder='Ingresa tu nueva contraseña'
                        keyboardType='default'
                        secureTextEntry
                        onChangeText={text => this.setState({ newPassword: text })}
                        value={this.state.newPassword}
                    />
                    <Text style={styles.textos}>{this.state.err}</Text>
                    <TouchableOpacity onPress={() => this.editProfile()}>
                        <Text style={styles.textos3}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.logout()} >
                    <Text style={styles.logout}>Log out</Text>
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
    },
    container: {
        backgroundColor: 'black',
        flex: 1
    },
    textos2: {
        color: 'white',
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'center',
        margin: 2,
    },
    titulo: {
        color: 'white'
    },
    textos3: {
        color: 'white',
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    textos4: {
        color: 'white',
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    input: {
        color: 'white',
        fontFamily: 'Oswald, sans-serif',
        fontSize: 10,
        textAlign: 'center',
        margin: 4
    },
    foto: {
        flex: 1,
        minHeight: 150,
    }
})


export default MyProfile;