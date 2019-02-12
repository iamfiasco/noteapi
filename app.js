var express = require('express')
var fs = require("fs")
var app = express()
var path = require("path")
var ws = require("ws").Server
globalstate = ""
app.set("view engine","pug")
app.set("views", path.join(__dirname, "templates"))
if(app.get('env')==="production"){
    app.locals.pretty = true
}
app.use("/static",express.static("static"))
function gethistory(){
    history = fs.readFileSync("history.json","utf-8")
    return JSON.parse(history)
}
app.get("/",function(req,res){
    res.render("hello")
})
app.post("/",function(req,res){
    name = req.body.filename
    history = gethistory()
    for(i=0;i<history.length;i++){
        if(name == history[i]["filename"]){
            res.render("edit",{'name': getfile(history[i])})
        }
    }
})
filename = ""
//wss = new ws({server: "ws://0.0.0.0", port: 1397})
wss = new ws({port: 1397})
wss.on('connection',function(w,r){
    console.log("connected IP", r.connection.remoteAddress)
    w.on('message',function(data){
        console.log(data)
        globalstate = data
    })

    w.on('close',function(){
        console.log("Django unchained")
        fs.writeFile(filename, globalstate,function(err){
            if(err){
                console.log(filename)
                console.error(err)
                console.log("error saving file")
                }
            else{
                console.log("looks like we did it !!")
                }
            })
        filename=""
        })
    })
wss2 = new ws({port: 1398})
wss2.on("connection", function(w){
    w.on("message", function(data){
        console.log("received filename ", data)
        filename = data
    })
})

app.listen(3000, "0.0.0.0")
