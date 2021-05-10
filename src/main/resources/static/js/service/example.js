function infoServiceF(){
    service.call(this);
    this.url="/api/info";
    var _this = this;
    this.getByChannelCode=function(code,callback){
        return _HTTP.get(_this.url+'/getByChannelCode/',{channelCode:code},callback);
    }
}
var infoService = new infoServiceF();