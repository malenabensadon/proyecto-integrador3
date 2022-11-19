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
                <View style={styles.container}>
                    <View style={styles.container3}>
                        <View style={styles.container2}>
                            <Image
                                style={styles.fotopp}
                                source={this.state.foto}
                                resizeMode='cover'
                            />

                            <View style={styles.datos}>
                                <Text style={styles.username}>{this.state.userName}</Text>
                                <Text >{this.state.email}</Text>
                                <Text >Cantidad de posteos: {this.state.userPosts.length}</Text>
                                <Text style={styles.bio}>{this.state.bio}</Text>
                            </View>
                        </View>

                        <FlatList style={styles.posts}
                            data={this.state.userPosts}
                            keyExtractor={onePost => onePost.id.toString()}
                            renderItem={({ item }) => <Post style={styles.posteo} postData={item} navigation= {this.props.navigation}  refrescarPosts={this.getUserPosts} />}
                        />


                        <View style={styles.editar}>
                            <Text style={styles.editarTexto}>Ingresa lo datos que quieras editar</Text>
                            <TextInput style={styles.cambio}
                                placeholder='Ingresa tu nuevo nombre de usuario'
                                keyboardType='default'
                                onChangeText={text => this.setState({ userName: text })}
                                value={this.state.userName}
                            />
                            <TextInput style={styles.cambio}
                                placeholder='Ingresa tu nueva biografia'
                                keyboardType='default'
                                onChangeText={text => this.setState({ bio: text })}
                                value={this.state.bio}
                            />
                            <TextInput style={styles.cambio}
                                placeholder='Ingresa tu actual contraseña'
                                keyboardType='default'
                                secureTextEntry
                                onChangeText={text => this.setState({ currentPassword: text })}
                                value={this.state.currentPassword}
                            />
                            <TextInput style={styles.cambio}
                                placeholder='Ingresa tu nueva contraseña'
                                keyboardType='default'
                                secureTextEntry
                                onChangeText={text => this.setState({ newPassword: text })}
                                value={this.state.newPassword}
                            />
                            <Text >{this.state.err}</Text>
                            <TouchableOpacity onPress={() => this.editProfile()}>
                                <Text style={styles.boton}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.logout()} >
                            <Text style={styles.logout}>Log out</Text>
                        </TouchableOpacity>

                        </View>
                       


                    </View>

                </View>

            </>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        scroll: 2
    },
    container2: {
       flex: 2,
       flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-around',
       zIndex: 10,
        backgroundColor: 'white',
        height: 1000,
       // scroll: 2


    },
    datos:{
        marginRight: 20
    },
    container3: {
      //  flex: 1,
      

    },
    boton:{
        borderWidth: 1,
        backgroundColor: 'black',
        borderRadius: 8,
        color: 'white',
        textAlign: 'center',
        padding: 5 

    },
    logout:{
        borderWidth: 2,
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 8,
        width: 100,
        textAlign: 'center',
        padding: 10,
        marginTop: 15,
        marginLeft: 135        



    },
    editar:{
        backgroundColor: 'white',
        color: 'black',
        padding: 30,
        
    },
    textos: {
        color: 'white',
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
    },
    fotopp: {
        height: '16vh',
        width: '16vh',
        marginLeft: 15,
        //  marginBottom: 10,
        borderRadius: 90,
        marginRight: 20,
    },
    cambio:{
        padding: 4,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: 'black',
        margin: 4,
    },

    posteo: {
        padding: 20
    },
    fotoss: {
        flex: 1,
        flexDirection: 'column',
    },
    editarTexto:{
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 4
    },
    bio:{
        marginTop: 7
    },
    posts:{
        padding:30,
        marginTop: 130
    }

})


export default MyProfile;