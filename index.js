//const express = require('express');
import express from 'express';
import * as line from '@line/bot-sdk';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()
//import files
import {locationsList,stationList} from './locationsList.js';
import {locationsSort1} from './locationsData.js';

//使用者token
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};

//----空氣資料初始化----
let data;
//資料中地區出現的順序
let arrayLocation;
//
const catchData = axios.get('https://data.epa.gov.tw/api/v2/aqx_p_432?api_key=e8dd42e6-9b8b-43f8-991e-b3dee723a52d&limit=1000&sort=ImportDate%20desc&format=JSON');

catchData.then((res)=>{
	data = res.data.records
  return data
  }).then(res=>{
    arrayLocation = data.map(item=>{return item.sitename});
  });
//----空氣資料初始化結束----

//----lineSDK----
const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => { 
      res.json(result);
    });
});


const client = new line.Client(config);
function handleEvent(event) {
  console.log(event);
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  
//reply內容為使用者傳來的訊息
let message = event.message.text ;
//回傳訊息
//改為比對資料結果
//let found; 

if( message == '測站清單' ){ return client.replyMessage(event.replyToken, locationsList) }

else{

  let found = locationsSort1.find(item => item.listName == message)


  if (found !== undefined){
//處理第二層清單


//訊息json內部第一層
    //for(i=0;i<=found.stations.length/3;i++){}
    for(let i=0;i<found.stations.length;i++){ 
      //let pushText = found.stations[i].name;
      stationList.contents.hero.contents.push({"type":"separator"});
      stationList.contents.hero.contents.push({
                     "type":"button",
                     "action":{
                        "type":"message",
                        "label":found.stations[i].name,
                        "text":found.stations[i].name
                     }
                  });
      }
      //console.log(stationList.contents.hero.contents)
        return client.replyMessage(event.replyToken,stationList)



/*
  found.stations.forEach((item,index)=>{
    stationList.contents.hero.contents.push({"type":"separator"})
    
  })
  //stationList.contents.hero.contents.push()*/
  
}
//console.log("這是陣列第"+found+"個");

//

  //return client.replyMessage(event.replyToken, )
  //this template JSON is from FLEX MESSAGE SIMULATOR 

}
}

app.listen(3001);

