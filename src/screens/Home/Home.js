import React, { Component } from 'react';
import { auth, db } from '../../firebase/config';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-web';
import NewPost from '../NewPost/NewPost';
import Post from '../../components/Post/Post'
import Navbar from '../../components/Navbar/Navbar';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            posts: []
        }
    }

    componentDidMount() {
        db.collection('posts').orderBy('createdAt', 'desc').onSnapshot(
            docs => {
                let posts = [];
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    })
                    this.setState({
                        posts: posts
                    })
                })
            }
        )
    }

    logout() {
        auth.signOut()
            .then(() => this.props.navigation.navigate("Login"))
    }

    render() {
        return (

            <>
                <Navbar />
               {/*  <Text style={styles.titulos}>Home</Text>
                <Text style={styles.titulos}>Lista de posteos </Text>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('NewPost')}>
                    <Text style={styles.titulos}>New Post</Text>
                </TouchableOpacity> */}

                <FlatList style={styles.fondo}
                    data={this.state.posts}
                    keyExtractor={onePost => onePost.id.toString()}
                    renderItem={({ item }) => <Post postData={item} />}
                />
                <TouchableOpacity onPress={() => this.logout()} >
                    <Text style={styles.logout}>Log out</Text>
                </TouchableOpacity>
            </>

        )
    }

}
const styles = StyleSheet.create({
    fondo: {
        backgroundColor: 'black'

    },
    logout: {
        color: 'white',
        backgroundColor: 'black'

    },
    titulos: {
        color: 'white',
        backgroundColor: 'black',
        flex: 1


    }

})

export default Home;