import React, { Component } from 'react';
import { Text, TextInput, View, Image, StatusBar, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Keyboard, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { styles } from '../StyleSheet';
import { Item } from '../RenderItem';
import Geolocation from '@react-native-community/geolocation';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

let { height, width } = Dimensions.get('window');

const serviceGas = ['RON 95', 'RON 92', 'Diesel', 'Dầu nhờn', 'Bảo hiểm', 'Thay dầu'];
const serviceATM = ['Techcombank', 'BIDV', 'TP Bank', 'Nộp tiền', 'Rút tiền', 'Vấn tin số dư', 'Chuyển tiền', 'Mở tài khoản thanh toán', 'Phát hành thẻ lấy ngay'];
const openTime = ['05:00 - 24:00', '05:30 - 22:00', '06:00 - 22:00', '06:00 - 22:30', '24/24']

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
            selectedItems: [],
            confirm: false
        }
    }
    async componentDidMount() {
        try {
            Geolocation.getCurrentPosition(
                (info) => this.getPosition(info.coords.latitude, info.coords.longitude),
                (error) => console.log(error),
                { enableHighAccuracy: false, timeout: 50000 }
            );
            const response = await fetch('http://192.168.1.9:8084/poi');
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
        Keyboard.dismiss();
    }
    updateSearch = (search) => {
        this.setState({
            search,
            refresh: !this.state.refresh
        })
    };

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    onSelectedConfirm = () => {
        this.setState({
            confirm: true
        })
    }

    getTypes() {
        let names = [];

        names[0] = this.state.dataSource[0].types;

        let x = 1;

        for (let i = 1; i < this.state.dataSource.length; i++) {
            let dem = 0;
            for (let j = 0; j < x; j++) {
                if (this.state.dataSource[i].types == names[j]) {
                    dem++;
                }
            }

            if (dem == 0) {
                names[x] = this.state.dataSource[i].types;
                x++;
            }
        }

        return names;
    }

    result(types) {
        let result = [];

        let dem = 0;

        for (let i = 0; i < types.length; i++) {
            result.push({
                id: types[i],
                name: types[i]
            });
        }

        return result;
    }

    resultOpenTime() {
        let result = [];
        let dem = 10000;

        for (let i = 0; i < openTime.length; i++) {
            result.push({
                id: openTime[i],
                name: openTime[i]
            })
        }

        return result;
    }

    renderItems() {
        let items = [];

        let dem = 0;

        for (let i = 0; i < this.getTypes().length; i++) {

            if (this.getTypes()[i] == 'gas') {
                items.push({
                    name: 'Trạm xăng',
                    id: 'Trạm xăng',
                    children: this.result(serviceGas)
                })

            } else if (this.getTypes()[i] == 'ATM') {
                items.push(
                    {
                        name: 'ATM',
                        id: 'ATM',
                        children: this.result(serviceATM)
                    }
                )
            }
        }

        items.push({
            name: 'Thời gian mở cửa',
            id: 'Thời gian mở cửa',
            children: this.resultOpenTime()
        })

        return items;
    }

    markerFilter(latitude, longitude, key) {
        return (
            <Marker
                key={key}
                title='Test'
                coordinate={{ latitude, longitude }}
            />
        )
    }

    checkContains() {
        let items = [];

        for (let i = 0; i < this.state.dataSource.length; i++) {
            if (this.state.dataSource[i].services.split(", ").toString().includes(this.state.selectedItems)) {
                items.push(this.markerFilter(this.state.dataSource[i].latitude, this.state.dataSource[i].longitude, i));
            }
        }

        return items;
    }

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
        let items = this.renderItems()

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
                    onPress={() => { this.setState({ isFocus: false, info: false }); Keyboard.dismiss(); }}
                >
                    {this.state.location == true ?
                        <Marker coordinate={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }} pinColor='#5ec3f2' title='Vị trí của bạn'
                        /> : <View />}
                    {this.state.latitude != 0 && this.state.longitude != 0 ?
                        <Marker coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                            onPress={() => this.setState({ info: true })} /> : <View />
                    }
                    {this.state.confirm == true ? this.checkContains() : <View />}

                </MapView>
                <View style={styles.findingBox}>
                    <Image source={require('../pictures/map.png')} style={{ width: 30, height: 30, flex: 1 }} />
                    <TextInput
                        style={{ width: width, flex: 8 }}
                        placeholder='Tìm kiếm địa điểm'
                        onChangeText={this.updateSearch}
                        value={search}
                        maxLength={45}
                        onFocus={onFocus}
                        on
                    />
                    <SectionedMultiSelect
                        items={items}
                        IconRenderer={Icon}
                        uniqueKey="id"
                        subKey="children"
                        showDropDowns={true}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        onConfirm={this.onSelectedConfirm}
                        selectedItems={this.state.selectedItems}
                        style={{ flex: 1 }}
                        showChips={false}
                    />
                </View>
                {this.state.isFocus == true ?
                    <ScrollView style={styles.listSearch} keyboardShouldPersistTaps='handled'>
                        <FlatList
                            keyboardShouldPersistTaps='handled'
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
