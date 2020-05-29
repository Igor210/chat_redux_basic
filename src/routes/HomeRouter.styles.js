import { StyleSheet, Dimensions } from 'react-native'

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default styles = StyleSheet.create({
    imageBackContainer: {
        height : screenWidth/ 2.15,
        flexDirection : 'row',
        padding: 20,
        justifyContent : 'space-between',
    },
    imageBackContainer1: {
        height : screenWidth/ 3.06,
        flexDirection : 'row',
        padding: 20,
        justifyContent : 'space-between',
    },
});