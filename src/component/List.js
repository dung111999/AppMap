import React, { Component } from 'react';
import { Text, Dimensions, View, ScrollView, Image, ActivityIndicator, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../StyleSheet';
import { Filter } from '../function/Filter';
import { FetchData } from '../function/FetchData';
import MainPage from './MainPage';

let { height, width } = Dimensions.get('window');

export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listGas: true,
            listATM: false,
            isLoading: true,
            dataSource: [],
            filter: ' ',
            refresh: true,
        }
    }
    async componentDidMount() {
        FetchData.data().then(res => {
            this.setState({
                isLoading: false,
                dataSource: res,
            })
        })
    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ height: '100%', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
        return (
            <View>
                <StatusBar backgroundColor='transparent' translucent={true} />
                <View style={{ flexDirection: 'row' }}>
                    {this.state.listGas ?
                        <TouchableOpacity style={styles.circleBlue} onPress={() => this.setState({ listGas: false })}>
                            <Image source={require('../pictures/gas_choose.png')} style={{ width: 24, height: 24 }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.circle} onPress={() => this.setState({ listGas: true, listATM: false, filter: ' ', refresh: !this.state.refresh })}>
                            <Image source={require('../pictures/gas.png')} style={{ width: 24, height: 24 }} />
                        </TouchableOpacity>}
                    {this.state.listATM ?
                        <TouchableOpacity style={styles.circleBlue} onPress={() => this.setState({ listATM: false })}>
                            <Image source={require('../pictures/atm_choose.png')} style={{ width: 23, height: 23 }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.circle} onPress={() => this.setState({ listATM: true, listGas: false, filter: ' ', refresh: !this.state.refresh })}>
                            <Image source={require('../pictures/atm.png')} style={{ width: 23, height: 23 }} />
                        </TouchableOpacity>}
                    <View style={{ height: 40, width: width / 3, marginLeft: width / 3, marginTop: 40, borderBottomWidth: 1, justifyContent: 'center' }}>
                        {this.state.listGas ?
                            <Picker
                                style={{ height: 40, width: 150 }}
                                onValueChange={(itemValue) => this.setState({ filter: itemValue, refresh: !this.state.refresh })}
                            >
                                <Picker.Item label='T???t c???' value=' ' />
                                <Picker.Item label='RON 95' value='RON 95' />
                                <Picker.Item label='RON 92' value='RON 92' />
                                <Picker.Item label='Diesel' value='Diesel' />
                                <Picker.Item label='D???u nh???n' value='D???u nh???n' />
                                <Picker.Item label='B???o hi???m' value='B???o hi???m' />
                                <Picker.Item label='Thay d???u' value='Thay d???u' />
                            </Picker> : <View />}
                        {this.state.listATM ?
                            <Picker
                                style={{ height: 40, width: 150 }}
                                onValueChange={(itemValue) => this.setState({ filter: itemValue, refresh: !this.state.refresh })}
                            >
                                <Picker.Item label='T???t c???' value=' ' />
                                <Picker.Item label='N???p ti???n' value='N???p ti???n' />
                                <Picker.Item label='R??t ti???n' value='R??t ti???n' />
                                <Picker.Item label='Chuy???n ti???n' value='Chuy???n ti???n' />
                                <Picker.Item label='V???n tin s??? d??' value='V???n tin s??? d??' />
                                <Picker.Item label='M??? t??i kho???n thanh to??n' value='M??? t??i kho???n thanh to??n' />
                                <Picker.Item label='Ph??t h??nh th??? l???y ngay' value='Ph??t h??nh th??? l???y ngay' />
                            </Picker> : <View />}
                    </View>
                </View>
                {this.state.listGas ?
                    <ScrollView style={styles.list}>
                        <FlatList
                            data={this.state.dataSource}
                            renderItem={({ item }) => {
                                return (<View>{item.types == 'gas' && Filter({ services: item.services, check: this.state.filter }) ?
                                    <TouchableOpacity style={styles.itemList} onPress={() => this.props.navigation.navigate('MainPage')}>
                                        <Text style={styles.name}>{item.name}</Text>
                                        <Text>D???ch v???: {item.services}</Text>
                                    </TouchableOpacity> : <View />}</View>)
                            }}
                            extraData={this.state.refresh}
                        />
                        <View style={{ height: 155 }} />
                    </ScrollView> : <View />}
                {this.state.listATM ?
                    <ScrollView style={styles.list}>
                        <FlatList
                            data={this.state.dataSource}
                            renderItem={({ item }) => {
                                return (<View>{item.types == 'ATM' && Filter({ services: item.services, check: this.state.filter }) ?
                                    <TouchableOpacity style={styles.itemList} onPress={() => this.props.navigation.navigate('  MainPage')}>
                                        <Text style={styles.name}>{item.name}</Text>
                                        <Text>D???ch v???: {item.services}</Text>
                                    </TouchableOpacity> : <View />}</View>)
                            }}
                            extraData={this.state.refresh}
                        />
                        <View style={{ height: 155 }} />
                    </ScrollView> : <View />}
            </View>
        );
    }
}