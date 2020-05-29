import React from "react";
import { View, Button , AsyncStorage ,  StyleSheet , TextInput, Image, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { NavigationActions } from 'react-navigation';

import logoImage from '../../../assets/images/logo.png'
import styles from './Login.styles';

import { connect } from 'react-redux'

import { loginUser } from '../../../store/session'
class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.saveCredit = this.saveCredit.bind(this);

  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const email = await AsyncStorage.getItem('atm_email');
    const password = await AsyncStorage.getItem('atm_password');

    if(email && password)
      this.props.login(email, password);
  };

  saveCredit = async () => {
    try {
        await AsyncStorage.setItem('atm_email', global.email);
        await AsyncStorage.setItem('atm_password', global.password);
    } catch (error) {
        console.log(error.message);
    }
  };

  handleEmailChange = (email) => {
    this.setState({email: email})
  }

  handlePasswordChange = (password) => {
    this.setState({password: password})
  }

  handleButtonPress = () => {
    if( !this.state.email ) {
      alert("Please input email.");
      return;
    }
    if( !this.state.password ) {
      alert("Please input password.");
      return;
    }
    global.email = this.state.email;
    global.password = this.state.password;
    this.props.login(this.state.email, this.state.password);
  } 

  render() {
    if(this.props.error) {
      // alert('Please input password or email correctly!');
    }
    if (this.props.logged && this.props.loading == false && !this.props.error) {
      this.saveCredit();
      if (this.props.profile) {
        var navigationProps = global.navigationProps;
        if (this.props.profile.country && this.props.profile.city) {
          navigationProps.navigate('Home', {}, NavigationActions.navigate({ routeName: 'Screen2' }))
        } else {
          navigationProps.navigate('Home', {}, NavigationActions.navigate({ routeName: 'Screen1' }))
        }
      }
    }
    return (
      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Image source={logoImage} style={styles.logoImgae}/>
        </View>
        <View style={styles.mainContainer}>
          <TextInput
            style={styles.textInput}
            placeholder='Email'
            returnKeyType='next'
            keyboardType='email-address'
            autoCapitalize='none'
            placeholderTextColor = 'white'
            onChangeText={this.handleEmailChange}
            value={this.state.email}
          />

          <TextInput
            style={[styles.textInput, styles.mt1]}
            placeholder='Password'
            secureTextEntry={true}
            returnKeyType='done'
            placeholderTextColor = 'white'
            onChangeText={this.handlePasswordChange}
            value={this.state.password}
          />
          <TouchableOpacity style={[styles.greenButton, styles.mt2]} onPress={this.handleButtonPress}>
            <Text style={styles.whilteText}>Login</Text>
          </TouchableOpacity>
          <Text style={[styles.normalText , styles.mt1]}>
            Please use the username and{'\n'}password shared with you
          </Text>
        </View>
        {(this.props.loading)  &&
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
  loading: state.session.loading,
  logged: state.session.user != null,
  error: state.session.error,
  user: state.session.user,
  profile: state.session.profile,
})

const mapDispatchToProps = {
  login: loginUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)