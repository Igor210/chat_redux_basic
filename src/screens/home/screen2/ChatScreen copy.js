import React from 'react';
import { View, ScrollView } from 'react-native';

import ChatSmall from './ChatSmall'
import { connect } from 'react-redux'

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }


  componentDidMount() {
  }

  render() {
    const items = [];
    var members = this.props.members;
    var groups = this.props.groups;
    for (key in members) {
      if (key == this.props.user.user.uid) continue;
      var flag = 0, key2;
      for (key1 in groups) {
        if (groups[key1].genre == 'p2p' && groups[key1].members.includes(this.props.user.user.uid) && groups[key1].members.includes(key)) {
          flag = 1;
          key2 = key1;
        }
      }
      if (flag == 0) {
        if (!this.props.presence) {
          items.push(
            <ChatSmall
              type={"chat"}
              memberKey={key}
              member={members[key]}
              key={key}
              user={this.props.user.user}
              profile={this.props.profile}
              name={members[key].name}
              img=''
            />
          )
        } else if (this.props.presence[key]) {
          items.push(
            <ChatSmall
              type={"chat"}
              memberKey={key}
              member={members[key]}
              key={key}
              user={this.props.user.user}
              profile={this.props.profile}
              name={members[key].name}
              online={this.props.presence[key].state == 'online' ? true : false}
              img=''
            />
          )
        }
      } else {
        var allmessages = this.props.allmessages;
        var count = 0;
        var flag1 = 0, totalMsgCount = 0;
        if (allmessages) {
          for (keya in allmessages[key2]) {
            totalMsgCount++;
            if (groups[key2].last_visit) {
              for (keyg in groups[key2].last_visit) {
                if(keyg == this.props.profile.id) flag1 = 1;
                if (keyg == this.props.profile.id && allmessages[key2][keya].send_date > groups[key2].last_visit[keyg].createdAt)
                  count++;
              }
            }
          }
        }
        if(flag1 == 0) count = totalMsgCount;
        if (!this.props.presence) {
            items.push(
              <ChatSmall
                type="group"
                name={groups[key2].name}
                groupKey={key2}
                key={key2}
                profile={this.props.profile}
                lastMsg={groups[key2].lastMsg}
                lastMsgDate={groups[key2].lastMsgDate}
                missCount={count}
                img=''
              />
            )
        } else if (this.props.presence[key]) {
          items.push(
            <ChatSmall
              type="group"
              name={groups[key2].name}
              groupKey={key2}
              key={key2}
              profile={this.props.profile}
              lastMsg={groups[key2].lastMsg}
              lastMsgDate={groups[key2].lastMsgDate}
              missCount={count}
              online={this.props.presence[key].state == 'online' ? true : false}
              type1="p2p"
              img=''
            />
          )
        }
      }
    }
    return (
      <View style={{ flex: 1, width: '100%', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, }}>
        <ScrollView style={{ width: '100%' }}>
          {items}
        </ScrollView>
      </View>
    );
  }

}

const mapStateToProps = state => ({
  members: state.session.members,
  groups: state.session.groups,
  user: state.session.user,
  profile: state.session.profile,
  presence: state.session.presence,
  allmessages: state.session.allmessages,
})

export default connect(mapStateToProps)(ChatScreen)

