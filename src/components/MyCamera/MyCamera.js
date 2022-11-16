import React, { Component } from 'react';
import { Camera } from 'expo-camera';
import { storage } from '../../firebase/config';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';

class MyCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permissions: false,
            showCamera: true,
            urlTemporal: ''
        }

        this.metodosDeCamara = ''
    }

    componentDidMount() {
        Camera.requestCameraPermissionsAsync()
            .then(() => this.setState({
                permissions: true
            }))
            .catch(e => console.log(e))
    }

    sacarFoto() {
        //Aca hay que usar los métodos de la cámara
        this.metodosDeCamara.takePictureAsync()
            .then(photo => {
                this.setState({
                    urlTemporal: photo.uri,
                    showCamera: false
                })
            })
            .catch(e => console.log(e))
    }

    pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        this.handleImagePicked(pickerResult);
    };

    handleImagePicked = async (pickerResult) => {
        try {
          if (!pickerResult.cancelled) {
            this.guardarFoto(pickerResult.uri);
          }
        } catch (e) {
          console.log(e);
          alert("Upload failed, sorry :(");
        }
    };

    guardarFoto(uploadUrl) {
        fetch(uploadUrl)
            .then(res => res.blob())
            .then(imagen => {
                const refStorage = storage.ref(`photos/${Date.now()}.jpg`);
                refStorage.put(imagen)
                    .then(() => {
                        refStorage.getDownloadURL()
                            .then(url => this.props.onImageUpload(url))
                        this.setState({
                            urlTemporal: '',
                            showCamera: false
                        })
                    })

            })
            .catch(e => console.log(e))
    }

    cancelar() {
        this.setState({
            urlTemporal: '',
            showCamera: true
        })

    }

    render() {
        return (
            <View style={styles.fondo}>
            <View>
                {
                    this.state.permissions ?
                        this.state.showCamera ?
                            <View style={styles.cameraBody}>
                                <Camera
                                    style={styles.camera}
                                    type={Camera.Constants.Type.front}
                                    ref={metodosDeCamara => this.metodosDeCamara = metodosDeCamara}
                                />
                                <TouchableOpacity style={styles.button} onPress={() => this.sacarFoto()}>
                                    <Text style={styles.texto5}><Ionicons name="radio-button-on" size={90} color="rgb(217, 217, 217)" /></Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.subir} onPress={this.pickImage}>
                                    <Text style={styles.subir}> <AntDesign name="upload" size={25} color="rgb(217, 217, 217)" />  O subir foto de la galería</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View>
                                <Image
                                    style={styles.preview}
                                    source={{ uri: this.state.urlTemporal }}
                                    resizeMode='cover'
                                />
                                 <View style={styles.botones}>
                                 <TouchableOpacity style={styles.aceptar1} onPress={() => this.guardarFoto(this.state.urlTemporal)}>
                                    <Text style={styles.aceptar}>Aceptar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.aceptar1} onPress={() => this.cancelar()}>
                                    <Text style={styles.aceptar}>Cancelar</Text>
                                </TouchableOpacity>
                                
                            </View>
                            </View>


                        :
                        <Text>No tengo permisos</Text>
                }
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    fondo:{
        backgrounColor: 'white',
    },
    cameraBody: {
        height: '60vh',
        backgroundColor: 'white',
        borderRadius: 8
    },
    preview: {
        height: '40vh'
    },
    camera:{
        borderRadius: 8
    },
    subir:{
        color: 'rgb(217, 217, 217)',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: 20
    },
    botones:{
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    texto: {
        fontWeight: 600,
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 0,
        borderWidth: 2,
    },
    texto5:{
        textAlign: 'center',
    },
    aceptar:{
        fontWeight: 600,
        color: 'rgb(217, 217, 217)',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 10,
        borderWidth: 2,
        borderColor: 'rgb(217, 217, 217)',
        padding: 10,
        borderRadius: 8,
        
    },
   
})

export default MyCamera;