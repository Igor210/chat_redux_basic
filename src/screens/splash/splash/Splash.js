import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  Text,
} from 'react-native';

export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    setTimeout(() => {
      this.props.navigation.navigate(userToken ? 'Home' : 'Auth');
    }, 3000);
  };

  render() {
    return (
      <View style={{ justifyContent: 'center', height: '100%', alignItems: 'center' }}>
        <Text>Loading...</Text>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}