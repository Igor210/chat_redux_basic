import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign';
import styles from './Screen4.styles';
import firebaseService from '../../../services/firebase'

import { connect } from 'react-redux'

import profileImage from '../../../assets/images/s_profile.png'
import locationImage from '../../../assets/images/s_location.png'
import linkImage from '../../../assets/images/s_link.png'
import lockImage from '../../../assets/images/s_lock.png'
import privacyImage from '../../../assets/images/s_privacy.png'

class Screen4 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPrivacy : false,
            showPassword: false,
            password: '',
            loading: false,
        };
        this.goBack = this.goBack.bind(this);
        this.showPrivacy = this.showPrivacy.bind(this);
        this.showPassword = this.showPassword.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    changePassword() {
        if(this.state.password.length < 6)
            alert("Please input the password more than 6 letter.");
        var user = firebaseService.auth().currentUser;
        var newPassword = this.state.password;
        
        this.setState({
            loading: true
        });
        user.updatePassword(newPassword).then(function() {
            this.setState({
                showPassword: false,
                password: '',
                loading: false,
            })
        }.bind(this)).catch(function(error) {
            console.log(error);
        });
    }


    goBack() {
        this.props.navigation.navigate('Screen2');
    }

    handlePasswordChange(val) {
        this.setState({
            password:  val,
        })
    }

    showPrivacy() {
        this.setState({
            showPrivacy: !this.state.showPrivacy,
        });
    }

    showPassword() {
        this.setState({
            showPassword: !this.state.showPassword,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topButtonContainer}>
                    <TouchableOpacity onPress={this.goBack}>
                        <AntIcon name={'left'} size={20} color={'#AAB2BF'} fontWeight={'bold'} />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Setting </Text>
                    </View>
                    <View></View>
                </View>
                <View style={styles.cardContainer}>
                    <ScrollView>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardTitleText}>Account</Text>
                        </View>
                        <View style={styles.cardRow}>
                            <View style={styles.cardRowFront}>
                                <Image source={profileImage} style={styles.imageBox}/>
                                <Text style={styles.grayText}>Edit Profile</Text>
                            </View>
                            <AntIcon name={'right'} size={20} color={'#AAB2BF'} fontWeight={'bold'} />
                        </View>
                        <View style={styles.cardRow}>
                            <View style={styles.cardRowFront}>
                                <Image source={locationImage} style={styles.imageBox}/>
                                <Text style={styles.grayText}>Location Sharing</Text>
                            </View>
                            <AntIcon name={'right'} size={20} color={'#AAB2BF'} fontWeight={'bold'} />
                        </View>
                        <View style={styles.cardRow}>
                            <View style={styles.cardRowFront}>
                                <Image source={linkImage} style={styles.imageBox}/>
                                <Text style={styles.grayText}>Linked Accounts</Text>
                            </View>
                            <AntIcon name={'right'} size={20} color={'#AAB2BF'} fontWeight={'bold'} />
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardTitleText}>Security</Text>
                        </View>
                        <TouchableOpacity style={styles.cardRow} onPress={this.showPassword}>
                            <View style={styles.cardRowFront}>
                                <Image source={lockImage} style={styles.imageBox}/>
                                <Text style={styles.grayText}>Change Password</Text>
                            </View>
                            <AntIcon name={'right'} size={20} color={'#AAB2BF'} fontWeight={'bold'} />
                        </TouchableOpacity>
                        {this.state.showPassword &&
                            <View style={styles.cardRow}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder='Password...'
                                    returnKeyType='next'
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    placeholderTextColor='gray'
                                    onChangeText={this.handlePasswordChange}
                                    underlineColorAndroid={'#AAB2BF'}
                                    value={this.state.password}
                                />
                                <TouchableOpacity style={styles.blueButton} onPress={this.changePassword} >
                                    <Text style={styles.whiteText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <TouchableOpacity style={styles.cardRow} onPress={this.showPrivacy}>
                            <View style={styles.cardRowFront}>
                                <Image source={privacyImage} style={styles.imageBox}/>
                                <Text style={styles.grayText}>Privacy</Text>
                            </View>
                            <AntIcon name={'right'} size={20} color={'#AAB2BF'} fontWeight={'bold'} />
                        </TouchableOpacity>
                        {this.state.showPrivacy &&
                            <View style={styles.cardRow}>
                                <Text style={styles.smallGrayText}>This is privacy</Text>
                            </View>
                        }
                        <View style={styles.cardRow}>
                            <View style={styles.cardRowFront}>
                                <Image source={linkImage} style={styles.imageBox}/>
                                <Text style={styles.grayText}>Linked Accounts</Text>
                            </View>
                            <AntIcon name={'right'} size={20} color={'#AAB2BF'} fontWeight={'bold'} />
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardTitleText}>System</Text>
                        </View>
                        <View style={styles.cardRow}>
                            <View style={styles.cardRowFront}>
                                <Image source={lockImage} style={styles.imageBox}/>
                                <Text style={styles.grayText}>Password Lock</Text>
                            </View>
                            <AntIcon name={'right'} size={20} color={'#AAB2BF'} fontWeight={'bold'} />
                        </View>
                    </ScrollView>
                </View>
                {(this.state.loading)  &&
                    <View style={styles.overlay}>
                        <Text style={{color: 'white'}}>Saving...</Text>
                        <ActivityIndicator />
                    </View>
                }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    profile: state.session.profile,
})


export default connect(mapStateToProps)(Screen4)

