import {Ionicons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../../screens/Home/Home';
import NewPost from '../../screens/NewPost/NewPost';
import Profile from '../../screens/Profile/Profile';

const Tab = createBottomTabNavigator();

function HomeMenu(){

    return (
        <Tab.Navigator screenOptions={{tabBarShowLabel: false}}>
            <Tab.Screen name="Home" component={ Home } />
            <Tab.Screen name="NewPost" component={ NewPost } /> 
            <Tab.Screen name="Profile" component={ Profile } />
        </Tab.Navigator>
    )

}

export default HomeMenu;