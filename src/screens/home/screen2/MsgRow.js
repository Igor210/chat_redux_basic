import React, { Component } from 'react';
import { Image, Platform, StyleSheet, Text, View, ScrollView,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import avatarImage from '../../../assets/images/avatar.jpg'
import { DotsLoader } from 'react-native-indicator';

export default class MsgRow extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
    }

    render() {
        if(this.props.isAttach == false) {
            return (
                <View style={{width: '100%', justifyContent : this.props.type == 'send' ? 'flex-end' : 'flex-start', marginTop : 10, flexDirection : 'row', }}>
                    {this.props.type == 'receive' &&
                        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 40, overflow: 'hidden', marginRight: 15,backgroundColor : '#E5E4E8', justifyContent: 'center', alignItems: 'center'}} onPress={() => {this.props.openProfile(this.props.uid)}}>
                            {(this.props.img != '' && this.props.img) ?
                                <Image source={ { uri: `data:image/png;base64,${this.props.img}` } } style={{ width: 40, height: 40, resizeMode: 'stretch' }} />
                            :
                                <Text style={{fontSize : 16, fontWeight:'bold', color: '#0065B5'}}>{this.props.name.toUpperCase()[0] + this.props.name.toUpperCase()[1]}</Text>
                            }
                        </TouchableOpacity>
                    }
                    {!this.props.typing &&
                    <View style={{alignItems: this.props.type == 'send' ? 'flex-end' : 'flex-start'}}>
                        <View style={{backgroundColor : this.props.type == 'send' ? '#0061AD' : '#DDD', borderRadius : 3, padding : 5, alignItems : 'center', justifyContent : 'center'}}>
                            <Text style={{fontSize : 14, color : this.props.type == 'send' ? 'white' : 'gray'}}>
                                {this.props.msgText}
                            </Text>
                        </View>
                        <Text style={{color : 'gray', fontSize : 10, marginTop : 3}}>{this.props.msgDate}</Text>
                    </View>
                    }
                    {this.props.typing &&
                        <View style={{justifyContent : 'center'}}>
                            <DotsLoader color='#BBB' size={8}/>
                        </View>
                    }
                </View>
            );
        } else {
            return (
                <View style={{width: '100%', justifyContent : this.props.type == 'send' ? 'flex-end' : 'flex-start', marginTop : 10, flexDirection : 'row', }}>
                    {this.props.type == 'receive' &&
                        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 40, overflow: 'hidden', marginRight: 15,backgroundColor : '#E5E4E8', justifyContent: 'center', alignItems: 'center'}} onPress={() => {this.props.openProfile(this.props.uid)}}>
                            {(this.props.img != '' && this.props.img) ?
                                <Image source={ { uri: `data:image/png;base64,${this.props.img}` } } style={{ width: 40, height: 40, resizeMode: 'stretch' }} />
                            :
                                <Text style={{fontSize : 16, fontWeight:'bold', color: '#0065B5'}}>{this.props.name.toUpperCase()[0] + this.props.name.toUpperCase()[1]}</Text>
                            }
                        </TouchableOpacity>
                    }
                    <View style={{alignItems: this.props.type == 'send' ? 'flex-end' : 'flex-start'}}>
                        <View style={{backgroundColor : this.props.type == 'send' ? '#0061AD' : '#DDD', borderRadius : 3, padding : 10, alignItems : 'center', justifyContent : 'center'}}>
                            <TouchableOpacity activeOpacity={.7} onPress={() => {this.props.downloadAttach(this.props.msgKey)}}>
                                <Text style={{fontSize : 14, color : this.props.type == 'send' ? 'white' : 'gray',textDecorationLine: 'underline'}}>
                                    {this.props.attachName}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{color : 'gray', fontSize : 10, marginTop : 3}}>{this.props.msgDate}</Text>
                    </View>
                </View>
            );
        }
    }

}

