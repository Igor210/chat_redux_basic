import React, { Component } from 'react';
import { Modal, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign';

import styles from './Profile.styles';
import firebaseService from '../../../services/firebase'

import { connect } from 'react-redux'

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    componentDidMount() {
    }

    render() {
        const placeList = [], placeNameList = [];
        var member = {};
        if('members' in this.props && this.props.memberId != '')
            member = this.props.members[this.props.memberId];
        if ('places' in member) {
            for (key in member.places) {
                placeList.push(
                    <View style={{ width: 100, height: 100, borderRadius: 5, overflow: 'hidden', marginRight: 10 }}>
                        <Image source={{ uri: `data:image/png;base64,${member.places[key].img}` }} style={{ width: 100, height: 100, resizeMode: 'stretch' }} />
                    </View>
                );
            }
        }
        if ('places_name' in member) {
            for (key in member.places_name) {
                placeNameList.push(
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={[styles.blueText, { marginLeft: 10 }]}>Date: </Text>
                        <Text style={styles.grayBigText}>{member.places_name[key].date}</Text>
                        <Text style={[styles.blueText, { marginLeft: 10 }]}>Where: </Text>
                        <Text style={styles.grayBigText}>{member.places_name[key].where}</Text>
                    </View>
                );
            }
        }
        return (
            <Modal animationType={"fade"} transparent={false}
                visible={this.props.open}
                onRequestClose={this.props.modalDidClose}
            >
                <View style={styles.container}>
                    <View style={styles.topButtonContainer}>
                        <TouchableOpacity onPress={this.props.closeModal}>
                            <AntIcon name={'left'} size={20} color={'white'} fontWeight={'bold'} />
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Profile </Text>
                        </View>
                        <View></View>
                    </View>
                    <View style={[styles.cardContainer, { paddingBottom: 40, position: 'relative' }]}>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={styles.imageBox}>
                                <View style={styles.imageContainer1}>
                                    {'profile_img' in member &&
                                        <Image style={styles.imageContainer1} source={{ uri: `data:image/png;base64,${member.profile_img}` }} />
                                    }
                                </View>
                            </View>
                            <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.blueText}>{member.name} </Text>
                                </View>
                                <Text style={styles.grayText}>{member.country + "," + member.city}</Text>
                            </View>
                        </View>
                        {'about' in member &&
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <Text style={styles.blueText}>About </Text>
                                </View>
                                <Text style={styles.grayText} numberOfLines={3}>{member.about} </Text>
                            </View>
                        }
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '112%', position: 'absolute', bottom: -13 }}>
                            <View style={styles.blueButton}>
                                <Text style={styles.innerText}>Follow</Text>
                            </View>
                            <TouchableOpacity style={styles.blueButton} onPress={this.props.openChatRoom}>
                                <Text style={styles.innerText}>Message</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {placeNameList.length > 0 &&
                        <View style={[styles.cardContainer, { marginTop: 30 },]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.blueText, { marginLeft: 10 }]}>Next Travels </Text>
                            </View>
                            {placeNameList}
                        </View>
                    }
                    {placeList.length > 0 &&
                        <View style={{ marginTop: 10, width: '100%', width: '90%' }}>
                            <Text style={[styles.blueText, { marginBottom: 10 }]}>Places Visited</Text>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                                {placeList}
                            </ScrollView>
                        </View>
                    }
                </View>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    members: state.session.members,
    profile: state.session.profile,
})

export default connect(mapStateToProps)(Profile)
