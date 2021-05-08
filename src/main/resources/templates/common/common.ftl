<#import "/spring.ftl" as spring/>
<#macro urlRandom url>
<@spring.url url />?t=${Application.urlRandomParam}
</#macro>

<#macro importBaseJs>
	<script type="text/javascript" src="<@spring.url '/js/libs/vue.js' />"></script>
<#--	<script type="text/javascript" src="<@spring.url '/js/libs/index.js' />"></script>-->
	<script src="https://unpkg.com/element-ui/lib/index.js"></script>
	<script type="text/javascript" src="https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js"></script>
	<script type="text/javascript" src="<@spring.url '/js/libs/jquery.url.js' />"></script>
	<script type="text/javascript" src="<@spring.url '/js/libs/axios.min.js' />"></script>
	<script type="text/javascript" src="https://cdn.bootcss.com/es6-promise/4.1.1/es6-promise.auto.min.js"></script> 
	<script type="text/javascript" src="<@spring.url '/js/common.js' />"></script>
</#macro>

<#macro importBaseCSS>
<#--	<link rel="stylesheet" type="text/css" href="<@spring.url '/css/index.css'/>"/>-->
	<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
	<link rel="stylesheet" type="text/css" href="<@spring.url '/css/animate.min.css'/>"/>
	<link rel="stylesheet" type="text/css" href="<@spring.url '/css/common.min.css'/>"/>
	<link rel="stylesheet" type="text/css" href="<@spring.url '/css/acc.css' />"/>
	<link rel="stylesheet" type="text/css" href="<@spring.url '/css/widget.css' />"/>
</#macro>