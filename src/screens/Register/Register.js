import React, { Component } from 'react';
import {auth, db} from '../../firebase/config';
import { View,
         Text,
         TextInput,
         TouchableOpacity,
        StyleSheet } from 'react-native';

class Register extends Component {
    constructor(){
        super()
        this.state = {
            email:'',
            pass:'',
            userName:'',
            bio:'',
            errors: {
                field: '',
                message: ''
            }
            
        }
    }

    registerUser(email, pass, userName, bio){
        //Registrar en firebase y si el reigstro sale bien redireccionar a Home
        auth.createUserWithEmailAndPassword(email, pass)
            .then( res => {
                db.collection('users').add({
                    owner: email,
                    userName: userName,
                    bio: bio,
                    createdAt: Date.now()
                })
                .then(() => {
                    this.setState({
                        email:'',
                        pass:'',
                        userName:'',
                        bio:'',
                        errors: {
                            field: '',
                            message: ''
                        }                        
                    })

                    this.props.navigation.navigate('HomeMenu')
                })
               
              
                
            })
            .catch(error => {
                let errorField = ''
                if (error.code === 'auth/invalid-email') {
                    errorField = "email"
                } else if (error.code === 'auth/weak-password') {
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
            <View style={style.container}> 
                <Text style={style.title}>Register</Text>
                <View>
                    <TextInput  style={style.input}
                        placeholder='Email'
                        keyboardType='email-address'
                        onChangeText={ text => this.setState({email:text}) }
                        value={this.state.email}
                    />
                    {this.state.errors.field === 'email' && (
                        <Text> {this.state.errors.message} </Text>
                    )}
                    <TextInput  style={style.input}
                        placeholder='Password'
                        keyboardType='default'
                        onChangeText={ text => this.setState({pass:text}) }
                        value={this.state.pass}
                    />
                    {this.state.errors.field === 'password' && (
                        <Text> {this.state.errors.message} </Text>
                    )}
                    <TextInput  style={style.input}
                        placeholder='Username'
                        keyboardType='default'
                        onChangeText={ text => this.setState({userName:text}) }
                        value={this.state.userName}
                    />
                    <TextInput  style={style.input}
                        placeholder='Mini Bio'
                        keyboardType='default'
                        onChangeText={ text => this.setState({bio:text}) }
                        value={this.state.bio}
                    />   

                    <TouchableOpacity
                        onPress={()=> this.registerUser(
                                this.state.email,
                                this.state.pass,
                                this.state.userName,
                                this.state.bio
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
                        <Text style={style.text}>Registrarme</Text>
                    </TouchableOpacity>
                    <Text onPress={ () => this.props.navigation.navigate('Login')} style={style.btnLoginTxt}>Iniciar Sesion</Text>     
                </View>
            </View>
        )
    }
    
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
        borderColor: 'rgb(213, 42, 153)',
        backgroundColor: 'rgb(0,0,0)',
        margin: 10,
        padding: 10,
        textAlign: 'right'
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


export default Register;