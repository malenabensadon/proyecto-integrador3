import { black } from "kleur";
import react, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import { Button } from "react-native-web";

function Navbar() {
    return (
        <View>
            <nav className="headerDesktop" style={styles.nav}>
                <div className="logoBeFoodie">
                    <Image style={styles.logo}
                        source={require("../../../assets/logoblanconew.png")}
                        resizeMode='contain' />
                </div>

                {/* <div className="perfilLogo">
            <Image style = {styles.perfil} 
                source={require("../../../assets/user.png")}
                resizeMode='contain'/>
            </div> */}
            </nav>
        </View>
    )
}
const styles = StyleSheet.create({
    logo: {
        height: 85,
    },
    nav: {
        backgroundColor: 'white',
        
    }

})

export default Navbar