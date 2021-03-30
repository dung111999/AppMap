import React from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Searching } from './Searching';
import { Distance } from './CalculateDistance';
import { styles } from './StyleSheet';

let {height, width} = Dimensions.get('window');

export const Item = ({fun, item, check, currentLat, currentLon}) => {
    return (
        <View>
            {Searching({item: item, check: check}) == true ?
                <TouchableOpacity
                    onPress={fun}
                    style={styles.itemBox}
                >
                    <View style={{flex: 7}}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.address}>{item.address}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text>{Distance({lat1: currentLat, lon1: currentLon, lat2: item.latitude, lon2: item.longitude})} km</Text>
                    </View>
                </TouchableOpacity> : null}
        </View>
    );
}