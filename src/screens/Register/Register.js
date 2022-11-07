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
            <View> 
                <Text>Registro</Text>
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
                    <TextInput  
                        placeholder='user name'
                        keyboardType='default'
                        onChangeText={ text => this.setState({userName:text}) }
                        value={this.state.userName}
                    />
                    <TextInput  
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
                        <Text>Registrarme</Text>
                    </TouchableOpacity>
                    <Text onPress={ () => this.props.navigation.navigate('Login')} >Iniciar Sesion</Text>     
                </View>
            </View>
        )
    }
    
}


export default Register;