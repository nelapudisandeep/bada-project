const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const pexels = require('pexels');
const Datastore = require('nedb');

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
  'PHP 4:7',
  '2COR 5:7',
  `PSA 23:5-6`,
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
const db_todos = new Datastore({
  filename:"./todos.db"
});

const progress_todos = new Datastore({
  filename:"./progress.db"
})

const app = express();
app.listen(port,()=>{
    console.log('listening on port : ',port);
});

app.use(cors());
app.use(express.json());
app.use(express.static("../client"));

app.get("/",(req,res)=>{
  // console.log("this is the home route!");
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

// posting routes!
app.post('/addNewTodo',(req,res)=>{
  db_todos.loadDatabase((err)=>{
    if(err){
      res.end();
      res.status(404).end();
      return;
    }else{
      // console.log(req.body);
      db_todos.insert(req.body,(err,newDoc)=>{
        if(err){
          res.end();
          res.status(500).end();
        }else{
          res.json(newDoc);
        }
      });
    }
  });
});


// send all todos to the client!
app.get("/getAllTodos",(req,res)=>{
  db_todos.loadDatabase((err)=>{
    if(err){
      res.end();
      res.status(404).end();
      return;
    }else{
      db_todos.find({},(err,docs)=>{
          if(err){
            res.end();
            res.status(500).end();
            return;
          }else{
            res.json(docs);
          }
      });
    }
  });
});


// updating the todoItem!
app.post("/updateTodoItem",(req,res)=>{
    // console.log(req.body);
    db_todos.loadDatabase((err)=>{
      if(err){
        res.end();
        res.status(500).end();
        return;
      }else{
        // finding the state of the given todo!
        db_todos.findOne({ _id: req.body.id }, function (err, doc) {
          if(err){
            res.end();
            res.status(500).end();
            return;
          }else{
            let state = doc.state;
            if(state === "undone"){
              state = "done";
            }else if(state === "done"){
              state = "undone";
            }else{
              state = "undone";
            }
            db_todos.update({_id: req.body.id},{ $set: { state: state}},{multi:false},(err,numReplaced)=>{
                if(err){
                  res.end();
                  res.status(500).end();
                  return;
                }else{
                  db_todos.findOne({_id:req.body.id},(err,doc_changes)=>{
                    // console.log(doc_changes.state,doc.state);
                      if(doc_changes.state !== doc.state){
                        res.json({
                          "state":doc_changes.state
                        });
                      }else{
                        res.json({
                          "state":doc_changes.state
                        });
                      }
                  });
                }
            });
          }
        });
      }
    });
});


// deleting a todo Item!
app.post('/deleteTodoItem',(req,res)=>{
  db_todos.loadDatabase((err)=>{
    if(err){
      res.end();
      res.status(404).end();
      return;
    }else{
      db_todos.remove({_id:req.body.id},{},(err,numRemoved)=>{
        if(err){
          res.end();
          res.status(500).end();
          return;
        }else{
          res.json({
            'message':'deleted!'
          });
        }
      });
    }
  });
});
