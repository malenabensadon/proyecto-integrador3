import React, { Component } from 'react';
import { auth } from '../../firebase/config';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { WhiteBalance } from 'expo-camera';

class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            pass: '',
            errors: {
                field: '',
                message: ''
            }
        }
    }
    componentDidMount() { 
        auth.onAuthStateChanged(
            user => {
                if (user) {
                    this.props.navigation.navigate('HomeMenu')
                }
            })
    }

    loginUser(email, pass) {
        //Registrar en firebase y si el reigstro sale bien redireccionar a Home
        auth.signInWithEmailAndPassword(email, pass)
            .then(res => {
                //equivalente a res.redirect
                this.props.navigation.navigate('HomeMenu')
            })
            .catch(error => {
                console.log(error)
                let errorField = ''
                if (error.code === 'auth/invalid-email') {
                    errorField = "email"
                } else if (error.code === 'auth/wrong-password') {
                    errorField = "password"
                }
                this.setState({
                    errors: {
                        field: errorField,
                        message: error.message
                    }
                })
            })
    }


    render() {
        return (


            <View style={style.container}>
                <Text style={style.title}>Login</Text>
                <View>
                    <TextInput style={style.input}
                        placeholder='Email'
                        keyboardType='email-address'
                        onChangeText={text => this.setState({ email: text })}
                        value={this.state.email}
                    />
                    {this.state.errors.field === 'email' && (
                        <Text> {this.state.errors.message} </Text>
                    )}
                    <TextInput style={style.input}
                        placeholder='Password'
                        keyboardType='default'
                        secureTextEntry={true}
                        onChangeText={text => this.setState({ pass: text })}
                        value={this.state.pass}
                    />
                    {this.state.errors.field === 'password' && (
                        <Text style={style.error}> {this.state.errors.message} </Text>
                    )}
                    <TouchableOpacity onPress={() => this.loginUser(
                        this.state.email,
                        this.state.pass
                    )

                    }
                        style={{

                            opacity: (this.state.email === '' || this.state.pass === '')
                                ? 0.5 : 1,
                        }}
                        disabled={
                            this.state.email === '' || this.state.pass === ''
                        }
                    >
                        <Text style={style.btnLogin}>Ingresar</Text>
                    </TouchableOpacity>
                    <Text onPress={() => this.props.navigation.navigate('Register')} style={style.registro}>No tenes cuenta? Registrate acá</Text>
                </View>
            </View>
        )



    };



}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        color: 'rgb(255,255,255)',
        padding: 15,
        justifyContent: 'center',
    },
    title: {
        fontWeight: 600,
        color: 'black',
        fontSize: 24,
        textAlign: 'center'
    },
    btnLogin: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'rgb(0,0,0)',
        margin: 10,
        color: 'white',
        padding: 10,
        textAlign: 'center',
        borderRadius: 8
    },
    registro:{

    },
    error:{
        color: 'red'
    
    },
    btnLoginTxt: {
        color: 'black'
    },
    input: {
        color: 'rgb(0,0,0)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(0,0,0)',
        backgroundColor: 'rgb(255,255,255)',
        padding: 10,
        margin: 10
    }
});



export default Login;