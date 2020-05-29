import { StyleSheet, Dimensions } from 'react-native'

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      width : '100%'
    },
    logoBox: {
        width : '100%',
        height : screenWidth/ 1.73,
    },
    logoImgae: {
        width: '100%',
        height: screenWidth / 1.73,
        resizeMode: 'stretch',
    },
    mainContainer: {
        flex: 1,
        width : '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        width: '90%',
        padding: 10,
        backgroundColor: '#1D2635',
        borderRadius: 20,
        color : 'white',
        textAlign : 'center',
    },
    mt1: {
        marginTop : 10,
    },
    mt2: {
        marginTop : 20,
    },
    greenButton: {
        backgroundColor: '#34CC81',
        padding : 10,
        borderRadius : 20,
        width : '90%',
        justifyContent : 'center',
        alignItems: 'center',
    },
    whilteText: {
        color: 'white',
        fontSize : 18,
    },
    normalText: {
        fontSize: 18,
        textAlign: 'center',
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
