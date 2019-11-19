var express = require('express');
var app = express();
var sunucu = app.listen('8080');
var io = require('socket.io').listen(sunucu);
var yol = require('path');
var mysql = require('mysql');
var baglanti = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});

baglanti.connect();
io.sockets.on('connection', function (socket) {
    socket.on("gonder", function (veri) {

        console.log(veri+"Sisteme Giriş Yaptı");
        io.sockets.emit("al",veri);
    })

    socket.on("mesaj", function (veri) {
        
        console.log(veri);
        var mesaj = {mesaj:veri.mesaj,kullanici:veri.kullanici};
        var query = baglanti.query('insert into nodejs set ?',mesaj,function(hata,cevap){
            console.log(query.sql);
        });
        io.sockets.emit("mesajAl",veri);
    })
}
);
app.get("/index.html", function (talep, cevap) {
    cevap.sendFile(yol.join(__dirname + "/index.html"));
})
console.log('suncu aktif');
