//資料庫行為函式
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

export default {
  actions: ["取消追蹤", "說明"],
  mongodbUrl : new MongoClient(process.env.url),
  insertData: async function (stationName, event) {
    try {
      await this.mongodbUrl.connect();
      const hasSavedlist = await this.mongodbUrl
        .db("test")
        .collection("people")
        .distinct("userId");
      const matchUser = hasSavedlist.find(
        (item) => item == event.source.userId
      );
      matchUser !== undefined
        ? await this.mongodbUrl
            .db("test")
            .collection("people")
            .updateOne(
              { userId: event.source.userId },
              { $set: { station: stationName.sitename } }
            )
        : await this.mongodbUrl.db("test").collection("people").insertOne({
            station: stationName.sitename,
            userId: event.source.userId,
          });

      client.replyMessage(event.replyToken, {
        type: "text",
        text: `已追蹤${stationName.sitename}站點空氣品質，若該地aqi值超過100時，我們將會通知您。`,
      });
      //.insertOne({ station: stationName.sitename ,userID: lineUser});
    } catch (err) {
      console.log(err.stack);
      client.replyMessage(event.replyToken, {
        type: "text",
        text: "目前系統連接資料庫發生問題，請稍後再試或聯繫工程師",
      });
    }
  },
  deleteData: async function (event) {
    //
  },
  sendNotification: async function (data) {
    try {
      await this.mongodbUrl.connect();
      const hasSavedlist = await this.mongodbUrl
        .db("test")
        .collection("people")
        .distinct("station");
      hasSavedlist.forEach((item) => {
        const handleText = data.find((item2) => item2.sitename == item);
        handleText.aqi >= 100
          ? (async () => {
              const res = await this.mongodbUrl
                .db("test")
                .collection("people")
                .find({ station: item })
                .toArray();
              const userIds = res.map((item2) => item2.userId);
              //
              client.multicast(userIds, [
                {
                  type: "text",
                  text: `⚠️${
                    aqiStatus.find((i) => i.max >= handleText.aqi).emoji
                  }目前【${handleText.sitename}】的空氣品質為${
                    handleText.status
                  }，AQI為${handleText.aqi}`,
                },
              ]);

              //console.dir(res);
            })()
          : null;

        //res.forEach(console.log);
      });
    } catch (err) {
      console.log(err);
    }
  },
};