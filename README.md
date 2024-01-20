# line 空氣品質監測bot

使用express js 串接line message api 與環境部空氣品質資料的聊天機器人，
並使用mongoDB 記錄使用者資訊

## 所需環境變數

```javascript

//line
channelAccessToken
channelSecret

//zeabur
PORT

//mongodb
url

//aqiReport
aqiReport

//updateInterval
milliseconds

//disableNotificationTime
hr
```

## 檔案說明

index.js：伺服器啟動&判斷訊息傳入所要執行的行為&請求資料
dbActions.js：mongodb資料庫比對相關
locationsData.js：全台縣市清單，用於呈現各地站點
outputTemplate.js：發送line flex message 版型
