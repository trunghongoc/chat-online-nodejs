var mangTaiKhoan = ["trung","nam","tuyen","dat","tam","tuananh","dinh","dung","quy","ngoc","hong","thang","tuan","phuong","thuong","tuantrung","vantrung","duong","thuy","cuong","phituyen","tung"];
var tenTaiKhoan = ["Hồ Ngọc Trung","Nguyễn Đăng Nam","Phan Thị Tuyến","Nguyễn Văn Đạt","Trần Nhựt Tâm","Bùi Tuấn Anh","Bùi Xuân Đỉnh","Nguyễn Chí Dũng","Quý","Ngọc","Hồng","Nguyễn Văn Thắng","Nguyễn Anh Tuấn","Kiều Thị Phương","Phạm Cao Thượng","Nguyễn Tuấn Trung","Nguyễn Văn Trung","Dương","Thủy","Ngô Văn Cường","Phí Thị Tuyền","Tùng"];
var nguoidangdangnhap = "";
var guiden = "";
//kết nối đến server:
var socket = io("https://chat-ahi.herokuapp.com");
//result login:
socket.on("server-result-login",function(data){
    if(data.ketqua==false)
    {
        $(".modal-body").html("<h4 class='text-center'>Đăng nhập thất bại</h4><p>Các tài khoản hợp lệ là: trung, nam, tuyen, dat, tam, tuananh, dinh, dung, quy, ngoc, hong,thang, tuan, phuong, thuong, tuantrung, vantrung, duong, thuy, cuong, phituyen , tung</p>");
        $('#myModal').modal({show: 'true'}); 
    }
    else//đăng nhập thành công
    {
        //hiển thị tên người gửi mặc định là gửi cho mình:
        $(".chatvoi").text(data.name);
        guiden = data.phong;
        //
        nguoidangdangnhap = data.phong;
        $(".modal-body").html("<h4>Welcome "+ data.name +"</h4>");
        $('#myModal').modal({show: 'true'}); 
        $(".login-card").hide();
        $(".trangchu").show();
        $(".username").html("<span style='color:#3498db;'>"+data.name+"</span>");
        $("ul.list-group").html('<li class="list-group-item list-group-item-success" style="background: #bdc3c7;"><h4 style="color:#000;;"><span class="fa fa-users"></span> &nbsp; Danh sách online</h4></li>');
        for(var i = data.users.length-1; i>=0 ;i--)
            $("ul.list-group").append('<li class="list-group-item" onclick="chonban('+"'"+data.users[i]+"'"+')" ><i class="fa fa-circle" aria-hidden="true"></i>&nbsp;'+data.list_name[i]+'</li>');
    }     
});
//result login:.
//nhận danh sách users đang online:
socket.on("server-send-ds-user",function(data){
    $("ul.list-group").html('<li class="list-group-item list-group-item-success" style="background: #bdc3c7;"><h4 style="color:#000;;"><span class="fa fa-users"></span> &nbsp; Danh sách online</h4></li>');
        for(var i = data.users.length-1; i>=0 ;i--)
            $("ul.list-group").append('<li class="list-group-item" onclick="chonban('+"'"+data.users[i]+"'"+')" ><i class="fa fa-circle" aria-hidden="true"></i>&nbsp;'+data.list_name[i]+'</li>');
});
//nhận danh sách users đang online.

//nhận tin nhắn:
    socket.on("server-send-mess-intme",function(data){//nhận của chính mình
         //tên người nhận:
        var vitriTen = mangTaiKhoan.indexOf(data.nguoinhan);
        tennguoinhan = tenTaiKhoan[vitriTen];
        //tên người nhận.
        $(".panel-body").append('<small class="right">'+tennguoinhan+' <i class="fa fa-reply" aria-hidden="true"></i></small><div class="clearfix"></div><p class="tinnhan itme">'+data.mess+'<p><div class="clearfix"></div>');
        $('#list_tinnhan').scrollTop($('#list_tinnhan').prop('scrollHeight'));
    });
    socket.on("server-send-mess-notme",function(data){//nhận của người khác
        //hiển thị tên người gửi:
        var hoten = "";
        var vitriTen = mangTaiKhoan.indexOf(data.nguoigui);
        hoten = tenTaiKhoan[vitriTen];
        $(".chatvoi").text(hoten);
        guiden = data.nguoigui;
        //tên người nhận:
        var vitriTen = mangTaiKhoan.indexOf(data.nguoinhan);
        tennguoinhan = tenTaiKhoan[vitriTen];
        //tên người nhận.
        $(".panel-body").append('<small class="left">'+hoten+' <i class="fa fa-share" aria-hidden="true"></i> '+tennguoinhan+'</small><div class="clearfix"></div><p class="tinnhan notme">'+data.mess+'<p><div class="clearfix"></div>');
        $('#list_tinnhan').scrollTop($('#list_tinnhan').prop('scrollHeight'));
    });
//nhận tin nhắn.


$(document).ready(function(){
    $(".login").click(function(){
        var name = $("#user").val();
        if(name.length < 1) alert("Không được để trống tài khoản!");
        else
        {
            socket.emit("client-login",name);
        }
    });
    
    //gửi tin nhắn:
    $(".panel-footer").keyup(function(e) {
        if (e.which == 13) {
            var mess = $(".emojionearea-editor").html();
            // $(".panel-body").append("<p>"+mess+"</p>");
            $("#mess").val("");
			$(".emojionearea-editor").html("");
            var data = {
                nguoigui : nguoidangdangnhap,
                nguoinhan: guiden,
                mess     : mess
            };
            socket.emit("client-send-mess",data);
            mess = "";
        }    
    });
    //gửi tin nhắn.

    //đăng xuất:
    $(".dangxuat").click(function(){
        socket.emit("client-logout",data);
    });
    //đăng xuất.

    
    
    $("#mess").emojioneArea({
        autoHideFilters: true
    });
});

//chọn bạn trò chuyện:
function chonban(name)
{
    var hoten = "";
    var vitriTen = mangTaiKhoan.indexOf(name);
    hoten = tenTaiKhoan[vitriTen];
    $(".chatvoi").text(hoten);
    guiden = name;
}
//chọn bạn trò chuyện.

