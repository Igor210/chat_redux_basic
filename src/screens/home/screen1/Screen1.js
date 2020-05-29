import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from './Screen1.styles';
import { CCDATA } from './const'

import { connect } from 'react-redux'

import { setCC } from '../../../store/session'

class Screen1 extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 'country',
      country: '',
    }

    this.onShowCity = this.onShowCity.bind(this);
    this.onCity = this.onCity.bind(this);
  }

  componentDidMount() {
  }

  onShowCity(country) {
    this.setState({
      page: 'city',
      country: country,
    })
  }

  onCity(city) {
    this.setState({
      country: '',
      page: 'country',
    });
    this.props.setCC(this.props.user.user.uid, this.state.country, city);
    this.props.navigation.navigate('Screen2');
  }

  render() {
    const items = [];
    if (this.state.page == 'country') {
      for (key in CCDATA) {
        if (key == "") continue;
        items.push(
          <TouchableOpacity style={styles.cardBox} activeOpacity={.7} onPress={this.onShowCity.bind(null, key)} key={key}>
            <Text style={styles.cardText}>{key}</Text>
          </TouchableOpacity>
        )
      }
    } else {
      var temp = CCDATA[this.state.country];
      for (var i = 0; i < 100; i++) {
        if (temp[i] == "") continue;
        items.push(
          <TouchableOpacity style={styles.cardBox} activeOpacity={.7} onPress={this.onCity.bind(null, temp[i])} key={i}>
            <Text style={styles.cardText}>{temp[i]}</Text>
          </TouchableOpacity>
        )
      }
    }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.cardContainer}>
          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 5 }}>
            {items}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.session.user,
  ccloading: state.session.ccloading,
  ccerror: state.session.ccerror,
})

const mapDispatchToProps = {
  setCC: setCC,
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen1)
