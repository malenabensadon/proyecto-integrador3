import React, { Component } from 'react';
import {auth} from '../../firebase/config';
import { View,
         Text,
         TextInput,
         TouchableOpacity,
        StyleSheet } from 'react-native';

class Login extends Component {
    constructor(){
        super()
        this.state = {
            email:'',
            pass:'',
            errors: {
                field: '',
                message: ''
            }
        }
    }
    componentDidMount(){ //Solo para redirigir y mostrar más fácil los ejemplos
        auth.onAuthStateChanged(
         user => {
            if (user){
                this.props.navigation.navigate('HomeMenu')
            }
         })
    }

    loginUser(email, pass){
        //Registrar en firebase y si el reigstro sale bien redireccionar a Home
        auth.signInWithEmailAndPassword(email, pass)
            .then( res => {
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
                this.setState ({
                    errors: {
                        field: errorField,
                        message: error.message
                    }
                })
            })
    }


    render(){
        return(
            <View> 
                <Text>Login</Text>
                <View>
                   <TextInput  
                       placeholder='email'
                       keyboardType='email-address'
                       onChangeText={ text => this.setState({email:text}) }
                       value={this.state.email}
                    />
                    {this.state.errors.field === 'email' && (
                        <Text> {this.state.errors.message} </Text>
                    )}
                    <TextInput  
                        placeholder='password'
                        keyboardType='default'
                        onChangeText={ text => this.setState({pass:text}) }
                        value={this.state.pass}
                    />
                    {this.state.errors.field === 'password' && (
                        <Text> {this.state.errors.message} </Text>
                    )}
                    <TouchableOpacity
                        onPress={()=> this.loginUser(
                            this.state.email,
                            this.state.pass
                            )
                        }
                        style={{
                            opacity: (this.state.email === '' || this.state.pass === '')
                                ? 0.5 : 1
                        }}
                        disabled={
                            this.state.email === '' || this.state.pass === ''
                        }
                    >
                        <Text>Ingresar</Text>
                    </TouchableOpacity>
                    <Text onPress={ () => this.props.navigation.navigate('Register')} >Ir a Registro</Text>
                </View>
            </View>
        )
    }
    
}


export default Login;