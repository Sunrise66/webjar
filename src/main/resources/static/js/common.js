Array.prototype.indexOf = function(val) { 
for (var i = 0; i < this.length; i++) { 
if (this[i] == val) return i; 
} 
return -1; 
};
Array.prototype.remove = function(val) { 
	var index = this.indexOf(val); 
	if (index > -1) { 
	this.splice(index, 1); 
	} 
};
	
	
axios.defaults.baseURL = top._CTX+"/";
// 超时时间
axios.defaults.timeout = 5000;
// http请求拦截器
var loadinginstace;
axios.interceptors.request.use(function(config){
	if(!config.params)
		config.params={};
	config.params.t=new Date().getTime();
 return config;
}, function(error){
	console.log('error',error);
 return Promise.reject(error);
});

// http响应拦截器
axios.interceptors.response.use(function(response){// 响应成功关闭loading
	// loadinginstace.close();
	if(response.data.code==999){
		window.ELEMENT.MessageBox.alert('登录超时，请重新登录', '登录超时', {
	        confirmButtonText: '去登录',
	        callback: function(action){
	        		window.location.href = top._CTX+'/login';
	        }
	      });
	}
	return response;
}, function(error){
	console.log('error',error);
 return Promise.reject(error);
});
Vue.prototype.$http = axios;

function axiosHttpAdapter(){
	this.$http = axios;
}
var SUCCESS_CODE=200;
axiosHttpAdapter.prototype.get=function(url,params,callback){
	params = params || {};
	this.$http.get(url,{params:params}).then(function(res){
		if(res.data.code==SUCCESS_CODE)
			callback && callback.success && callback.success(res.data.data);
		else{
			if(callback && callback.fail){
				callback.fail(res.data);
			}
			else{
				alert(res.data.msg);
			}
		}
    })
    .catch(function(err){
    	console.error(err);
    	callback && callback.error && callback.error(err);
    });
}

axiosHttpAdapter.prototype.post=function(url,data,callback){
	this.$http.post(url,data).then(function(res){
//		console.log(res);
		if(res.data.code==SUCCESS_CODE)
			callback && callback.success && callback.success(res.data.data);
		else{
			if(callback && callback.fail){
				callback.fail(res.data);
			}
			else{
				alert(res.data.msg);
			}
		}
    })
    .catch(function(err){
    	callback && callback.error && callback.error(err);
    });
}

axiosHttpAdapter.prototype.delete=function(url,params,callback){
	params = params || {};
	this.$http.delete(url,{params:params}).then(function(res){
		if(res.data.code==SUCCESS_CODE)
			callback && callback.success && callback.success(res.data.data);
		else{
			if(callback && callback.fail){common.ftl
				callback.fail(res.data);
			}
			else{
				alert(res.data.msg);
			}
		}
    })
    .catch(function(err){
    	console.error(err);
    	callback && callback.error && callback.error(err);
    });
}
/******
 * enum
 */


/******************************/
_HTTP = new axiosHttpAdapter();

function getQueryString(sProp) {
	var re = new RegExp("[&,?]" + sProp + "=([^//&]*)", "i");
	var a = re.exec(window.location.search);
	if (a == null) {
		return "";
	} else {
		return decodeURIComponent(a[1]);
	}
}

function clearObject(data){
	for(var obj in data){
		data[obj] = '';
	}
}

function service(){
	this.requsetPage=function(params,callback){
		return _HTTP.post(this.url+'/requestPage',params,callback);
	}
	this.deleteObj=function(id,callback){
		return _HTTP.delete(this.url+'/'+id,null,callback);
	}
	this.save=function(member,callback){
		return _HTTP.post(this.url+'/save',member,callback);
	}
	
	this.getData=function(url,params,callback){
		return _HTTP.get(url,params,callback);
	}
	
	this.postData=function(url,saveReqDto,callback){
		return _HTTP.post(url,saveReqDto,callback);
	}
}

function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

