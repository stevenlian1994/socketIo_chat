var express = require('express')
var app = express()
var mongoose = require('mongoose')
var server = app.listen(8000, function(){
    console.log("listening on port 8000")
})
var io = require('socket.io')(server);

mongoose.connect('mongodb://localhost/hello_express')

var ContainerSchema = new mongoose.Schema({
    container : [],
})
mongoose.model('Container', ContainerSchema)
var Container = mongoose.model('Container')

app.use(express.static(__dirname + "/static"));
app.set("views", __dirname + '/views');
app.set("view engine", "ejs");

io.on('connection', function(socket) {
    socket.on('pairUp',function(second_user){
        Container.findOne({}, function(err,data){
            if(err){
                console.log(err)
            } else if(data == null) {
                var new_cont = new Container()
                new_cont.container = [[Math.ceil(Math.random()*10000)]]
                new_cont.save(function(err){
                    if(err){
                        console.log(err)
                    }
                })
            }
            else if(data.container[data.container.length-1].length>1) {
                //if room in index .length is filled, create a new room
                var ranNum = Math.ceil(Math.random()*10000);
                data.container.push([ranNum])
                Container.update({}, data, function(err){
                    if(err){
                        console.log(err)
                    }
                })
                socket.join(ranNum);
                io.in(ranNum).emit('room-number', {'room-number':ranNum, 'waiting': 'Pairing with a partner..'})
                console.log('someone joined', ranNum)
            } else {
                //if room in index .length is not filled, socket joins room
                var thisRoom = data.container[data.container.length-1]
                console.log('this is the room index', thisRoom)
                socket.join(thisRoom[0])
                io.in(thisRoom[0]).emit('room-number', {'room-number':thisRoom[0]})
                console.log('someone joined', data.container[data.container.length-1][0])
                // io.sockets.in(thisRoom[0]).emit('broadcast', data)
                io.in(thisRoom[0]).emit('broadcast', {'second-user': `${second_user} has joined the room`})
                data.container[data.container.length-1][1] = 1
                // console.log(data)
                Container.update({}, data, function(err){
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })
    socket.on('room',function(data){
        var new_room = data.room_name
        socket.join(data.room_name);
        console.log('someone joined', data.room_name)
    })
    socket.on('disc',function(data){
        console.log('trying to disconnect from:', data.room);
        socket.leave(data.room, function(){
        console.log('leaving room', data.room)
        })
    })
    socket.on('message', function(data){
        console.log('this is data.room', data.room)
        io.sockets.in(data.room).emit('broadcast', data)
    })
})


app.get('/', function(request, response){
    response.render('index')
})
