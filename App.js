import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, ScrollView, Dimensions, ActivityIndicator , Image } from 'react-native';
import Constants from 'expo-constants';
import * as Location from "expo-location";
import {Ionicons} from '@expo/vector-icons';


// You can import from local files
import AssetExample from './components/AssetExample';
// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
const {width:SCREEN_WIDTH} = Dimensions.get("window");
const API_KEY = "5471c2004972c02f20016f8995f701b4";

function Unix_timestamp(t){
    var week = new Array('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');
    var date = new Date(t*1000);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth()+1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    var second = "0" + date.getSeconds();
    var tday = date.getDay();
    //return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
    return week[tday]+'('+month.substr(-2) + "/" + day.substr(-2)+')';
}
function findClothes(temperature){
  const imglist= {
    27: 'https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/000000/external-sleeveless-clothes-icongeek26-linear-colour-icongeek26.png',
    23: "https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/000000/external-football-shirt-football-icongeek26-linear-colour-icongeek26.png",
    20 : `https://img.icons8.com/windows/100/000000/v-neck-longsleeve.png`,
    15:"https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/100/000000/external-windbreaker-spring-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png",
    10:"https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/60/000000/external-coat-clothes-vitaliy-gorbachev-lineal-color-vitaly-gorbachev-1.png",
    5: "https://img.icons8.com/external-justicon-lineal-color-justicon/100/000000/external-jacket-autumn-clothes-justicon-lineal-color-justicon-2.png",
    0: "https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/100/000000/external-mitten-snowboarding-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png"
  };
  if (temperature >= 27) {
    return imglist[27];
  }
  else if(temperature >= 23) {
    return imglist[27];
  }
  else if (temperature >=20){
    return imglist[20]
  }
  else if (temperature >=15){
    return imglist[15]
  }
  else if (temperature >=10){
    return imglist[10]
  }
  else if (temperature >=5){
    return imglist[5]
  }
  else {
    return imglist[0];
  }
}
export default function App() {
  const [location, setLocation] = useState();
  const [geo , setgeo] = useState("GEO");
  const [street, setStreet] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [timezone_offset, setTimezone] = useState();
  const [ok , setOk] = useState(true);
  const ask= async () => {
      let { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setOk('false');
      }
      const{  coords : { latitude , longitude},} = await Location.getCurrentPositionAsync({ accuracy:5 });
      const location = await Location.reverseGeocodeAsync({ latitude,longitude},{useGoogleMaps:false});
      setLocation(location);
      setStreet(location[0].street);
      const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&exclude=alerts,minutely,hourly&units=metric`);
      const json =await res.json();
      setgeo([latitude,longitude]);
      setDays(json.daily)
      setTimezone(json.timezone_offset)
    };
  useEffect(()=> { ask();},[]);
  let ttt = JSON.stringify(days);
  let text = "nothing";
/*  if (location) {
    text = JSON.stringify(location);
  }
*/
  if (days) {
    text = JSON.stringify(days[0]);
  }
/*          
        <Text>{geo[0]}</Text>
        <Text>{geo[1]}</Text>
        <Text>{text}</Text>
        */
  let date = ""
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityname}>{street}</Text>

      </View>
      <ScrollView pagingEnabled showsHorizontalScrollIndicator ={false}horizontal contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" style={{marginTop:10}} size="large"/>
          </View>
        ) : (days.map(
          (day,index) => (
            <View style={styles.day}>
              <Text style={styles.description}>{Unix_timestamp(day.dt)}</Text>
              <Image style={styles.logo} source={{ uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`,}}/>
              <Text style={styles.temperature}>{parseFloat(day.temp.day).toFixed(1)}°C</Text>
              <Text style={styles.minmaxTemp}> {parseFloat(day.temp.min).toFixed(1)}°C ~ {parseFloat(day.temp.max).toFixed(1)}°C</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Image style={styles.logo_wear} source={{uri :`${findClothes(parseFloat(day.temp.day).toFixed(1))}`,}}/>

            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="light"></StatusBar>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#57A0D9',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#57A0D9',
  },
  cityname: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    color:'white'
  },
  weather: {
    backgroundColor: '#57A0D9',
  },
  day: {
    width:SCREEN_WIDTH,
    alignItems: 'center',
  },
  temperature: {
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white'
  },
  minmaxTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white'
  },
  description: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white'
  },
  logo: {
    width: 150,
    height: 150,
  },
  logo_wear:{
    width : 150,
    height : 150,
    color:"white",
  }
});
