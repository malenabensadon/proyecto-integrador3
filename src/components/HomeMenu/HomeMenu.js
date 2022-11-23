import { AntDesign } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Comments from '../../screens/Comments/Comments';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

import Home from '../../screens/Home/Home';
import MyProfile from '../../screens/MyProfile/MyProfile';
import NewPost from '../../screens/NewPost/NewPost';
import Profile from '../../screens/Profile/Profile';
import ProfileEdit from '../../screens/ProfileEdit/ProfileEdit';
import Search from '../../screens/Search/Search';
import { auth } from '../../firebase/config';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeMenu() {
    return (
        <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
            <Tab.Screen name="HomeStack" component={HomeStack} options={
                {
                    tabBarIcon: () => <AntDesign name="home" size={24} color="black" />, headerShown: false
                }
            } />
            <Tab.Screen name="NewPost" component={NewPost} options={
                { tabBarIcon: () => <AntDesign name="pluscircleo" size={24} color="black" />, headerShown: false, unmountOnBlur: true }
            } />
            {<Tab.Screen name="SearchStack" component={ SearchStack }  options={
                {tabBarIcon: ()=> <Ionicons name="search-outline" size={28} color="black" />, headerShown: false} 
            } /> }
            <Tab.Screen name="MyProfile" component={Profile} initialParams={{email: auth.currentUser.email}} options={
                { tabBarIcon: () => <AntDesign name="user" size={24} color="black" />, headerShown: false, unmountOnBlur: true }
            } />
            
        </Tab.Navigator>
    )
}

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Comments" component={Comments} options={{ headerShown: false }} />
            <Stack.Screen name="HomeProfile" component={Profile} options={{ headerShown: false }}/>
            <Stack.Screen name="ProfileEdit" component={ProfileEdit} options={{ headerShown: false }}/>
        </Stack.Navigator>
    )
}

function SearchStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
            <Stack.Screen name="SearchProfile" component={Profile} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


export default HomeMenu;