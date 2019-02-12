var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
//var WebSocket = require('ws');
var saveData = (function (){
    a = document.createElement("a")
    document.body.appendChild(a)
    a.style = "display: none"
    return function(data, filename){
        var json = JSON.stringify(data)
        var blob = new Blob([json], {"type": "octet/stream"})
        var url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)
    }
})()
function toggleauto(value){
    console.log("toggle value set to: ",value)
    editor.setOptions({
        enableBasicAutocompletion: value
    });
}




var ws = new WebSocket('ws://'+ window.location.hostname + ':1397');
var ws2 = new WebSocket('ws://'+window.location.hostname + ':1398')
function disableMargin(){
    editor.setOption("showPrintMargin",false)
}
editor.getSession().setMode("ace/mode/javascript");
editor.setShowFoldWidgets(false);
font="tahoma"
size="10pt"
savetoself = false
function changemode(mode){
    editor.getSession().setMode("ace/mode/"+mode)
}
function increasefont(){
    s=editor.getFontSize()
    editor.setOptions({
        fontSize: ++s
    });
}
function decreasefont(){
    s = editor.getFontSize()
    editor.setOptions({
        fontSize: --s
    });
}
function getfontsize(){
    return editor.getFontSize()
}

editor.getSession().on('change',function(){
  console.log("received changes")
  ws.send(editor.getSession().getValue())
})

disableMargin()

function getclass(query){
    return document.getElementsByClassName(query)[0]
}
function changesavemode(value){
    if(value=="Server"){
        console.log("Server mode initated")
        savetoself = false
    }
    else{
        console.log("Client mode initiated")
        savetoself = true
    }
}
function sendname(){
        if(!savetoself){
            console.log("trying to save in server mode")
            name = document.querySelectorAll(".saveto")[0].value
            data = editor.getSession().getValue()
            console.log(name)
            ws2.send({"name": name,"data":data})
        }
        else{
            console.log("trying to save in client mode")
            name = document.querySelectorAll(".saveto")[0].value
            data = editor.getSession().getValue()
            saveData(data,name)
        }
}


