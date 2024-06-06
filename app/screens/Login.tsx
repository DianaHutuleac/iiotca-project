import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import React, {useEffect, useState} from "react";
import { API_URL, useAuth } from "../context/AuthContext";

const Login = () =>{

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const{onLogin, onRegister} = useAuth();



    const login = async () => {
        const result = await onLogin!(email, password);
        if (result && result.error) {
            alert(result.msg);
            console.log(result);
        }
    };

    // automatically call the login after a successfull registration
    const register = async () => {
        const result = await onRegister!(email, password);
        if (result && result.error) {
            alert(result.msg);
        } else{
            login();
        }
    }

    return(
        <View style={styles.container}>
        <Image source={require('../../assets/library_logo.jpeg')} style={styles.image} />
        <Text style={styles.heading}>Welcome to our Smart Library Box App!</Text>
            <View style={styles.form}>
                <TextInput autoCapitalize="none" style={styles.input} placeholder="Email" onChangeText={(text: string) => setEmail(text)} value={email}/>
                <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={(text:string) => setPassword(text)} value={password}/>
                <Button onPress={login} title="Sign in"/>
                <Button onPress={register} title="Create Account"/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '50%',
        height: '50%',
        resizeMode:'contain',
        marginTop:-300,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop:-50,
        textAlign: 'center',
        paddingRight:30,
        paddingLeft:30,
      },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      form: {
        width: '80%',
        alignItems: 'center',
      },
      input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        marginTop: 10,
        width: '100%',
        backgroundColor: '#fff',
      },

});

export default Login;