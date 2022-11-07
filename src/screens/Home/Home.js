import React, { Component } from 'react';
import {auth, db} from '../../firebase/config';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import NewPost from '../NewPost/NewPost';
import Post from '../../components/Post/Post'


class Home extends Component{
    constructor(){
        super();
        this.state = {
            posts:[]
        }
    }

    componentDidMount(){
        console.log(auth.currentUser);
        // db.collection('posts').onSnapshot(
        //     docs => {
        //         //console.log(docs);
        //         let posts = [];
        //         docs.forEach( doc => {
        //             posts.push({
        //                 id: doc.id,
        //                 data: doc.data()
        //             })
        //             this.setState({
        //                 posts: posts
        //             })
        //         })
                
        //     }
        // )
    }

    logout(){
        auth.signOut()
        .then(()=> this.props.navigation.navigate("Login"))
    }

    render(){
        return(
            <>
                <Text> Home</Text>
                <Text> Lista de posteos </Text> 
                
                <TouchableOpacity onPress={ () => this.props.navigation.navigate('NewPost')}>
                    <Text>New Post</Text>
                </TouchableOpacity>

                <FlatList 
                        data={this.state.posts}
                        keyExtractor={ onePost => onePost.id.toString()}
                        renderItem={ ({item}) => <Post postData={item} />}
                    />   
                 <TouchableOpacity onPress={ () => this.logout()} >
                    <Text>Log out</Text>
                 </TouchableOpacity>
            </>

        )
    }
}

export default Home;