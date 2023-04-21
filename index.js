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
import bdActions from "./bdActions.js";


//----mongodb database----

//----line----
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
};


//----空氣資料初始化----
let data;

function getAirdata() {
  const catchData = axios.get(
    "https://data.epa.gov.tw/api/v2/aqx_p_432?api_key=e8dd42e6-9b8b-43f8-991e-b3dee723a52d&limit=1000&sort=ImportDate%20desc&format=JSON"
  );
  catchData
    .then((res) => {
      data = res.data.records;
    })
    .catch((err) => console.log(err));
}
getAirdata();

setInterval(() => {
  getAirdata();
  bdActions.sendNotification(data);
}, 3600000);
//----空氣資料初始化結束----

//----lineSDK----
const app = express();
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) => {
    res.json(result);
  });
});

const client = new line.Client(config);

function handleEvent(event) {
  //reply內容為使用者傳來的訊息
  const message = event.message.text;
  //console.log(event);
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  } else if (message == "測站清單") {
    return client.replyMessage(event.replyToken, locationsList);
  } else if (message.indexOf("追蹤") == 0) {
    const filterStation = data.find(
      (item) => item.sitename == message.slice(2)
    );
    filterStation !== undefined
      ? bdActions.insertData(filterStation, event)
      : client.replyMessage(event.replyToken, {
          type: "text",
          text: "查無該測站，無法追蹤",
        }); // bdActions.sendNotification(data);
  } else {
    let found = locationsSort1.find((item) => item.listName == message);

    if (found !== undefined) {
      return client.replyMessage(
        event.replyToken,
        stationList(found.stations, data)
      );
    } else {
      found = data.find((item) => item.sitename == message);

      if (found !== undefined) {
        const {
          sitename,
          aqi,
          status,
          pollutant,
          "pm2.5": pm25,
          pm10,
          co,
          no2,
          so2,
          o3,
          publishtime,
        } = found;
        const aqiColor = aqiStatus.find((item) => item.max >= aqi).color;
        return client.replyMessage(
          event.replyToken,
          airSituation(
            sitename,
            aqi,
            aqiColor,
            status,
            pollutant,
            pm25,
            pm10,
            co,
            no2,
            so2,
            o3,
            publishtime
          )
        );
      } else {
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: "查無該地區或站點，請重新輸入",
        });
      }
    }
  }
}

app.listen(3001);
