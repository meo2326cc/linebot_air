export const locationsList = {
  type: "flex",
  altText: "請選擇地區",
  contents: {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "地區選擇",
          size: "md",
          weight: "bold",
        },
      ],
      margin: "lg",
      spacing: "lg",
    },
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "separator",
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              action: {
                type: "message",
                label: "基隆",
                text: "基隆站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "新北",
                text: "新北站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "台北",
                text: "台北站點清單",
              },
            },
          ],
          borderColor: "#000000",
          borderWidth: "none",
        },
        {
          type: "separator",
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              action: {
                type: "message",
                label: "桃園",
                text: "桃園站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "新竹",
                text: "新竹站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "苗栗",
                text: "苗栗站點清單",
              },
            },
          ],
          borderWidth: "none",
          borderColor: "#000000",
          cornerRadius: "none",
          justifyContent: "center",
        },
        {
          type: "separator",
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              action: {
                type: "message",
                label: "台中",
                text: "台中站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "彰化",
                text: "彰化站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "南投",
                text: "南投站點清單",
              },
            },
          ],
          borderWidth: "none",
          borderColor: "#000000",
          cornerRadius: "none",
          justifyContent: "center",
        },
        {
          type: "separator",
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              action: {
                type: "message",
                label: "雲林",
                text: "雲林站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "嘉義",
                text: "嘉義站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "台南",
                text: "台南站點清單",
              },
            },
          ],
          borderWidth: "none",
          borderColor: "#000000",
          cornerRadius: "none",
          justifyContent: "center",
        },
        {
          type: "separator",
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              action: {
                type: "message",
                label: "高雄",
                text: "高雄站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "屏東",
                text: "屏東站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "台東",
                text: "台東站點清單",
              },
            },
          ],
          borderWidth: "none",
          borderColor: "#000000",
          cornerRadius: "none",
          justifyContent: "center",
        },
        {
          type: "separator",
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              action: {
                type: "message",
                label: "花蓮",
                text: "花蓮站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "宜蘭",
                text: "宜蘭站點清單",
              },
            },
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "外島",
                text: "外島站點清單",
              },
            },
          ],
          borderWidth: "none",
          borderColor: "#000000",
          cornerRadius: "none",
          justifyContent: "center",
        },
      ],
    },
  },
};

export function stationList(stationArray,data) {
  const stationList = {
    type: "flex",
    altText: "請選擇測站",
    contents: {
      size: "micro",
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "站點選擇",
            size: "md",
            weight: "bold",
          },
        ],
        margin: "lg",
        spacing: "lg",
      },
      hero: {
        type: "box",
        layout: "vertical",
        contents: [],
      },
    },
  };

  for (let i = 0; i < stationArray.length; i++) {
    
    stationList.contents.hero.contents.push({ type: "separator" });
    stationList.contents.hero.contents.push({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "button",
          action: {
            type: "message",
            label: stationArray[i].name,
            text: stationArray[i].name,
          },
        },
        {
          type: "box",
          layout: "vertical",
          contents: [],
          width: "8px",
          backgroundColor: [
            { max: 50, color: "#83c276" },
            { max: 100, color: "#eddb7e" },
            { max: 150, color: "#edac7e" },
            { max: 200, color: "#ed7e7e" },
            { max: 300, color: "#9a76b3" },
            { max: 500, color: "#7d4755" },
          ].find((item) => {
            return item.max >= data[stationArray[i].index].aqi;
          }).color,
        },
      ],
    });
  }
  return stationList;
}

/*
{
                     "type":"button",
                     "action":{
                        "type":"message",
                        "label":stationArray[i].name,
                        "text":stationArray[i].name
                              }
                              }
*/

export function airSituation(
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
) {
  const template = {
    type: "flex",
    altText: "目前" + sitename + "的空氣品質" + status + "，AQI為" + aqi,
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: sitename,
            weight: "bold",
            size: "md",
          },
        ],
      },
      hero: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "AQI",
                    align: "center",
                    size: "xl",
                  },
                  {
                    type: "text",
                    text: aqi,
                    align: "center",
                    size: "xxl",
                  },
                ],
              },
            ],
            borderWidth: "16px",
            borderColor: aqiColor,
            width: "160px",
            height: "160px",
            cornerRadius: "90px",
            justifyContent: "center",
            alignItems: "center",
            margin: "md",
          },
          {
            type: "text",
            text: status,
            margin: "md",
            size: "xl",
          },
        ],
        justifyContent: "center",
        alignItems: "center",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "separator",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "空氣污染指標物",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "start",
                  },
                  {
                    type: "text",
                    text: " " + pollutant,
                    size: "xs",
                    color: "#8c8c8c",
                    align: "end",
                  },
                ],
                margin: "md",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "pm2.5細懸浮微粒",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "start",
                  },
                  {
                    type: "text",
                    text: pm25 + "(μg/m3)",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "end",
                  },
                ],
                margin: "md",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "pm10懸浮微粒",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "start",
                  },
                  {
                    type: "text",
                    text: pm10 + "(μg/m3)",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "end",
                  },
                ],
                margin: "md",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "一氧化碳",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "start",
                  },
                  {
                    type: "text",
                    text: co + "(ppm)",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "end",
                  },
                ],
                margin: "md",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "二氧化氮",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "start",
                  },
                  {
                    type: "text",
                    text: no2 + "(ppb)",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "end",
                  },
                ],
                margin: "md",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "二氧化硫",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "start",
                  },
                  {
                    type: "text",
                    text: so2 + "(ppb)",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "end",
                  },
                ],
                margin: "md",
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "臭氧",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "start",
                  },
                  {
                    type: "text",
                    text: o3 + "(ppb)",
                    size: "xs",
                    color: "#8c8c8c",
                    align: "end",
                  },
                ],
                margin: "md",
              },
            ],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "資料更新時間" + publishtime,
            size: "xxs",
            color: "#8c8c8c",
            align: "start",
            margin: "none",
          },
        ],
      },
      styles: {
        hero: {
          separator: false,
        },
        footer: {
          separator: true,
        },
      },
    },
  };
  return template;
}

//let [contents] = stationList.contents.hero.contents;
//console.log(contents);
