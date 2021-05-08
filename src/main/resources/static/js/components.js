/**
 * 模板页选择
 * value-双向绑定模板页code
 * type-模板页类型，1：列表页，2：详细页
 * disabled-是否可编辑
 * label-选中模板页的名称
 */
Vue.component("template-select",{
	props:['value','type','disabled','label'],
	template:'<span><el-input v-model="selected" class="input-with-select" suffix-icon="el-icon-edit" @focus="openSelectDialog" v-bind:disabled="disable" placeholder="选择模板" readonly="true" >\
					</el-input>\
		<el-dialog title="选择模板" :visible.sync="dialogVisible" width="600px" append-to-body>\
	        <el-table  stripe ref="multipleTablemb" :data="tableVm.datas"  highlight-current-row border style="width: 100%" v-loading="loading" @row-dblclick="confRow" @select="select" @select-all="selectAll">\
				<el-table-column type="selection" width="70" > </el-table-column>\
                <el-table-column prop="code" label="模板编号" show-overflow-tooltip></el-table-column>\
                <el-table-column prop="name" label="模板名称" show-overflow-tooltip></el-table-column>\
			</el-table>\
            <div class="block">\
            	<el-pagination  @current-change="handleCurrentChange" :current-page="tableVm.pageIndex" :page-size="tableVm.pageSize" layout="prev, pager, next, jumper" :total="tableVm.total"></el-pagination>\
          	</div>\
		<div slot="footer" class="dialog-footer">\
			<el-button plain size="medium" icon="el-icon-close"  @click.native="dialogVisible = false">关闭</el-button>\
			<span><el-button plain type="primary" size="medium" icon="el-icon-success" @click.native="comfirm()" >确定</el-button></span>\
		</div>\
		</el-dialog></span>',
	data:function(){
		return {
			myValue:this.value,
			dialogVisible:false,
			currentSearch:{type:this.type,pageInfo:{pageIndex:1,pageSize:10}},
			tableVm:{
				datas:[],
				total : 1,
				pageIndex : 1,
				pageSize : 10},
			loading:false,
			multipleSelection:[],
			selected:'',
			dataList:[],
			disable : this.disabled,
			selectionList:[]
		}
	},
	mounted:function(){
		this.selected = this.label;
	},
	methods:{
		openSelectDialog:function(){
//			console.log('openSelectDialog'+this.value);
			this.dialogVisible=true;
			this.myValue = this.value;	
			this.currentSearch.pageInfo.pageIndex=1;		
			this.getList();
			this.selectionList=[];
		},
		initCheckData:function(checkVal){
			if(checkVal!=""){
				for(var j=0;j<this.tableVm.datas.length;j++){
					if(checkVal==this.tableVm.datas[j].code){
						this.selectionList.push(this.tableVm.datas[j]);
						break;
					}
				}
			}
		},		
		getList:function(){
			var _this = this;
			this.loading = true;
			templateService.selectList(this.currentSearch, {
				success : function(data) {
					_this.loading = false;
					_this.tableVm.datas = data.dataList;
					_this.tableVm.total = data.total;
					_this.tableVm.pageIndex = data.pageNum;
					_this.dataList=data.dataList;
					
					_this.initCheckData(_this.myValue);
					_this.setCheckedItem();
				}
			});
		},
		setCheckedItem:function(){
			var _this=this;
			if(_this.$refs.multipleTablemb!=undefined){
				_this.$refs.multipleTablemb.clearSelection();
				var rows=[];
				if(_this.selectionList!=null && _this.selectionList.length>0){
					for(var i=0;i<_this.selectionList.length;i++){
						for(var j=0;j<_this.tableVm.datas.length;j++){
							if(_this.selectionList[i].code==_this.tableVm.datas[j].code){
								rows.push(_this.tableVm.datas[j]);
								break;
							}
						}
					}
					rows.forEach(row => {
						_this.$nextTick(() => {
							_this.$refs.multipleTablemb.toggleRowSelection(row);
						});
			        });
				}
			}
		},
		comfirm:function(){
			this.dialogVisible = false;
			this.selected=this.multipleSelection[0]?this.multipleSelection[0].name:"";
			this.myValue=this.multipleSelection[0]?this.multipleSelection[0].code:"";
			this.$emit('selectchanged', this.multipleSelection[0]);
			this.$emit('input', this.myValue);
		},
		confRow:function(row,e){			
			this.dialogVisible = false;
			this.selected=row.name;
			this.myValue=row.code;
			this.$emit('selectchanged', row);
			this.$emit('input', this.myValue);	
		},
		buildCurrentSearch : function() {
			this.currentSearch.pageInfo.pageSize=this.tableVm.pageSize;
			this.currentSearch.pageInfo.pageIndex=1;
		},
		search : function() {
			this.buildCurrentSearch();
			this.getList();
		},
		handleCurrentChange : function(val) {
			this.currentSearch.pageInfo.pageIndex = val;
			this.getList();
		},
		select:function(selection,row){
			this.multipleSelection=selection;
		},
		selectAll:function(selection){
			this.$refs.multipleTablemb.clearSelection();
			this.multipleSelection=[];
		}
	},
	watch:{
		label:function(){
			this.selected = this.label;
		},
		disabled:function(){
			this.disable = this.disabled;
		}
	}
});

