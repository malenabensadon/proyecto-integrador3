import React, { Component } from 'react';
import { Camera } from 'expo-camera';
import { storage } from '../../firebase/config';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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
            <View>
                {
                    this.state.permissions ?
                        this.state.showCamera ?
                            <View style={styles.cameraBody}>
                                <Camera
                                    style={styles.cameraBody}
                                    type={Camera.Constants.Type.front}
                                    ref={metodosDeCamara => this.metodosDeCamara = metodosDeCamara}
                                />
                                <TouchableOpacity style={styles.button} onPress={() => this.sacarFoto()}>
                                    <Text style={styles.texto}>Sacar foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={this.pickImage}>
                                    <Text style={styles.texto}>Subir Foto</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View>
                                <Image
                                    style={styles.preview}
                                    source={{ uri: this.state.urlTemporal }}
                                    resizeMode='cover'
                                />
                                <TouchableOpacity style={styles.button} onPress={() => this.cancelar()}>
                                    <Text style={styles.texto}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => this.guardarFoto(this.state.urlTemporal)}>
                                    <Text style={styles.texto}>Aceptar</Text>
                                </TouchableOpacity>
                            </View>

                        :
                        <Text>No tengo permisos</Text>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cameraBody: {
        height: '80vh',
    },
    button: {
        height: '20vh',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 5,
        borderRadius: 4,
        marginTop: 20
    },
    preview: {
        height: '40vh'
    },
    texto: {
        fontWeight: 600,
        color: 'white',
        fontSize: 24,
        textAlign: 'center'

    }
})

export default MyCamera;