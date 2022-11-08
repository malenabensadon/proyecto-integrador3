import React, { Component } from 'react';
import {auth, db} from '../../firebase/config';
import { View,
         Text,
         TextInput,
         TouchableOpacity,
        StyleSheet,
        FlatList } from 'react-native';

class Profile extends Component {
    constructor(){
        super()
        this.state = {
            user: []
            
        }
    }

//    componentDidMount(){
//     db.collection('users').onSnapshot(
//         docs => {
//             let users = [];
//             docs.forEach(
//                 doc => {
//                     users.push({
//                         id: doc.id,
//                         data: doc.data()
//                     })
//                     this.setState({ user: users})
//                 }
//             )
//         }
//     )

//    } 
     



    render(){
        console.log(this.state.user);
        return(
            
            <View> 
                <Text>Profile</Text>
                {/* <Text>{auth.currentUser.owner}</Text> */}
                {/* <FlatList 
                    data={this.state.user}
                    keyExtractor={ oneUser => oneUser.id.toString()}
                    renderItem={ ({item}) => <Text> {item.data.owner } </Text>}
                />    */}
            </View>
        )
    }
    
}


export default Profile;