import { StyleSheet, Dimensions } from 'react-native'

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default StyleSheet.create({
    container: {
        padding: 0,
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems : 'center',
    },
    mt1: {
        marginTop: 10,
    },
    mt2: {
        marginTop : 20,
    },
    topButtonContainer: {
        paddingHorizontal: 20,
        paddingTop : 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor : '#005AA1',
        paddingBottom : 70,
        borderBottomLeftRadius : 20,
        borderBottomRightRadius : 20,
    },
    cardContainer:{
        padding : 10,
        borderRadius : 5,
        backgroundColor : 'white',
        marginTop: -30,
        flex: 1,
        width : '90%',
    },
    cardTitleText: {
        color : '#0065B5',
        fontSize : 20,
    },
    cardRow: {
        padding: 20,
        flexDirection : 'row',
        justifyContent: 'space-between',
        borderBottomColor : '#F4F5F8',
        borderBottomWidth : 1,
        alignItems : 'center',
    },
    cardRowFront: {
        flexDirection: 'row',
        alignItems : 'center',
    },
    grayText: {
        fontSize : 16,
        color : '#AAB2BF',
    },
    smallGrayText: {
        fontSize : 14,
        color : '#AAB2BF',
    },
    textInput: {
        color : 'gray',
        paddingLeft : 10,
        width: screenWidth/2,
    },
    imageBox:{
        width: 25,
        height: 25,
        resizeMode: 'stretch',
        marginRight: 10,
    },
    blueButton: {
        backgroundColor: '#0065B5',
        borderRadius : 5,
        paddingVertical : 5,
        paddingHorizontal : 10,
    },
    whiteText:{
        fontSize: 14,
        color : 'white',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'black',
        opacity: 0.7,
        justifyContent : 'center',
        alignItems : 'center',
    }
});