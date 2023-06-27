const mysql=require('mysql');
const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'data',

});
con.connect((err)=>{
    if(err) throw err;
    else console.log('connected successfull!!');
});
module.exports=con;