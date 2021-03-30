import React, { Component } from 'react';
import { Text, TextInput, View, Image, StatusBar, Dimensions, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { styles } from '../StyleSheet';
import { Item } from '../RenderItem';
import Geolocation from '@react-native-community/geolocation';
import { ScrollView } from 'react-native-gesture-handler';

let { height, width } = Dimensions.get('window');

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
            item: {},
            latitude: 0,
            longitude: 0,
            regionLatitude: 0,
            regionLongitude: 0,
            regionLatitudeDelta: 0.05,
            regionLongitudeDelta: 0.05,
            currentPositionLatitude: 0,
            currentPositionLongitude: 0,
            location: true,
            search: '',
            isFocus: false,
            refresh: true,
            filter: '',
            filterList: false
        }
    }
    async componentDidMount() {
        try {
            Geolocation.getCurrentPosition(
                (info) => this.getPosition(info.coords.latitude, info.coords.longitude),
                (error) => console.log(error),
                { enableHighAccuracy: false, timeout: 50000 }
            );
            const response = await fetch('http://192.168.0.105:8084/poi');
            const responseJson = await response.json();
            this.setState({
                isLoading: false,
                dataSource: responseJson,
            }, function () {
            });
        } catch (error) {
            console.error(error);
        }
    }
    currentPosition() {
        Geolocation.getCurrentPosition(
            (info) => this.getPosition(info.coords.latitude, info.coords.longitude),
            (error) => console.log(error),
            { enableHighAccuracy: false, timeout: 50000 }
        );
    }
    getPosition(latitude, longitude) {
        this.setState({
            currentPositionLatitude: latitude,
            currentPositionLongitude: longitude,
            regionLatitude: latitude,
            regionLongitude: longitude
        })
    }
    updatePosition(item) {
        this.setState({
            item: item,
            latitude: item.latitude,
            longitude: item.longitude,
            regionLatitude: item.latitude,
            regionLongitude: item.longitude,
            isFocus: false
        })
    }
    updateSearch = (search) => {
        this.setState({
            search,
            refresh: !this.state.refresh
        })
    };

    render() {
        const { search } = this.state
        const onFocus = () => this.setState({ isFocus: true })
        if (this.state.isLoading) {
            return (
                <View style={{ height: '100%', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='transparent' barStyle='dark-content' translucent={true} />
                <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: this.state.regionLatitude,
                        longitude: this.state.regionLongitude,
                        latitudeDelta: this.state.regionLatitudeDelta,
                        longitudeDelta: this.state.regionLongitudeDelta
                    }}
                    onRegionChangeComplete={(region) => {
                        this.setState({
                            regionLatitude: region.latitude,
                            regionLongitude: region.longitude,
                            regionLatitudeDelta: region.latitudeDelta,
                            regionLongitudeDelta: region.longitudeDelta
                        })
                    }}
                >
                    {this.state.location == true ? <Marker coordinate={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }} pinColor='#5ec3f2'
                        title='Vị trí của bạn'
                    /> : <View />}
                    <Marker coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                        title={this.state.item.name}
                        description={this.state.item.address}
                        onPress={() => this.setState({ info: true })}
                        onDeselect={() => this.setState({ info: false })}
                    />
                </MapView>
                <View style={styles.findingBox}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                        <Image source={require('../pictures/map.png')} style={{ width: 30, height: 30 }} />
                    </View>
                    <View style={{ flex: 8 }}>
                        <TextInput
                            style={{ width: width }}
                            placeholder="Tìm kiếm địa điểm"
                            onChangeText={this.updateSearch}
                            value={search}
                            maxLength={45}
                            onFocus={onFocus}
                        />
                    </View>

                    <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                        <Image source={require('../pictures/filter.png')} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>

                </View>
                {this.state.isFocus == true ?
                    <ScrollView style={styles.listSearch}>
                        <FlatList
                            data={this.state.dataSource}
                            renderItem={({ item }) => <Item fun={() => this.updatePosition(item)} item={item} check={this.state.search} currentLat={this.state.currentPositionLatitude} currentLon={this.state.currentPositionLongitude} />}
                            extraData={this.state.refresh}
                        />
                    </ScrollView> : <View />}
                {this.state.info == true ?
                    <TouchableOpacity style={styles.info}>
                        <View style={{ flexDirection: 'row' }}>
                            {this.state.item.types == 'gas' ? <Image source={require('../pictures/gas.png')} style={{ width: 50, height: 50, marginTop: 5 }} />
                                : this.state.item.types == 'ATM' ? <Image source={require('../pictures/atm.png')} style={{ width: 50, height: 45, marginTop: 10 }} />
                                    : <View />}
                            <View style={{ paddingLeft: 10, paddingRight: 35 }}>
                                <Text style={styles.infoName}>{this.state.item.name}</Text>
                                <Text style={styles.infoAddress}>{this.state.item.address}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/open_close.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ alignSelf: 'flex-end' }}> {this.state.item.open_close}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/services.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ alignSelf: 'flex-end' }}> {this.state.item.services}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/phone.png')} style={{ width: 22, height: 22, marginLeft: 1 }} />
                            <Text style={{ alignSelf: 'flex-end' }}>  {this.state.item.phone}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../pictures/email.png')} style={{ width: 20, height: 20, marginLeft: 3 }} />
                            <Text style={{ alignSelf: 'flex-end' }}>  {this.state.item.email}</Text>
                        </View>
                    </TouchableOpacity> : <View />}
            </View>
        );
    }
}