import React, { Component } from 'react';
import { updatePassword } from "firebase/auth";
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
import { FontAwesome } from '@expo/vector-icons';
import Post from '../../components/Post/Post';
import { AntDesign } from '@expo/vector-icons'; 


class Profile extends Component {
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

        }
    }

    componentDidMount() {
        this.getUserPosts.bind(this);
        this.getUserInfo();
        this.getUserPosts();
    }

    getUserInfo() {
        db.collection('users').where('owner', '==', this.props.route.params.email).onSnapshot(
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
        db.collection('posts').where('owner', '==', this.props.route.params.email).orderBy('createdAt', 'desc').onSnapshot(
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
    logout() {
        auth.signOut()
            .then(() => this.props.navigation.navigate("Login"))
    }

    render() {
        return (
            <>

<View style={styles.container}>
                    <View style={styles.container3}>
                        <View style={styles.container2}>
                            {this.state.foto !== '' ?
                            <Image
                                style={styles.fotopp}
                                source={this.state.foto}
                                resizeMode='cover'
                            />:
                            <Image
                                style={styles.fotopp}
                                source={require("../../../assets/noProfilePicture.svg")}
                                resizeMode='cover'
                            />
                        }
                            <View style={styles.datos}>
                                <Text style={styles.username}>{this.state.userName}</Text>
                                <Text >{this.state.email}</Text>
                                <Text >Cantidad de posteos: {this.state.userPosts.length}</Text>
                                <Text style={styles.bio}>{this.state.bio}</Text>
                                {this.state.email === auth.currentUser.email ?
                                <View style={styles.logos}>
                                    <TouchableOpacity style={styles.tuerca} onPress={() => this.props.navigation.navigate('ProfileEdit')}>
                                        <FontAwesome name="gear" size={22}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cerrar} onPress={() => this.logout()}>
                                    <AntDesign name="logout" size={20} color="black" />
                                    </TouchableOpacity>
                                </View>
                                :
                                 <Text></Text>
                                }
                            </View>
                          
                        </View>
                        <FlatList style={styles.posts}
                            data={this.state.userPosts}
                            keyExtractor={onePost => onePost.id.toString()}
                            renderItem={({ item }) => <Post style={styles.posteo} postData={item} navigation= {this.props.navigation}  refrescarPosts={this.getUserPosts} />}
                        />

                      {/*   {this.state.email === auth.currentUser.email ?

                          <View style={styles.editar}>
                           
                            <Text style={styles.editarTexto} onPress={ () => this.props.navigation.navigate('ProfileEdit', {owner: this.state.userId})}> Ingresa lo datos que quieras editar ?</Text>
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
                            <Text style={styles.boton}>Log out</Text>
                        </TouchableOpacity>
                        
                        </View>
                        :
                        <Text></Text>
                         } */}
                        
                        
                
                        
    

                </View>
    


</View>
    
            </>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        scroll: 2,
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-around',
    //    width: '100%',
       // scroll: 2


    },
    datos:{
        marginRight: 20,
        marginBottom: 100
    },
    container3: {
      //  flex: 1,
      
    
    },
    logos:{
        flex: 2,
        flexDirection: 'row',
        marginTop: 10,
    },
    boton:{
        borderWidth: 1,
        backgroundColor: 'black',
        borderRadius: 8,
        color: 'white',
        textAlign: 'center',
        padding: 5

    },
    tuerca:{
        marginRight: 8
    },
    editar:{
        backgroundColor: 'white',
        color: 'black',
        padding: 30
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

    /* textos: {
        color: 'white',
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 15,
    },
    containerPic: {
        flex: 2,
        flexDirection: 'row'
    },
    containerText: {
        color: 'black',
        margin: 15,
        width: '70vw',
        flexGrow: 1,
        flex: 1
    },
    textos2: {
        color: 'black',
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
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    textos4: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    input: {
        color: 'black',
        fontSize: 10,
        textAlign: 'center',
        margin: 4
    },
    foto: {
       // flex: 1,
       // minHeight: 150,
        borderRadius: 90,
        width: '10vh',
        height: '10vh',

    } */
})


export default Profile;