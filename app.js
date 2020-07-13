const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const pexels = require('pexels');
require('dotenv').config();
const VERSES = [
  `JER 29:11`,
  `PSA 23:1`,
  `PHP 4:13`,
  `JHN 3:16`,
  `ROM 8:28`,
  `ISA 41:10`,
  `PSA 46:1`,
  `GAL 5:22-23`,
  `HEB 11:1`,
  `2TI 1:7`,
  `1COR 10:13`,
  `PRO 22:6`,
  `ISA 40:31`,
  `JOS 1:9`,
  `HEB 12:2`,
  `MAT 11:28`,
  `ROM 10:9-10`,
  `PHP 2:3-4`,
  `MAT 5:43-44`,
];

const topics = [
  'Bible Study',
  'Church',
  'Cross',
  'Worship',
  'Sunrise',
  'Christmas',
  'Landscape',
  'Flowers',
  'Christianity',
  'Faith',
  'Music',
  'Bible',
  'Jesus',
  'Christian',
  'Nature',
  'mountains'
];

const port = process.env.PORT||3000;

const app = express();
app.listen(port,()=>{
    console.log('listening on port : ',port);
});

app.use(cors());
app.use(express.json());
app.use(express.static("../client"));

app.get("/",(req,res)=>{
  console.log("this is the home route!");
  res.send("this is the home route!");
});


app.get("/getBibleVerse",(req,res)=>{
  const verseIndex = Math.floor(Math.random() * VERSES.length);
  let url = `https://bible-api.com/${VERSES[verseIndex]}`;
  fetch(url)
    .then(response=>response.json())
    .then(data=>{
      let bibleVerse = data.text || data.verses[0].text;
      let reference = data.reference;

      res.json({bibleVerse,reference});
    });
});

const API_KEY = process.env.API_KEY;
app.get("/getPhotos",(req,res)=>{
  const client = pexels.createClient(API_KEY);
  const query = topics[Math.floor(Math.random()*topics.length)];
  client.photos.search({ query, per_page: 15}).then(photos =>{
    let urls = [];
    photos.photos.forEach((item, i) => {
      urls.push(item.src.original);
    });
    res.json({urls});
  });
});
