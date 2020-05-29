import React, { Component } from 'react';
import { Modal, Text, View, TouchableOpacity, Image, ScrollView, ImageBackground, TextInput, SafeAreaView,ToastAndroid, } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import RadioForm from 'react-native-simple-radio-button';
import { Dropdown } from 'react-native-material-dropdown';
import relativeDate from 'relative-date'
import MsgRow from './MsgRow'
import Profile from './Profile'
import GroupProfile from './GroupProfile'

import styles from './ChatForm.styles';
import msgPlusImage from '../../../assets/images/msg_plus.png'
import msgBackImage from '../../../assets/images/msg_back.png'
import msgSendImage from '../../../assets/images/msg_send.png'

import { connect } from 'react-redux'
import { sendMessage } from '../../../store/session'
import firebaseService from '../../../services/firebase'
import FilePickerManager from 'react-native-file-picker';
import RNFetchBlob from 'react-native-fetch-blob';

class ChatForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            curMsg: '',
            msgList: [],
            messages: {},
            groups: {},
            open: false,
            memberId: '',
            open2: false,
        }

        this.handleMsgChange = this.handleMsgChange.bind(this);
        this.onSendMsg = this.onSendMsg.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
        this.setLastVisit = this.setLastVisit.bind(this);
        this.setTyping = this.setTyping.bind(this);
        this.stopTyping = this.stopTyping.bind(this);
        this.timer = null;
        this.closeModal = this.closeModal.bind(this);
        this.modalDidClose = this.modalDidClose.bind(this);
        this.openProfile = this.openProfile.bind(this);
        this.viewProfile = this.viewProfile.bind(this);
        this.openChatRoom = this.openChatRoom.bind(this);
        this.closeModal2 = this.closeModal2.bind(this);
        this.modalDidClose2 = this.modalDidClose2.bind(this);
        this.openChatRoom2 = this.openChatRoom2.bind(this);
        this.leaveGroup = this.leaveGroup.bind(this);
        this.addFile = this.addFile.bind(this);
        this.downloadAttach = this.downloadAttach.bind(this);
    }

    downloadAttach(msgKey) {
        let dirs = RNFetchBlob.fs.dirs;
        var messages = this.state.messages;

        RNFetchBlob
        .config({
            path : dirs.DownloadDir + '/' + messages[msgKey].attach_name,
            IOSBackgroundTask: true,
            overwrite: true,
            indicator: true,
        })
        .fetch('GET', messages[msgKey].attach_url, {
            //some headers ..
        })
        .progress( (received, total) => {
        })
        .then((res) => {
            ToastAndroid.showWithGravityAndOffset(
                'The file has been downloaded to DownLoad Folder!',
                ToastAndroid.LONG, //can be SHORT, LONG
                ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                25, //xOffset
                150 //yOffset
            );
        })
    }

    addFile() {
        FilePickerManager.showFilePicker(null, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled file picker');
            }
            else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
            }
            else {
                console.log(response);

                const Blob = RNFetchBlob.polyfill.Blob;
                const fs = RNFetchBlob.fs;
                window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
                window.Blob = Blob;


                let uploadBlob = null
                const fileRef = firebaseService.storage().ref('attach').child(this.props.user.user.uid + new Date().getTime() + response.fileName)
                let mime = response.type;
                fs.readFile(response.uri, 'base64')
                    .then((data) => {
                        return Blob.build(data, { type: `${mime};BASE64` })
                    })
                    .then((blob) => {
                        uploadBlob = blob
                        return fileRef.put(blob, { contentType: mime })
                    })
                    .then(() => {
                        uploadBlob.close()
                        return fileRef.getDownloadURL()
                    })
                    .then((url) => {
                        let createdAt = (new Date().getTime() + new Date().getTimezoneOffset()*60*1000);
                        let newMessage = {
                            sender_id: this.props.user.user.uid,
                            msg: 'Attachment... ',
                            send_date: createdAt,
                            attach_url: url,
                            attach_name:response.fileName,
                            attach_type: response.type,
                            attach_size: response.readableSize,
                        }

                        console.log(newMessage);

                        firebaseService.database().ref().child('/messages/' + this.props.groupKey).push().set(newMessage, (error) => {
                            if (error) {
                            } else {
                            }
                        })
                        firebaseService.database().ref().child('/groups/' + this.props.groupKey)
                            .update({ lastMsg: 'Attachment... ', lastMsgDate: createdAt }, (error) => {
                            if (error) {
                                console.log(error);
                            }
                            });

                    })
                    .catch((error) => {
                        console.log(error);

                    })
            }
        });
    }

    leaveGroup() {
        this.setState({
            open2: false
        });
        this.props.closeModal();
    }

    closeModal2 = () => {
        this.setState({ open2: false });
    }

    modalDidClose2 = () => {
        this.setState({ open2: false });
    };

    openChatRoom() {
        this.closeModal();
    }

    openChatRoom2() {
        this.closeModal2();
    }

    viewProfile() {
        var groups = {}, groupKey = this.props.groupKey;
        if (this.props.groups)
            groups = this.props.groups;
        if (groupKey in groups) {
            if (groups[groupKey].genre == "p2p") {
                for (var i = 0; i < groups[groupKey].members.length; i++) {
                    if (groups[groupKey].members[i] != this.props.user.user.uid) {

                        this.setState({
                            memberId: groups[groupKey].members[i],
                            open: true,
                        });
                        break;
                    }
                }
            } else {
                this.setState({
                    open2: true,
                })
            }
        }
    }

    openProfile(key) {
        this.setState({
            memberId: key,
            open: true,
        });
    }

    closeModal = () => {
        this.setState({ open: false });
    }

    modalDidClose = () => {
        this.setState({ open: false });
    };

    loadMessages() {
        firebaseService.database().ref('messages/' + this.props.groupKey).limitToLast(1000).on('value', (snapshot) => {
            var messages = snapshot.val();
            for (key in messages) {
                messages[key].send_date = (messages[key].send_date - new Date().getTimezoneOffset() * 60 * 1000);
            }
            this.setState({
                messages: messages,
            });
        }, (errorObject) => {
            console.log(errorObject.message);
        })
    }

    handleMsgChange(val) {
        this.setState({
            curMsg: val
        });
        this.setTyping();
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            this.stopTyping();
        }.bind(this), 2000);
    }

    setTyping() {
        if (this.props.user && this.props.groupKey) {
            let newRow = {
                typing: true,
            }
            firebaseService.database().ref().child('/groups/' + this.props.groupKey + "/typing/" + this.props.user.user.uid)
                .update(newRow, (error) => {
                    if (error) {
                        console.log(error);
                    }
                })
        }
    }

    stopTyping() {
        if (this.props.user && this.props.groupKey) {
            let newRow = {
                typing: false,
            }
            firebaseService.database().ref().child('/groups/' + this.props.groupKey + "/typing/" + this.props.user.user.uid)
                .update(newRow, (error) => {
                    if (error) {
                        console.log(error);
                    }
                })
        }
    }

    setLastVisit() {

    }

    componentDidMount() {
        this.loadMessages();
    }

    onSendMsg() {
        this.props.sendMessage(this.props.user.user.uid, this.state.curMsg, this.props.groupKey)
        this.setState({
            curMsg: ''
        });
    }



    render() {
        const items = [], items1 = [];
        var messages = this.state.messages;
        var groups = this.props.groups;
        for (key in messages) {
            const date = relativeDate(new Date(messages[key].send_date));
            if ('attach_type' in messages[key]) {
                items.push(
                    <MsgRow
                        img={(this.props.members && messages[key].sender_id in this.props.members) ? this.props.members[messages[key].sender_id].profile_img : ''}
                        type={messages[key].sender_id == this.props.user.user.uid ? 'send' : 'receive'}
                        msgText={messages[key].msg}
                        msgDate={date}
                        key={key}
                        msgKey={key}
                        typing={false}
                        uid={messages[key].sender_id}
                        name={(this.props.members && messages[key].sender_id in this.props.members) ? this.props.members[messages[key].sender_id].name : ''}
                        openProfile={(uid) => { this.openProfile(uid) }}
                        isAttach={true}
                        attachName={messages[key].attach_name}
                        downloadAttach={(msgKey) => { this.downloadAttach(msgKey) }}
                    />
                );
            } else {
                items.push(
                    <MsgRow
                        img={(this.props.members && messages[key].sender_id in this.props.members) ? this.props.members[messages[key].sender_id].profile_img : ''}
                        type={messages[key].sender_id == this.props.user.user.uid ? 'send' : 'receive'}
                        msgText={messages[key].msg}
                        msgDate={date}
                        key={key}
                        typing={false}
                        uid={messages[key].sender_id}
                        name={(this.props.members && messages[key].sender_id in this.props.members) ? this.props.members[messages[key].sender_id].name : ''}
                        openProfile={(uid) => { this.openProfile(uid) }}
                        isAttach={false}
                    />
                );
            }
        }
        if (this.props.groupKey in groups && 'typing' in groups[this.props.groupKey]) {
            for (key in groups[this.props.groupKey].typing) {
                if (groups[this.props.groupKey].typing[key].typing == true && key != this.props.user.user.uid) {
                    items1.push(
                        <MsgRow
                            img={(this.props.members && key in this.props.members) ? this.props.members[key].profile_img : ''}
                            key={key}
                            typing={true}
                            type={'receive'}
                            uid={key}
                            name={(this.props.members && key in this.props.members) ? this.props.members[key].name : ''}
                            openProfile={(uid) => { }}
                            isAttach={false}
                        />
                    );
                }
            }
        }
        return (
            <Modal animationType={"fade"} transparent={false}
                visible={this.props.open}
                onRequestClose={this.props.modalDidClose}
            >
                <View style={styles.container}>
                    <View style={styles.topButtonContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.props.closeModal}>
                                <AntIcon name={'left'} size={20} color={'white'} fontWeight={'bold'} />
                            </TouchableOpacity>
                            <View style={{ marginLeft: 20 }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{this.props.name} </Text>
                                {/* <Text style={{ color: 'white', fontSize: 12, fontWeight : 'bold' }}>Online </Text> */}
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity onPress={this.viewProfile}>
                                <Icon name={'dots-three-vertical'} size={20} color={'white'} fontWeight={'bold'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.msgContainer}>
                        <ScrollView
                            style={{ width: '100%' }}
                            contentContainerStyle={{ padding: 20 }}
                            ref={ref => this.scrollView = ref}
                            onContentSizeChange={(contentWidth, contentHeight) => {
                                this.scrollView.scrollToEnd({ animated: true });
                            }}>
                            {items}
                            {items1}
                        </ScrollView>
                    </View>
                    <View style={styles.msgInputContainer}>
                        <View style={{ flexDirection: 'row', paddingLeft: 20, flex: 1, alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.addFile}>
                                <Image source={msgPlusImage} style={{ width: 30, height: 30, resizeMode: 'stretch' }} />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Write Your Message'
                                returnKeyType='next'
                                autoCapitalize='none'
                                placeholderTextColor='gray'
                                onChangeText={this.handleMsgChange}
                                value={this.state.curMsg}
                            />
                        </View>
                        <ImageBackground style={styles.imageBackContainer} source={msgBackImage}>
                            <TouchableOpacity onPress={this.onSendMsg}>
                                <Image source={msgSendImage} style={{ width: 30, height: 30, resizeMode: 'stretch', marginLeft: 10 }} />
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                    <Profile
                        open={this.state.open}
                        modalDidClose={this.modalDidClose}
                        closeModal={this.closeModal}
                        memberId={this.state.memberId}
                        openChatRoom={this.openChatRoom}
                    />
                    <GroupProfile
                        open={this.state.open2}
                        modalDidClose={this.modalDidClose2}
                        closeModal={this.closeModal2}
                        groupKey={this.props.groupKey}
                        openChatRoom={this.openChatRoom2}
                        leaveGroup={this.leaveGroup}
                    />
                </View>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    user: state.session.user,
    groups: state.session.groups,
    members: state.session.members,
})

const mapDispatchToProps = {
    sendMessage: sendMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatForm)
