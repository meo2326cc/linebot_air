//const express = require('express');
import express from 'express';
import * as line from '@line/bot-sdk';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config()

//使用者token
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};

//空氣資料初始化
let data;
let arrayLocation;
const catchData = axios.get('https://data.epa.gov.tw/api/v2/aqx_p_432?api_key=e8dd42e6-9b8b-43f8-991e-b3dee723a52d&limit=1000&sort=ImportDate%20desc&format=JSON');

//空氣資料初始化結束
catchData.then((res)=>{
	data = res.data.records
  return data
  })
  
  .then(res=>{
    arrayLocation = data.map(item=>{return item.sitename});
    
  });

  




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
  

//自行新增變數
let reply = event.message.text ;
let found; 

if( reply == '測站清單' ){
  
    return client.replyMessage(event.replyToken, {
    type: 'text',
    text: arrayLocation.toString()
    //event.message.text
  });
  
}
else{

arrayLocation.forEach((item ,index)=> {
  
  if (arrayLocation[index] == reply){
    //found = index;
    found = `${event.message.text}目前空氣品質${data[index].status}，pm2.5為：${data[index]["pm2.5"]}(μg/m3)`
  }
  
});
 

if (found == undefined){
  found = '你輸入錯誤的監測站名稱，請重新輸入，若要檢視有哪些監測站，可以輸入「測站清單」';
}
//console.log("這是陣列第"+found+"個");

//

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: found
    //event.message.text
  });}
}

app.listen(3000);

