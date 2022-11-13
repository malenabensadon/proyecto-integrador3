import { AntDesign } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Comments from '../../screens/Comments/Comments';

import Home from '../../screens/Home/Home';
import NewPost from '../../screens/NewPost/NewPost';
import Profile from '../../screens/Profile/Profile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeMenu() {
    return (
        <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
            <Tab.Screen name="HomeStack" component={HomeStack} options={
                {
                    tabBarIcon: () => <AntDesign name="home" size={24} color="black" />
                }
            } />
            <Tab.Screen name="NewPost" component={NewPost} options={
                { tabBarIcon: () => <AntDesign name="pluscircleo" size={24} color="black" /> }
            } />
            <Tab.Screen name="Profile" component={Profile} options={
                { tabBarIcon: () => <AntDesign name="user" size={24} color="black" /> }
            } />
        </Tab.Navigator>
    )
}

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Comments" component={Comments} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


export default HomeMenu;