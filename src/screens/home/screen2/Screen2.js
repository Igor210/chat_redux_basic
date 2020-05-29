import React, { Component } from 'react'
import {Image, Text, View, TouchableOpacity } from 'react-native'
import { createAppContainer , createMaterialTopTabNavigator} from 'react-navigation';

import Groups from './Groups'
import RecentScreen from './Recent'
import ChatScreen from './ChatScreen'

import chatplusImage from '../../../assets/images/chatplus.png'
import CreateChat from './CreateChat';

export default class Screen2 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.modalDidClose = this.modalDidClose.bind(this);

  }

  closeModal = () => {
    this.setState({ open: false });
  }

  modalDidClose = () => {
    this.setState({ open: false });
  };

  openModal() {
    this.setState({
      open: true,
    });
  }

  render() {
    return (
      <View style={{flex:1}}>
        <AppContainer />
          <TouchableOpacity style={{ position: 'absolute', right: 20, bottom: 60 }} activeOpacity={.7} onPress={this.openModal}>
            <Image source={chatplusImage} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
          </TouchableOpacity>
          <CreateChat
            open={this.state.open}
            modalDidClose={this.modalDidClose}
            closeModal={this.closeModal}
          />
        </View>
    );
  }
}

const TabNavigator = createMaterialTopTabNavigator(
  {
    Recent: { screen: RecentScreen , navigationOptions: {title: 'Recent',},},
    Chat: ChatScreen,
    Groups : Groups,
  },
  {
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'gray',
      pressColor: '#EEE',
      style: {
        backgroundColor: 'white',
      },
      labelStyle: {
        paddingTop : 3,
        textAlign: 'center',
      },
      indicatorStyle: {
        borderBottomColor: '#1E7FCB',
        borderBottomWidth: 3,
      },
    },
  }
);

const AppContainer = createAppContainer(TabNavigator);
