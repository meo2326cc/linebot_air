//const express = require('express');
import express from 'express';
import * as line from '@line/bot-sdk';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()
//import files
import {locationsList,stationList} from './outputTemplate.js';
import {locationsSort1} from './locationsData.js';

//使用者token
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};

//資料庫行為函式
const bdActions = {
  actions:['查詢上次結果','回報上次結果']
}

//----空氣資料初始化----
let data;
const catchData = axios.get('https://data.epa.gov.tw/api/v2/aqx_p_432?api_key=e8dd42e6-9b8b-43f8-991e-b3dee723a52d&limit=1000&sort=ImportDate%20desc&format=JSON');

catchData.then((res)=>{
	data = res.data.records
  }).catch((err) => console.log(err));
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
  //reply內容為使用者傳來的訊息
const message = event.message.text ;
  console.log(event);
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  
  
  else if( message == '測站清單' ){ return client.replyMessage(event.replyToken, locationsList) }
  
  else{

  let found = locationsSort1.find(item => item.listName == message)


  if (found !== undefined){

    for(let i=0;i<found.stations.length;i++){ 

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
return client.replyMessage(event.replyToken,stationList)
} else {
  
  found = data.find((item => item.sitename == message))
  if(found !== undefined ){
        const {sitename,aqi,status,pollutant,["pm2.5"]:pm25,pm10,co,no2,so2,o3,publishtime} = found
        const aqiColorpicker = [{max:50,color:'#83c276'},{max:100,color:'#eddb7e'},{max:150,color:'#edac7e'},{max:200,color:'#ed7e7e'},{max:300,color:'#9a76b3'},{max:500,color:'#7d4755'}].find(item=>item.max >= aqi)
        const aqiColor = aqiColorpicker.color;
        const template = 
{
  "type": "flex",
  "altText": "目前"+sitename+"的空氣品質"+status+"，AQI為"+aqi,
  "contents":
    {
      "type": "bubble",
      "size": "kilo",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": sitename,
            "weight": "bold",
            "size": "md"
          }
        ]
      },
      "hero": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "AQI",
                    "align": "center",
                    "size": "xl"
                  },
                  {
                    "type": "text",
                    "text": aqi,
                    "align": "center",
                    "size": "xxl"
                  }
                ]
              }
            ],
            "borderWidth": "16px",
            "borderColor": aqiColor,
            "width": "160px",
            "height": "160px",
            "cornerRadius": "90px",
            "justifyContent": "center",
            "alignItems": "center",
            "margin": "md"
          },
          {
            "type": "text",
            "text": status,
            "margin": "md",
            "size": "xl"
          }
        ],
        "justifyContent": "center",
        "alignItems": "center"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "separator"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "空氣污染指標物",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "start"
                  },
                  {
                    "type": "text",
                    "text": " " + pollutant,
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "pm2.5細懸浮微粒",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "start"
                  },
                  {
                    "type": "text",
                    "text": pm25 + "(μg/m3)",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "pm10懸浮微粒",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "start"
                  },
                  {
                    "type": "text",
                    "text": pm10 + "(μg/m3)",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "一氧化碳",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "start"
                  },
                  {
                    "type": "text",
                    "text":  co + "(ppm)",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "二氧化氮",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "start"
                  },
                  {
                    "type": "text",
                    "text": no2 +"(ppb)",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "二氧化硫",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "start"
                  },
                  {
                    "type": "text",
                    "text": so2 +"(ppb)",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "text",
                    "text": "臭氧",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "start"
                  },
                  {
                    "type": "text",
                    "text": o3 +"(ppb)",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "align": "end"
                  }
                ],
                "margin": "md"
              }
            ]
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "資料更新時間"+ publishtime,
            "size": "xxs",
            "color": "#8c8c8c",
            "align": "start",
            "margin": "none"
          }
        ]
      },
      "styles": {
        "hero": {
          "separator": false
        },
        "footer": {
          "separator": true
        }
      }
    }
}

  return client.replyMessage(event.replyToken,template)

}

//copy from postman

/*
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.openai.com/v1/chat/completions',
  headers: { 
    'Authorization': process.env.Authorization, 
    'OpenAI-Organization': 'org-rde6Ex1C30YcwbMtHYEii7M4', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  template.contents.contents[1].body.contents[1].text += response.data.choices[0]?.message.content;
  return client.replyMessage(event.replyToken,template)
})
.catch((error) => {
  console.log(error);
});
*/

else {
    return client.replyMessage(event.replyToken,{type: 'text',text: '查無該地區或站點，請重新輸入'})
        }
      }

  }
}

app.listen(3001);