/**
 * 栏目选择树ztree
 * value - 当前点击的栏目channelCode
 */
var _CHANNELTHIS = null;
Vue.component("channel-tree",{
	props:['value'],
	template:'<span><ul id="channelTree" class="ztree"></ul></span>',
	data:function(){
		return {
			myValue:this.value,
			selectionList:[],
			setting:{
				view: {
					dblClickExpand: false,
					showLine: false,
					selectedMulti: false
				},
				data: {
					simpleData: {
						enable:true,
						idKey: "channelCode",
						pIdKey: "parentCode",
						rootPId: "root"
					}
				},
				callback: {
					onClick:function(event, treeId, treeNode){
						_CHANNELTHIS.choose(treeNode);
					}
				}
			},
			service:channelService
		}
	},
	mounted:function(){
		_CHANNELTHIS = this;
		this.init();
	},
	methods:{
		init:function(){
			var _this = this;
			this.service.getAllTree({
				success : function(data) {
					_this.initTree(data);
				},
				fail : function(res) {
					_this.showFailMsg(res.msg);
				}
			});
//			this.$emit('nodeClick', 123);
		},
		initTree:function(data){
			var t = $("#channelTree");
			data.forEach(function(d){
				d.name = d.channelName;
			});
			t = $.fn.zTree.init(t, this.setting, data);
		},
		choose:function(node){
			this.myValue=node.channelCode;
			this.$emit('input', this.myValue);
			this.$emit('nodeclick', node);
		}
	}
});

//wangEditor富文本编辑器
Vue.component("wangEditor", {
    template: '<div ref="editor"></div>',
    data() {
        return {
            editor: null,
            editorConfigCur: {
                uploadFileName : 'file',
                zIndex : 100,
                uploadImgServer : top._CTX+'/api/file/uploadwangeditor',
                contenteditable:true,
                menus:[
                    'head',  // 标题
                    'bold',  // 粗体
                    'fontSize',  // 字号
                    'fontName',  // 字体
                    'italic',  // 斜体
                    'underline',  // 下划线
                    'strikeThrough',  // 删除线
                    'foreColor',  // 文字颜色
                    'backColor',  // 背景颜色
                    'link',  // 插入链接
                    'list',  // 列表
                    'justify',  // 对齐方式
                    'quote',  // 引用
//                    'emoticon',  // 表情
                    'image',  // 插入图片
                    'table',  // 表格
                    'video',  // 插入视频
                    'code',  // 插入代码
                    'undo',  // 撤销
                    'redo'  // 重复
                ]
            }
        }
    },
    props: {
        content: {
            type: String
        },
        config: {
            type: Object
        }
    },
    mounted() {
        var _this = this;
        this.editor = new wangEditor(this.$refs.editor);
        this.config = $.extend(true,{},this.editorConfigCur,this.config);
        for(var configKey in this.config){
            this.editor.customConfig[configKey]=this.config[configKey];
        }

        this.editor.create();
        this.editor.txt.html(this.content);
        if(this.config.contenteditable!=undefined){
            this.editor.$textElem.attr('contenteditable', this.config.contenteditable);
        }
    },
    methods: {
        getContent:function() { // 获取内容方法
            return this.editor.txt.html();
        }
    },
    destroyed() {
    },
    watch: {
        content:function(newValue,oldValue){
            this.editor.txt.html(newValue||""); // 确保UE加载完成后，放入内容。
        },
        config: {
            handler(curVal,oldVal){
                // 开启.禁用编辑功能
                this.editor.$textElem.attr('contenteditable', this.config.contenteditable);
            },
            deep:true
        }
    }
});

