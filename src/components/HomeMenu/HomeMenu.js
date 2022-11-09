import {Ionicons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import { Entypo, AntDesign } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../../screens/Home/Home';
import NewPost from '../../screens/NewPost/NewPost';
import Profile from '../../screens/Profile/Profile';

const Tab = createBottomTabNavigator();

function HomeMenu(){

    return (
        <Tab.Navigator screenOptions={{tabBarShowLabel: false}}>
            <Tab.Screen name="Home" component={ Home } options={
                    {tabBarIcon: ()=> <AntDesign name="home" size={24} color="black" />}
                }/>
            <Tab.Screen name="NewPost" component={ NewPost } options={
                    {tabBarIcon: ()=> <AntDesign name="pluscircleo" size={24} color="black" /> }
                }/>
            <Tab.Screen name="Profile" component={ Profile } options={
                    {tabBarIcon: ()=> <AntDesign name="user" size={24} color="black" /> }
                }/>
        </Tab.Navigator>
    )

}


export default HomeMenu;