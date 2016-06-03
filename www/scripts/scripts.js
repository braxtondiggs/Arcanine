"use strict";function appRoute(a,b,c){a.state("app",{url:"/app","abstract":!0,templateUrl:"templates/menu.html",controller:"AppCtrl",controllerAs:"main"}).state("app.dashboard",{url:"/dashboard",views:{menuContent:{templateUrl:"templates/dashboard.html",controller:"DashboardCtrl",controllerAs:"dashboard"}}}).state("app.discover",{url:"/discover",views:{menuContent:{templateUrl:"templates/discover.html",controller:"DiscoverCtrl",controllerAs:"discover"}}}).state("app.search",{url:"/search",views:{menuContent:{templateUrl:"templates/search.html",controller:"SearchCtrl",controllerAs:"search"}}}),b.otherwise("/app/dashboard"),c.tabs.position("top"),c.views.swipeBackEnabled(!0)}function appRate(a,b){var c={language:"en",appName:"Alma",iosURL:"992255249",usesUntilPrompt:5,promptForNewVersion:!0,androidURL:"market://details?id=com.cymbit.Alma"};b.addEventListener("deviceready",function(){a.setPreferences(c)},!1)}function appIdentify(a){a.identify({app_id:"e1f80125",api_key:"78e1608ca9a8dad91cc3b4f896981b65d82055083a70cee2"})}function appRun(a){a.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()})}function errSrc(){function a(a,b,c){b.bind("error",function(){c.src!==c.errSrc&&(c.$set("src",c.errSrc),c.$set("class","missingImage"))})}var b={link:a};return b}function LoadingService(a,b){function c(){b.start(),b.inc(),a.show({animation:"fade-in",hideOnStateChange:!0,showBackdrop:!1})}function d(){a.hide(),b.complete()}var e={show:c,hide:d};return e}function AuthService(a,b){var c=new Firebase(b.FIREBASE_URL+"/url");return a(c)}function UserService(a,b){return{ref:function(a){return new Firebase(b.FIREBASE_URL+"Users/"+a)},get:function(b){return a(this.ref(b))},update:function(a){return this.ref(a.id).update(a)}}}function UtilsService(){function a(a){return"jpg"===a.slice(-3)?a.indexOf("http://imvdb.com/")>-1?a.substr(17):a:"images/logo_missing.png"}function b(a,b){return null!==a&&void 0!==a&&""!==a?a:null!==b&&void 0!==b&&""!==b?isNaN(b)?b.replace("-"," ").replace("-"," ").replace(/\w\S*/g,function(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()}):b:""}var c={checkImage:a,convertSlug:b};return c}function AppCtrl(a,b,c,d,e,f,g,h,i,j){function k(){}function l(){}var m=this;d.fromTemplateUrl("templates/modal/login.tmpl.html",{scope:a,controller:"LoginCtrl",animation:"slide-in-up"}).then(function(a){m.modal=a,m.login={}}),b.openLogin=function(){window.cordova&&window.cordova.plugins.Keyboard&&f.disableScroll(!0),m.modal.show(),m.login.title="Login",e.enableSlide(!1)},m.signupPage=function(){m.login.title="Signup",e.slide(0)},m.loginPage=function(){m.login.title="Login",e.slide(1)},b.closeLogin=function(){m.modal.hide().then(function(){window.cordova&&window.cordova.plugins.Keyboard&&f.disableScroll(!1)})},m.logout=function(){g.confirm("Are you sure you want to logout?","Alma").then(function(a){if(1===a){h.isOpenLeft()===!0&&h.toggleLeft(),j.$reset();var b=i.currentView();"app.settings"!==b.stateName&&"app.profile"!==b.stateName||c.transitionTo("app.dashboard"),i.nextViewOptions({historyRoot:!0}),g.alert("You have been successfully logged out","Alma")}})},document.addEventListener("resume",k,!1),document.addEventListener("pause",l,!1)}function LoginCtrl(a,b,c,d){var e=this;e.auth=b,e.auth.$onAuth(function(b){b&&(a.user=b[b.provider],console.log(a.user))}),e.signup={form:{}},e.login=e.signup,e.login.submit=function(){e.login.form.$valid&&(d.show(),b.$authWithPassword({email:e.login.form.email.$viewValue,password:e.login.form.password.$viewValue}).then(function(b){c.update(b.password).then(function(){e.login={},e.signup=e.login,a.closeLogin(),d.hide()})["catch"](function(a){e.login.error=a,d.hide()})})["catch"](function(a){e.login.error=a,d.hide()}))},e.signup.submit=function(){e.signup.form.$valid&&b.$createUser({email:e.signup.form.email.$viewValue,password:e.signup.form.password.$viewValue}).then(function(){b.$authWithPassword({email:e.signup.form.email.$viewValue,password:e.signup.form.password.$viewValue}).then(function(b){b.password.id=b.uid,b.password.accessToken=b.token,b.password.displayName=e.signup.form.name.$viewValue,b.password.provider="Password",c.update(b.password).then(function(){e.login={},e.signup=e.login,a.closeLogin(),d.hide()})["catch"](function(a){e.signup.error=a,d.hide()})})["catch"](function(a){e.signup.error=a,d.hide()})})["catch"](function(a){e.signup.error=a,d.hide()})},e.facebook=function(){function e(b){b.facebook.provider="facebook",c.update(b.facebook).then(function(){a.closeLogin(),d.hide()})}b.$authWithOAuthPopup("facebook",{scope:"public_profile, email, user_friends, user_birthday"}).then(function(a){e(a)})["catch"](function(a){"TRANSPORT_UNAVAILABLE"===a.code&&b.$authWithOAuthPopup("facebook",{scope:"public_profile, email, user_friends, user_birthday"}).then(function(a){e(a)})})},e.twitter=function(){},e.formChange=function(){e.login.error=null,e.signup.error=null},e.forgetPassword=function(){}}function DashboardCtrl(){}function DiscoverCtrl(a,b,c,d,e){var f=this;f.get=function(g){if(e.isUndefined(f[g])){f[g]={loaded:!1},d.show();var h=b(new Firebase(c.FIREBASE_URL+"Discover/"+g));h.$loaded(function(){h&&h.tracks&&0!==h.tracks.length&&!moment(new Date(h.date)).isBefore(new Date,"day")?(f[g].tracks=h.tracks,f[g].loaded=!0,d.hide()):a({method:"GET",url:c.apiEndpoint+"tracks/discover/"+g}).success(function(a){f[g].tracks=a,f[g].loaded=!0,d.hide()})})}}}function SearchCtrl(a,b,c,d,e,f,g,h,i,j){function k(){return n[n.action]&&n[n.action].current_page>0?parseInt(n[n.action].current_page,10)+1:1}function l(){var a=n.$storage.search[n.action].indexOf(n.term);-1===a?(n.$storage.search[n.action].unshift(n.term),n.$storage.search[n.action].length>=5&&(n.$storage.search[n.action]=n.$storage.search[n.action].slice(0,5))):n.$storage.search[n.action]=ionic.Utils.arrayMove(n.$storage.search[n.action],0,a)}function m(a){h.show(),b({method:"GET",url:i.apiEndpoint+"search",params:{pg:a,q:n.term,s:n.action}}).success(function(b){a>1?(e.merge(n[n.action],b,function(a,b){return e.isArray(a)?a.concat(b):void 0}),n[n.action].current_page=b.current_page,n[n.action].loaded=!0):(n[n.action]={results:b.results,current_page:b.current_page,total_pages:b.total_pages,loaded:!0,maxed:!1},1===g.selectedIndex()&&(n[n.action].resultsTop=e.filter(b.results,function(a){return n.convertSlug(a.name,a.slug).toLowerCase().indexOf(n.term.toLowerCase())>-1}),n[n.action].results=e.filter(b.results,function(a){return-1===n.convertSlug(a.name,a.slug).toLowerCase().indexOf(n.term.toLowerCase())}),e.isEmpty(n[n.action].resultsTop)&&delete n[n.action].resultsTop)),l(),h.hide()})}var n=this;n.term="",n.changed=!1,n.action=0===g.selectedIndex()?"videos":"entities",n.$storage=c.$default({search:{videos:[],entities:[]}}),a.$watch(angular.bind(this,function(){return this.term}),function(a){a&&a.length>2&&(n.changed=!0,m(1))}),n.set=function(a){n.term=a},n.load=function(){parseInt(n[n.action].current_page,10)!==parseInt(n[n.action].total_pages,10)?m(k()):n[n.action].maxed=!0,d(function(){a.$broadcast("scroll.infiniteScrollComplete")},500)},n.onChange=function(a){n.action=a,n.changed&&(m(k()),n.changed=!1)},n.select=function(a){},n.checkImage=function(a){return j.checkImage(a)},n.convertSlug=function(a,b){return j.convertSlug(a,b)},n.getKeys=function(a){13===a.which&&window.cordova&&window.cordova.plugins.Keyboard&&f.isVisible()&&f.close()}}angular.module("arcanine",["ionic","arcanine.controllers","arcanine.config","arcanine.directives","arcanine.services","ngCordova","angularMoment","ngLodash","ngStorage","angular-loading-bar","ngTextTruncate","monospaced.elastic","720kb.fx","firebase"]),angular.module("arcanine.config",[]).constant("ENV",{name:"production",apiEndpoint:"http://arbok.herokuapp.com/api/",FIREBASE_URL:"https://arbok.firebaseio.com/"}),appRoute.$inject=["$stateProvider","$urlRouterProvider","$ionicConfigProvider"],angular.module("arcanine.config").config(appRoute),appRun.$inject=["$ionicPlatform"],angular.module("arcanine.config").run(appRun),angular.module("arcanine.directives",[]).directive("errSrc",errSrc);var watchMenu=function(a,b){function c(c){a(function(){c.$watch(function(){return b.getOpenRatio()},function(a){c.data=a,c.ratio=a>=.5})})}var d={link:c,restrict:"A"};return d};watchMenu.$inject=["$timeout","$ionicSideMenuDelegate"],angular.module("arcanine.directives").directive("watchMenu",watchMenu),LoadingService.$inject=["$ionicLoading","cfpLoadingBar"],angular.module("arcanine.services",[]).factory("Loading",LoadingService),AuthService.$inject=["$firebaseAuth","ENV"],angular.module("arcanine.services").factory("Auth",AuthService),UserService.$inject=["$firebaseObject","ENV"],angular.module("arcanine.services").factory("User",UserService),angular.module("arcanine.services").factory("Utils",UtilsService),AppCtrl.$inject=["$scope","$rootScope","$state","$ionicModal","$ionicSlideBoxDelegate","$cordovaKeyboard","$cordovaDialogs","$ionicSideMenuDelegate","$ionicHistory","$localStorage"],angular.module("arcanine.controllers",[]).controller("AppCtrl",AppCtrl),LoginCtrl.$inject=["$rootScope","Auth","User","Loading"],angular.module("arcanine.controllers").controller("LoginCtrl",LoginCtrl),angular.module("arcanine.controllers").controller("DashboardCtrl",DashboardCtrl),DiscoverCtrl.$inject=["$http","$firebaseObject","ENV","Loading","lodash"],angular.module("arcanine.controllers").controller("DiscoverCtrl",DiscoverCtrl),SearchCtrl.$inject=["$scope","$http","$localStorage","$timeout","lodash","$cordovaKeyboard","$ionicTabsDelegate","Loading","ENV","Utils"],angular.module("arcanine.controllers").controller("SearchCtrl",SearchCtrl);