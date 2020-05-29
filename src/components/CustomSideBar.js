import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, AsyncStorage, Image, Platform } from 'react-native'

import exploreImage from '../assets/images/explore.png'
import chatroomImage from '../assets/images/chatroom.png'
import profileImage from '../assets/images/profile.png'
import logoutImage from '../assets/images/logout.png'
import shareImage from '../assets/images/share.png'
import settingImage from '../assets/images/setting.png'
import avatarImage from '../assets/images/avatar.jpg'
import Icon from 'react-native-vector-icons/FontAwesome5';

import { connect } from 'react-redux'
import { logoutUser } from '../store/session'
import Share from 'react-native-share';

class CustomSideBar extends Component {
    constructor(props) {
        super(props);
        
        this.shareApp = this.shareApp.bind(this);
    }

    shareApp() {
        const shareOptions = {
            title: 'Travel With Me',
            message: 'Please install this app',
            url: '',
        };
        Share.open(shareOptions)
        .then((res) => { console.log(res) })
        .catch((err) => { err && console.log(err); });
    }
    
    componentDidMount() {
    }

    navigateToScreen = (route) => (
        () => {
            const navigateAction = NavigationActions.navigate({
                routeName: route
            });
            this.props.navigation.dispatch(navigateAction);
        })

    _signOutAsync = async () => {
        this.props.logout(this.props.profile.id);
        await AsyncStorage.clear();
    };

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/images/sidebar_back.png')} style={{ height : 300, width : '100%' , alignItems: 'center', justifyContent: 'center'}} resizeMode = "stretch">
                    <View style={{width : '100%', padding: 10, alignItems: 'flex-start', paddingTop: Platform.OS == "ios" ? 30 : 10,}}>
                        <TouchableOpacity onPress={() => {this.props.navigation.closeDrawer();}}>
                            <Icon name="arrow-left" color="white" size={25}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{width : '100%', flex : 1, paddingTop : 0, alignItems: 'center',  }}>
                        <View style={styles.imageBox}>
                            <View style={styles.imageContainer1}>
                                {'profile_img' in this.props.profile ?
                                    <Image style={styles.imageContainer1} source={{ uri: `data:image/png;base64,${this.props.profile.profile_img}` }} />
                                    :
                                    <Image style={styles.imageContainer1} source={avatarImage} />
                                }
                            </View>
                        </View>
                        {'name' in this.props.profile &&
                            <Text style={{color:'white', fontSize : 18, fontWeight : 'bold'}}>{this.props.profile.name}</Text>
                        }
                        </View>
                </ImageBackground>
                <View style={styles.screenContainer}>
                    <View style={[styles.screenStyle, (this.props.activeItemKey == 'Screen1') ? styles.activeBackgroundColor : null]}>
                        <TouchableOpacity onPress={this.navigateToScreen('Screen1')} style={styles.lineContainer}>
                            <Image source={exploreImage} style={{marginRight : 10, width : 20, height: 20, resizeMode : 'contain'}}/>
                            <Text style={styles.screenTextStyle}>Explore</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.screenStyle, (this.props.activeItemKey == 'Screen2') ? styles.activeBackgroundColor : null]}>
                        <TouchableOpacity onPress={this.navigateToScreen('Screen2')} style={styles.lineContainer}>
                            <Image source={chatroomImage} style={{marginRight : 10, width : 20, height: 20, resizeMode : 'contain'}}/>
                            <Text style={styles.screenTextStyle}>Chat Rooms</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.screenStyle, (this.props.activeItemKey == 'Screen3') ? styles.activeBackgroundColor : null]}>
                        <TouchableOpacity onPress={this.navigateToScreen('Screen3')} style={styles.lineContainer}>
                            <Image source={profileImage} style={{marginRight : 10, width : 20, height: 20, resizeMode : 'contain'}}/>
                            <Text style={styles.screenTextStyle}>Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.screenStyle, (this.props.activeItemKey == 'Screen4') ? styles.activeBackgroundColor : null]}>
                        <TouchableOpacity onPress={this.navigateToScreen('Screen4')} style={styles.lineContainer}>
                            <Image source={settingImage} style={{marginRight : 10, width : 20, height: 20, resizeMode : 'contain'}}/>
                            <Text style={styles.screenTextStyle}>Setting</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.screenStyle}>
                        <TouchableOpacity onPress={this.shareApp} style={styles.lineContainer}>
                            <Image source={shareImage} style={{marginRight : 10, width : 20, height: 20, resizeMode : 'contain'}}/>
                            <Text style={styles.screenTextStyle}>Share</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.screenStyle}>
                        <TouchableOpacity onPress={this._signOutAsync} style={styles.lineContainer}>
                            <Image source={logoutImage} style={{marginRight : 10, width : 20, height: 20, resizeMode : 'contain'}}/>
                            <Text style={styles.screenTextStyle}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    profile: state.session.profile,
})

const mapDispatchToProps = {
    logout: logoutUser
}
  
  
export default connect(mapStateToProps, mapDispatchToProps)(CustomSideBar)

const styles = StyleSheet.create({
    lineContainer: {
        flexDirection : 'row',
        alignItems : 'center',
    },
    container: {
        alignItems: 'center',
        width : '100%'
    },
    headerContainer: {
        height: 150,
        width : '100%'
    },
    headerText: {
        color: '#fff8f8',
        fontWeight: "bold",
        fontSize: 20,
    },
    screenContainer: {
        paddingLeft: 50,
        paddingTop : 30,
        width: '100%',
    },
    screenStyle: {
        height: 30,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingLeft : 20,
    },
    screenTextStyle: {
        fontSize: 20,
        marginLeft: 20,
        textAlign: 'center',
        color: '#0065b4',
    },
    selectedTextStyle: {
        fontWeight: 'bold',
        color: 'white'
    },
    activeBackgroundColor: {
        backgroundColor: '#EBEBEB',
        borderTopLeftRadius : 30,
        borderBottomLeftRadius : 30,
    },
    imageContainer1: {
        borderRadius: 80,
        width: 80,
        height: 80,
        borderColor: '#9B9B9B',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    imageBox: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
});