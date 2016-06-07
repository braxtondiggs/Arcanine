"use strict";function appRoute(a,b,c){a.state("app",{url:"/app","abstract":!0,templateUrl:"templates/menu.html",controller:"AppCtrl",controllerAs:"main",resolve:{currentAuth:["$rootScope","User","$q","Auth","Queue","Loading",function(a,b,c,d,e,f){f.show();var g=c.defer();return d.$waitForAuth().then(function(c){c?"password"===c.provider?b.get(c.uid).$loaded().then(function(b){f.hide(),a.user=b,g.resolve(b)}):(f.hide(),a.user=c[c.provider],g.resolve(c[c.provider])):(f.hide(),g.resolve())}),g.promise}]}}).state("app.dashboard",{url:"/dashboard",views:{menuContent:{templateUrl:"templates/dashboard.html",controller:"DashboardCtrl",controllerAs:"dashboard"}}}).state("app.discover",{url:"/discover",views:{menuContent:{templateUrl:"templates/discover.html",controller:"DiscoverCtrl",controllerAs:"discover"}}}).state("app.search",{url:"/search",views:{menuContent:{templateUrl:"templates/search.html",controller:"SearchCtrl",controllerAs:"search"}}}).state("app.artist",{url:"/artist/:action/:artistId",views:{menuContent:{templateUrl:"templates/artist.html",controller:"ArtistCtrl",controllerAs:"artist",resolve:{Artist:["$q","$stateParams","ArtistService","$cordovaDialogs","$ionicHistory",function(a,b,c,d,e){function f(){d.alert("We are having trouble getting this artists information right now. Our data is constantly changing, so check back later","Alma - Error").then(function(){e.goBack(-1)})}var g=a.defer();return"id"===b.action?c.getInfo(b.artistId).then(function(a){g.resolve(a)},function(a){f(),g.reject(a)}):"slug"===b.action&&c.getSlug(b.artistId).then(function(a){g.resolve(a)},function(a){f(),g.reject(a)}),g.promise}]}}}}).state("app.venue",{url:"/venue",views:{menuContent:{templateUrl:"templates/venue.html",controller:"VenueCtrl",controllerAs:"venue"}}}).state("app.profile",{url:"/profile/:id",views:{menuContent:{templateUrl:"templates/profile.html",controller:"ProfileCtrl",controllerAs:"profile",resolve:{profileUser:["User","$q","$stateParams","Loading",function(a,b,c,d){d.show();var e=b.defer();return a.get(c.id).$loaded().then(function(a){d.hide(),a.provider?e.resolve(a):e.reject()}),e.promise}]}}}}).state("app.settings",{url:"/settings",views:{menuContent:{templateUrl:"templates/settings.html",controller:"SettingsCtrl",controllerAs:"settings",resolve:{currentAuth:["Auth",function(a){return a.$requireAuth()}]}}}}),b.otherwise("/app/dashboard"),c.tabs.position("top"),c.views.swipeBackEnabled(!0)}function appRate(a,b){var c={language:"en",appName:"Alma",iosURL:"992255249",usesUntilPrompt:5,promptForNewVersion:!0,androidURL:"market://details?id=com.cymbit.Alma"};b.addEventListener("deviceready",function(){a.setPreferences(c)},!1)}function appIdentify(a){a.identify({app_id:"e1f80125",api_key:"78e1608ca9a8dad91cc3b4f896981b65d82055083a70cee2"})}function appRun(a,b,c){c.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()}),a.$on("$routeChangeError",function(a,c,d,e){"AUTH_REQUIRED"===e&&b.path("/dashboard")})}function errSrc(){function a(a,b,c){b.bind("error",function(){c.src!==c.errSrc&&(c.$set("src",c.errSrc),c.$set("class","missingImage"))})}var b={link:a};return b}function LoadingService(a,b){function c(){b.start(),b.inc(),a.show({animation:"fade-in",hideOnStateChange:!0,showBackdrop:!1})}function d(){a.hide(),b.complete()}var e={show:c,hide:d};return e}function AuthService(a,b){var c=new Firebase(b.FIREBASE_URL+"/url");return a(c)}function UserService(a,b){return{ref:function(a){return new Firebase(b.FIREBASE_URL+"Users/"+a)},get:function(b){return a(this.ref(b))},update:function(a){return this.ref(a.id).update(a)}}}function PlayerService(a,b,c){return{ref:function(a){return new Firebase(c.FIREBASE_URL+"Player/"+a)},get:function(b){return a(this.ref(b))},update:function(a){return this.ref(a.id).update(a)},refConnected:function(a){return this.ref(a).child("connected")},getConnected:function(a){return b(this.refConnected(a))},getConnected2:function(a,c){return b(this.refConnected(a).child(c))}}}function ArtistService(a,b,c,d,e){function f(f){var g=a.defer();return d.show(),b({method:"GET",url:e.apiEndpoint+"artists/id/"+f}).success(function(a){d.hide(),g.resolve({id:a.discogs_id,name:a.name,slug:a.slug,img:a.image,convertedSlug:c.convertSlug(a.name,a.slug),artistStyles:c.convertSlug(a.name,a.slug).indexOf("logo_missing.png")>-1?"emptyArtist":"",checkedImage:c.checkImage(a.image),videography:a.artist_videos.videos,featured:a.featured_artist_videos.videos,style:{"background-image":"url("+c.checkImage(a.image)+")"}})}).error(function(){g.reject()}),g.promise}function g(c){d.show();var g=a.defer();return b({method:"GET",url:e.apiEndpoint+"artists/slug/"+c}).success(function(a){if(a.results.length)for(var b=0;b<a.results.length;b++)a.results[b].slug===c&&(d.hide(),g.resolve(f(a.results[b].id)))}).error(function(){g.reject()}),g.promise}function h(c){var f=a.defer();return d.show(),b({method:"GET",url:e.apiEndpoint+"artists/bio/"+c}).success(function(a){d.hide(),f.resolve(a)}).error(function(){f.reject()}),f.promise}function i(c){var f=a.defer();return d.show(),b({method:"GET",url:e.apiEndpoint+"artists/related/"+c}).success(function(a){d.hide(),f.resolve(a)}).error(function(){f.reject()}),f.promise}var j={getInfo:f,getSlug:g,getBio:h,getRelated:i};return j}function QueueService(a,b,c,d,e){function f(a){return c(d.ref(a).child("queue"))}function g(a,b){return f(a).$add(b)}function h(a){}function i(a){}var j={get:f,check:h,remove:i,add:g};return j}function UtilsService(){function a(a){return"jpg"===a.slice(-3)?a.indexOf("http://imvdb.com/")>-1?a.substr(17):a:"images/logo_missing.png"}function b(a,b){return null!==a&&void 0!==a&&""!==a?a:null!==b&&void 0!==b&&""!==b?isNaN(b)?b.replace("-"," ").replace("-"," ").replace(/\w\S*/g,function(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()}):b:""}function c(a){return a.toLowerCase().replace(/ /g,"-").replace(/[^\w-]+/g,"")}function d(a,b){var c=.621371,d=1.60934;return Math.round(100*("mi"===a?b*c:b*d))/100}var e={checkImage:a,convertSlug:b,toSlug:c,unitConvert:d};return e}function AppCtrl(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){function p(){}function q(){}var r=this;d.fromTemplateUrl("templates/modal/login.tmpl.html",{scope:a,controller:"LoginCtrl",animation:"slide-in-up"}).then(function(a){r.modal=a,r.login={}}),r.auth=k,r.user=n,r.auth.$onAuth(function(a){a&&o.isUndefined(r.user)&&("password"===a.provider?l.get(a.uid).$loaded().then(function(a){r.user=a,b.user=r.user}):(r.user=a[a.provider],b.user=r.user))}),b.openLogin=function(){window.cordova&&window.cordova.plugins.Keyboard&&f.disableScroll(!0),r.modal.show(),r.login.title="Login",e.enableSlide(!1)},r.signupPage=function(){r.login.title="Signup",e.slide(0)},r.loginPage=function(){r.login.title="Login",e.slide(1)},b.closeLogin=function(){r.modal.hide().then(function(){window.cordova&&window.cordova.plugins.Keyboard&&f.disableScroll(!1)})},r.logout=function(){g.confirm("Are you sure you want to logout?","Alma").then(function(a){if(1===a){h.isOpenLeft()===!0&&h.toggleLeft(),j.$reset(),k.$unauth(),delete r.user;var b=i.currentView();"app.settings"!==b.stateName&&"app.profile"!==b.stateName||c.transitionTo("app.dashboard"),i.nextViewOptions({historyRoot:!0}),g.alert("You have been successfully logged out","Alma")}})},document.addEventListener("resume",p,!1),document.addEventListener("pause",q,!1)}function LoginCtrl(a,b,c,d,e){var f=this;f.auth=c,f.signup={form:{}},f.login={form:{}},f.login.submit=function(){f.login.form.$valid&&(e.show(),c.$authWithPassword({email:f.login.form.lemail.$viewValue,password:f.login.form.lpassword.$viewValue}).then(function(b){d.update(b.password).then(function(){f.login={},f.signup={},a.closeLogin(),e.hide()})["catch"](function(a){f.login.error=a,e.hide()})})["catch"](function(a){f.login.error=a,e.hide()}))},f.signup.submit=function(){f.signup.form.$valid&&c.$createUser({email:f.signup.form.semail.$viewValue,password:f.signup.form.spassword.$viewValue}).then(function(){c.$authWithPassword({email:f.signup.form.semail.$viewValue,password:f.signup.form.spassword.$viewValue}).then(function(b){b.password.id=b.uid,b.password.accessToken=b.token,b.password.displayName=f.signup.form.sname.$viewValue,b.password.provider="Password",d.update(b.password).then(function(){f.login={},f.signup={},a.closeLogin(),e.hide()})["catch"](function(a){f.signup.error=a,e.hide()})})["catch"](function(a){f.signup.error=a,e.hide()})})["catch"](function(a){f.signup.error=a,e.hide()})},f.facebook=function(){function b(b){b.facebook.provider="facebook",d.update(b.facebook).then(function(){a.closeLogin(),e.hide()})}c.$authWithOAuthPopup("facebook",{scope:"public_profile, email, user_friends, user_birthday"}).then(function(a){b(a)})["catch"](function(a){"TRANSPORT_UNAVAILABLE"===a.code&&c.$authWithOAuthPopup("facebook",{scope:"public_profile, email, user_friends, user_birthday"}).then(function(a){b(a)})})},f.twitter=function(){function b(b){b.twitter.provider="twitter",d.update(b.twitter).then(function(){a.closeLogin(),e.hide()})}c.$authWithOAuthPopup("twitter").then(function(a){b(a)})["catch"](function(a){"TRANSPORT_UNAVAILABLE"===a.code&&c.$authWithOAuthPopup("twitter").then(function(a){b(a)})})},f.forgotPassword=function(){f.login.form.lemail.$valid&&c.$resetPassword({email:f.login.form.lemail.$viewValue}).then(function(){b.alert("Password reset email sent successfully!","Alma","Ok")})["catch"](function(a){b.alert(a,"Alma","Ok")})},f.formChange=function(){f.login.error=null,f.signup.error=null}}function DashboardCtrl(){}function DiscoverCtrl(a,b,c,d,e){var f=this;f.get=function(g){if(e.isUndefined(f[g])){f[g]={loaded:!1},d.show();var h=b(new Firebase(c.FIREBASE_URL+"Discover/"+g));h.$loaded(function(){h&&h.tracks&&0!==h.tracks.length&&!moment(new Date(h.date)).isBefore(new Date,"day")?(f[g].tracks=h.tracks,f[g].loaded=!0,d.hide()):a({method:"GET",url:c.apiEndpoint+"tracks/discover/"+g}).success(function(a){f[g].tracks=a,f[g].loaded=!0,d.hide()})})}}}function SearchCtrl(a,b,c,d,e,f,g,h,i,j){function k(){return n[n.action]&&n[n.action].current_page>0?parseInt(n[n.action].current_page,10)+1:1}function l(){var a=n.$storage.search[n.action].indexOf(n.term);-1===a?(n.$storage.search[n.action].unshift(n.term),n.$storage.search[n.action].length>=5&&(n.$storage.search[n.action]=n.$storage.search[n.action].slice(0,5))):n.$storage.search[n.action]=ionic.Utils.arrayMove(n.$storage.search[n.action],0,a)}function m(a){h.show(),b({method:"GET",url:i.apiEndpoint+"search",params:{pg:a,q:n.term,s:n.action}}).success(function(b){a>1?(e.merge(n[n.action],b,function(a,b){return e.isArray(a)?a.concat(b):void 0}),n[n.action].current_page=b.current_page,n[n.action].loaded=!0):(n[n.action]={results:b.results,current_page:b.current_page,total_pages:b.total_pages,loaded:!0,maxed:!1},1===g.selectedIndex()&&(n[n.action].resultsTop=e.filter(b.results,function(a){return n.convertSlug(a.name,a.slug).toLowerCase().indexOf(n.term.toLowerCase())>-1}),n[n.action].results=e.filter(b.results,function(a){return-1===n.convertSlug(a.name,a.slug).toLowerCase().indexOf(n.term.toLowerCase())}),e.isEmpty(n[n.action].resultsTop)&&delete n[n.action].resultsTop)),l(),h.hide()})}var n=this;n.term="",n.changed=!1,n.action=0===g.selectedIndex()?"videos":"entities",n.$storage=c.$default({search:{videos:[],entities:[]}}),a.$watch(angular.bind(this,function(){return this.term}),function(a){a&&a.length>2&&(n.changed=!0,m(1))}),n.set=function(a){n.term=a},n.load=function(){parseInt(n[n.action].current_page,10)!==parseInt(n[n.action].total_pages,10)?m(k()):n[n.action].maxed=!0,d(function(){a.$broadcast("scroll.infiniteScrollComplete")},500)},n.onChange=function(a){n.action=a,n.changed&&(m(k()),n.changed=!1)},n.select=function(a){},n.checkImage=function(a){return j.checkImage(a)},n.convertSlug=function(a,b){return j.convertSlug(a,b)},n.getKeys=function(a){13===a.which&&window.cordova&&window.cordova.plugins.Keyboard&&f.isVisible()&&f.close()}}function QueueCtrl(a,b,c,d,e,f){var g=this;b.$watch("user.connected",function(a){a&&f.get(a.player).$loaded().then(function(a){b.queueList=a})}),d.fromTemplateUrl("templates/modal/queue.tmpl.html",{scope:a,controller:"QueueCtrl",controllerAs:"queue",animation:"slide-in-up"}).then(function(a){g.modal=a}),g["goto"]=function(a){g.close(),c.transitionTo("app.artist",{action:"slug",artistId:a})},g.close=function(){g.modal.hide().then(function(){window.cordova&&window.cordova.plugins.Keyboard&&e.disableScroll(!1)})},g.open=function(){window.cordova&&window.cordova.plugins.Keyboard&&e.disableScroll(!0),g.modal.show()}}function ArtistCtrl(a,b,c,d,e,f,g){var h=this;h.info=c,h.user=g,h.getBio=function(){h.bio||d.getBio(h.info.convertedSlug).the(function(a){h.bio=a})},h.getRelated=function(){h.related||d.getRelated(h.info.convertedSlug).then(function(a){h.related=a})},h.contact=function(a){console.log(a)},h.toSlug=function(a){return f.toSlug(a)},a.queue=function(a){h.user&&h.user.connected.player&&b.confirm("Are you sure you want add this song?","Alma").then(function(b){1===b&&e.add(h.user.connected.player,a).then(function(a){console.log(a)})})}}function VenueCtrl(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var q=this;q.auth=k,q.user={},q.players={},q.loaded=!1,q.manual=!1;var r=new GeoFire(new Firebase(l.FIREBASE_URL+"Locations/Player"));q.user=p,a.$watch(angular.bind(this,function(){return this.user.location}),function(a){if(!i.isUndefined(a)){var b={id:q.user.id,location:q.user.location};m.update(b);var c=r.query({center:[a.lat,a.lng],radius:24});c.on("ready",function(){j.hide(),q.loaded=!0}),c.on("key_entered",function(a,b,c){o.get(a).$loaded().then(function(a){a.distance=c,q.players[a.$id]=a})})}}),q.getLocation=function(){j.show(),e.getCurrentPosition({timeout:1e4,enableHighAccuracy:!1}).then(function(a){q.user.location={lat:a.coords.latitude,lng:a.coords.longitude}},function(){a.$broadcast("scroll.refreshComplete"),j.hide(),q.loaded=!0})},q.unitConvert=function(a,b){return n.unitConvert(a,b)},q.refresh=function(){q.getLocation()},q.reset=function(){q.manual=!0,h.scrollBottom(!0)},q.find=function(a){j.show(),c.get("http://nominatim.openstreetmap.org/search",{params:{q:a,format:"json",addressdetails:1}}).then(function(a){a.data[0]&&(q.players=[],q.user.location={lat:parseFloat(a.data[0].lat),lng:parseFloat(a.data[0].lon)},q.manual=!1,h.scrollTop(!0)),j.hide()})},q.join=function(a){function c(){o.getConnected(a.$id).$add(q.user.id).then(function(c){var d={id:q.user.id,connected:{id:c.key(),player:a.$id}};m.update(d),f.alert("You have succesfully connect to this player","Alma").then(function(){b.transitionTo("app.dashboard"),g.nextViewOptions({historyRoot:!0})})})}function d(a,b){if(i.isNull(a.$getRecord(q.user.connected.id)))b();else{var c=a.$getRecord(q.user.connected.id);a.$remove(c).then(function(){var a={id:q.user.id,connected:null};m.update(a),b()},function(a){console.log(a)})}}f.confirm("Are you sure you want to connect to this player?","Alma",["Connect","Cancel"]).then(function(b){1===b&&o.getConnected(a.$id).$loaded().then(function(a){q.user.connected.id?(i.isNull(a.$getRecord(q.user.connected.id))||q.user.connected.id!==a.$getRecord(q.user.connected.id).$id)&&d(a,function(){c()}):c()})})},q.getLocation()}function ProfileCtrl(a){var b=this;b.user=a}function SettingsCtrl(a,b,c,d,e,f,g,h,i,j,k){var l=this;l.user=k,l.submit=function(){function b(){l.form.email.$dirty&&h.$changeEmail({oldEmail:"my@email.com",newEmail:l.form.email.$viewValue,password:"mypassword"}).then(function(){console.log("Email changed successfully!")})["catch"](function(a){console.error("Error: ",a)})}function c(){l.form.password.$dirty&&h.$changePassword({email:l.form.email.$viewValue,oldPassword:"mypassword",newPassword:l.form.password.$viewValue}).then(function(){console.log("Password changed successfully!")})["catch"](function(a){console.error("Error: ",a)})}function d(){l.form.gender.$dirty&&(l.user.gender=l.form.gender.$viewValue,i.update(l.user).then(function(a){console.log(a)}))}l.form.$valid&&a.all([b(),c(),d()]).then(function(){console.log("done")})["catch"](function(){console.log("error")})},l.deleteAccount=function(){c.confirm("Deleting your account will also remove all of your library data. This is permanent and cannout be undone. Are your sure?","Delete Your Account",["Yes","Cancel"]).then(function(a){1===a&&(j.show(),h.$removeUser({email:l.user.email,password:"mypassword"}).then(function(){f.$reset(),b.transitionTo("app.dashboard"),g.clearHistory(),j.hide(),delete l.user})["catch"](function(a){console.error("Error: ",a)}))})}}angular.module("arcanine",["ionic","arcanine.controllers","arcanine.config","arcanine.directives","arcanine.services","ngCordova","angularMoment","ngLodash","ngStorage","angular-loading-bar","ngTextTruncate","monospaced.elastic","720kb.fx","firebase"]),angular.module("arcanine.config",[]).constant("ENV",{name:"production",apiEndpoint:"http://arbok.herokuapp.com/api/",FIREBASE_URL:"https://arbok.firebaseio.com/"}),appRoute.$inject=["$stateProvider","$urlRouterProvider","$ionicConfigProvider"],angular.module("arcanine.config").config(appRoute),appRun.$inject=["$rootScope","$location","$ionicPlatform"],angular.module("arcanine.config").run(appRun),angular.module("arcanine.directives",[]).directive("errSrc",errSrc);var watchMenu=function(a,b){function c(c){a(function(){c.$watch(function(){return b.getOpenRatio()},function(a){c.data=a,c.ratio=a>=.5})})}var d={link:c,restrict:"A"};return d};watchMenu.$inject=["$timeout","$ionicSideMenuDelegate"],angular.module("arcanine.directives").directive("watchMenu",watchMenu),LoadingService.$inject=["$ionicLoading","cfpLoadingBar"],angular.module("arcanine.services",[]).factory("Loading",LoadingService),AuthService.$inject=["$firebaseAuth","ENV"],angular.module("arcanine.services").factory("Auth",AuthService),UserService.$inject=["$firebaseObject","ENV"],angular.module("arcanine.services").factory("User",UserService),PlayerService.$inject=["$firebaseObject","$firebaseArray","ENV"],angular.module("arcanine.services").factory("Player",PlayerService),ArtistService.$inject=["$q","$http","Utils","Loading","ENV"],angular.module("arcanine.services").factory("ArtistService",ArtistService),QueueService.$inject=["$q","$http","$firebaseArray","Player","ENV"],angular.module("arcanine.services").factory("Queue",QueueService),angular.module("arcanine.services").factory("Utils",UtilsService),AppCtrl.$inject=["$scope","$rootScope","$state","$ionicModal","$ionicSlideBoxDelegate","$cordovaKeyboard","$cordovaDialogs","$ionicSideMenuDelegate","$ionicHistory","$localStorage","Auth","User","Queue","currentAuth","lodash"],angular.module("arcanine.controllers",[]).controller("AppCtrl",AppCtrl),LoginCtrl.$inject=["$rootScope","$cordovaDialogs","Auth","User","Loading"],angular.module("arcanine.controllers").controller("LoginCtrl",LoginCtrl),angular.module("arcanine.controllers").controller("DashboardCtrl",DashboardCtrl),DiscoverCtrl.$inject=["$http","$firebaseObject","ENV","Loading","lodash"],angular.module("arcanine.controllers").controller("DiscoverCtrl",DiscoverCtrl),SearchCtrl.$inject=["$scope","$http","$localStorage","$timeout","lodash","$cordovaKeyboard","$ionicTabsDelegate","Loading","ENV","Utils"],angular.module("arcanine.controllers").controller("SearchCtrl",SearchCtrl),QueueCtrl.$inject=["$scope","$rootScope","$state","$ionicModal","$cordovaKeyboard","Queue"],angular.module("arcanine.controllers").controller("QueueCtrl",QueueCtrl),ArtistCtrl.$inject=["$rootScope","$cordovaDialogs","Artist","ArtistService","Queue","Utils","currentAuth"],angular.module("arcanine.controllers").controller("ArtistCtrl",ArtistCtrl),VenueCtrl.$inject=["$scope","$state","$http","$firebaseArray","$cordovaGeolocation","$cordovaDialogs","$ionicHistory","$ionicScrollDelegate","lodash","Loading","Auth","ENV","User","Utils","Player","currentAuth"],angular.module("arcanine.controllers").controller("VenueCtrl",VenueCtrl),ProfileCtrl.$inject=["profileUser"],angular.module("arcanine.controllers").controller("ProfileCtrl",ProfileCtrl),SettingsCtrl.$inject=["$q","$state","$cordovaDialogs","$cordovaAppVersion","$cordovaEmailComposer","$localStorage","$ionicHistory","Auth","User","Loading","currentAuth"],angular.module("arcanine.controllers").controller("SettingsCtrl",SettingsCtrl);