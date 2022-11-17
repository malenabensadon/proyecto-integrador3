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
import Navbar from '../../components/Navbar/Navbar';


class ProfileEdit extends Component {
    constructor() {
        super()
        this.state = {
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
        
        this.getUserInfo();
       
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
                            this.props.navigation.navigate('Profile')
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => this.setState({
                    err: err.message
                }))

        } else {
            this.updateProfileInfo();
            this.props.navigation.navigate('Profile')
        }

    }

    render() {
        return (
            <>
                         <Navbar />
                         <View style={styles.container}>
                          <View style={styles.editar}>
                            <Text style={styles.editarTexto}>Ingresa lo datos que quieras editar</Text>
                            {this.state.foto !== '' ?
                           
                           <Image
                                style={styles.foto}
                                source={this.state.foto}
                                resizeMode='cover'
                            />:
                            <Image
                                style={styles.foto}
                                source={require("../../../assets/noProfilePicture.svg")}
                                resizeMode='cover'
                            />}
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
                            
                            {/* <TouchableOpacity onPress={() => this.logout()} >
                            <Text style={styles.boton}>Log out</Text>
                        </TouchableOpacity> */}

                        </View>
                        </View>
                        
    
            </>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    foto: {
        height: 90,
        width: 90,
        borderRadius: 90,
        margin: 20,
        
    },
   
    boton:{
        borderWidth: 1,
        backgroundColor: 'black',
        borderRadius: 8,
        color: 'white',
        textAlign: 'center',
        padding: 5,
        marginTop: 10

    },
    editar:{
       backgroundColor: 'rgb(230, 230, 230)',
        color: 'black',
        borderRadius: 5,
        padding: 30,
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10

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
        width: '100%',
        padding: 4,
        borderWidth: 1,
        //borderRadius: 5,
        borderBottomColor: 'pink',
        borderLeftColor: 'rgb(230, 230, 230)',
        borderTopColor: 'rgb(230, 230, 230)',
        borderRightColor: 'rgb(230, 230, 230)',
        //borderColor: 'black',
        margin: 4,
    },

    editarTexto:{
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center'
    },

   
})


export default ProfileEdit;