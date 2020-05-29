import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ImageBackground, Dimensions, SafeAreaView } from 'react-native';
import {
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/Ionicons';


import Screen1 from '../screens/home/screen1/Screen1';
import Screen2 from '../screens/home/screen2/Screen2';
import Screen3 from '../screens/home/screen3/Screen3';
import Screen4 from '../screens/home/screen4/Screen4';
import CustomSideBar from '../components/CustomSideBar';
import styles from './HomeRouter.styles';
import logoImage from '../assets/images/logo.png'
import logoSmallImage from '../assets/images/logo_small.png'

class NavigationDrawerStructure extends Component {

  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' , marginLeft : 10 }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <Icon name="bars" color="white" size={20} />
        </TouchableOpacity>
      </View>
    );
  }
}

class CustomHeader extends Component {

  render() {
    return (
      <SafeAreaView>
      <ImageBackground
        source={logoImage}
        style={styles.imageBackContainer}
      >
        <Icon1 name="ios-notifications" color="white" size={25} />
        <NavigationDrawerStructure navigationProps={this.props.navigationProps} />
      </ImageBackground>
      </SafeAreaView>
    );
  }
}

class CustomHeader1 extends Component {

  render() {
    return (
      <SafeAreaView>
      <ImageBackground
        source={logoSmallImage}
        style={styles.imageBackContainer1}
      >
        <Icon1 name="ios-notifications" color="white" size={25} />
        <NavigationDrawerStructure navigationProps={this.props.navigationProps} />
      </ImageBackground>
      </SafeAreaView>
    );
  }
}

const Screen1_StackNavigator = createStackNavigator({
  First: {
    screen: Screen1,
    navigationOptions: ({ navigation }) => ({
      header: <CustomHeader navigationProps={navigation}/>,
    }),
  },
});

const Screen2_StackNavigator = createStackNavigator({
  Second: {
    screen: Screen2,
    navigationOptions: ({ navigation }) => ({
      header: <CustomHeader1 navigationProps={navigation}/>,
    }),
  },
});

const Screen3_StackNavigator = createStackNavigator({
  Third: { screen: Screen3 , navigationOptions: {header: null,},},
});

const Screen4_StackNavigator = createStackNavigator({
  Fouth: { screen: Screen4 , navigationOptions: {header: null,},},
});


export const HomeRouter = createDrawerNavigator(
  {
    Screen1: {
      screen: Screen1_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Screen 1',
      },
    },
    Screen2: {
      screen: Screen2_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Screen 2',
      },
    },
    Screen3: {
      screen: Screen3_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Screen 3',
      },
    },
    Screen4: {
      screen: Screen4_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Screen 4',
      },
    },
  },
  {
    contentComponent: CustomSideBar,
    drawerWidth: Dimensions.get('window').width * 0.9,
  }
);