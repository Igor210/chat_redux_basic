import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, Modal } from 'react-native';

import { connect } from 'react-redux'

import { loadMember } from '../../../store/session'
import avatarImage from '../../../assets/images/avatar.jpg'
import createChatImage from '../../../assets/images/create_chat.png'
import Profile from './Profile'
import ChatForm from './ChatForm'
import firebaseService from '../../../services/firebase'
import styles1 from './ShowMember.styles';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AddGroup from './AddGroup';

class CreateChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      memberId: '',
      open: false,
      open1: false,
      open2: false,
      groupKey: '',
    };
    this.closeModal = this.closeModal.bind(this);
    this.modalDidClose = this.modalDidClose.bind(this);
    this.closeModal1 = this.closeModal1.bind(this);
    this.modalDidClose1 = this.modalDidClose1.bind(this);
    this.openProfile = this.openProfile.bind(this);
    this.openChatRoom = this.openChatRoom.bind(this);
    this.closeModal2 = this.closeModal2.bind(this);
    this.modalDidClose2 = this.modalDidClose2.bind(this);
    this.openModal2 = this.openModal2.bind(this);
  }

  openModal2() {
    this.setState({
      open2 : true,
    });
  }

  closeModal = () => {
    this.setState({ open: false });
  }

  modalDidClose = () => {
    this.setState({ open: false });
  };

  closeModal2 = () => {
    this.setState({ open2: false });
  }

  modalDidClose2 = () => {
    this.setState({ open2: false });
  };

  closeModal1 = () => {
    this.setState({ open1: false });
    if (this.props.profile && this.state.groupKey) {
      let createdAt = (new Date().getTime() + new Date().getTimezoneOffset()*60*1000);
      let newRow = {
          createdAt: createdAt,
      }
      firebaseService.database().ref().child('/groups/' + this.state.groupKey + "/last_visit/" +  this.props.profile.id)
          .update(newRow, (error) => {
              if (error) {
                  console.log(error);
              }
          })
  }
  }

  modalDidClose1 = () => {
    this.setState({ open1: false });
    if (this.props.profile && this.state.groupKey) {
      let createdAt = (new Date().getTime() + new Date().getTimezoneOffset()*60*1000);
      let newRow = {
          createdAt: createdAt,
      }
      firebaseService.database().ref().child('/groups/' + this.state.groupKey + "/last_visit/" +  this.props.profile.id)
          .update(newRow, (error) => {
              if (error) {
                  console.log(error);
              }
          })
  }
  };

  openProfile(key) {
    this.setState({
      memberId: key,
      open: true,
    });
  }

  openChatRoom() {
    var flag = 0, groupKey;
    var groups = this.props.groups;
    for (key in groups) {
      if (groups[key].genre == 'p2p' && groups[key].members.includes(this.props.profile.id) && groups[key].members.includes(this.state.memberId)) {
        flag = 1;
        groupKey = key;
        break;
      }
    }
    if (flag == 1) {
      this.setState({
        open: false,
        open1: true,
        groupKey: groupKey,
      });
    } else {
      let newGroup = {
        name: this.props.profile.name + " & " + this.props.members[this.state.memberId].name,
        type: "private",
        country: this.props.profile.country,
        city: this.props.profile.city,
        members: [this.props.profile.id, this.state.memberId],
        owner: this.props.profile.id,
        genre: 'p2p',
        lastMsg: '',
        lastMsgDate: '939719978706',
      }

      var groupKey = firebaseService.database().ref('groups').push().key;
      firebaseService.database().ref().child('/groups/' + groupKey)
        .set(newGroup, (error) => {
          if (error) {
          } else {
            this.setState({
              open: false,
              open1: true,
              groupKey: groupKey,
            });
            if (this.props.profile && groupKey) {
              let createdAt = (new Date().getTime() + new Date().getTimezoneOffset()*60*1000);
              let newRow = {
                  createdAt: createdAt,
              }
              firebaseService.database().ref().child('/groups/' + groupKey + "/last_visit/" +  this.props.profile.id)
                  .update(newRow, (error) => {
                      if (error) {
                          console.log(error);
                      }
                  })
            }
          }
        })
    }
  }

  componentDidMount() {
    this.props.loadMember();
  }

  render() {
    const items = [];
    var members = {};
    if (this.props.members)
      members = this.props.members;
    var memberCount = 0;
    for (key in members) {
      if (key == this.props.profile.id) continue;
      memberCount++;
      items.push(
        <TouchableOpacity style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, borderWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2, marginVertical: 5, }} activeOpacity={.7} onPress={this.openProfile.bind(null, key)} key={key}>
          <View style={{ position: 'relative' }}>
            <View style={{ width: 40, height: 40, borderRadius: 40, overflow: 'hidden' }}>
              <Image source={'profile_img' in members[key] ? { uri: `data:image/png;base64,${members[key].profile_img}` } : avatarImage} style={{ width: 40, height: 40, resizeMode: 'stretch' }} />
            </View>
            {('presence' in this.props && key in this.props.presence) &&
              <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: this.props.presence[key].state == 'online' ? '#006ABF' : 'gray', position: 'absolute', top: 29, left: 29 }} />
            }
          </View>
          <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
            <Text style={{ color: 'gray', fontSize: 16 }}>{members[key].name}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <Modal animationType={"fade"} transparent={false}
        visible={this.props.open}
        onRequestClose={this.props.modalDidClose}
      >
        <View style={styles1.container}>
          <View style={styles1.topButtonContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={this.props.closeModal}>
                <AntIcon name={'left'} size={20} color={'white'} fontWeight={'bold'} />
              </TouchableOpacity>
              <View style={{ marginLeft: 20 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Select Members </Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{memberCount} Members </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity>
                <AntIcon name={'search1'} size={20} color={'white'} fontWeight={'bold'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1, width: '100%', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, }}>
            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, borderWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2, marginVertical: 5, }} activeOpacity={.7} onPress={this.openModal2}>
              <View style={{ position: 'relative' }}>
                <View style={{ width: 40, height: 40, borderRadius: 40, overflow: 'hidden' }}>
                  <Image source={createChatImage} style={{ width: 40, height: 40, resizeMode: 'stretch' }} />
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>Create Group</Text>
              </View>
            </TouchableOpacity>
            <ScrollView style={{ width: '100%' }}>
              {items}
            </ScrollView>
            <Profile
              open={this.state.open}
              modalDidClose={this.modalDidClose}
              closeModal={this.closeModal}
              memberId={this.state.memberId}
              openChatRoom={this.openChatRoom}
            />
            <AddGroup
              open={this.state.open2}
              modalDidClose={this.modalDidClose2}
              closeModal={this.closeModal2}
            />
            {this.state.open1 &&
              <ChatForm
                open={this.state.open1}
                modalDidClose={this.modalDidClose1}
                closeModal={this.closeModal1}
                groupKey={this.state.groupKey}
                name={members[this.state.memberId].name}
              />
            }
          </View>
        </View>
      </Modal>
    );
  }

}

const mapStateToProps = state => ({
  members: state.session.members,
  presence: state.session.presence,
  groups: state.session.groups,
  profile: state.session.profile,
})

const mapDispatchToProps = {
  loadMember: loadMember,
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateChat)

