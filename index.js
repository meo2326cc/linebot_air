import express from "express";
import * as line from "@line/bot-sdk";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import {
  aqiStatus,
  locationsList,
  stationList,
  airSituation,
} from "./outputTemplate.js";
import { locationsSort1 } from "./locationsData.js";
import dbActions from "./dbActions.js";



//----line----
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
};

const client = new line.Client(config);


//----空氣資料初始化----
let data;

const getAirdata = async() => {
try{
   const catchData = await axios.get(
    "https://data.epa.gov.tw/api/v2/aqx_p_432?api_key=e8dd42e6-9b8b-43f8-991e-b3dee723a52d&limit=1000&sort=ImportDate%20desc&format=JSON"
  );
  data = catchData.data.records
}catch(err){
  console.log('取得遠端空氣資料發生錯誤'+err)
}}
getAirdata();


async function updateData(){
await new Promise(res => res(getAirdata()))
dbActions.sendNotification(data);
}

setInterval(updateData, process.env.updateInterval);
//3600000
//----空氣資料初始化結束----

function trackingStation (data , event ,message){
  const filterStation = data.find(
    item => item.sitename == message.slice(2)
  );
  filterStation !== undefined
    ? dbActions.insertData(filterStation, event)
    : client.replyMessage(event.replyToken, {
        type: "text",
        text: "查無該測站，無法追蹤",
      });
}

//----lineSDK----
const app = express();
app.post("/", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) => {
    res.json(result);
  });
});


function handleEvent(event) {
  //reply內容為使用者傳來的訊息
  const message = event.message.text;
  //console.log(event);
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  } else if (message === "測站清單") {
    return client.replyMessage(event.replyToken, locationsList);
  } else if (message === "取消追蹤"){
    dbActions.deleteData(event)
  } else if (message === "暫停通知"){
    dbActions.disableNotification(event)
  } else if (message.indexOf("追蹤") === 0) {
    trackingStation(data , event , message)
  } else { //xx站點清單
    let found = locationsSort1.find((item) => item.listName === message);

    if (found !== undefined) {
      return client.replyMessage(
        event.replyToken,
        stationList(found.stations, data)
      );
    } else {
      found = data.find((item) => item.sitename === message);
      if (found !== undefined) {

        //防止沒資料出錯暫時解法

        // if(Object.keys(found).length === 0){
        //     return( client.replyMessage(event.replyToken, airSituation()) ) 
        // }else{

        //防止沒資料出錯暫時解法2

        const filterData =  Object.keys(found)
        filterData.forEach( item => {
          
          if( found.item === "" ){
            delete found.item
          }
        })


        const aqiColor = aqiStatus.find((item) => item.max >= found?.aqi).color;
        return client.replyMessage(
          event.replyToken,
          airSituation( {...found , aqiColor:aqiColor } )
        );

        //}

      } else {
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: "查無該地區或站點，請重新輸入",
        });
      }
    }
  }
}

app.listen(process.env.PORT);