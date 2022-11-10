import React, { Component } from 'react';
import { auth, db } from '../../firebase/config';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-web';

class Comments extends Component {
    constructor() {
        super();
        this.state = {
            comments: []
        }
    };

    render() {
        return (
            <View />
        )
    };
}


export default Comments;