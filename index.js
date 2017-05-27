var express = require("express");
var app = express();
app.use(express.static('public'));
app.set("view engine","ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var mangTaiKhoan = ["trung","nam","tuyen","dat","tam","tuananh","dinh","dung","quy","ngoc","hong","thang","tuan","phuong","thuong","tuantrung","vantrung","duong","thuy","cuong","phituyen","tung"];
var tenTaiKhoan = ["Hồ Ngọc Trung","Nguyễn Đăng Nam","Phan Thị Tuyến","Nguyễn Văn Đạt","Trần Nhựt Tâm","Bùi Tuấn Anh","Bùi Xuân Đỉnh","Nguyễn Chí Dũng","Quý","Ngọc","Hồng","Nguyễn Văn Thắng","Nguyễn Anh Tuấn","Kiều Thị Phương","Phạm Cao Thượng","Nguyễn Tuấn Trung","Nguyễn Văn Trung","Dương","Thủy","Ngô Văn Cường","Phí Thị Tuyền","Tùng"];
var dangOnline = [];
var dangOnline_name = [];
var socket_dangOnline = [];


io.on("connection",function(socket){//khi có người kết nối:
    //đăng nhập:
    socket.on("client-login",function(name){
        var count = 0;
        mangTaiKhoan.forEach(function(tk){
            if(name == tk) count ++;
        });
            
        if(count==1)//đăng nhập thành công
        {  
            var count2 = 0;
            for(var i = 0; i<=dangOnline.length; i++)if(dangOnline[i]==name) count2 ++;
            if(count2==0) 
            {
                dangOnline.push(name);//danh sách đang online
            }
            //tham gia vào phòng chỉ riêng mình:
            socket.join(name);
            socket.phong = name;
            //tham gia vào phòng chỉ riêng mình.         
            var hoten = "";
            var vitriTen = mangTaiKhoan.indexOf(name);
            hoten = tenTaiKhoan[vitriTen];
            //lưu tên vào mảng tên đang online:
            if(dangOnline_name.indexOf(hoten)==-1)
                dangOnline_name.push(hoten);//danh sách đang online
            //gửi về người đang online:
            socket.emit("server-result-login",{"ketqua":true,"phong":socket.phong,"name":hoten,"users":dangOnline,"list_name":dangOnline_name});
            //gửi đến phòng:io.sockets.in().emit();
            
            //gửi ds đang online đến tất cả mọi người trừ socket đang đăng nhập:
            socket.broadcast.emit("server-send-ds-user",{"users":dangOnline,"list_name":dangOnline_name});

        }
        else
            socket.emit("server-result-login",{"ketqua":false});
        console.log(dangOnline);  

        //nhận tin nhắn:
        socket.on("client-send-mess",function(data){
            io.sockets.in(socket.phong).emit("server-send-mess-intme",data);//gửi đến chính mình (nhóm của chính mình)
            io.sockets.in(data.nguoinhan).emit("server-send-mess-notme",data);//gửi đến bạn (nhóm của bạn)            
            // io.sockets.in(!socket.phong).emit("server-send-mess",dt2);//gửi đến những người còn lại
            
        });
        //nhận tin nhắn.


        //đăng xuất:
            socket.on('client-logout', function(name) {
                var vitri = dangOnline.indexOf(socket.phong);
                dangOnline.splice(vitri, 1);//xóa khỏi list user đang online
                dangOnline_name.splice(vitri, 1);//xóa khỏi list user đang online
                socket.broadcast.emit('server-send-list-users', {"users":dangOnline,"list_name":dangOnline_name});//gửi ds đến những người còn lại
                console.log(dangOnline); 
            });
        //đăng xuất.
    });
    //đăng nhập.
});//khi có người kết nối.


app.get("/",function(req,res){
	res.render("login");
});
