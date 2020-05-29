import React, {Component} from 'react';
import {Image,Platform, StyleSheet, Text, View} from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import AllScreen from './AllScreen'
import PublicScreen from './PublicScreen'
import PrivateScreen from './PrivateScreen'
import MyGroupsScreen from './MyGroupsScreen'
import allImage from '../../../assets/images/all.png'
import privateImage from '../../../assets/images/private.png'
import publicImage from '../../../assets/images/public.png'
import groupsImage from '../../../assets/images/groups.png'

export default class Screnn2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }


  componentDidMount() {
  }

  render() {
      return (
        <AppContainer navigationProps = {this.props.navigation}/>
      );
  }

}

const TabNavigator = createBottomTabNavigator(
  {
    All: AllScreen,
    Public: PublicScreen,
    Private: PrivateScreen,
    My_Groups: MyGroupsScreen,
  },
  {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          if (routeName === 'All') {
            return (
              <Image source={allImage} style={{width: 20, height: 20, resizeMode : 'contain'}}/>
            );
          }
          if (routeName === 'Public') {
            return (
              <Image source={publicImage} style={{width: 20, height: 20, resizeMode : 'contain'}}/>
            );
          }
          if (routeName === 'Private') {
            return (
              <Image source={privateImage} style={{width: 20, height: 20, resizeMode : 'contain'}}/>
            );
          }
          if (routeName === 'My_Groups') {
            return (
              <Image source={groupsImage} style={{width: 20, height: 20, resizeMode : 'contain'}}/>
            );
          }
        },
      }),
      tabBarOptions: {
        activeTintColor: '#0075D2',
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

