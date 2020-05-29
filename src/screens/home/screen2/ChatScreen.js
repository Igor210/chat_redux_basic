import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';

import ChatSmall from './ChatSmall'

import { connect } from 'react-redux'

import { loadGroups, loadAllMessages, loadPresence, loadMember } from '../../../store/session'
import styles from './AddGroup.styles';
import chatplusImage from '../../../assets/images/chatplus.png'

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);


    this.onStart = this.onStart.bind(this);
  }

  onStart() {
    this.props.navigation.navigate('Chat');
  }



  componentDidMount() {
    this.props.loadAllMessages();
    this.props.loadGroups();
    this.props.loadPresence();
    this.props.loadMember();
  }

  render() {
    const items = [];
    var groups = this.props.groups;
    var allmessages = this.props.allmessages;
    var sortedGroups = [];

    if (groups)
      sortedGroups = Object.keys(groups).sort(function (a, b) { return groups[b].lastMsgDate - groups[a].lastMsgDate })
    for (var i = 0; i < sortedGroups.length;  i++) {
      var key = sortedGroups[i];
      if (this.props.profile) {
        if (!groups[key].members.includes(this.props.profile.id) || !groups[key].lastMsg) continue;
      }
      var count = 0;
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
      if(groups[key].genre == "p2p"){
        var another_id = null;
        for(var ii = 0; ii < groups[key].members.length; ii++) {
          if(groups[key].members[ii] != this.props.profile.id)
            another_id = groups[key].members[ii];
        }
          if (!this.props.presence) {
            items.push(
              <ChatSmall
                key={key}
                type="group"
                groupKey={key}
                curGroup={groups[key]}
                name={groups[key].name}
                lastMsg={groups[key].lastMsg}
                lastMsgDate={groups[key].lastMsgDate}
                missCount={count}
                img={'img' in groups[key] ? groups[key].img : ''}
              />
            )
        } else if (this.props.presence[another_id]) {
            items.push(
              <ChatSmall
                key={key}
                type="group"
                groupKey={key}
                curGroup={groups[key]}
                name={this.props.members ? this.props.members[another_id].name : ''}
                img={(this.props.members && 'profile_img' in this.props.members[another_id]) ? this.props.members[another_id].profile_img : ''}
                lastMsg={groups[key].lastMsg}
                lastMsgDate={groups[key].lastMsgDate}
                missCount={count}
                online={this.props.presence[another_id].state == 'online' ? true : false}
                type1="p2p"
            />
          )
        }
      }
    }
    if (items.length > 0) {
      return (
        <View style={{ flex: 1, width: '100%', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, position: 'relative' }}>
          <ScrollView style={{ width: '100%' }}>
            {items}
          </ScrollView>
        </View>
      );
    } else {
      return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{color : 'gray', fontSize : 20, marginBottom : 10}}>No messages to show.</Text>
          <TouchableOpacity style={styles.blueButton} onPress={this.onStart}>
            <Text style={{fontSize : 20, color : 'white'}}>Start communicating!</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

}

const mapStateToProps = state => ({
  groups: state.session.groups,
  profile: state.session.profile,
  allmessages: state.session.allmessages,
  presence : state.session.presence,
  members: state.session.members,
})

const mapDispatchToProps = {
  loadGroups: loadGroups,
  loadAllMessages: loadAllMessages,
  loadPresence: loadPresence,
  loadMember: loadMember,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
