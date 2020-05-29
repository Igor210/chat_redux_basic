import React, { Component } from 'react';
import { Modal, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import RadioForm from 'react-native-simple-radio-button';
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker'
import ChatSmall from './ChatSmall'

import styles from './AddGroup.styles';
import styles1 from './ShowMember.styles';
import createGroupImage from '../../../assets/images/create_group.png'
import selectMemberImage from '../../../assets/images/select_member.png'

import { connect } from 'react-redux'

import { loadMember, createGroup } from '../../../store/session'
import avatarImage from '../../../assets/images/avatar.jpg'
import { CCDATA } from '../screen1/const'

class AddGroup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            radiodata: [
                {
                    label: 'Public',
                    value: 'public'
                },
                {
                    label: 'Private',
                    value: 'private'
                },
            ],
            countryData: [],
            country: '',
            cityData: [],
            city: '',
            showMember: false,
            members: [],
            groupName: '',
            type: 'public',
            about: '',
            imageData: {},
        }

        this.onCountryDataRange = this.onCountryDataRange.bind(this);
        this.onCityDataRange = this.onCityDataRange.bind(this);
        this.onShowMembers = this.onShowMembers.bind(this);
        this.onHideMembers = this.onHideMembers.bind(this);
        this.onMemberSelected = this.onMemberSelected.bind(this);
        this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
        this.creatGroup = this.creatGroup.bind(this);
        this.handleAboutChange = this.handleAboutChange.bind(this);
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
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

                this.setState({
                    imageData: response,
                });
            }
        });
    }


    handleAboutChange(value) {
        this.setState({
            about: value,
        });
    }

    creatGroup() {
        if (this.state.groupName == '') {
            alert('Please input Group name!');
            return;
        }
        if (this.state.country == '') {
            alert('Please select the country!');
            return;
        }
        if (this.state.city == '') {
            alert('Please select the city!');
            return;
        }
        if (this.state.members.length == 0) {
            alert('Please select members!');
            return;
        }
        var img = ''
        if( 'data' in this.state.imageData )
            img = this.state.imageData;
        this.props.createGroup(this.props.user.user.uid, this.state.groupName, this.state.type, this.state.country, this.state.city, this.state.members, this.state.about, img);
        this.props.closeModal();
    }

    handleGroupNameChange(val) {
        this.setState({
            groupName: val
        });
    }

    componentDidMount() {
        this.props.loadMember();
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
        })
    }

    onShowMembers() {
        var members = [];
        members.push(this.props.user.user.uid);
        this.setState({
            showMember: true,
            members: members,
        });
    }

    onHideMembers() {
        this.setState({
            showMember: false,
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

    onMemberSelected(key) {
        var members = this.state.members;
        console.log(members);
        if (!members.includes(key))
            members.push(key);
        else {
            var index = members.indexOf(key);
            members.splice(index, 1);
        }
        console.log(members);
        this.setState({
            members: members
        });
    }

    render() {
        const items = [];
        var members = this.props.members;
        var memberCount = 0;
        for (key in members) {
            if (key == this.props.user.user.uid) continue;
            memberCount++;
            items.push(
                <TouchableOpacity style={{ backgroundColor: this.state.members.includes(key) ? '#EEE' : 'white', width: '100%', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, borderWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2, marginVertical: 5, }} activeOpacity={.7} onPress={this.onMemberSelected.bind(null, key)} key={key}>
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
                    {this.state.members.includes(key) &&
                        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 0, }}>
                            <AntIcon name="check" size={20} />
                        </View>
                    }
                </TouchableOpacity>
            )
        }
        return (
            <Modal animationType={"fade"} transparent={false}
                visible={this.props.open}
                onRequestClose={this.props.modalDidClose}
            >
                {!this.state.showMember &&
                    <View style={styles.container}>
                        <View style={styles.topButtonContainer}>
                            <TouchableOpacity onPress={this.props.closeModal}>
                                <AntIcon name={'left'} size={20} color={'white'} fontWeight={'bold'} />
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Create Group </Text>
                            </View>
                            <View></View>
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.groupContainer}>
                                <View style={styles.imageBox}>
                                    <View style={styles.imageContainer1}>
                                        {this.state.imageData &&
                                            <Image style={styles.imageContainer1} source={{ uri: `data:image/png;base64,${this.state.imageData.data}` }} />
                                        }
                                        <TouchableOpacity style={styles.imagePlusContainer} onPress={this.selectPhotoTapped}>
                                            <AntIcon name="camerao" color='white' size={16} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.groupbox}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder='Group Name'
                                        returnKeyType='next'
                                        autoCapitalize='none'
                                        placeholderTextColor='#0065b4'
                                        onChangeText={this.handleGroupNameChange}
                                        value={this.state.groupName}
                                        underlineColorAndroid={'#0065b4'}
                                    />
                                </View>
                            </View>
                            <View style={[styles.mt1, styles.borderBox]}>
                                <Text style={styles.blueText}>About <Icon name="pencil" color={'gray'} size={12} /></Text>
                                <TextInput
                                    style={styles.textInput1}
                                    placeholder='Please input here...'
                                    returnKeyType='next'
                                    autoCapitalize='none'
                                    placeholderTextColor='#0065b4'
                                    onChangeText={this.handleAboutChange}
                                    value={this.state.about}
                                    underlineColorAndroid={'#0065b4'}
                                />
                            </View>
                            <View style={[styles.mt1, styles.borderBox, { alignItems: 'center', paddingTop: 15 }]}>
                                <RadioForm
                                    radio_props={this.state.radiodata}
                                    initial={0} // you can set as per requirement, initial i set here 0 for male
                                    // initial={-1} // you can set as per requirement, initial i set here 0 for male
                                    onPress={(value) => { this.setState({ type: value }) }}
                                    selectedButtonColor={'#0065b4'}
                                    selectedLabelColor={'#0065b4'}
                                    labelStyle={{ fontSize: 16, color: '#0065b4', marginRight: 50 }}
                                    formHorizontal={true}
                                    labelHorizontal={true}
                                    buttonColor={'#EEE'}
                                    buttonSize={8}
                                />
                            </View>
                            <View style={[styles.mt1, styles.borderBox]}>
                                <Dropdown
                                    label='Select Country'
                                    data={this.state.countryData}
                                    baseColor='#0065b4'
                                    textColor='#0065b4'
                                    selectedItemColor='#0065b4'
                                    value={this.state.country}
                                    onChangeText={value => this.onCountryDataRange(value)}
                                />
                                <Dropdown
                                    label='Select City'
                                    data={this.state.cityData}
                                    baseColor='#0065b4'
                                    textColor='#0065b4'
                                    selectedItemColor='#0065b4'
                                    value={this.state.city}
                                    onChangeText={value => this.onCityDataRange(value)}
                                />
                            </View>
                            <TouchableOpacity style={[styles.mt1, styles.borderBox, { flexDirection: 'row', justifyContent: 'space-between' }]} onPress={this.onShowMembers}>
                                <Image source={selectMemberImage} style={{ resizeMode: 'stretch', width: 20, height: 20, marginRight: 10 }} />
                                <Text style={[styles.blueText, { marginRight: 10 }]}>{this.state.members.length == 0 ? 'Select Member' : this.state.members.length - 1 + ' Members Selected'}</Text>
                                <View>
                                    <AntIcon name={'right'} size={20} color={'#0065b4'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.mt2, styles.blueButton]} onPress={this.creatGroup}>
                                <Text style={styles.innerText}>Create Group</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                {this.state.showMember &&
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
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    members: state.session.members,
    user: state.session.user,
    profile: state.session.profile,
    presence: state.session.presence,
})

const mapDispatchToProps = {
    loadMember: loadMember,
    createGroup: createGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(AddGroup)
