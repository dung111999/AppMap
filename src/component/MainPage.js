import React, { Component } from 'react';
import { Text, TextInput, View, Image, StatusBar, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Keyboard, PermissionsAndroid, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { styles } from '../StyleSheet';
import { Item } from '../function/RenderItem';
import Geolocation from '@react-native-community/geolocation';
import { ScrollView } from 'react-native-gesture-handler';
import { SearchLog } from '../function/SearchLog';
import { GetLog } from '../function/GetLog';
import { FetchData } from '../function/FetchData';
import { History } from '../function/RenderHistory';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { getDistance } from 'geolib';
import { Alert } from 'react-native';

let { height, width } = Dimensions.get('window');

const serviceGas = ['RON 95', 'RON 92', 'Diesel', 'Dầu nhờn', 'Bảo hiểm', 'Sơn', 'Nước giặt', 'Thay dầu', 'Nhà vệ sinh'];
const serviceATM = ['Agribank', 'BIDV', 'Vietcombank', 'Vietinbank', 'TP', 'MB', 'VP', 'VIB', 'ACB', 'MSB', 'PG', 'SHB', 'Sacombank', 'AB', 'SeABank', 'SaiGonBank', 'PublicBank', 'HSBC', 'HDBank', 'Eximbank', 'PVCombank', 'OceanBank', 'VietBank', 'VietABank', 'GPBank','Techcombank','Nộp tiền', 'Rút tiền', 'Vấn tin số dư', 'Chuyển tiền', 'Mở tài khoản thanh toán', 'Phát hành thẻ lấy ngay'];
const openTime = ['05:00 - 24:00', '05:30 - 22:00', '06:00 - 22:00', '06:00 - 22:30', '08:00 - 22:00', '24/24'];


export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
            direct: [],
            item: {},
            latitude: 0,
            longitude: 0,
            regionLatitude: 0,
            regionLongitude: 0,
            regionLatitudeDelta: 0.01,
            regionLongitudeDelta: 0.01,
            currentPositionLatitude: 0,
            currentPositionLongitude: 0,
            search: '',
            location: true,
            isFocus: false,
            refresh: true,
            direct: false,
            history: '',
            selectedItems: [],
            confirm: false,
            itemInfo: [],
            oneInfo: false,
            directFilter: false,
        }
    }

    async componentDidMount() {
        {
            this.currentPosition();
            this.getLog();
            FetchData.data().then((res) => {
                this.setState({
                    isLoading: false,
                    dataSource: res,
                })
            })
        }
    }

    currentPosition() {
        Geolocation.getCurrentPosition(
            (info) => this.getPosition(info.coords.latitude, info.coords.longitude),
            (error) => Alert.alert('Bạn cần bật vị trí để sử dụng ứng dụng này'),
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
        SearchLog({ name: item.name })
        this.setState({
            item: item,
            latitude: item.latitude,
            longitude: item.longitude,
            regionLatitude: item.latitude,
            regionLongitude: item.longitude,
        })
        this.clear();
    }
    updateSearch = (search) => {
        this.setState({
            search,
            refresh: !this.state.refresh,
            confirm: false,
            selectedItems: []
        })
    }
    getLog() {
        GetLog.log().then(res => {
            this.setState({
                history: res,
            })
        })
    }
    clear() {
        this.setState({
            isFocus: false,
            info: false,
            direct: false,
            directFilter: false
        })
        this.getLog();
        Keyboard.dismiss();
    }

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    onSelectedConfirm = () => {
        this.setState({
            confirm: true,
            oneInfo: false,
            latitude: 0,
            longitude: 0,
            directFilter: false,
            direct: false
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

        if (types == serviceGas) {
            result.push({
                id: 'Gần tôi gas',
                name: 'Gần tôi'
            })
        } else if (types == serviceATM) {
            result.push({
                id: 'Gần tôi ATM',
                name: 'Gần tôi'
            })
        }

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

    setData(data) {
        this.setState({
            itemInfo: data,
            info: true,
            directFilter: true,
            direct: false
        })
        // console.log("click " + data)
        // console.log(this.state.itemInfo);
    }

    directFilter() {
        console.log(this.state.itemInfo.length);
        return (
            <MapViewDirections
                origin={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }}
                destination={{ latitude: this.state.itemInfo.latitude, longitude: this.state.itemInfo.longitude }}
                apikey={'AIzaSyDGRIkhrfyhXfwmzRRX6TTyZ6XmvAsW4Iw&fbclid'}
                strokeWidth={3}
                strokeColor='red'
            />
        )
    }

    markerFilter(data, key) {
        this.state.item = data;

        if (this.state.item.types == 'gas') {
            //console.log(this.state.item);
            return (
                <Marker
                    key={key}
                    coordinate={{ latitude: data.latitude, longitude: data.longitude }}
                    onPress={() => { this.setData(data) }}
                >
                    <Image source={require('../pictures/pointer_gas.png')} style={{ width: 60, height: 60 }} />
                </Marker>
            )
        }
        if (this.state.item.types == 'ATM') {
            //console.log(this.state.item);
            return (
                <Marker
                    key={key}
                    coordinate={{ latitude: data.latitude, longitude: data.longitude }}
                    onPress={() => this.setData(data)}
                >
                    <Image source={require('../pictures/pointer_atm.png')} style={{ width: 60, height: 60 }} />
                </Marker>
            )
        }
    }

    removeItem(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }

    getDistance(lat1, lon1, lat2, lon2) {
        var dis = getDistance(
            { latitude: lat1, longitude: lon1 },
            { latitude: lat2, longitude: lon2 },
        );

        var distance = dis / 1000;

        return distance;
    }

    checkOpenClose() {
        for (let i = 0; i < openTime.length; i++) {
            if (this.state.selectedItems.includes(openTime[i])) {
                return true;
            }
        }
        return false;
    }

    checkOnceOpenClose() {
        let count = 0;
        for (let i = 0; i < openTime.length; i++) {
            if (this.state.selectedItems.includes(openTime[i])) {
                count++;
            }
        }
        if (count == 1) {
            return true;
        }
        return false;
    }

    getOnceOpenClose() {
        let count = 0;
        let result = null;
        for (let i = 0; i < openTime.length; i++) {
            if (this.state.selectedItems.includes(openTime[i])) {
                count++;
                result = openTime[i];
            }
        }
        if (count == 1) {
            return result;
        }
        return null;
    }

    checkContains() {
        let items = [];
        let dis = [];
        let dataCoor = [];
        let index = -1;
        let check = 0;
        let arr = [];

        if (this.state.selectedItems.length != 0) {
            // listItem.clear();

            for (let i = 0; i < this.state.dataSource.length; i++) {
                if (this.state.selectedItems.includes("Gần tôi ATM") == false && this.state.selectedItems.includes("Gần tôi gas") == false && this.checkOpenClose() == false) {
                    if (this.state.selectedItems.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                        // items.push(this.markerFilter(this.state.dataSource[i].latitude, this.state.dataSource[i].longitude, i));
                        items.push(this.markerFilter(this.state.dataSource[i], i));
                    }
                } else {

                    if (this.state.selectedItems.includes("Gần tôi ATM") && this.state.dataSource[i].types == 'ATM') {
                        if (this.checkOpenClose() == false) {
                            arr = this.removeItem(this.state.selectedItems, "Gần tôi ATM");
                            if (arr.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                                dis.push(this.getDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, this.state.dataSource[i].latitude, this.state.dataSource[i].longitude));
                                dataCoor.push(this.state.dataSource[i]);
                                check = 1;
                            }
                            this.state.selectedItems.push("Gần tôi ATM");
                        } else {
                            if (this.checkOnceOpenClose()) {
                                if (this.state.dataSource[i].open_close == this.getOnceOpenClose()) {
                                    // items.push(this.markerFilter(this.state.dataSource[i].latitude, this.state.dataSource[i].longitude, i));
                                    const time = this.getOnceOpenClose();
                                    arr = this.removeItem(this.state.selectedItems, "Gần tôi ATM");
                                    arr = this.removeItem(this.state.selectedItems, this.getOnceOpenClose());
                                    if (arr.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                                        dis.push(this.getDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, this.state.dataSource[i].latitude, this.state.dataSource[i].longitude));
                                        dataCoor.push(this.state.dataSource[i]);
                                        check = 1;
                                    }
                                    this.state.selectedItems.push("Gần tôi ATM");
                                    this.state.selectedItems.push(time);
                                }
                            }
                        }
                    }
                }
                if (this.state.selectedItems.includes("Gần tôi gas") && this.state.dataSource[i].types == 'gas') {
                    if (this.checkOpenClose() == false) {
                        arr = this.removeItem(this.state.selectedItems, "Gần tôi gas");
                        if (arr.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                            dis.push(this.getDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, this.state.dataSource[i].latitude, this.state.dataSource[i].longitude));
                            dataCoor.push(this.state.dataSource[i]);
                            check = 2;
                        }
                        this.state.selectedItems.push("Gần tôi gas");
                    } else {
                        if (this.checkOnceOpenClose()) {
                            if (this.state.dataSource[i].open_close == this.getOnceOpenClose()) {
                                // items.push(this.markerFilter(this.state.dataSource[i].latitude, this.state.dataSource[i].longitude, i));
                                const time = this.getOnceOpenClose();
                                arr = this.removeItem(this.state.selectedItems, "Gần tôi gas");
                                arr = this.removeItem(this.state.selectedItems, this.getOnceOpenClose());
                                if (arr.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                                    dis.push(this.getDistance(this.state.currentPositionLatitude, this.state.currentPositionLongitude, this.state.dataSource[i].latitude, this.state.dataSource[i].longitude));
                                    dataCoor.push(this.state.dataSource[i]);
                                    check = 2;
                                }
                                this.state.selectedItems.push("Gần tôi gas");
                                this.state.selectedItems.push(time);
                            }
                        }
                    }
                }

                if (this.checkOnceOpenClose() && this.state.selectedItems.includes("Gần tôi gas") == false && this.state.selectedItems.includes("Gần tôi ATM") == false) {
                    if (this.getOnceOpenClose() == this.state.dataSource[i].open_close) {
                        // items.push(this.markerFilter(this.state.dataSource[i], i));
                        const time = this.getOnceOpenClose();
                        arr = this.removeItem(this.state.selectedItems, this.getOnceOpenClose());
                        if (arr.every((x) => this.state.dataSource[i].services.split(", ").includes(x))) {
                            // items.push(this.markerFilter(this.state.dataSource[i].latitude, this.state.dataSource[i].longitude, i));
                            items.push(this.markerFilter(this.state.dataSource[i], i));
                        }
                        this.state.selectedItems.push(time);
                    }
                }
            }
        }


        index = dis.indexOf(Math.min.apply(Math, dis));
        if (check == 1) {
            items.push(this.markerFilter(dataCoor[index], "keyATM"));
        }
        if (check == 2) {
            items.push(this.markerFilter(dataCoor[index], "keyGas"));
        }

        return items;
    }

    renderInfo(item) {
        if (this.state.info === true || this.state.oneInfo === true) {
            return (
                <TouchableOpacity style={styles.info}>
                    <View style={{ flexDirection: 'row' }}>
                        {item.types == 'gas' ? <Image source={require('../pictures/gas.png')} style={{ width: 50, height: 50, marginTop: 5 }} />
                            : item.types == 'ATM' ? <Image source={require('../pictures/atm.png')} style={{ width: 50, height: 45, marginTop: 10 }} />
                                : <View />}
                        <View style={{ paddingLeft: 10, paddingRight: 35 }}>
                            <Text style={styles.infoName}>{item.name}</Text>
                            <Text style={styles.infoAddress}>{item.address}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../pictures/open_close.png')} style={{ width: 25, height: 25 }} />
                        <Text style={{ alignSelf: 'center' }}>{item.open_close}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../pictures/services.png')} style={{ width: 25, height: 25 }} />
                        <Text style={{ alignSelf: 'center' }}>{item.services}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../pictures/phone.png')} style={{ width: 25, height: 25 }} />
                        <Text style={{ alignSelf: 'center' }}>{item.phone}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../pictures/email.png')} style={{ width: 25, height: 25 }} />
                        <Text style={{ alignSelf: 'center' }}>{item.email}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <View></View>
            )
        }
    }

    markOneItem() {
        let items = [];
        items.push(<Marker coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
            onPress={() => { this.setState({ oneInfo: true, direct: true }), this.getLog(); }}
        >
            {this.state.item.types == 'gas' ? <Image source={require('../pictures/pointer_gas.png')} style={{ width: 60, height: 60 }} />
                : this.state.item.types == 'ATM' ? <Image source={require('../pictures/pointer_atm.png')} style={{ width: 60, height: 60 }} />
                    : <View />}
        </Marker>)
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
                    onPress={() => { this.clear() }}
                >
                    {this.state.location ?
                        <Marker coordinate={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }} pinColor='#5ec3f2' title='Vị trí của bạn'
                            onPress={() => this.clear()} /> : <View />}
                    {this.state.latitude != 0 && this.state.longitude != 0 ?
                        this.markOneItem() : <View />}
                    {this.state.confirm == true ? this.checkContains() : <View />}

                    {this.state.direct ?
                        <MapViewDirections
                            origin={{ latitude: this.state.currentPositionLatitude, longitude: this.state.currentPositionLongitude }}
                            destination={{ latitude: this.state.item.latitude, longitude: this.state.item.longitude }}
                            apikey={'AIzaSyDGRIkhrfyhXfwmzRRX6TTyZ6XmvAsW4Iw&fbclid'}
                            strokeWidth={3}
                            strokeColor='red'
                        /> : <View />}

                    {this.state.directFilter ?
                        this.directFilter() : <View />
                    }

                </MapView>
                <View style={styles.findingBox}>
                    <Image source={require('../pictures/map.png')} style={{ width: 30, height: 30, flex: 1 }} />
                    <TextInput
                        style={{ width: width * 4 / 5, flex: 8 }}
                        placeholder='Tìm kiếm địa điểm'
                        onChangeText={this.updateSearch}
                        value={this.state.search}
                        maxLength={45}
                        onFocus={onFocus}
                    />
                    <SectionedMultiSelect
                        items={this.renderItems()}
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
                        searchPlaceholderText="Search"
                    />
                    {this.state.search != '' ?
                        <TouchableOpacity onPress={() => this.setState({ search: '' })}>
                            <Image source={require('../pictures/clear.png')} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity> : <View />}
                </View>
                {this.state.isFocus ?
                    <ScrollView style={styles.listSearch} keyboardShouldPersistTaps='handled'>
                        {this.state.search == '' ?
                            <FlatList
                                keyboardShouldPersistTaps='handled'
                                data={this.state.history}
                                renderItem={({ item }) => <History fun={() => this.updateSearch(item)} item={item} />}
                                extraData={this.state.refresh}
                            />
                            :
                            <FlatList
                                keyboardShouldPersistTaps='handled'
                                data={this.state.dataSource}
                                renderItem={({ item }) => <Item fun={() => this.updatePosition(item)} item={item} check={this.state.search} currentLat={this.state.currentPositionLatitude} currentLon={this.state.currentPositionLongitude} />}
                                extraData={this.state.refresh}
                            />}
                    </ScrollView> : <View />}
                {this.state.info ?
                    <View>{this.renderInfo(this.state.itemInfo)}</View> : <View />}
                {this.state.oneInfo ?
                    <View>{this.renderInfo(this.state.item)}</View> : <View />}
            </View>


        );
    }
}
