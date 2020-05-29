import { StyleSheet, Dimensions } from 'react-native'

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  cardContainer: {
    borderWidth: 0,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,

    width: '90%',
    padding: 20,
  },
  cardBox: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
    width : screenWidth * 0.8,
    marginTop: 10,
  },
  cardText: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
  }
});
