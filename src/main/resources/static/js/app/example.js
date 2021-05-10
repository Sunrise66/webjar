
var config = $.extend(true, {}, listApp, {
    data : {
        defaultLoad:false,
        service : infoService,
        editVm : {

        },
        addVm:{},
    },
    methods : {

    }
});
var app = new Vue(config);
