//資料庫行為函式
import * as line from "@line/bot-sdk";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
};
const client = new line.Client(config);
import { aqiStatus, warningTemplate } from "./outputTemplate.js";

export default {
  aqiReport : process.env.aqiReport ,
  actions: ["取消追蹤", "說明"],
  mongodbConnect : new MongoClient(process.env.url).db("test").collection("people"),
  insertData: async function (stationName, event) {
    try {
      const hasSavedlist = await this.mongodbConnect
        .distinct("userId");
      const matchUser = hasSavedlist.find(
        (item) => item == event.source.userId
      );
      matchUser !== undefined
        ? await this.mongodbConnect
            .updateOne(
              { userId: event.source.userId },
              { $set: { station: stationName.sitename } }
            )
        : await this.mongodbConnect.insertOne({
            station: stationName.sitename,
            userId: event.source.userId,
          });

      client.replyMessage(event.replyToken, {
        type: "text",
        text: `已追蹤${stationName.sitename}站點空氣品質，若該地aqi值超過${this.aqiReport}時，我們將會通知您。`,
      });
      //.insertOne({ station: stationName.sitename ,userID: lineUser});
    } catch (err) {
      console.log(err.stack);
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "連接資料庫發生問題，請稍後再試或聯繫工程師",
      });
    }
  },
  deleteData: async function (event) {
      try{
        await this.mongodbConnect
        .deleteOne({userId:event.source.userId});
        client.replyMessage(event.replyToken, {
        type: "text",
        text: "已移除追蹤的地點",
      });
      }catch(err){
      console.log(err.stack);
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "連接資料庫發生問題，請稍後再試或聯繫工程師",
      });
      }
  },
  sendNotification: async function (data) {
    try {
      const hasSavedlist = await this.mongodbConnect
        .distinct("station");
      hasSavedlist.forEach((item) => {
        const handleText = data.find((item2) => item2.sitename == item);
        handleText.aqi >= this.aqiReport
          ? (async () => {
              const res = await this.mongodbConnect
                .find({ station: item })
                .toArray();
              const userIds = res.filter((item2) => {
              return item2.disableTime < Date.now() || item2.disableTime === undefined
            }).map(item2 => item2.userId );
              //
              client.multicast(userIds, [
                warningTemplate(aqiStatus,handleText),
              ]);
            })()
          : null;
      });
    } catch (err) {
      console.log('發送通知遇到錯誤！'+err);
    }
  },
  disableNotification: async function(event){
        const time = Date.now() + 10800000 ;
    try{
      await this.mongodbConnect.updateOne({ userId: event.source.userId },{$set:{disableTime:time}})
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "從現在開始算起3小時內，您將不會收到通知",
      });
    }catch(err){
      console.log(err.stack);
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "連接資料庫發生問題，無法完成目前操作，請稍後再試或聯繫工程師",
      });
    }
  }
};
