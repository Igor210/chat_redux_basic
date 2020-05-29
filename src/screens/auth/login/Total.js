import React, {Component} from 'react';
import {Image,Platform, StyleSheet, Text, View} from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import LoginScreen from './Login'
import SignupScreen from './Signup'

export default class TotalScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }


  componentDidMount() {
    global.navigationProps = this.props.navigation;
  }

  render() {
      return (
        <AppContainer navigationProps = {this.props.navigation}/>
      );
  }

}

const TabNavigator = createBottomTabNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen,
  },
  {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          if (routeName === 'Login') {
            return (
              <Icon name="user" size={18} color={tintColor}/>
            );
          }
          if (routeName === 'Signup') {
            return (
              <Icon name="user-plus" size={18} color={tintColor}/>
            );
          }
        },
      }),
      tabBarOptions: {
        activeTintColor: '#91C493',
        inactiveTintColor : 'gray',
        style: {
          backgroundColor: 'white',
          borderTopColor : 'gray',
          borderTopWidth: 1,
        }
      },
  }
);

const AppContainer = createAppContainer(TabNavigator);

