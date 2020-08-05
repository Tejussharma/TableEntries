

const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/DataDB",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const entrySchema = {
    value: String,
    display:String,
    description:String
};
const entry = new mongoose.model("entry", entrySchema);
const item1 = new entry({
    value: "ABC",
    display: "Tense Biceps",
    description:
        "I feel strong!"
});
const item2 = new entry({
    value: "ABC",
    display: "Rolling On The Floor, Laughing",
    description:
        "This is funny! "
});
const item3 = new entry({
    value: "CDE",
    display: "Person With Folded Hands",
    description:
        "Two hands pressed together"
});
const itemArray = [item1, item2, item3];



app.get("/",function(req,res){
    entry.find(function(err,foundEntry){
        if(foundEntry.length===0){
            entry.insertMany(itemArray, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("success");
                }
            });
            res.redirect("/");

        }
       
       
        else{
            res.render("entry",{array:itemArray})
        }
    })
});
app.post("/",function(req,res){
  
const in1=req.body.inp1;
   const in2= req.body.inp2;

    entry.findOne({ $and: [{ value: in1 }, { $or: [{ display: in2 }, { description: in2 }] }]},function(err,find){
    if(!find){
       res.send("Entry not found!");
    }
    else { res.render("found", { thisOne: find });}
  
        
    })

});

app.listen(3000,function(req,res){
    console.log("okay");
})
// { $or: [{ value: in1 }, { description: in2 }] }