/**
 * 图片上传
 */
Vue.component("upload-image", {
	props:['value','disabled'],
    template: '<span>\
			     <el-upload v-if="!isEdit" class="avatar-uploader" :on-success="handleAvatarSuccess" :on-progress="handleAvatarProgress" :before-upload="beforeAvatarUpload" :action="action" :show-file-list="false" > \
					<img v-if="myValue" :src="myValue" class="avatar"> \
					<i v-if="!myValue && !imageLoading" class="el-icon-plus avatar-uploader-icon"></i> \
					<i v-if="imageLoading" class="el-icon-loading avatar-uploader-icon"></i> \
				 </el-upload> \
				 <el-popover v-else placement="top" width="100%" height="100%" trigger="click"> \
				  <img :src="myValue" class="avatar" style="width:100%;height:100%"> \
				  <img v-show="myValue" slot="reference" :src="myValue" class="avatar"> \
				</el-popover> \
			</span>',
    data() {
        return {
        	myValue:this.value,
        	action:top._CTX+'/api/file/upload',
        	imageLoading:false,
        	isEdit:this.disabled || false
        }
    },
    mounted() {
    	this.myValue = this.value;
    },
    methods: {
		handleAvatarSuccess(res, file) {
			 this.imageLoading = false;
			 this.myValue=res.data.content;
			 this.$emit('input', this.myValue);
		},
		handleAvatarProgress(event, file, fileList) {
			this.myValue="";
			this.$emit('input', this.myValue);
	        this.imageLoading = true;
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
	    }
    },
    watch: {
    	value:function(newValue,oldValue){
        	this.myValue = this.value;
        }
    }
});

/**
 * 图片上传-多图
 */
Vue.component("upload-images", {
	props:['value'],
    template: '<span>\
    	<el-upload\
		  action="/api/file/upload"\
		  list-type="picture-card"\
		  :on-preview="handlePictureCardPreview"\
		  :on-success="handleSuccess"\
    	  :on-remove="onremove"\
		  :before-upload="beforeAvatarUpload"\
		  limit="10"\
		  :file-list = "filelist">\
		  <i class="el-icon-plus"></i>\
		</el-upload>\
		<el-dialog :visible.sync="dialogVisible" append-to-body>\
		  <img width="100%" :src="dialogImageUrl" alt="">\
		</el-dialog>\
			</span>',
    data() {
        return {
        	action:top._CTX+'/api/file/upload',
        	dialogImageUrl: '',
            dialogVisible: false,
            filelist:[]
        }
    },
    mounted() {
    	this.filelist = this.value;
    },
    methods: {
	    handlePictureCardPreview:function(file) {
	        this.dialogImageUrl = file.url;
	        this.dialogVisible = true;
	    },
	    handleSuccess:function(res,file, filelist) {
	    	file.fileUrl = res.data.content;
	    	this.$emit('onchange', filelist);
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
	    onremove:function(file,filelist){
	    	this.$emit('onchange', filelist||[]);
	    }
    },
    watch: {
    	value:function(n,o){
    		this.filelist = this.value;
    	}
    }
});