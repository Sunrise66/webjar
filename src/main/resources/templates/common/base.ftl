<#import "/common/common.ftl" as common/>
<#import "/spring.ftl" as spring/>

<#assign jses=[]/>
<#assign csses=[]/>

<#macro page title>
    <!DOCTYPE html>
    <html>
    <head>
        <@common.importBaseCSS/>
        <#list csses as css>
            <link rel="stylesheet" type="text/css" href="<@spring.url '${css}' />">
        </#list>
        <style>
            [v-cloak] {
                display: none;
            }

            html, body{height:100%; }

            .page-container-wrapper{
                height:auto;
                min-height:100%;
            }
        </style>
        <script>
            location._CTX = "<@spring.url '' />";
        </script>
    </head>
    <body ng-app='myapp'>
        <div class="page-container-wrapper" id="app">
            <div class="page-container" style="padding-bottom: 120px;">
                <#nested/>
            </div>
        </div>
    <@common.importBaseJs/>
    <#list jses as js>
        <script type="text/javascript" src="<@spring.url '${js}' />"></script>
    </#list>
    </body>
    </html>
</#macro>