var listApp = {
		el : '#app',
		data : {
			searchVm : {

			},
			currentSearch : {

			},
			tableVm : {
				loading : false,
				data : [],
				total : 1,
				pageIndex : 1,
				pageSize : 10,
				tempData : []
			},
			editVm : {
				formName:"editForm",
				data : {},
				visible : false,
				oprate : "修改",
				loading : false,// 提交中
				isEdit:true,
				isAdd:false
			},
			deleteLoading:false,
			fullscreenLoading : false,
			allLoaded : false,
			defaultLoad:true
		},
		mounted : function() {
			this.init();
			if(this.defaultLoad){
				this.buildCurrentSearch();
				this.requsetPage();
			}
		},
		filters:{
	        formatEditStatus:function(status){
	        	return status == 1 ? '正常' : '停用';
	        },
	        formatDate(time) {
	        	if(!time) return "";
	            var date = new Date(time);
	            return formatDate(date, "yyyy-MM-dd hh:mm:ss");
	        },
	        formatDateToDay(time) {
	        	if(!time) return "";
	            var date = new Date(time);
	            return formatDate(date, "yyyy/MM/dd");
	        }
	    },
		methods : {
			init:function(){},
			requsetPage : function() {
				this.tableVm.loading = true;
				var _this = this;
				this.service.requsetPage(this.currentSearch, {
					success : function(data) {
						_this.tableVm.loading = false;
						_this.tableVm.data = data.dataList;
						_this.tableVm.total = data.total;
						_this.tableVm.pageIndex = data.pageNum;
					}
				});
			},
			buildCurrentSearch : function() {
				this.currentSearch = $.extend(true,{},this.searchVm);
//				this.currentSearch.pageSize=this.tableVm.pageSize;
//				this.currentSearch.pageIndex=1;
				this.currentSearch.pageInfo = {pageIndex:1,pageSize:this.tableVm.pageSize}
			},
			search : function() {
				this.buildCurrentSearch();
				this.requsetPage();
			},
			handleCurrentChange : function(val) {
				this.currentSearch.pageInfo.pageIndex = val;
				this.requsetPage();
			},
			edit : function(index, row ,callback) {
				this.editVm.oprate = '编辑';
				this.editVm.visible = true;
				this.editVm.isEdit = true;
				this.editVm.isAdd = false;
				this.editVm.data = $.extend(true,{},row);
				if(callback && typeof callback === 'function')
					callback(row);
			},
			show : function(index, row) {
				this.editVm.oprate = '查看';
				this.editVm.visible = true;
				this.editVm.isEdit = false;
				this.editVm.isAdd = false;
				this.editVm.data = $.extend(true,{},row);
			},
			add : function(callback) {
				this.editVm.oprate = '新增';
				this.editVm.visible = true;
				this.editVm.isEdit = true;
				this.editVm.isAdd = true;
				this.editVm.data = $.extend(true,{},this.addVm);
				if(callback && typeof callback === 'function')
					callback();
			},
			showSuccessMsg:function(msg){
				this.$message({
					message : msg,
					type : 'success'
				});
			},
			showFailMsg:function(msg){
				this.$message({
					message : msg,
					type : 'fail'
				});
			},
			deleteRow : function(index, row) {
				var _this = this;
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText : '确定',
					cancelButtonText : '取消',
					type : 'warning'
				}).then(function() {
					_this.deleteLoading = true;
					_this.service.deleteObj(row.id, {
						success : function(ret) {
							_this.deleteLoading = false;
							_this.buildCurrentSearch();
							if(_this.currentSearch.pageInfo.pageIndex>1)
								_this.currentSearch.pageInfo.pageIndex--;
							_this.requsetPage();
							_this.showSuccessMsg("操作成功！");
						},
						fail : function(res) {
							_this.deleteLoading = false;
							_this.showFailMsg(res.msg);
						}
					});
				});
			},
			save : function(vm,callback) {
				var _this = this;
				this.$refs[vm.formName].validate(function(valid) {
					if (valid) {
						vm.loading = true;
						_this.service.save(_this.buildSaveReqDto(vm), {
							success : function(ret) {
								vm.loading = false;
								if(callback){
									callback();
								}else{
									_this.requsetPage();
								}
								vm.visible = false;
							},
							fail : function(res) {
								vm.loading = false;
								_this.showFailMsg(res.msg);
							}
						});
					} else {
						_this.showFailMsg('校验不通过哦');
						return false;
					}
				});
			},
			buildSaveReqDto:function(vm){
				return vm.data;
			},
			formatStatus:function(row, column){
	        	return row.status == 1 ? '正常' : '停用';
	        },
	        timestamp:function(row, column){
	        	console.log(row.createdTime);
	        	var date = new Date(row.createdTime);
	            var Y = date.getFullYear() + '-';
	            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	            var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
	            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	            var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	            var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
	            return Y+M+D+h+m+s;
		    },
		    filterDate: function (row, column, value) { 
		    	 var date = row[column.property];  
		          if (date == undefined) {  
		             return "";  
		          }  
		          var d = new Date(date); 
	    	      var year   =  d.getFullYear();  
	              var month  =  d.getMonth() + 1;  
	              var day    =  d.getDate(); 
	              var hour    =  d.getHours(); 
	              var mines    =  d.getMinutes();
	              var seconds    =  d.getSeconds();
		          return year+"/"+month+"/"+day+" "+hour+":"+mines+":"+seconds;  
	        },
		    filterDateDay: function (row, column, value) { 
		    	 var date = row[column.property];  
		          if (date == undefined) {  
		             return "";  
		          }  
		          var d = new Date(date); 
	    	      var year   =  d.getFullYear();  
	              var month  =  d.getMonth() + 1;  
	              var day    =  d.getDate(); 
		          return year+"/"+month+"/"+day;  
	        },
		    beforeAvatarUpload:function(file) {
		    	const isJPG = (file.type === 'image/jpeg' 
		        	|| file.type === 'image/png'
		        	|| file.type==='image/gif'
		        	|| file.type==='image/bmp');
		        const isLt2M = file.size / 1024 / 1024 < 1;

		        if (!isJPG) {
		          this.$message.error('上传图片只能是 jpg，gif，png，bmp 格式!');
		        }
		        if (!isLt2M) {
		          this.$message.error('上传图片大小不能超过 1MB!');
		        }
		        return isJPG && isLt2M;
		    },
		    serviceSave : function(service,vm,callback) {
				var _this = this;
				this.$refs[vm.formName].validate(function(valid) {
					if (valid) {
						vm.loading = true;
						service.save(_this.buildSaveReqDto(vm), {
							success : function(ret) {
								vm.loading = false;
								if(callback){
									callback();
								}else{
									service.requsetPage();
								}
								vm.visible = false;
							},
							fail : function(res) {
								vm.loading = false;
								_this.showFailMsg(res.msg);
							}
						});
					} else {
						_this.showFailMsg('校验不通过哦');
						return false;
					}
				});
			}
		}
	};
//用于生成uuid
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}		