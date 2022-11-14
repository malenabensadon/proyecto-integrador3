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
import Post from '../../components/Post/Post';

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
            editSucces: false
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


    render() {
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
                        resizeMode='cover'
                    />
                    <Text style={styles.textos2}>Cantidad de posteos: {this.state.userPosts.length}</Text>
                    <FlatList
                        data={this.state.userPosts}
                        keyExtractor={onePost => onePost.id.toString()}
                        renderItem={({ item }) => <Post postData={item} irAComments={() => { }} refrescarPosts={this.getUserPosts} />}
                    />
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


export default Profile;