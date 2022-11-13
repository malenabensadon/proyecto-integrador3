import React, { Component } from 'react';
import { auth, db } from '../../firebase/config';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-web';
import Post from '../../components/Post/Post'
import Navbar from '../../components/Navbar/Navbar';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            postID: ''
        }
    }

    componentDidMount() {
        this.getPosts.bind(this);
        this.getPosts();
    }

    getPosts() {
        db.collection('posts').orderBy('createdAt', 'desc').onSnapshot(
            docs => {
                let posts = [];
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    })
                    this.setState({
                        posts: posts,
                        postID: doc.id
                    })
                })
            }
        )
    }

    logout() {
        auth.signOut()
            .then(() => this.props.navigation.navigate("Login"))
    }

    irAComments() {
        this.props.navigation.navigate("Comments", { id: this.state.postID })
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
                    renderItem={({ item }) => <Post postData={item} irAComments={() => this.irAComments()} refrescarPosts={this.getPosts} />}
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
        color: 'rgb(0,0,0)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(0,0,0)',
        backgroundColor: 'rgb(255,255,255)',
        padding: 10,
        margin: 10

    },
    titulos: {
        color: 'white',
        backgroundColor: 'black',
        flex: 1


    }

})

export default Home;