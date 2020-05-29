import React, { Component } from 'react';
import { Modal, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-picker'
import Dialog from "react-native-dialog";
import { Dropdown } from 'react-native-material-dropdown';

import styles from './Screen3.styles';
import placePlusImage from '../../../assets/images/create_group.png'
import firebaseService from '../../../services/firebase'
import { CCDATA } from '../screen1/const'

import { connect } from 'react-redux'

class Screen3 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            placeImageList: [],
            uploding: false,
            imageData: null,
            changName: false,
            name: '',
            changeabout: false,
            about: '',
            dialogVisible: false,
            CCdialogVisible: false,
            where: '',
            date: '',
            countryData: [],
            country: '',
            cityData: [],
            city: '',
        };

        this.goBack = this.goBack.bind(this);
        this.onAddPlace = this.onAddPlace.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.onCloseChangeName = this.onCloseChangeName.bind(this);
        this.onChangeAbout = this.onChangeAbout.bind(this);
        this.handleAboutChange = this.handleAboutChange.bind(this);
        this.onCloseChangeAbout = this.onCloseChangeAbout.bind(this);
        this.uploadPlace = this.uploadPlace.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleWhereChange = this.handleWhereChange.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.showCCDialog = this.showCCDialog.bind(this);
        this.onCountryDataRange = this.onCountryDataRange.bind(this);
        this.onCityDataRange = this.onCityDataRange.bind(this);
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

    handleDateChange(value) {
        this.setState({
            date: value,
        });
    }

    handleWhereChange(value) {
        this.setState({
            where: value,
        });
    }

    showDialog = () => {
        this.setState({ dialogVisible: true });
    };

    showCCDialog = () => {
        this.setState({ CCdialogVisible: true });
    };

    handleCancel = () => {
        this.setState({ dialogVisible: false });
    };

    handleCCCancel = () => {
        this.setState({ CCdialogVisible: false });
    };

    handleCCSave = () => {
        firebaseService.database().ref().child('/users/' + this.props.profile.id)
          .update({ country: this.state.country, city: this.state.city }, (error) => {
            if (error) {
            } else {
            }
          });
        this.setState({ CCdialogVisible: false });

    };

    handleSave = () => {
        let newPlace = {
            date: this.state.date,
            where: this.state.where,
        }
        firebaseService.database().ref().child('/users/' + this.props.profile.id + '/places_name/').push().set(newPlace, (error) => {
            if (error) {
            } else {
            }
        })
        this.setState({ dialogVisible: false });

    };

    onCloseChangeName() {
        firebaseService.database().ref().child('/users/' + this.props.profile.id)
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
        firebaseService.database().ref().child('/users/' + this.props.profile.id)
            .update({ about: this.state.about }, (error) => {
                if (error) {
                } else {
                }
            });
        this.setState({
            changeabout: false,
        });
    }

    goBack() {
        this.props.navigation.navigate('Screen2');
    }

    onChangeName() {
        this.setState({
            changName: true,
            name: this.props.profile.name,
        })
    }

    onChangeAbout() {
        this.setState({
            changeabout: true,
            about: this.props.profile.about,
        })
    }

    onAddPlace() {
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
                let source = { uri: response.uri };

                this.uploadPlace(response);
                var temp = this.state.placeImageList;
                temp.push(source);

                this.setState({
                    placeImageList: temp,
                });
            }
        });
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
        firebaseService.database().ref().child('/users/' + this.props.profile.id)
            .update({ profile_img: this.state.imageData.data }, (error) => {
                if (error) {
                } else {
                }
            });
    }

    uploadPlace(imageData) {
        let newPlace = {
            img: imageData.data,
        }

        firebaseService.database().ref().child('/users/' + this.props.profile.id + '/places/').push().set(newPlace, (error) => {
            if (error) {
            } else {
            }
        })
    }

    render() {
        const placeList = [], placeNameList = [];
        if ('places' in this.props.profile) {
            for (key in this.props.profile.places) {
                placeList.push(
                    <View style={{ width: 100, height: 100, borderRadius: 5, overflow: 'hidden', marginRight: 10 }}>
                        <Image source={{ uri: `data:image/png;base64,${this.props.profile.places[key].img}` }} style={{ width: 100, height: 100, resizeMode: 'stretch' }} />
                    </View>
                );
            }
        }
        if ('places_name' in this.props.profile) {
            for (key in this.props.profile.places_name) {
                placeNameList.push(
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={[styles.blueText, { marginLeft: 10 }]}>Date: </Text>
                        <Text style={styles.grayBigText}>{this.props.profile.places_name[key].date}</Text>
                        <Text style={[styles.blueText, { marginLeft: 10 }]}>Where: </Text>
                        <Text style={styles.grayBigText}>{this.props.profile.places_name[key].where}</Text>
                    </View>
                );
            }
        }
        return (
            <View style={styles.container}>
                <View style={styles.topButtonContainer}>
                    <TouchableOpacity onPress={this.goBack}>
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
                                {'profile_img' in this.props.profile &&
                                    <Image style={styles.imageContainer1} source={{ uri: `data:image/png;base64,${this.props.profile.profile_img}` }} />
                                }
                                <TouchableOpacity style={styles.imagePlusContainer} onPress={this.selectPhotoTapped.bind(this)}>
                                    <AntIcon name="camerao" color='white' size={16} />
                                </TouchableOpacity>
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
                                    ('name' in this.props.profile &&
                                        <Text style={styles.blueText}>{this.props.profile.name} </Text>
                                    )
                                }
                                {!this.state.changName ?
                                    <TouchableOpacity onPress={this.onChangeName}>
                                        <Icon name="pencil" color={'gray'} size={16} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={this.onCloseChangeName}>
                                        <Icon name="close-circle" color={'gray'} size={16} />
                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={{flexDirection:'row', marginTop : 5, alignItems: 'center'}}>
                                <Text style={[styles.grayText,{marginRight: 5}]}>{'city' in this.props.profile && this.props.profile.city + "," + this.props.profile.country}</Text>
                                <TouchableOpacity onPress={this.showCCDialog}>
                                    <Icon name="pencil" color={'gray'} size={12} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Text style={styles.blueText}>About </Text>
                        {!this.state.changeabout ?
                            <TouchableOpacity onPress={this.onChangeAbout}>
                                <Icon name="pencil" color={'gray'} size={16} />
                            </TouchableOpacity>
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
                        ('about' in this.props.profile &&
                            <Text style={styles.grayText} numberOfLines={3}>{this.props.profile.about} </Text>
                        )
                    }
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '112%', position: 'absolute', bottom: -13 }}>
                        <View style={styles.blueButton}>
                            <Text style={styles.innerText}>Follow</Text>
                        </View>
                        <View style={styles.blueButton}>
                            <Text style={styles.innerText}>Message</Text>
                        </View>
                    </View> */}
                </View>
                <View style={[styles.cardContainer, { marginTop: 30 },]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.blueText, { marginLeft: 10 }]}>Next Travels </Text>
                        <TouchableOpacity onPress={this.showDialog}>
                            <Icon name="pencil" color={'gray'} size={12} />
                        </TouchableOpacity>
                    </View>
                    {placeNameList}
                </View>
                <View style={{ marginTop: 10, width: '100%', width: '90%' }}>
                    <Text style={[styles.blueText, { marginBottom: 10 }]}>Places Visited</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                        {placeList}
                        <TouchableOpacity style={{ backgroundColor: '#CED5DF', width: 100, height: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={this.onAddPlace}>
                            <Image source={placePlusImage} style={{ width: 50, height: 50, resizeMode: 'stretch' }} />
                        </TouchableOpacity>
                    </ScrollView>
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
                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>Please input new travles.</Dialog.Title>
                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                        <Text style={[styles.blueText, { marginLeft: 10 }]}>Date: </Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Date...'
                            returnKeyType='next'
                            autoCapitalize='none'
                            placeholderTextColor='gray'
                            onChangeText={this.handleDateChange}
                            underlineColorAndroid={'gray'}
                            value={this.state.date}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                        <Text style={[styles.blueText, { marginLeft: 10 }]}>Where: </Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Where...'
                            returnKeyType='next'
                            autoCapitalize='none'
                            placeholderTextColor='gray'
                            onChangeText={this.handleWhereChange}
                            underlineColorAndroid={'gray'}
                            value={this.state.where}
                        />
                    </View>
                    <Dialog.Button label="Save" onPress={this.handleSave} />
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                </Dialog.Container>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    profile: state.session.profile,
})


export default connect(mapStateToProps)(Screen3)

