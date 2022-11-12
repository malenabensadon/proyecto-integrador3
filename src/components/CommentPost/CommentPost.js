import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';

import { auth, db } from '../../firebase/config';
import firebase from 'firebase';

class CommentPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    componentDidMount() {
        
    }

    render() {
        
        return (
            <Text>Hola</Text>
           
        )
    }
}

export default CommentPost;