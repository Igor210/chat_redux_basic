import React, { Component } from 'react';
import { Image, Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import relativeDate from 'relative-date'

import avatarImage from '../../../assets/images/avatar.jpg'
import ChatForm from './ChatForm'
import firebaseService from '../../../services/firebase'
import { connect } from 'react-redux'

class ChatSmall extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.modalDidClose = this.modalDidClose.bind(this);
        this.chatWith = this.chatWith.bind(this);
    }

    closeModal = () => {
        this.setState({ open: false });
        if (this.props.user && this.props.groupKey) {
            let createdAt = (new Date().getTime() + new Date().getTimezoneOffset()*60*1000);
            let newRow = {
                createdAt: createdAt,
            }
            firebaseService.database().ref().child('/groups/' + this.props.groupKey + "/last_visit/" +  this.props.user.user.uid)
                .update(newRow, (error) => {
                    if (error) {
                        console.log(error);
                    }
                })
        }
    }

    modalDidClose = () => {
        this.setState({ open: false });
        if (this.props.user && this.props.groupKey) {
            let createdAt = (new Date().getTime() + new Date().getTimezoneOffset()*60*1000);
            let newRow = {
                createdAt: createdAt,
            }
            firebaseService.database().ref().child('/groups/' + this.props.groupKey + "/last_visit/" +  this.props.user.user.uid)
                .update(newRow, (error) => {
                    if (error) {
                        console.log(error);
                    }
                })
        }
    };

    chatWith() {
        let newGroup = {
            name: this.props.profile.name + " & " + this.props.member.name,
            type: "private",
            country: this.props.member.country,
            city: this.props.member.city,
            members: [this.props.user.uid, this.props.memberKey],
            owner: this.props.user.uid,
            genre: 'p2p',
            lastMsg: '',
            lastMsgDate: '939719978706',
        }

        const postKey = firebaseService.database().ref('groups').push().set(newGroup, (error) => {
            if (error) {
                console.log(error);
            } else {
                // this.setState({
                //     name: this.props.user.email + " & " + this.props.member.name,
                //     groupKey: postKey,
                //     open: true,
                // });
            }
        })
        .then((snap) => {
        })
    }

    openModal() {
        if (this.props.type == "chat") {
            Alert.alert(
                'Chat',
                'Do you want to chat with ' + this.props.member.name + '?',
                [
                    { text: 'NO', style: 'cancel' },
                    { text: 'YES', onPress: this.chatWith }
                ]
            );
        } else {
            if (this.props.user && this.props.groupKey) {
                let createdAt = (new Date().getTime() + new Date().getTimezoneOffset()*60*1000);
                let newRow = {
                    createdAt: createdAt,
                }
                firebaseService.database().ref().child('/groups/' + this.props.groupKey + "/last_visit/" +  this.props.user.user.uid)
                    .update(newRow, (error) => {
                        if (error) {
                            console.log(error);
                        }
                    })
            }
            this.setState({
                open: true,
            });
        }
    }


    componentDidMount() {
    }

    render() {
        const items = [];
        if (this.props.missCount) {
            items.push(
                <View style={{ backgroundColor: '#0065B5', borderRadius: 50, paddingVertical: 2, paddingHorizontal : 5, margin: 2 }}>
                    <Text style={{ color: 'white', fontSize: 10 }}>{this.props.missCount}</Text>
                </View>
            )
        }

        
        return (
            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, borderWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2, marginVertical: 5 ,}} activeOpacity={.7} onPress={this.openModal}>
                <View style={{position:'relative'}}>
                    <View style={{ width: 40, height: 40, borderRadius: 40, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor : '#E5E4E8'}}>
                        {this.props.img != '' ?
                        <Image source={this.props.img != '' ? { uri: `data:image/png;base64,${this.props.img}` } : avatarImage} style={{ width: 40, height: 40, resizeMode: 'stretch' }} />
                        :
                        (this.props.name.length > 2 &&
                            <Text style={{fontSize : 16, fontWeight:'bold', color: '#0065B5'}}>{this.props.name.toUpperCase()[0] + this.props.name.toUpperCase()[1]}</Text>
                        )
                    }
                    </View>
                    {(this.props.type == 'chat' || this.props.type1 == 'p2p') &&
                        <View style={{width : 10, height: 10, borderRadius : 10, backgroundColor : this.props.online ? '#006ABF' : 'gray', position:'absolute', top: 29, left: 29}}/>
                    }
                </View>
                <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
                    <Text style={{ color: 'gray', fontSize: 16 }}>{this.props.name}</Text>
                    {this.props.type == 'group' &&
                        <Text style={{ color: 'gray', fontSize: 12 }}>{this.props.lastMsg}</Text>
                    }
                </View>
                
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={(!this.props.lastMsg && this.props.type == 'group') ? {fontSize : 16, color : '#C21'} : { color: '#0065B5', fontSize: 12 }}>{(!this.props.lastMsg && this.props.type == 'group') ? 'New!' : relativeDate(new Date(this.props.lastMsgDate))}</Text>
                        {items}
                    </View>
                
                {this.props.type == 'group' &&
                    <ChatForm
                        open={this.state.open}
                        modalDidClose={this.modalDidClose}
                        closeModal={this.closeModal}
                        groupKey={this.props.groupKey}
                        name={this.props.name}
                    />
                }
                {this.props.type == 'chat' &&
                    <ChatForm
                        open={this.state.open}
                        modalDidClose={this.modalDidClose}
                        closeModal={this.closeModal}
                        groupKey={this.state.groupKey}
                        name={this.state.name}
                    />
                }
            </TouchableOpacity>
        );
    }

}

const mapStateToProps = state => ({
    user: state.session.user,
  })

export default connect(mapStateToProps)(ChatSmall)

