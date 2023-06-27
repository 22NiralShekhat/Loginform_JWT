const express=require('express')
const router=express.Router();
const con=require('./db')
const routes=require('./Routes')
const app=express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}))
app.use('/',routes);

app.listen(8080,(err)=>{
    if(err) throw err;
    console.log("listening on port 8080")
})