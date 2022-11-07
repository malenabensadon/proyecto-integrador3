import {Ionicons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../../screens/Home/Home';
// import Profile from '../screens/profile';
import NewPost from '../../screens/NewPost/NewPost';

const Tab = createBottomTabNavigator();

function HomeMenu(){

    return (
        <Tab.Navigator screenOptions={{tabBarShowLabel: false}}>
            <Tab.Screen name="Home" component={ Home } />
             {/* <Tab.Screen name="Profile" component={ Profile } /> */}
            <Tab.Screen name="NewPost" component={ NewPost } /> 
        </Tab.Navigator>
    )

}

export default HomeMenu;