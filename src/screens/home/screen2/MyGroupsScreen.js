import React, { Component } from 'react';
import { Image, Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

import ChatSmall from './ChatSmall'

import { connect } from 'react-redux'



class MyGroupsScreen extends React.Component {
  constructor(props) {
    super(props);
  }


  componentDidMount() {
  }

  render() {
    const items = [];
    var groups = this.props.groups;
    for (key in groups) {
      if(this.props.profile) {
        if(groups[key].genre == 'p2p') 
          continue;
        if(!(groups[key].owner != this.props.profile.id))
          continue;
      }
      var count = 0;
        var allmessages = this.props.allmessages;
        var flag1 = 0, totalMsgCount = 0;
        if(allmessages) {
          for(key2 in allmessages[key]){
            totalMsgCount++;
            if(groups[key].last_visit) {
              for(key3 in groups[key].last_visit){
                if(key3 == this.props.profile.id) flag1 = 1;
                if(key3 == this.props.profile.id && allmessages[key][key2].send_date > groups[key].last_visit[key3].createdAt)
                  count++;
              }
            }
          }
        }
        if(flag1 == 0) count = totalMsgCount;
      items.push(
        <ChatSmall 
          type="group"
          name={groups[key].name}
          groupKey={key}
          key={key}
          lastMsg={groups[key].lastMsg}
          lastMsgDate={groups[key].lastMsgDate}
          missCount={count}
          img={'img' in groups[key] ? groups[key].img : ''}
        />
      )
    }
    return (
      <View style={{ flex: 1, width: '100%', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, position: 'relative' }}>
        <ScrollView style={{ width: '100%' }}>
          {items}
        </ScrollView>
      </View>
    );
  }

}

const mapStateToProps = state => ({
  groups: state.session.groups,
  profile: state.session.profile,
  allmessages: state.session.allmessages,
})

export default connect(mapStateToProps)(MyGroupsScreen)