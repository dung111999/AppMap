import { StyleSheet, Dimensions } from 'react-native';

let { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  findingBox: {
    position: 'absolute',
    width: width,
    height: 50,
    marginTop: 30, 
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  itemBox: {
    width: width,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderTopColor: 'black',
    borderWidth: 1,
    height: 65,
    padding: 5,
    paddingLeft: 10
  },
  itemList: {
    width: width,
    backgroundColor: 'white',
    borderColor: 'white',
    borderTopColor: 'black',
    borderWidth: 1,
    padding: 5,
    paddingLeft: 10
  },
  list: {
    height: height,
    marginTop: 25
  },
  listSearch: {
    position: 'absolute',
    height: height / 2,
    marginTop: 80
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  address: {
    fontSize: 12
  },
  circle: {
    marginTop: 35,
    marginLeft: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBlue: {
    marginTop: 35,
    marginLeft: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#5ec3f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginTop: -height / 4 - 30,
    height: height / 4,
    backgroundColor: 'white',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  infoName: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  infoAddress: {
    fontSize: 14,
  },
  filterBox: {
    flex: 6,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
  },
  map: {
    width: width,
    height: height
  },
});