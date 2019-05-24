var express = require('express');
var app = express();
var server = app.listen(8000, function(){
    console.log('Connected to port 8000')
})
var io = require('socket.io')(server)
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

io.on('connection', function(socket) {
    socket.on('message', function(data){
        console.log(data)
        io.sockets.emit('broadcast', data)
    })
    // socket.on('blue-click', function(){
    //     localStorage.setItem('count', parseInt(localStorage.getItem('count'))+1);
    //     io.sockets.emit('broadcast', {count:parseInt(localStorage.getItem('count'))});
    // })
    // socket.on('red-click', function(){
    //     localStorage.setItem('count', 0);
    //     io.sockets.emit('broadcast', {count:parseInt(localStorage.getItem('count'))});
    // })
})

app.get('/', function(req,res){
    res.render('index');
})

