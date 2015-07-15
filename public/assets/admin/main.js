angular.module("nodercms",["ngAnimate","ipCookie","ui.router","controllers","services","directives","filters"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(e,t,n,i){"use strict";i.defaults.headers.common={"content-type":"application/json;charset=utf-8"},i.interceptors.push("authorityInterceptorService"),n.html5Mode(!0),t.otherwise(function(e){e.get("$state").go("main")}),e.state("install",{url:"^/admin/install",templateUrl:"/assets/admin/views/install.html",controller:"installController",resolve:{checkInstallResolve:["checkInstallResolveService",function(e){return e.leaveToLoginOrNone()}]}}).state("login",{url:"^/admin/login",templateUrl:"/assets/admin/views/login.html",controller:"loginController",resolve:{checkInstallResolve:["checkInstallResolveService",function(e){return e.enterToInstallOrNone()}]}}).state("main",{url:"^/admin",templateUrl:"/assets/admin/views/main.html",controller:"mainController"}).state("main.column",{url:"^/admin/column/:name",templateUrl:"/assets/admin/views/column.html",controller:"columnController"}).state("main.siteInfo",{url:"^/admin/setting/siteInfo",templateUrl:"/assets/admin/views/siteInfo.html",controller:"siteInfoController"}).state("main.categories",{url:"^/admin/setting/categories",templateUrl:"/assets/admin/views/categories.html",controller:"categoriesController"}).state("main.categories.create",{url:"^/admin/setting/categories/create",templateUrl:"/assets/admin/views/categoriesChange.html",controller:"categoriesChangeController"}).state("main.categories.update",{url:"^/admin/setting/categories/:_id",templateUrl:"/assets/admin/views/categoriesChange.html",controller:"categoriesChangeController"}).state("main.contentModels",{url:"^/admin/setting/contentModels",templateUrl:"/assets/admin/views/contentModels.html",controller:"contentModelsController"}).state("main.contentModels.create",{url:"^/admin/setting/contentModels/create",templateUrl:"/assets/admin/views/contentModelChange.html",controller:"contentModelChangeController"}).state("main.contentModels.update",{url:"^/admin/setting/contentModels/:_id",templateUrl:"/assets/admin/views/contentModelChange.html",controller:"contentModelChangeController"}).state("main.roles",{url:"^/admin/setting/roles",templateUrl:"/assets/admin/views/roles.html",controller:"rolesController"}).state("main.roles.create",{url:"^/admin/setting/roles/create",templateUrl:"/assets/admin/views/rolesChange.html",controller:"rolesChangeController"}).state("main.roles.update",{url:"^/admin/setting/roles/:_id",templateUrl:"/assets/admin/views/rolesChange.html",controller:"rolesChangeController"}).state("main.adminUsers",{url:"^/admin/setting/adminUsers",templateUrl:"/assets/admin/views/adminUsers.html",controller:"adminUsersController"}).state("main.adminUsers.create",{url:"^/admin/setting/adminUsers/create",templateUrl:"/assets/admin/views/adminUsersChange.html",controller:"adminUsersChangeController"}).state("main.adminUsers.update",{url:"^/admin/setting/adminUsers/:_id",templateUrl:"/assets/admin/views/adminUsersChange.html",controller:"adminUsersChangeController"})}]).run(["checkloginService",function(e){e()}]),angular.module("controllers",[]),angular.module("services",[]),angular.module("directives",[]),angular.module("filters",[]),angular.module("controllers").controller("adminUsersChangeController",["$scope","$state","$stateParams","$http",function(e,t,n,i){"use strict";e.transmitting=!1,e.action="create",e.checkEmailing=!1,e.inputing=!1,e.email="",e.oldEmail="",e.nickname="",e.password="",e.roles=[],e.role="",async.parallel({roles:function(e){i.get("/api/roles").success(function(t){e(null,t)}).error(function(){e("获取角色列表失败")})},user:function(t){n._id?(e.action="update",i.get("/api/adminUsers/"+n._id).success(function(e){t(null,e)}).error(function(){t("获取用户失败")})):t(null)}},function(i,o){return i?e.$emit("notification",{type:"danger",message:i}):(e.roles=o.roles,void(n._id&&o.user?(e.oldEmail=angular.copy(o.user.email),e.email=o.user.email,e.nickname=o.user.nickname,e.role=o.user.role._id):n._id&&t.go("main.adminUsers")))}),e.saveUser=function(){function o(){for(var t=0;t<e.roles.length;t++)if(r.role===e.roles[t]._id){r.role=e.roles[t];break}}e.transmitting=!0;var r={email:e.email.toLowerCase(),nickname:e.nickname,role:e.role};e.password&&(r.password=e.password),n._id?(r._id=n._id,i.put("/api/adminUsers/"+n._id,r).success(function(){o();for(var n=0;n<e.$parent.users.length;n++)if(e.$parent.users[n]._id===r._id)return e.$parent.users[n]=r,e.$emit("notification",{type:"success",message:"保存用户成功"}),t.go("main.adminUsers")}).error(function(){e.$emit("notification",{type:"danger",message:"保存用户失败"})})):i.post("/api/adminUsers",r).success(function(n){return o(),r._id=n._id,e.$parent.users.push(r),e.$emit("notification",{type:"success",message:"创建用户成功"}),t.go("main.adminUsers")}).error(function(){e.$emit("notification",{type:"danger",message:"创建用户失败"})})}}]),angular.module("controllers").controller("adminUsersController",["$scope","$timeout","$state","$http",function(e,t,n,i){"use strict";e.users=[],e.deleteUserId="",i.get("/api/adminUsers").success(function(t){e.users=t}).error(function(){e.$emit("notification",{type:"danger",message:"读取后台用户失败"})}),e.deleteUser=function(){i["delete"]("/api/adminUsers/"+e.deleteUserId).success(function(){for(var t=0;t<e.users.length;t++)if(e.deleteUserId===e.users[t]._id)return e.users.splice(t,1),e.$emit("notification",{type:"success",message:"删除用户成功"}),$("#deleteModal").modal("hide")}).error(function(){e.$emit("notification",{type:"danger",message:"删除用户失败"})})}}]),angular.module("controllers").controller("categoriesChangeController",["$scope","$state","$stateParams","$http",function(e,t,n,i){"use strict";e.transmitting=!1,e.action="create",e.inputing=!1,e.checkDirectorying=!1,e.types=[{type:"channel",name:"频道"},{type:"column",name:"栏目"},{type:"page",name:"单页"},{type:"link",name:"链接"}],e.models=[],e.viewfiles=[],e.type="column",e.name="",e.sort=0,e.isShow=!0,e.directory="",e.oldDirectory="",e.model="",e.views={list:"",content:""},e.parentCategory=void 0,e.keywords="",e.description="",i.get("/api/models",{params:{type:"content"}}).success(function(t){e.models=t}).error(function(){e.$emit("notification",{type:"danger",message:"读取内容模型失败"})}),i.get("/api/views").success(function(t){e.viewfiles=t}).error(function(){e.$emit("notification",{type:"danger",message:"读取模板失败"})}),n._id&&(e.action="update",i.get("/api/categories/"+n._id).success(function(n){n?(e.type=n.type,e.name=n.name,e.oldDirectory=angular.copy(n.directory),e.directory=n.directory,e.isShow=n.isShow,e.sort=n.sort,e.model=n.model&&n.model._id||"",e.views=n.views,e.parentCategory=n.parentCategory||void 0,e.keywords=n.keywords||"",e.description=n.description||""):t.go("main.categories")}).error(function(){e.$emit("notification",{type:"danger",message:"获取分类失败"})})),e.saveCategory=function(){e.transmitting=!0;var o={type:e.type,name:e.name,directory:e.directory.toLowerCase(),isShow:e.isShow,sort:e.sort};switch(e.type){case"channel":o.views=e.views,o.keywords=e.keywords,o.description=e.description;break;case"column":o.model=e.model,o.parentCategory=e.parentCategory||void 0,o.views=e.views,o.keywords=e.keywords,o.description=e.description;break;case"page":o.isEdit=e.isEdit,o.parentCategory=e.parentCategory||void 0,o.views=e.views,o.keywords=e.keywords,o.description=e.description;break;case"link":o.parentCategory=e.parentCategory||void 0}n._id?(o._id=n._id,i.put("/api/categories/"+n._id,o).success(function(){if(o.model)for(var n=0;n<e.models.length;n++)if(o.model===e.models[n]._id){o.model=e.models[n];break}for(var n=0;n<e.$parent.categories.length;n++)if(o._id===e.$parent.categories[n]._id)return e.$parent.categories[n]=o,e.$parent.categoriesSort(),e.$emit("notification",{type:"success",message:"保存分类成功"}),e.$emit("mainCategoriesUpdate"),t.go("main.categories")}).error(function(){e.transmitting=!1,e.$emit("notification",{type:"danger",message:"保存分类失败"})})):i.post("/api/categories",o).success(function(n){if(o._id=n._id,o.model)for(var i=0;i<e.models.length;i++)if(o.model===e.models[i]._id){o.model=e.models[i];break}e.$parent.categories.push(o),e.$parent.categoriesSort(),e.$emit("mainCategoriesUpdate"),t.go("main.categories")}).error(function(){e.transmitting=!1,e.$emit("notification",{type:"danger",message:"保存分类失败"})})}}]),angular.module("controllers").controller("categoriesController",["$scope","$http",function(e,t){"use strict";e.actionTitle="",e.deleteCategoryId="",e.types=[{type:"channel",name:"频道"},{type:"column",name:"栏目"},{type:"page",name:"单页"},{type:"link",name:"链接"}],e.categories=[],e.categoriesList=[],e.categoriesSort=function(){function t(e){for(var t=[],i=0,o=0;o<n.length;o++)n[o].parentCategory||(t.push(n[o]),i++);!function r(o){for(var s=0;s<o.length;s++)for(var a=0;a<n.length;a++)o[s]._id===n[a].parentCategory&&(o[s]._node=o[s]._node||[],o[s]._node.push(n[a]),i++,i<n.length?r(o[s]._node):i===n.length&&e(t))}(t)}var n=angular.copy(e.categories);e.categoriesList=[],t(function(t){!function n(t,i,o){t.sort(function(e,t){return e.sort-t.sort});for(var r=0;r<t.length;r++){var s=angular.copy(t[r]);delete s._node,s.indent={"text-indent":1.5*o+"em"},r==t.length-1&&0!=o?s.prefix="└ ":0!=o&&(s.prefix="├ "),s.preCatDirectory=i+s.directory,e.categoriesList.push(s),t[r]._node&&n(t[r]._node,s.preCatDirectory+"/",o+1)}}(t,"/",0)})},e.translate=function(t){for(var n=0;n<e.types.length;n++)if(t===e.types[n].type)return e.types[n].name},t.get("/api/categories").success(function(t){e.categories=t,e.categoriesSort()}).error(function(){e.$emit("notification",{type:"danger",message:"读取分类失败"})}),e.deleteModel=function(){t["delete"]("/api/categories/"+e.deleteCategoryId).success(function(){for(var t=0;t<e.categories.length;t++)if(e.deleteCategoryId===e.categories[t]._id)return e.categories.splice(t,1),e.$emit("notification",{type:"success",message:"删除分类成功"}),$("#deleteModal").modal("hide")}).error(function(){e.$emit("notification",{type:"danger",message:"删除分类失败"})})}}]),angular.module("controllers").controller("columnController",["$scope","$stateParams","$http",function(e,t,n){"use strict";e.category={},n.get("/api/categories/"+t._id).success(function(t){e.category=t})}]),angular.module("controllers").controller("contentModelChangeController",["$scope","$state","$stateParams","$http",function(e,t,n,i){"use strict";e.transmitting=!1,e.action="create",e.keyFormAction="",e.keyIndex="",e.name="",e.description="",e.system={thumbnail:!0,content:!0,tags:!0,gallery:!1},e.extensions=[],e.keyType=[{name:"文本框",type:"textInput"}],e.key={key:"",name:"",type:"textInput",description:""},e.keyNonUnique=!1,e.$watch("key.key",function(){if("add"===e.keyFormAction)for(var t=0;t<e.extensions.length;t++)if(e.key.key===e.extensions[t].key)return e.keyNonUnique=!0;e.keyNonUnique=!1}),n._id&&(e.action="update",i.get("/api/models/"+n._id).success(function(n){n?(e.name=n.name,e.description=n.description,e.system={thumbnail:n.system.thumbnail,content:n.system.content,tags:n.system.tags,gallery:n.system.gallery},e.extensions=n.extensions):t.go("main.contentModels")}).error(function(){e.$emit("notification",{type:"danger",message:"获取内容模型失败"})})),e.keyModel=function(t,n){t?(e.keyFormAction="edit",e.keyIndex=n,e.key=angular.copy(t)):(e.keyFormAction="add",e.keyForm.$setPristine(),e.key={key:"",name:"",type:"textInput",description:""}),$("#keyModal").modal("show")},e.deleteKey=function(){"edit"===e.keyFormAction&&(e.extensions.splice(e.keyIndex,1),$("#keyModal").modal("hide"))},e.saveKey=function(){"add"===e.keyFormAction?e.extensions.push(e.key):"edit"===e.keyFormAction&&(e.extensions[e.keyIndex]=e.key),$("#keyModal").modal("hide")},e.saveModel=function(){e.transmitting=!0;var o={name:e.name,description:e.description,type:"content",system:e.system,extensions:e.extensions};n._id?(o._id=n._id,i.put("/api/models/"+n._id,o).success(function(){for(var n=0;n<e.$parent.models.length;n++)if(o._id===e.$parent.models[n]._id)return e.$parent.models[n]=o,e.$emit("notification",{type:"success",message:"保存内容模型成功"}),t.go("main.contentModels")}).error(function(){e.$emit("notification",{type:"danger",message:"保存内容模型失败"})})):i.post("/api/models",o).success(function(n){o._id=n._id,e.$parent.models.push(o),e.$emit("notification",{type:"success",message:"保存内容模型成功"}),t.go("main.contentModels")}).error(function(){e.$emit("notification",{type:"danger",message:"保存内容模型失败"})})}}]),angular.module("controllers").controller("contentModelsController",["$scope","$http","$state",function(e,t,n){"use strict";e.models=[],e.deleteModelId="",t.get("/api/models").success(function(t){e.models=t}).error(function(){e.$emit("notification",{type:"danger",message:"读取内容模型失败"})}),e.translate=function(e){var t={thumbnail:"缩略图",content:"内容",tags:"标签",gallery:"图集"};for(var n in t)if(n===e)return t[n]},e.deleteModel=function(){t["delete"]("/api/models/"+e.deleteModelId).success(function(){for(var t=0;t<e.models.length;t++)if(e.deleteModelId===e.models[t]._id)return e.models.splice(t,1),e.$emit("notification",{type:"success",message:"删除内容模型成功"}),$("#deleteModal").modal("hide")}).error(function(){e.$emit("notification",{type:"danger",message:"删除内容模型失败"})})}}]),angular.module("controllers").controller("installController",["$scope","$state","$http",function(e,t,n){"use strict";e.title="",e.email="",e.nickname="",e.password="",e.submitInstall=function(){n.post("/api/install",{title:e.title,email:e.email.toLowerCase(),nickname:e.nickname,password:e.password}).success(function(e,n){t.go("main")}).error(function(e,t){e.message&&console.log(e.message)})}}]),angular.module("controllers").controller("loginController",["$scope","$timeout","$state","$http",function(e,t,n,i){"use strict";e.submitLogin=function(){e.transmitting=!0,i.post("/api/login",{email:e.email,password:e.password}).success(function(e,t){n.go("main")}).error(function(n,i){n&&n.error&&"WRONG_EMAIL_OR_PASSWORD"===n.error.code?(e.animateShake=!0,t(function(){e.animateShake=!1,e.transmitting=!1},600)):e.transmitting=!1})}}]),angular.module("controllers").controller("mainController",["$scope","$state","$http","$filter",function(e,t,n,i){}]),angular.module("controllers").controller("rolesChangeController",["$scope","$state","$stateParams","$http",function(e,t,n,i){"use strict";e.transmitting=!1,e.action="create",e.name="",e.description="",e.authorities=[],async.parallel({authorities:function(e){i.get("/api/authorities").success(function(t){for(var n=0;n<t.length;n++)1e4===t[n].authority?t.splice(n,1):t[n].required=!1;e(null,t)}).error(function(){e("获取权限失败")})},role:function(t){n._id?(e.action="update",i.get("/api/roles/"+n._id).success(function(e){t(null,e)}).error(function(){t("获取角色失败")})):t(null)}},function(i,o){if(i)return e.$emit("notification",{type:"danger",message:i});if(e.authorities=o.authorities,n._id&&o.role){e.name=o.role.name,e.description=o.role.description;for(var r=0;r<e.authorities.length;r++)for(var s=0;s<o.role.authorities.length;s++)e.authorities[r].authority===o.role.authorities[s]&&(e.authorities[r].required=!0)}else n._id&&t.go("main.roles")}),e.saveRole=function(){e.transmitting=!0;for(var o={name:e.name,description:e.description,authorities:[]},r=0;r<e.authorities.length;r++)e.authorities[r].required&&o.authorities.push(e.authorities[r].authority);n._id?(o._id=n._id,i.put("/api/roles/"+n._id,o).success(function(){for(var n=0;n<e.$parent.roles.length;n++)if(e.$parent.roles[n]._id===o._id)return e.$parent.roles[n]=o,e.$emit("notification",{type:"success",message:"保存角色成功"}),t.go("main.roles")}).error(function(){e.$emit("notification",{type:"danger",message:"保存角色失败"})})):i.post("/api/roles",o).success(function(n){o._id=n._id,e.$parent.roles.push(o),e.$emit("notification",{type:"success",message:"创建角色成功"}),t.go("main.roles")}).error(function(){e.$emit("notification",{type:"danger",message:"创建角色失败"})})}}]),angular.module("controllers").controller("rolesController",["$scope","$http",function(e,t){"use strict";e.authorities=[],e.roles=[],e.deleteRoleId="",async.parallel({authorities:function(e){t.get("/api/authorities").success(function(t){e(null,t)}).error(function(){e("获取权限失败")})},roles:function(e){t.get("/api/roles").success(function(t){for(var n,i=0;i<t.length;i++){for(var o=0;o<t[i].authorities.length;o++)if(1e4===t[i].authorities[o]){n=i;break}if(!isNaN(n)){t.splice(n,1);break}}e(null,t)}).error(function(){e("获取角色列表失败")})}},function(t,n){return t?e.$emit("notification",{type:"danger",message:t}):(e.authorities=n.authorities,void(e.roles=n.roles))}),e.translate=function(t){for(var n=0;n<e.authorities.length;n++)if(t===e.authorities[n].authority)return e.authorities[n].name},e.deleteRole=function(){t["delete"]("/api/roles/"+e.deleteRoleId).success(function(){for(var t=0;t<e.roles.length;t++)if(e.deleteRoleId===e.roles[t]._id)return e.roles.splice(t,1),e.$emit("notification",{type:"success",message:"删除角色成功"}),$("#deleteModal").modal("hide")}).error(function(){e.$emit("notification",{type:"danger",message:"删除角色失败"})})}}]),angular.module("controllers").controller("siteInfoController",["$scope","$http",function(e,t){"use strict";e.transmitting=!1,e.title="",e.keywords="",e.description="",e.translate={on:!1,key:""},e.codeHeader="",e.codeFooter="",t.get("/api/siteInfo").success(function(t){e.title=t.title,e.keywords=t.keywords,e.description=t.description,e.translate={on:t.translate&&t.translate.on?t.translate.on:!1,key:t.translate&&t.translate.key?t.translate.key:""},e.codeHeader=t.codeHeader,e.codeFooter=t.codeFooter}).error(function(){e.$emit("notification",{type:"danger",message:"获取网站配置失败"})}),e.submitSiteInfo=function(){e.transmitting=!0,t.put("/api/siteInfo",{title:e.title,keywords:e.keywords,description:e.description,translate:{on:e.translate.on,key:e.translate.key},codeHeader:e.codeHeader,codeFooter:e.codeFooter}).success(function(){e.transmitting=!1,e.$emit("notification",{type:"success",message:"网站配置已保存"})}).error(function(){e.transmitting=!1,e.$emit("notification",{type:"danger",message:"网站配置保存失败"})})}}]),angular.module("services").factory("authorityInterceptorService",["$q","$injector",function(e,t){"use strict";return{responseError:function(n){if(401===n.status&&n.data&&n.data.error)switch(n.data.error.code){case"NOT_LOGGED_IN":t.get("$state").go("login");break;case"NO_AUTHORITY":t.get("$state").go("main")}return e.reject(n)}}}]),angular.module("services").factory("checkInstallResolveService",["$q","$state","$http",function(e,t,n){"use strict";return{leaveToLoginOrNone:function(){var i=e.defer();return n.get("/api/install").success(function(){i.resolve()}).error(function(){i.reject(),t.go("login")}),i.promise},enterToInstallOrNone:function(){var i=e.defer();return n.get("/api/install").success(function(){t.go("install")}).error(function(){i.resolve()}),i.promise}}}]),angular.module("services").factory("checkloginService",["$rootScope","$state","ipCookie",function(e,t,n){"use strict";return function(){e.$on("$stateChangeStart",function(e,i,o,r,s){n("nodercmsSid")||"login"===i.name||"install"===i.name||(e.preventDefault(),t.go("login"))})}}]),angular.module("directives").directive("ndBlurred",function(){return{require:"ngModel",link:function(e,t,n,i){i.$blurred=!0,t.on("focus",function(){e.$apply(function(){i.$blurred=!1})}).on("blur",function(){e.$apply(function(){i.$blurred=!0})})}}}),angular.module("directives").directive("ndNavigation",["$timeout","$http","$filter",function(e,t,n){return{link:function(i,o){function r(){$(".sub-list").each(function(){$(this).children(".item").hasClass("active")?$(this).siblings(".item").addClass("active select"):$(this).slideUp("fast",function(){$(this).siblings(".sub-list-heading").removeClass("select")}).siblings(".sub-list-heading").removeClass("active")})}i.categories=[],t.get("/api/categories").success(function(t){i.categories=n("filter")(t,function(e,t){return"channel"!==e.type&&"link"!==e.type?!0:void 0}),e(function(){r()})}),i.$on("$stateChangeSuccess",function(){e(function(){r()})}),$(".sub-list-heading").on("click",function(){$(this).hasClass("select")?$(this).siblings(".sub-list").slideUp("fast",function(){$(this).siblings(".sub-list-heading").removeClass("select")}):$(this).siblings(".sub-list").slideDown("fast",function(){$(this).siblings(".sub-list-heading").addClass("select")})})}}}]),angular.module("directives").directive("ndNotification",["$timeout",function(e){return{replace:!0,link:function(t){function n(){i=!0,e(function(){o-->0?n():(i=!1,t.notificationShow=!1)},1e3)}var i,o;t.$on("notification",function(e,r){o=2,t.type=r.type,t.message=r.message,t.notificationShow=!0,i||n()})}}}]),angular.module("directives").directive("ndSame",function(){return{require:"ngModel",link:function(e,t,n,i){t.add(n.ndSame).on("input",function(){e.$apply(function(){var e=t.val()===$(n.ndSame).val();i.$setValidity("same",e)})})}}}),angular.module("directives").directive("ndTranslate",["$http",function(e){"use strict";return{require:"ngModel",link:function(t,n,i,o){n.on("input",function(){t.$apply(function(){t.translateOnShow=!1})}).on("blur",function(){t.$apply(function(){t.checkTranslateing=!0,e.jsonp("http://openapi.baidu.com/public/2.0/bmt/translate",{params:{from:"zh",to:"en",client_id:n.val(),q:"你好",callback:"JSON_CALLBACK"}}).success(function(e){if(t.checkTranslateing=!1,e.error_code){switch(t.translate.on=!1,t.translateOnShow=!1,e.error_code){case"52001":t.$emit("notification",{type:"danger",message:"百度翻译 API 检测超时"});break;case"52002":t.$emit("notification",{type:"danger",message:"百度翻译 API 系统错误"});break;case"52003":t.$emit("notification",{type:"danger",message:"百度翻译 Key 不正确"})}return void o.$setValidity("translate",!1)}t.$emit("notification",{type:"success",message:"百度翻译 API Key正确"}),t.translateOnShow=!0,o.$setValidity("translate",!0)}).error(function(){t.checkTranslateing=!1,t.$emit("notification",{type:"danger",message:"百度翻译 API 未知错误"}),t.translateOnShow=!1,t.translate.on=!1,o.$setValidity("translate",!1)})})})}}}]),angular.module("directives").directive("ndVdirectory",["$http",function(e){"use strict";return{require:"ngModel",link:function(t,n,i,o){n.on("input",function(){t.$apply(function(){t.inputing=!0})}).on("blur",function(){t.$apply(t.$eval(i.ndVdirectory)?function(){t.inputing=!1,t.checkDirectorying=!0;for(var i=n.val().toLowerCase(),r=["admin","api","openapi","open","assets","attachments"],s=0;s<r.length;s++)if(i===r[s])return t.checkDirectorying=!1,o.$setValidity("vdirectory",!1);e.get("/api/categories",{params:{directory:i}}).success(function(e){e[0]?o.$setValidity("vdirectory",!1):o.$setValidity("vdirectory",!0),t.checkDirectorying=!1}).error(function(){t.$emit("notification",{type:"danger",message:"目录名验证未知错误"}),t.checkDirectorying=!1})}:function(){o.$setValidity("vemail",!0)})})}}}]),angular.module("directives").directive("ndVemail",["$http",function(e){"use strict";return{require:"ngModel",link:function(t,n,i,o){n.on("input",function(){t.$apply(function(){t.inputing=!0})}).on("blur",function(){t.$apply(t.$eval(i.ndVemail)?function(){t.inputing=!1,t.checkEmailing=!0,e.get("/api/users",{params:{email:n.val()}}).success(function(e){e[0]?o.$setValidity("vemail",!1):o.$setValidity("vemail",!0),t.checkEmailing=!1}).error(function(){t.$emit("notification",{type:"danger",message:"邮箱验证未知错误"}),t.checkEmailing=!1})}:function(){o.$setValidity("vemail",!0)})})}}}]);