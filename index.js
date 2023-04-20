import express from "express";
import * as line from "@line/bot-sdk";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { locationsList, stationList, airSituation } from "./outputTemplate.js";
import { locationsSort1 } from "./locationsData.js";
import { MongoClient } from "mongodb";

//----mongodb database----
const mongodbUrl = new MongoClient(process.env.url);

//----line----
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
};

//資料庫行為函式
const bdActions = {
  actions: ["取消追蹤", "說明"],
  insertData: async function (stationName, event) {
    try {
      await mongodbUrl.connect();
      const hasSavedlist = await mongodbUrl
        .db("test")
        .collection("people")
        .distinct("userId");
      const matchUser = hasSavedlist.find(
        (item) => item == event.source.userId
      );
      matchUser !== undefined
        ? await mongodbUrl
            .db("test")
            .collection("people")
            .updateOne(
              { userId: event.source.userId },
              { $set: { station: stationName.sitename } }
            )
        : await mongodbUrl.db("test").collection("people").insertOne({
            station: stationName.sitename,
            userId: event.source.userId,
          });
      //.insertOne({ station: stationName.sitename ,userID: lineUser});
    } catch (err) {
      console.log(err.stack);
    }
  },
  deleteData: async function (event) {
    //
  },
  sendNotification: async function (data) {
    try {
      await mongodbUrl.connect();
      const hasSavedlist = await mongodbUrl
        .db("test")
        .collection("people")
        .distinct("station");
      hasSavedlist.forEach((item) => {
        (async () => {
          const res = await mongodbUrl
            .db("test")
            .collection("people")
            .find({ station: item })
            .toArray();
            const userIds = res.map(item2 => item2.userId);
            const handleText = data.find(item2 => item2.sitename == item);
            //
            client.multicast( userIds, [{type:'text',text:`目前${handleText.sitename}的空氣品質為${handleText.status}，aqi為${handleText.aqi}`}]);
          //console.dir(res);
        })();

        //res.forEach(console.log);
      });
    } catch (err) {
      console.log(err);
    }
  },
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

setInterval(getAirdata, 3600000);
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
    const noname = data.find((item) => item.sitename == message.slice(2));
    noname !== undefined
      ? bdActions.insertData(noname, event)
      : bdActions.sendNotification(data); //console.log("no");
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
        const aqiColor = [
          { max: 50, color: "#83c276" },
          { max: 100, color: "#eddb7e" },
          { max: 150, color: "#edac7e" },
          { max: 200, color: "#ed7e7e" },
          { max: 300, color: "#9a76b3" },
          { max: 500, color: "#7d4755" },
        ].find((item) => item.max >= aqi).color;
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
