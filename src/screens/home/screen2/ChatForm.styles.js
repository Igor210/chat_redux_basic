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
        paddingBottom : Platform.OS == "ios" ? 20 : 0,
    },
    mt1: {
        marginTop: 10,
    },
    mt2: {
        marginTop : 20,
    },
    topButtonContainer: {
        padding : 20,
        paddingTop : Platform.OS == "ios" ? 40 : 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor : '#005AA1',
    },
    msgContainer: {
        flex: 1,
        width : '100%',
        justifyContent : 'flex-end',
    },
    msgInputContainer: {
        flexDirection : 'row',
        alignItems: 'center',
        width: '100%',
        borderTopWidth : 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        paddingTop : 5,
    },
    imageBackContainer: {
        width : screenWidth / 3,
        padding: 10,
        justifyContent : 'center',
        alignItems: 'center',
    },
    textInput: {
        color : 'gray',
        paddingLeft : 10,
        width: screenWidth/2,
    },
});