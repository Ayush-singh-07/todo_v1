const express = require("express");
const bodyParser = require("body-parser");
const Date = require(__dirname+'/Date.js');
const mongoose = require('mongoose');
const _ = require("lodash")

const app= express();
app.use(bodyParser.urlencoded({extended: true}))

//ejs best docs
// https://github.com/mde/ejs/wiki/Using-ejs-with-Express
app.set('view engine', 'ejs');
app.use(express.static('public'))

  
//Db connection
// mongoose.connect('mongodb://localhost:27017/todoListDB');


// momgoDB on ATLAS
mongoose.connect(""+proceess.env.DB_URL);


//listSchema 
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
})

//model or (collection)
const Item = new mongoose.model('Item', itemSchema);


//default added items are here
const item1 = new Item({
    name: "Create multiple list by adding '/yourlistname' to the url  ",
})

const item2 = new Item({
    name: "Press (+) to add an item  ",
})

const item3 = new Item({
    name: "<= hit to delete an item ",
})

const defaultItems = [item1, item2, item3];


app.get('/' , (req, res) =>{
    const date = Date.getdate();  //getting date 
    Item.find({})
    .then((founditems) => {
        if(founditems.length === 0){
            Item.insertMany(defaultItems)
            .then( () => { res.redirect('/')})
            .catch(err => console.log("error Occured in inserting default item"+ err))
        }
        else{
            homelist ="True";
            res.render('list', {list_title: date, items: founditems, homelist:homelist})
        }
    })
    .catch(err =>console.log(err))
})


app.post('/', (req, res)=>{
 const item  = req.body.user_item;
 const customListName  = req.body.list;
 const homelist  = req.body.homelist;

 const newItem = new Item({
    name: item,
})

 if(item != "" && homelist === "False"){
    List.findOne({name: customListName})
    .then((founditem)=>{
        founditem.items.push(newItem)
        founditem.save().then(()=> res.redirect("/"+customListName))
    })
    .catch(() => {console.log("List Not Found ")}
    )}
 else if(item != "" && homelist === "True"){
    newItem.save().then(
        ()=>{
            res.redirect('/');
        }
    )}
})


app.post("/delete", (req, res)=>{
    // console.log(req.body);
    const _id = req.body.checkbox;
    const homelist  = req.body.homelist;

    if(homelist === "False"){
        const customListName  = req.body.Deletelist;
        // The { new: true } option is used to return the updated document after the update operation completes.
        List.findOneAndUpdate(
            { name: customListName },
            { $pull: { items: { _id: _id } } },  //pull from array
            { new: true },
          ).then(() => {
            res.redirect('/'+customListName) 
        })
          .catch(() => {console.log("Error Occured")})
    }
    else{  //mainlist  = homeList :True
        Item.findByIdAndRemove(_id)
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
        
    }

})


// custom list schema
const listSchema = new mongoose.Schema({
    name: String,
    items :  [itemSchema],   //accepts an array of itemSchema docs
 })

const List = new mongoose.model('List',listSchema)

app.get("/:customList" , (req, res)=>{
    const customList = _.capitalize(req.params.customList);

    List.findOne({name: customList})
    .then((data) =>{
        if(data === null){
            //create custom list
            const initialItems = new List({
                name: customList,
                items : defaultItems,
            })
            initialItems.save().then(
                ()=>{
                    res.redirect("/"+customList);
                }
            )
        }
        else{
            //show the custom list
            homelist="False";
            res.render('list', {list_title: data.name, items: data.items, homelist: homelist})
        }
    })
    .catch((err) => console.log(err))   

})


app.listen(3000, ()=>{
    console.log("server is running on port 3000 ");
})
