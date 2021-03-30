import React, { Component } from 'react';
import { Text, Dimensions, View, ScrollView, Image, ActivityIndicator, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../StyleSheet';
import { Item } from '../RenderItem';
import MainPage from './MainPage';
import { Filter } from '../Filter';

let {height, width} = Dimensions.get('window');

export default class List extends Component {
    constructor(props){
        super(props);
        this.state = {
          listGas: false,
          listATM: false,
          isLoading: true,
          dataSource: [],
          filter: '',
          filterList: false,
          refresh: true,
        }
    }
    async componentDidMount(){
        try {
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
    render() {
        const chooseFilter = () => this.setState({filterList: !this.state.filterList})
        if(this.state.isLoading) {
            return (
                <View style={{height: '100%', justifyContent: 'center'}}>
                    <ActivityIndicator size='large'/>
                </View>
            )
        }
        return (
            <View>
                <StatusBar backgroundColor='transparent' translucent={true}/>
                <View style={{flexDirection: 'row'}}>
                    {this.state.listGas == false ?
                    <TouchableOpacity style={styles.circle} onPress={() => this.setState({listGas: true, listATM: false})}>
                        <Image source={require('../pictures/gas.png')} style={{width: 24, height: 24}}/>
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.circleBlue} onPress={() => this.setState({listGas: false})}>
                        <Image source={require('../pictures/gas_choose.png')} style={{width: 24, height: 24}}/>
                    </TouchableOpacity>}
                    {this.state.listATM == false ?
                    <TouchableOpacity style={styles.circle} onPress={() => this.setState({listATM: true, listGas: false})}>
                        <Image source={require('../pictures/atm.png')} style={{width: 23, height: 23}}/>
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.circleBlue} onPress={() => this.setState({listATM: false})}>
                    <Image source={require('../pictures/atm_choose.png')} style={{width: 23, height: 23}}/>
                    </TouchableOpacity>}
                    <View style={{marginTop: 35, flexDirection: 'row', marginLeft: width/4}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Filter: </Text>
                            <View style={{flexDirection: 'row', height: 35, width: 130, borderWidth: 1, alignSelf: 'center', right: 100}}>
                                <Text style={styles.filterBox}>{this.state.filter}</Text>
                                <TouchableOpacity style={{flex: 1, borderLeftWidth: 1}} onPress={chooseFilter}>
                                    <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Z</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {this.state.filterList == true ?
                    <View style={{position: 'absolute', marginTop: 65, marginLeft: width/4, height: 200, zIndex: 1}}>
                        <TouchableOpacity>
                            <Text>RON 95</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text>RON 92</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text>Diesel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text>Dầu nhờn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text>Bảo hiểm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({filter: 'Thay dầu', refresh: !this.state.refresh})}>
                            <Text>Thay dầu</Text>
                        </TouchableOpacity>
                    </View>
                    : <View/>}
                </View>
                {this.state.listGas == true ? 
                <ScrollView style = {styles.list}>
                    <FlatList
                        data = {this.state.dataSource}
                        renderItem={({item}) => {return(<View>{item.types == 'gas' && Filter({services: item.services, check: this.state.filter}) == true ? 
                        <View  style={styles.itemList}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text>Dịch vụ: {item.services}</Text>
                        </View>: <View/>}</View>)}}
                        extraData = {this.state.refresh}
                    />
                    <View style={{height: 80}}/>
                </ScrollView> : <View/>}
                {this.state.listATM == true ? 
                <ScrollView style = {styles.list}>
                    <FlatList
                        data = {this.state.dataSource}
                        renderItem={({item}) => {return(<View>{item.types == 'ATM' ?
                        <View  style={styles.itemList}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text>Dịch vụ: {item.services}</Text>
                        </View> : <View/>}</View>)}}
                        extraData = {this.state.refresh}
                    />
                    <View style={{height: 80}}/>
                </ScrollView> : <View/>}
            </View>
        );
    }
}