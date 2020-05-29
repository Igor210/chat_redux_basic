import React from "react";
import { View, AsyncStorage, TextInput, Image, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";

import logoImage from '../../../assets/images/logo.png'
import styles from './Signup.styles';

import { connect } from 'react-redux'
import { signupUser } from '../../../store/session'

class SignupScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            country: '',
            city: '',
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
    }

    handleEmailChange = (email) => {
        this.setState({ email: email })
    }

    handlePasswordChange = (password) => {
        this.setState({ password: password })
    }

    validateEmail(eml) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(eml) === false)
            return false;
        return true;
    }

    handleButtonPress = () => {
        if(this.state.name == '') {
            alert("Please input Name Correctly!");
            return;
        }
        if(this.validateEmail(this.state.email) == false){
            alert("Please input Email Correctly!");
            return;
        }
        if(this.state.phone == '') {
            alert("Please input Phone Number Correctly!");
            return;
        }
        if(this.state.password.length < 6) {
            alert("Please input Password at least 6 letters!");
            return;
        }
        global.email = this.state.email;
        global.password = this.state.password;
        this.props.signup(this.state.email, this.state.password, this.state.name, this.state.phone);
    }

    handleNameChange = (val) => {
        this.setState({ name: val })
    }

    handleCountryChange = (val) => {
        this.setState({ country: val })
    }

    handleCityChange = (val) => {
        this.setState({ city: val })
    }

    handlePhoneChange = (val) => {
        this.setState({ phone: val })
    }

    render() {
        // if (this.props.logged) {
        //     var navigationProps = global.navigationProps;
        //     navigationProps.navigate('Home');
        // }
        return (
            <View style={styles.container}>
                <View style={styles.logoBox}>
                    <Image source={logoImage} style={styles.logoImgae} />
                </View>
                <View style={styles.mainContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Name'
                            returnKeyType='next'
                            autoCapitalize='none'
                            placeholderTextColor='white'
                            onChangeText={this.handleNameChange}
                            value={this.state.name}
                        />
                        <TextInput
                            style={[styles.textInput, styles.mt1]}
                            placeholder='Email'
                            returnKeyType='next'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            placeholderTextColor='white'
                            onChangeText={this.handleEmailChange}
                            value={this.state.email}
                        />

                        <TextInput
                            style={[styles.textInput, styles.mt1]}
                            placeholder='Password'
                            secureTextEntry={true}
                            returnKeyType='done'
                            placeholderTextColor='white'
                            onChangeText={this.handlePasswordChange}
                            value={this.state.password}
                        />

                        {/* <TextInput
                            style={[styles.textInput, styles.mt1]}
                            placeholder='Select country'
                            returnKeyType='next'
                            autoCapitalize='none'
                            placeholderTextColor='white'
                            onChangeText={this.handleCountryChange}
                            value={this.state.country}
                        />

                        <TextInput
                            style={[styles.textInput, styles.mt1]}
                            placeholder='Select city'
                            returnKeyType='next'
                            autoCapitalize='none'
                            placeholderTextColor='white'
                            onChangeText={this.handleCityChange}
                            value={this.state.city}
                        /> */}

                        <TextInput
                            style={[styles.textInput, styles.mt1]}
                            placeholder='Phone Number'
                            returnKeyType='next'
                            autoCapitalize='none'
                            placeholderTextColor='white'
                            onChangeText={this.handlePhoneChange}
                            value={this.state.phone}
                        />

                        <TouchableOpacity style={[styles.greenButton, styles.mt2]} onPress={this.handleButtonPress}>
                            <Text style={styles.whilteText}>Sign Up</Text>
                        </TouchableOpacity>
                </View>
                {this.props.loading &&
                    <View style={styles.overlay}>
                        <Text style={{color: 'white'}}>Loading...</Text>
                        <ActivityIndicator />
                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = state => ({
    restoring: state.session.restoring,
    logged: state.session.user != null,
    loading : state.session.loading,
})


const mapDispatchToProps = {
    signup: signupUser
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
