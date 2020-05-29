import React, { Component } from 'react';
import { Modal, Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-picker'
import Dialog from "react-native-dialog";
import { Dropdown } from 'react-native-material-dropdown';
import styles1 from './ShowMember.styles';

import styles from './GroupProfile.styles';
import firebaseService from '../../../services/firebase'
import { CCDATA } from '../screen1/const'
import selectMemberImage from '../../../assets/images/select_member.png'
import logoutImage from '../../../assets/images/logout.png'

import { connect } from 'react-redux'


class GroupProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            uploding: false,
            imageData: null,
            changName: false,
            name: '',
            changeabout: false,
            about: '',
            changeprivacy: false,
            privacy: '',
            CCdialogVisible: false,
            countryData: [],
            country: '',
            cityData: [],
            city: '',
            showMember: false,
            members: [],
            showNextOwner: false,
            nextOwner: '',
        };

        this.onShowMembers = this.onShowMembers.bind(this);
        this.goBack = this.goBack.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.onCloseChangeName = this.onCloseChangeName.bind(this);
        this.onChangeAbout = this.onChangeAbout.bind(this);
        this.handleAboutChange = this.handleAboutChange.bind(this);
        this.onCloseChangeAbout = this.onCloseChangeAbout.bind(this);
        this.onChangePrivacy = this.onChangePrivacy.bind(this);
        this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
        this.onCloseChangePrivacy = this.onCloseChangePrivacy.bind(this);
        this.showCCDialog = this.showCCDialog.bind(this);
        this.onCountryDataRange = this.onCountryDataRange.bind(this);
        this.onCityDataRange = this.onCityDataRange.bind(this);
        this.onHideMembers = this.onHideMembers.bind(this);
        this.onMemberSelected = this.onMemberSelected.bind(this);
        this.onLeaveGroup = this.onLeaveGroup.bind(this);
        this.onOwnerLeaveGroup = this.onOwnerLeaveGroup.bind(this);
        this.onHideNextOwner = this.onHideNextOwner.bind(this);
        this.onNextOwnerSeleted = this.onNextOwnerSeleted.bind(this);
        this.onDoneNextOwner = this.onDoneNextOwner.bind(this);
    }

    onNextOwnerSeleted(key) {
        this.setState({
            nextOwner: key,
        })
    }

    onOwnerLeaveGroup() {
        this.setState({
            showNextOwner: true,
        });
    }

    onHideNextOwner() {
        this.setState({
            showNextOwner: false,
            nextOwner: '',
        });
    }

    onDoneNextOwner() {
        if(this.state.nextOwner == '') {
            alert("Please select next member.");
            return;
        }
        firebaseService.database().ref().child('/groups/' + this.props.groupKey)
            .update({ owner: this.state.nextOwner }, (error) => {
                if (error) {
                } else {
                }
            });
        this.setState({
            showNextOwner: false,
        });
        this.onLeaveGroup();
    }

    onLeaveGroup() {
        var members = this.props.groups[this.props.groupKey].members;
        var index = members.indexOf(this.props.profile.id);
        members.splice(index, 1);
        firebaseService.database().ref().child('/groups/' + this.props.groupKey)
            .update({ members: members }, (error) => {
                if (error) {
                } else {
                }
            });
        this.props.leaveGroup();
    }

    onMemberSelected(key) {
        var members = this.state.members;
        if (!members.includes(key))
            members.push(key);
        else {
            var index = members.indexOf(key);
            members.splice(index, 1);
        }
        this.setState({
            members: members
        });
    }

    onShowMembers() {
        this.setState({
            members: this.props.groups[this.props.groupKey].members,
            showMember: true,
        });
    }

    onHideMembers() {
        firebaseService.database().ref().child('/groups/' + this.props.groupKey)
            .update({ members: this.state.members }, (error) => {
                if (error) {
                } else {
                }
            });
        this.setState({
            showMember: false,
        });
    }

    componentDidMount() {
        var countryData = [];
        for (key in CCDATA) {
            if (key == "") continue;
            countryData.push({
                id: key,
                value: key,
            });
        }
        this.setState({
            countryData: countryData
        });
    }

    onCountryDataRange(value) {
        var temp = CCDATA[value];
        var cityData = [];
        for (var i = 0; i < temp.length; i++) {
            if (temp[i] == "") continue;
            cityData.push({
                id: temp[i],
                value: temp[i],
            })
        }
        this.setState({
            country: value,
            cityData: cityData,
        });
    }

    onCityDataRange(value) {
        this.setState({
            city: value
        });
    }

    handleNameChange(value) {
        this.setState({
            name: value,
        });
    }

    showCCDialog = () => {
        this.setState({ CCdialogVisible: true });
    };

    handleCCCancel = () => {
        this.setState({ CCdialogVisible: false });
    };

    handleCCSave = () => {
        firebaseService.database().ref().child('/groups/' + this.props.groupKey)
            .update({ country: this.state.country, city: this.state.city }, (error) => {
                if (error) {
                } else {
                }
            });
        this.setState({ CCdialogVisible: false });

    };

    onCloseChangeName() {
        firebaseService.database().ref().child('/groups/' + this.props.groupKey)
            .update({ name: this.state.name }, (error) => {
                if (error) {
                } else {
                }
            });
        this.setState({
            changName: false,
        });
    }

    handleAboutChange(value) {
        this.setState({
            about: value,
        });
    }

    onCloseChangeAbout() {
        firebaseService.database().ref().child('/groups/' + this.props.groupKey)
            .update({ about: this.state.about }, (error) => {
                if (error) {
                } else {
                }
            });
        this.setState({
            changeabout: false,
        });
    }

    handlePrivacyChange(value) {
        this.setState({
            privacy: value,
        });
    }

    onCloseChangePrivacy() {
        firebaseService.database().ref().child('/groups/' + this.props.groupKey)
            .update({ privacy: this.state.privacy }, (error) => {
                if (error) {
                } else {
                }
            });
        this.setState({
            changeprivacy: false,
        });
    }

    goBack() {
        this.props.closeModal();
    }

    onChangeName() {
        this.setState({
            changName: true,
            name: this.props.groups[this.props.groupKey].name,
        })
    }

    onChangeAbout() {
        this.setState({
            changeabout: true,
            about: this.props.groups[this.props.groupKey].about,
        })
    }

    onChangePrivacy() {
        this.setState({
            changeprivacy: true,
            privacy: this.props.groups[this.props.groupKey].privacy,
        })
    }

    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log(response);
                let source = { uri: response.uri };

                this.setState({
                    imageData: response,
                }, () => {
                    this.uploadImage();
                });
            }
        });
    }

    uploadImage() {
        firebaseService.database().ref().child('/groups/' + this.props.groupKey)
            .update({ img: this.state.imageData.data }, (error) => {
                if (error) {
                } else {
                }
            });
    }

    render() {
        var group = {};
        if ('groups' in this.props && this.props.groups && this.props.groupKey != '')
            group = this.props.groups[this.props.groupKey];
        var owner = false;
        if ('owner' in group && this.props.profile.id == group.owner)
            owner = true;
        const items = [];
        var members = this.props.members;
        var memberCount = 0;
        for (key in members) {
            if (key == this.props.profile.id) continue;
            memberCount++;
            items.push(
                <TouchableOpacity style={{ backgroundColor: this.state.members.includes(key) ? '#EEE' : 'white', width: '100%', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, borderWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2, marginVertical: 5, }} activeOpacity={.7} onPress={this.onMemberSelected.bind(null, key)} key={key}>
                    <View style={{ position: 'relative' }}>
                        <View style={{ width: 40, height: 40, borderRadius: 40, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E4E8' }}>
                            {'profile_img' in members[key] ?
                                <Image source={{ uri: `data:image/png;base64,${members[key].profile_img}` }} style={{ width: 40, height: 40, resizeMode: 'stretch' }} />
                                :
                                (members[key].name.length > 2 &&
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0065B5' }}>{members[key].name.toUpperCase()[0] + members[key].name.toUpperCase()[1]}</Text>
                                )
                            }
                        </View>
                        {('presence' in this.props && key in this.props.presence) &&
                            <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: this.props.presence[key].state == 'online' ? '#006ABF' : 'gray', position: 'absolute', top: 29, left: 29 }} />
                        }
                    </View>
                    <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
                        <Text style={{ color: 'gray', fontSize: 16 }}>{members[key].name}</Text>
                    </View>
                    {this.state.members.includes(key) &&
                        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 0, }}>
                            <AntIcon name="check" size={20} />
                        </View>
                    }
                </TouchableOpacity>
            )
        }
        var memberCount1 = 0;
        var items1 = [];
        if ('members' in group) {
            for (var i = 0; i < group.members.length; i++) {
                if (group.members[i] in members && group.members[i] != this.props.profile.id) {
                    var key = group.members[i];
                    memberCount1++;
                    items1.push(
                        <TouchableOpacity style={{ backgroundColor: this.state.nextOwner == key ? '#EEE' : 'white', width: '100%', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, borderWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2, marginVertical: 5, }} activeOpacity={.7} onPress={this.onNextOwnerSeleted.bind(null, key)} key={key}>
                            <View style={{ position: 'relative' }}>
                                <View style={{ width: 40, height: 40, borderRadius: 40, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E4E8' }}>
                                    {'profile_img' in members[key] ?
                                        <Image source={{ uri: `data:image/png;base64,${members[key].profile_img}` }} style={{ width: 40, height: 40, resizeMode: 'stretch' }} />
                                        :
                                        (members[key].name.length > 2 &&
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0065B5' }}>{members[key].name.toUpperCase()[0] + members[key].name.toUpperCase()[1]}</Text>
                                        )
                                    }
                                </View>
                                {('presence' in this.props && key in this.props.presence) &&
                                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: this.props.presence[key].state == 'online' ? '#006ABF' : 'gray', position: 'absolute', top: 29, left: 29 }} />
                                }
                            </View>
                            <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
                                <Text style={{ color: 'gray', fontSize: 16 }}>{members[key].name}</Text>
                            </View>
                            {this.state.nextOwner == key &&
                                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 0, }}>
                                    <AntIcon name="check" size={20} />
                                </View>
                            }
                        </TouchableOpacity>
                    )
                }
            }
        }

        return (
            <Modal animationType={"fade"} transparent={false}
                visible={this.props.open}
                onRequestClose={this.props.modalDidClose}
            >
                {(!this.state.showMember && !this.state.showNextOwner) &&
                    <View style={styles.container}>
                        <View style={styles.topButtonContainer}>
                            <TouchableOpacity onPress={this.goBack}>
                                <AntIcon name={'left'} size={20} color={'white'} fontWeight={'bold'} />
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{group.name} </Text>
                            </View>
                            <View></View>
                        </View>
                        <View style={[styles.cardContainer, { paddingBottom: 40, position: 'relative' }]}>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={styles.imageBox}>
                                    <View style={styles.imageContainer1}>
                                        {'img' in group &&
                                            <Image style={styles.imageContainer1} source={{ uri: `data:image/png;base64,${group.img}` }} />
                                        }
                                        {owner &&
                                            <TouchableOpacity style={styles.imagePlusContainer} onPress={this.selectPhotoTapped.bind(this)}>
                                                <AntIcon name="camerao" color='white' size={16} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                                <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {this.state.changName ?
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder='Name'
                                                returnKeyType='next'
                                                autoCapitalize='none'
                                                placeholderTextColor='#0065b4'
                                                onChangeText={this.handleNameChange}
                                                underlineColorAndroid={'#0065b4'}
                                                value={this.state.name}
                                            />
                                            :
                                            ('name' in group &&
                                                <Text style={styles.blueText}>{group.name} </Text>
                                            )
                                        }
                                        {!this.state.changName ?
                                            (owner &&
                                                <TouchableOpacity onPress={this.onChangeName}>
                                                    <Icon name="pencil" color={'gray'} size={16} />
                                                </TouchableOpacity>)
                                            :
                                            <TouchableOpacity onPress={this.onCloseChangeName}>
                                                <Icon name="close-circle" color={'gray'} size={16} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                        <Text style={[styles.grayText, { marginRight: 5 }]}>{'city' in group && group.city + "," + group.country}</Text>
                                        {owner &&
                                            <TouchableOpacity onPress={this.showCCDialog}>
                                                <Icon name="pencil" color={'gray'} size={12} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <Text style={styles.blueText}>About </Text>
                                {!this.state.changeabout ?
                                    (owner &&
                                        <TouchableOpacity onPress={this.onChangeAbout}>
                                            <Icon name="pencil" color={'gray'} size={16} />
                                        </TouchableOpacity>)
                                    :
                                    <TouchableOpacity onPress={this.onCloseChangeAbout}>
                                        <Icon name="close-circle" color={'gray'} size={16} />
                                    </TouchableOpacity>
                                }
                            </View>
                            {this.state.changeabout ?
                                <TextInput
                                    style={styles.textInput1}
                                    placeholder='Pleat input here...'
                                    returnKeyType='next'
                                    autoCapitalize='none'
                                    placeholderTextColor='gray'
                                    onChangeText={this.handleAboutChange}
                                    underlineColorAndroid={'gray'}
                                    value={this.state.about}
                                />
                                :
                                ('about' in group &&
                                    <Text style={styles.grayText} numberOfLines={3}>{group.about} </Text>
                                )
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '112%', position: 'absolute', bottom: -13 }}>
                                <TouchableOpacity style={styles.blueButton} onPress={this.props.openChatRoom}>
                                    <Text style={styles.innerText}>Message</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.cardContainer1, styles.mt2]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <Text style={styles.blueText}>Privacy </Text>
                                {!this.state.changeprivacy ?
                                    (owner &&
                                        <TouchableOpacity onPress={this.onChangePrivacy}>
                                            <Icon name="pencil" color={'gray'} size={16} />
                                        </TouchableOpacity>)
                                    :
                                    <TouchableOpacity onPress={this.onCloseChangePrivacy}>
                                        <Icon name="close-circle" color={'gray'} size={16} />
                                    </TouchableOpacity>
                                }
                            </View>
                            {this.state.changeprivacy ?
                                <TextInput
                                    style={styles.textInput1}
                                    placeholder='Pleat input here...'
                                    returnKeyType='next'
                                    autoCapitalize='none'
                                    placeholderTextColor='gray'
                                    onChangeText={this.handlePrivacyChange}
                                    underlineColorAndroid={'gray'}
                                    value={this.state.privacy}
                                />
                                :
                                ('privacy' in group &&
                                    <Text style={styles.grayText} numberOfLines={3}>{group.privacy} </Text>
                                )
                            }
                        </View>
                        <View style={[styles.cardContainer1, styles.mt2]}>
                            {(owner || ('type' in group && group.type == 'public')) &&
                                <TouchableOpacity style={[styles.mt1, styles.borderBox, { flexDirection: 'row', justifyContent: 'space-between' }]} onPress={this.onShowMembers}>
                                    <Image source={selectMemberImage} style={{ resizeMode: 'stretch', width: 20, height: 20, marginRight: 10 }} />
                                    <Text style={[styles.blueText, { marginRight: 10 }]}>{'Add Member'}</Text>
                                    <View>
                                        <AntIcon name={'right'} size={20} color={'#0065b4'} />
                                    </View>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={[styles.mt1, styles.borderBox, { flexDirection: 'row', justifyContent: 'space-between' }]} onPress={owner ? this.onOwnerLeaveGroup : this.onLeaveGroup}>
                                <Image source={logoutImage} style={{ resizeMode: 'stretch', width: 20, height: 20, marginRight: 10 }} />
                                <Text style={[styles.blueText, { marginRight: 10 }]}>{'Leave Group'}</Text>
                                <View>
                                    <AntIcon name={'right'} size={20} color={'#0065b4'} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Dialog.Container visible={this.state.CCdialogVisible}>
                            <Dialog.Title>Please select country and city.</Dialog.Title>
                            <Dropdown
                                label='Select Country'
                                data={this.state.countryData}
                                baseColor='#0065b4'
                                textColor='#0065b4'
                                selectedItemColor='#0065b4'
                                onChangeText={value => this.onCountryDataRange(value)}
                            />
                            <Dropdown
                                label='Select City'
                                data={this.state.cityData}
                                baseColor='#0065b4'
                                textColor='#0065b4'
                                selectedItemColor='#0065b4'
                                onChangeText={value => this.onCityDataRange(value)}
                            />
                            <Dialog.Button label="Save" onPress={this.handleCCSave} />
                            <Dialog.Button label="Cancel" onPress={this.handleCCCancel} />
                        </Dialog.Container>
                    </View>
                }
                {(this.state.showMember && !this.state.showNextOwner) &&
                    <View style={styles1.container}>
                        <View style={styles1.topButtonContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={this.onHideMembers}>
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
                        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                            <View style={{ width: '90%' }}>
                                {items}
                            </View>
                        </ScrollView>
                    </View>
                }
                {(!this.state.showMember && this.state.showNextOwner) &&
                    <View style={styles1.container}>
                        <View style={styles1.topButtonContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={this.onHideNextOwner}>
                                    <AntIcon name={'left'} size={20} color={'white'} fontWeight={'bold'} />
                                </TouchableOpacity>
                                <View style={{ marginLeft: 20 }}>
                                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Select Next Owner </Text>
                                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{memberCount1} Members </Text>
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity onPress={this.onDoneNextOwner}>
                                    <Text style={{color:'white', fontSize: 22}}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                            <View style={{ width: '90%' }}>
                                {items1}
                            </View>
                        </ScrollView>
                    </View>
                }
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    groups: state.session.groups,
    profile: state.session.profile,
    members: state.session.members,
})

export default connect(mapStateToProps)(GroupProfile)
