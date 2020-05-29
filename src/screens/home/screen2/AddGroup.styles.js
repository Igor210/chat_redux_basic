import { StyleSheet, Dimensions, Platform } from 'react-native'

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
        paddingTop : Platform.OS == "ios" ? 40 : 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor : '#005AA1',
        paddingBottom : 80,
        borderBottomLeftRadius : 20,
        borderBottomRightRadius : 20,
    },
    cardContainer: {
        borderRadius : 5,
        borderWidth : 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        width : '90%',
        alignItems : 'center',
        padding : 10,
        marginTop: -40,
        backgroundColor : 'white',
    },
    groupContainer:{
        flexDirection : 'row',
        width : '95%',
    },
    groupbox : {
        flex : 1,
        justifyContent : 'flex-start',
        alignItems : 'center',
        flexDirection : 'row',
    },
    borderBox: {
        borderColor : 'gray',
        borderWidth : 0.5,
        borderRadius : 5,
        padding : 10,
        justifyContent : 'center',
        width : '95%',
    },
    blueText: {
        color : '#0065b4',
        fontSize  :16,
    },
    grayText: {
        fontSize : 12,
        color : 'gray',
    },
    blueButton: {
        backgroundColor : '#0065b4',
        padding: 10,
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 5,
    },
    innerText: {
        color : 'white',
        fontWeight : 'bold',
        fontSize : 16,
    },
    textInput: {
        color : '#0065b4',
        paddingLeft : 10,
        width: screenWidth/3,
    },
    textInput1: {
        color : '#0065b4',
        paddingLeft : 10,
        width: screenWidth * 0.7,
    },
    imageBox: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
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
    imagePlusContainer: {
        backgroundColor: '#0075D1',
        borderRadius: 30,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 50,
        left: 50,
    },
});