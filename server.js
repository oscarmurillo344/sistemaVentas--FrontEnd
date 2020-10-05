const express =  require('express');
const path = require('path');

const app=express();

app.use(express.static(__dirname+'dist/sistemaventasapp'));
app.get('/*',function (req,res) {
    res.sendFile(__dirname+'/../../dist/sistemaventasapp/index.html');
})
app.listen(process.env.PORT || 8080);