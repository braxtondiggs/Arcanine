"use strict";function appRoute(a,b,c){a.state("app",{url:"/app","abstract":!0,templateUrl:"templates/menu.html",controller:"AppCtrl",controllerAs:"main",resolve:{currentAuth:["$rootScope","User","$q","Auth","Queue","Loading",function(a,b,c,d,e,f){f.show();var g=c.defer();return d.$waitForAuth().then(function(c){if(c){var d="password"!==c.provider?c[c.provider].id:c.uid;b.get(d).$loaded().then(function(b){a.user=b,f.hide(),g.resolve(b)})}else f.hide(),g.resolve()}),g.promise}]}}).state("app.dashboard",{url:"/dashboard",views:{menuContent:{templateUrl:"templates/dashboard.html",controller:"DashboardCtrl",controllerAs:"dashboard"}}}).state("app.discover",{url:"/discover",views:{menuContent:{templateUrl:"templates/discover.html",controller:"DiscoverCtrl",controllerAs:"discover"}}}).state("app.search",{url:"/search",views:{menuContent:{templateUrl:"templates/search.html",controller:"SearchCtrl",controllerAs:"search"}}}).state("app.artist",{url:"/artist/:action/:artistId",views:{menuContent:{templateUrl:"templates/artist.html",controller:"ArtistCtrl",controllerAs:"artist",resolve:{Artist:["$q","$stateParams","ArtistService","$ionicPopup",function(a,b,c,d){function e(){d.alert({template:"We are having trouble getting this artists information right now. Our data is constantly changing, so check back later",title:"Alma - Error"})}var f=a.defer();return"id"===b.action?c.getInfo(b.artistId).then(function(a){f.resolve(a)},function(a){e(),f.reject(a)}):"slug"===b.action&&c.getSlug(b.artistId).then(function(a){f.resolve(a)},function(a){e(),f.reject(a)}),f.promise}]}}}}).state("app.venue",{url:"/venue",views:{menuContent:{templateUrl:"templates/venue.html",controller:"VenueCtrl",controllerAs:"venue"}}}).state("app.profile",{url:"/profile/:id",views:{menuContent:{templateUrl:"templates/profile.html",controller:"ProfileCtrl",controllerAs:"profile",resolve:{profileUser:["User","$q","$stateParams","Loading",function(a,b,c,d){d.show();var e=b.defer();return a.get(c.id).$loaded().then(function(a){d.hide(),a.provider?e.resolve(a):e.reject()}),e.promise}]}}}}).state("app.settings",{url:"/settings",views:{menuContent:{templateUrl:"templates/settings.html",controller:"SettingsCtrl",controllerAs:"settings",resolve:{currentAuth:["Auth",function(a){return a.$requireAuth()}]}}}}),b.otherwise("/app/dashboard"),c.tabs.position("top"),c.views.swipeBackEnabled(!0)}function appRate(a,b){var c={language:"en",appName:"Alma",iosURL:"992255249",usesUntilPrompt:5,promptForNewVersion:!0,androidURL:"market://details?id=com.cymbit.Alma"};b.addEventListener("deviceready",function(){a.setPreferences(c)},!1)}function appIdentify(a){a.identify({app_id:"e1f80125",api_key:"78e1608ca9a8dad91cc3b4f896981b65d82055083a70cee2"})}function appRun(a,b,c){c.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()}),a.$on("$routeChangeError",function(a,c,d,e){"AUTH_REQUIRED"===e&&b.path("/dashboard")})}function errSrc(){function a(a,b,c){b.bind("error",function(){c.src!==c.errSrc&&(c.$set("src",c.errSrc),c.$set("class","missingImage"))})}var b={link:a};return b}function LoadingService(a,b){function c(){b.start(),b.inc(),a.show({animation:"fade-in",hideOnStateChange:!0,showBackdrop:!1})}function d(){a.hide(),b.complete()}var e={show:c,hide:d};return e}function AuthService(a,b){var c=new Firebase(b.FIREBASE_URL+"/url");return a(c)}function UserService(a,b,c,d,e,f){return{ref:function(b){var c=b||(a.user&&a.user.connected?a.user.connected:null);return new Firebase(f.FIREBASE_URL+"Users/"+c)},get:function(b){var c=b||a.user.id;return d(this.ref(c))},update:function(a){return this.ref(a.id).update(a)},auth:function(){var c=b.defer(),d=a.user;return d?c.resolve():e.alert({template:"You need to be logged in inorder to complete this action",title:"Alma - Error"}).then(function(){a.openLogin(),c.reject()}),c.promise}}}function PlayerService(a,b,c,d,e,f,g,h){return{ref:function(b){var c=b||(a.user&&a.user.connected?a.user.connected:null);return new Firebase(g.FIREBASE_URL+"Player/"+c)},get:function(c){var d=c||a.user.connected;return b(this.ref(d))},update:function(a){h.auth().then(function(){this.auth().then(function(){return this.ref().update(a)})})},refConnected:function(a){return this.ref(a).child("connected")},getConnected:function(a){return e(this.refConnected(a))},auth:function(){var b=c.defer(),e=a.user;return e.connected?b.resolve():f.alert({template:"You have not connected to an Alma yet.",title:"Alma - Error"}).then(function(){d.transitionTo("app.venue"),b.reject()}),b.promise}}}function ArtistService(a,b,c,d,e){function f(f){var g=a.defer();return d.show(),b({method:"GET",url:e.apiEndpoint+"artists/id/"+f}).success(function(a){d.hide(),g.resolve({id:a.discogs_id,name:a.name,slug:a.slug,img:a.image,convertedSlug:c.convertSlug(a.name,a.slug),artistStyles:c.convertSlug(a.name,a.slug).indexOf("logo_missing.png")>-1?"emptyArtist":"",checkedImage:c.checkImage(a.image),videography:a.artist_videos.videos,featured:a.featured_artist_videos.videos,style:{"background-image":"url("+c.checkImage(a.image)+")"}})}).error(function(){g.reject()}),g.promise}function g(c){d.show();var g=a.defer();return b({method:"GET",url:e.apiEndpoint+"artists/slug/"+c}).success(function(a){if(a.results.length)for(var b=0;b<a.results.length;b++)a.results[b].slug===c&&(d.hide(),g.resolve(f(a.results[b].id)))}).error(function(){g.reject()}),g.promise}function h(c){var f=a.defer();return d.show(),b({method:"GET",url:e.apiEndpoint+"artists/bio/"+c}).success(function(a){d.hide(),f.resolve(a)}).error(function(){f.reject()}),f.promise}function i(c){var f=a.defer();return d.show(),b({method:"GET",url:e.apiEndpoint+"artists/related/"+c}).success(function(a){d.hide(),f.resolve(a)}).error(function(){f.reject()}),f.promise}var j={getInfo:f,getSlug:g,getBio:h,getRelated:i};return j}function QueueService(a,b,c,d,e,f,g,h,i){function j(){return h.ref().child("queue")}function k(a){return j().child(a)}function l(a){return k(a).child("votes")}function m(){return c(j())}function n(a){return c(l(a))}function o(c){h.auth().then(function(){e.confirm({title:"Alma",template:"Are you sure you want add this song?"}).then(function(d){d&&(p(c)?(g.show(),b({method:"GET",url:i.apiEndpoint+"artists/find/"+c.id}).success(function(b){var c=f.filter(b.sources,["source","youtube"]);c.length>0?(b.user={id:a.user.id,name:a.user.displayName},b.priority=0,m().$add(b).then(function(){e.alert({template:"Your song is now in the queue!",title:"Alma"}),g.hide()})):(g.hide(),e.alert({template:"This song could not be added at this time, try again.",title:"Alma - Internal Error"}))})):e.alert({template:"Looks like this song is already in the Queue.",title:"Alma - Error"}))})})}function p(b){return f.isUndefined(f.find(a.queueList,function(a){return a.id===b.id}))}function q(a){return m().$remove(a)}function r(b,c){k(b).once("value",function(b){if(c!==b.child("votes/"+a.user.id+"/status").val()){var d=Boolean(c)?1:-1,e=parseInt(b.val().priority,10)||0;e+=d,b.child("votes/"+a.user.id).ref().set({user:{name:a.user.displayName,image:a.user.profileImageURL},status:c}),b.child("priority").ref().set(e)}})}var s={getVotes:n,get:m,check:p,remove:q,add:o,vote:r};return s}function ChatService(a,b){function c(){return b.ref().child("chat")}function d(){return a(c())}var e={ref:c,get:d};return e}function UtilsService(){function a(a){return"jpg"===a.slice(-3)?a.indexOf("https://imvdb.com/")>-1?a.substr(18):a:"images/logo_missing.png"}function b(a,b){return null!==a&&void 0!==a&&""!==a?a:null!==b&&void 0!==b&&""!==b?isNaN(b)?b.replace("-"," ").replace("-"," ").replace(/\w\S*/g,function(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()}):b:""}function c(a){return a.toLowerCase().replace(/ /g,"-").replace(/[^\w-]+/g,"")}function d(a,b){var c=.621371,d=1.60934;return Math.round(100*("mi"===a?b*c:b*d))/100}var e={checkImage:a,convertSlug:b,toSlug:c,unitConvert:d};return e}function AppCtrl(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){function p(){b.user&&b.user.connected&&(m.ref().child("connected/"+b.user.id).set({name:b.user.displayName,image:b.user.profileImageURL}),m.ref().child("connected/"+b.user.id).onDisconnect().remove())}function q(){}function r(){}var s=this;d.fromTemplateUrl("templates/modal/login.tmpl.html",{scope:a,controller:"LoginCtrl",animation:"slide-in-up"}).then(function(a){s.modal=a,s.login={}}),s.auth=k,b.user=n,s.auth.$onAuth(function(a){if(a&&o.isUndefined(b.user)){var c="password"!==a.provider?a[a.provider].id:a.uid;l.get(c).$loaded().then(function(a){b.user=a,p()})}}),p(),b.openLogin=function(){window.cordova&&window.cordova.plugins.Keyboard&&f.disableScroll(!0),s.modal.show(),s.login.title="Login",e.enableSlide(!1)},s.signupPage=function(){s.login.title="Signup",e.slide(0)},s.loginPage=function(){s.login.title="Login",e.slide(1)},b.closeLogin=function(){s.modal.hide().then(function(){window.cordova&&window.cordova.plugins.Keyboard&&f.disableScroll(!1)})},s.logout=function(){g.confirm({template:"Are you sure you want to logout?",title:"Alma"}).then(function(a){if(a){h.isOpenLeft()===!0&&h.toggleLeft(),j.$reset(),k.$unauth(),delete b.user,delete b.queueList;var d=i.currentView();"app.settings"!==d.stateName&&"app.profile"!==d.stateName||c.transitionTo("app.dashboard"),i.nextViewOptions({historyRoot:!0}),g.alert({template:"You have been successfully logged out",title:"Alma"})}})},document.addEventListener("resume",q,!1),document.addEventListener("pause",r,!1)}function LoginCtrl(a,b,c,d,e){var f=this;f.auth=c,f.signup={form:{}},f.login={form:{}},f.login.submit=function(){f.login.form.$valid&&(e.show(),c.$authWithPassword({email:f.login.form.lemail.$viewValue,password:f.login.form.lpassword.$viewValue}).then(function(b){d.update(b.password).then(function(){f.login={},f.signup={},a.closeLogin(),e.hide()})["catch"](function(a){f.login.error=a,e.hide()})})["catch"](function(a){f.login.error=a,e.hide()}))},f.signup.submit=function(){f.signup.form.$valid&&c.$createUser({email:f.signup.form.semail.$viewValue,password:f.signup.form.spassword.$viewValue}).then(function(){c.$authWithPassword({email:f.signup.form.semail.$viewValue,password:f.signup.form.spassword.$viewValue}).then(function(b){b.password.id=b.uid,b.password.accessToken=b.token,b.password.displayName=f.signup.form.sname.$viewValue,b.password.provider="Password",d.update(b.password).then(function(){f.login={},f.signup={},a.closeLogin(),e.hide()})["catch"](function(a){f.signup.error=a,e.hide()})})["catch"](function(a){f.signup.error=a,e.hide()})})["catch"](function(a){f.signup.error=a,e.hide()})},f.facebook=function(){function b(b){b.facebook.provider="facebook",d.update(b.facebook).then(function(){a.closeLogin(),e.hide()})}c.$authWithOAuthPopup("facebook",{scope:"public_profile, email, user_friends, user_birthday"}).then(function(a){b(a)})["catch"](function(a){"TRANSPORT_UNAVAILABLE"===a.code&&c.$authWithOAuthPopup("facebook",{scope:"public_profile, email, user_friends, user_birthday"}).then(function(a){b(a)})})},f.twitter=function(){function b(b){b.twitter.provider="twitter",d.update(b.twitter).then(function(){a.closeLogin(),e.hide()})}c.$authWithOAuthPopup("twitter").then(function(a){b(a)})["catch"](function(a){"TRANSPORT_UNAVAILABLE"===a.code&&c.$authWithOAuthPopup("twitter").then(function(a){b(a)})})},f.forgotPassword=function(){f.login.form.lemail.$valid&&c.$resetPassword({email:f.login.form.lemail.$viewValue}).then(function(){b.alert({template:"Password reset email sent successfully!",title:"Alma"})})["catch"](function(a){b.alert({template:a,title:"Alma"})})},f.formChange=function(){f.login.error=null,f.signup.error=null}}function DashboardCtrl(a,b,c,d,e,f,g,h,i,j){var k=this;k.loaded=!1,b.user&&b.user.connected&&h.get().$loaded().then(function(a){k.loaded=!0,k.chats=a}),k.tutorial=function(){c.transitionTo("app.venue")},k.submit=function(){k.chatForm.$valid&&i.auth().then(function(){j.show(),k.chats.$add({message:k.chatForm.message.$viewValue,timestamp:Firebase.ServerValue.TIMESTAMP,user:{name:b.user.displayName,image:b.user.profileImageURL,id:b.user.id}}).then(function(){j.hide(),f.scrollBottom(!0),k.message=""})})},k.onHold=function(a){e.show({buttons:[{text:"Delete Message"}],titleText:"Message Options",cancelText:"Cancel",buttonClicked:function(b){switch(b){case 0:i.auth().then(function(){j.show(),k.loaded=!1,k.chats.$remove(a).then(function(){j.hide(),k.loaded=!0})}),d(function(){f.resize()},0)}return!0}})},k.getKeys=function(a){13===a.which&&(a.target.blur(),window.cordova&&window.cordova.plugins.Keyboard&&g.isVisible()&&g.close())},a.$on("$ionicView.enter",function(){f.scrollBottom(!0)})}function DiscoverCtrl(a,b,c,d,e,f){var g=this;g.get=function(f){if(a.isUndefined(g[f])){g[f]={loaded:!1},e.show();var h=c(new Firebase(d.FIREBASE_URL+"Discover/"+f));h.$loaded(function(){h&&h.tracks&&0!==h.tracks.length&&!moment(new Date(h.date)).isBefore(new Date,"day")?g[f].tracks=h.tracks:b({method:"GET",url:d.apiEndpoint+"tracks/discover/"+f}).success(function(a){g[f].tracks=a})}).then(function(){g[f].loaded=!0,e.hide()})}},g.add=function(a){b({method:"GET",url:d.apiEndpoint+"search",params:{pg:1,q:a.slug+" "+a.slugTitle,s:"videos"}}).success(function(a){f.add(a.results[0])})}}function SearchCtrl(a,b,c,d,e,f,g,h,i,j,k){function l(){return o[o.action]&&o[o.action].current_page>0?parseInt(o[o.action].current_page,10)+1:1}function m(){var a=o.$storage.search[o.action].indexOf(o.term);a===-1?(o.$storage.search[o.action].unshift(o.term),o.$storage.search[o.action].length>=5&&(o.$storage.search[o.action]=o.$storage.search[o.action].slice(0,5))):o.$storage.search[o.action]=ionic.Utils.arrayMove(o.$storage.search[o.action],0,a)}function n(a){h.show(),b({method:"GET",url:i.apiEndpoint+"search",params:{pg:a,q:o.term,s:o.action}}).success(function(b){a>1?(e.merge(o[o.action],b,function(a,b){if(e.isArray(a))return a.concat(b)}),o[o.action].current_page=b.current_page,o[o.action].loaded=!0):(o[o.action]={results:b.results,current_page:b.current_page,total_pages:b.total_pages,loaded:!0,maxed:!1},1===g.selectedIndex()&&(o[o.action].resultsTop=e.filter(b.results,function(a){return o.convertSlug(a.name,a.slug).toString().toLowerCase().indexOf(o.term.toLowerCase())>-1}),o[o.action].results=e.filter(b.results,function(a){return o.convertSlug(a.name,a.slug).toString().toLowerCase().indexOf(o.term.toLowerCase())===-1}),e.isEmpty(o[o.action].resultsTop)&&delete o[o.action].resultsTop)),m(),h.hide()})}var o=this;o.term="",o.changed=!1,o.action=0===g.selectedIndex()?"videos":"entities",o.$storage=c.$default({search:{videos:[],entities:[]}}),a.$watch(angular.bind(this,function(){return this.term}),function(a){a&&a.length>2&&(o.changed=!0,n(1))}),o.set=function(a){o.term=a},o.load=function(){parseInt(o[o.action].current_page,10)!==parseInt(o[o.action].total_pages,10)?n(l()):o[o.action].maxed=!0,d(function(){a.$broadcast("scroll.infiniteScrollComplete")},500)},o.onChange=function(a){o.action=a,o.changed&&(n(1),o.changed=!1)},o.select=function(a){k.add(a)},o.checkImage=function(a){return j.checkImage(a)},o.convertSlug=function(a,b){return j.convertSlug(a,b)},o.clear=function(){o.term="",o.videos={},o.entities={},angular.element(document.querySelector("#search"))[0].focus()},o.getKeys=function(a){13===a.which&&(a.target.blur(),window.cordova&&window.cordova.plugins.Keyboard&&f.isVisible()&&f.close())}}function QueueCtrl(a,b,c,d,e,f,g,h){var i=this;b.votes={},b.$watch("user.connected",function(a){a&&h.get().$loaded().then(function(a){b.queueList=a})}),d.fromTemplateUrl("templates/modal/queue.tmpl.html",{scope:a,controller:"QueueCtrl",controllerAs:"queue",animation:"slide-in-up"}).then(function(a){i.modal=a}),i["goto"]=function(a){i.close(),c.transitionTo("app.artist",{action:"slug",artistId:a})},i.close=function(){i.modal.hide().then(function(){window.cordova&&window.cordova.plugins.Keyboard&&e.disableScroll(!1)})},i.open=function(){window.cordova&&window.cordova.plugins.Keyboard&&e.disableScroll(!0),i.modal.show()},i.remove=function(a){f.confirm({template:"Are you sure you want to delete this video from the queue?",title:"Alma",cancelText:"Cancel",okText:"Delete"}).then(function(b){b&&h.remove(a).then(function(){f.alert({template:"Your video has successfully been removed from the queue",title:"Alma"})})})},i.vote=function(a,b){h.vote(a.$id,b)},i.status=function(a){return!!angular.isDefined(a)&&!a}}function ArtistCtrl(a,b,c,d,e){var f=this;f.info=b,f.getBio=function(){f.bio||c.getBio(f.info.convertedSlug).the(function(a){f.bio=a})},f.getRelated=function(){f.related||c.getRelated(f.info.convertedSlug).then(function(a){f.related=a})},f.contact=function(a){console.log(a)},f.toSlug=function(a){return e.toSlug(a)},a.queue=function(a){d.add(a)}}function VenueCtrl(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var q=this;q.auth=l,q.players={},q.loaded=!1,q.manual=!1,q.location={};var r=new GeoFire(new Firebase(m.FIREBASE_URL+"Locations/Player"));a.$watch(angular.bind(this,function(){return this.location}),function(c){if(!j.isEmpty(c)){if(b.user&&b.user.id){var d={id:b.user.id,location:q.location};n.update(d)}var e=r.query({center:[c.lat,c.lng],radius:24});e.on("ready",function(){k.hide(),q.loaded=!0,q.manual=!1,a.$broadcast("scroll.refreshComplete")}),e.on("key_entered",function(a,b,c){p.get(a).$loaded().then(function(a){a.distance=c,q.players[a.$id]=a})})}}),q.getLocation=function(){k.show(),f.getCurrentPosition({timeout:1e4}).then(function(a){q.location={lat:a.coords.latitude,lng:a.coords.longitude}})},q.unitConvert=function(a,b){return o.unitConvert(a,b)},q.refresh=function(){q.loaded=!1,q.getLocation()},q.reset=function(){q.manual=!0,i.scrollBottom(!0)},q.find=function(a){k.show(),d.get("http://nominatim.openstreetmap.org/search",{params:{q:a,format:"json",addressdetails:1}}).then(function(a){a.data[0]&&(q.players=[],q.location={lat:parseFloat(a.data[0].lat),lng:parseFloat(a.data[0].lon)},q.manual=!1,i.scrollTop(!0)),k.hide()})},q.join=function(a){function d(){p.ref(a.$id).child("connected/"+b.user.id).set({name:b.user.displayName,image:b.user.profileImageURL}).then(function(){var d={id:b.user.id,connected:a.$id};n.update(d),g.alert({template:"You have succesfully connect to this player",title:"Alma"}).then(function(){c.transitionTo("app.dashboard"),h.nextViewOptions({historyRoot:!0})})})}function e(a,c){if(j.isNull(a.$getRecord(b.user.id)))c();else{var d=a.$getRecord(b.user.id);a.$remove(d).then(function(){var a={id:b.user.id,connected:null};n.update(a),c()},function(a){console.log(a)})}}g.confirm({template:"Are you sure you want to connect to this player?",title:"Alma",okText:"Connect",cancelText:"Cancel"}).then(function(c){c&&p.getConnected(a.$id).$loaded().then(function(a){b.user.connected?(j.isNull(a.$getRecord(b.user.id))||b.user.id!==a.$getRecord(b.user.id).$id)&&e(a,function(){d()}):d()})})},q.getLocation()}function ProfileCtrl(a){var b=this;b.user=a}function SettingsCtrl(a,b,c,d,e,f,g,h,i,j,k,l){var m=this;a.user=l,m.submit=function(){function c(){m.form.email.$dirty&&i.$changeEmail({oldEmail:"my@email.com",newEmail:m.form.email.$viewValue,password:"mypassword"}).then(function(){console.log("Email changed successfully!")})["catch"](function(a){console.error("Error: ",a)})}function d(){m.form.password.$dirty&&i.$changePassword({email:m.form.email.$viewValue,oldPassword:"mypassword",newPassword:m.form.password.$viewValue}).then(function(){console.log("Password changed successfully!")})["catch"](function(a){console.error("Error: ",a)})}function e(){m.form.gender.$dirty&&(a.user.gender=m.form.gender.$viewValue,j.update(a.user).then(function(a){console.log(a)}))}m.form.$valid&&b.all([c(),d(),e()]).then(function(){console.log("done")})["catch"](function(){console.log("error")})},m.deleteAccount=function(){d.confirm({template:"Deleting your account will also remove all of your library data. This is permanent and cannout be undone. Are your sure?",title:"Delete Your Account",cancelText:"Cancel",okText:"Yes"}).then(function(b){b&&(k.show(),i.$removeUser({email:a.user.email,password:"mypassword"}).then(function(){g.$reset(),c.transitionTo("app.dashboard"),h.clearHistory(),k.hide(),delete a.user,delete a.queueList})["catch"](function(a){console.error("Error: ",a)}))})}}angular.module("arcanine",["ionic","arcanine.controllers","arcanine.config","arcanine.directives","arcanine.services","ngCordova","angularMoment","ngLodash","ngStorage","angular-loading-bar","ngTextTruncate","monospaced.elastic","720kb.fx","firebase","ngGeolocation"]),angular.module("arcanine.config",[]).constant("ENV",{name:"production",apiEndpoint:"https://arbok.herokuapp.com/api/",FIREBASE_URL:"https://arbokold.firebaseio.com/"}),appRoute.$inject=["$stateProvider","$urlRouterProvider","$ionicConfigProvider"],angular.module("arcanine.config").config(appRoute),appRun.$inject=["$rootScope","$location","$ionicPlatform"],angular.module("arcanine.config").run(appRun),angular.module("arcanine.directives",[]).directive("errSrc",errSrc);var watchMenu=function(a,b){function c(c){a(function(){c.$watch(function(){return b.getOpenRatio()},function(a){c.data=a,c.ratio=a>=.5})})}var d={link:c,restrict:"A"};return d};watchMenu.$inject=["$timeout","$ionicSideMenuDelegate"],angular.module("arcanine.directives").directive("watchMenu",watchMenu),LoadingService.$inject=["$ionicLoading","cfpLoadingBar"],angular.module("arcanine.services",[]).factory("Loading",LoadingService),AuthService.$inject=["$firebaseAuth","ENV"],angular.module("arcanine.services").factory("Auth",AuthService),UserService.$inject=["$rootScope","$q","$state","$firebaseObject","$ionicPopup","ENV"],angular.module("arcanine.services").factory("User",UserService),PlayerService.$inject=["$rootScope","$firebaseObject","$q","$state","$firebaseArray","$ionicPopup","ENV","User"],angular.module("arcanine.services").factory("Player",PlayerService),ArtistService.$inject=["$q","$http","Utils","Loading","ENV"],angular.module("arcanine.services").factory("ArtistService",ArtistService),QueueService.$inject=["$rootScope","$http","$firebaseArray","$firebaseObject","$ionicPopup","lodash","Loading","Player","ENV"],angular.module("arcanine.services").factory("Queue",QueueService),ChatService.$inject=["$firebaseArray","Player"],angular.module("arcanine.services").factory("Chat",ChatService),angular.module("arcanine.services").factory("Utils",UtilsService),AppCtrl.$inject=["$scope","$rootScope","$state","$ionicModal","$ionicSlideBoxDelegate","$cordovaKeyboard","$ionicPopup","$ionicSideMenuDelegate","$ionicHistory","$localStorage","Auth","User","Player","currentAuth","lodash"],angular.module("arcanine.controllers",[]).controller("AppCtrl",AppCtrl),LoginCtrl.$inject=["$rootScope","$ionicPopup","Auth","User","Loading"],angular.module("arcanine.controllers").controller("LoginCtrl",LoginCtrl),DashboardCtrl.$inject=["$scope","$rootScope","$state","$timeout","$ionicActionSheet","$ionicScrollDelegate","$cordovaKeyboard","Chat","Player","Loading"],angular.module("arcanine.controllers").controller("DashboardCtrl",DashboardCtrl),DiscoverCtrl.$inject=["lodash","$http","$firebaseObject","ENV","Loading","Queue"],angular.module("arcanine.controllers").controller("DiscoverCtrl",DiscoverCtrl),SearchCtrl.$inject=["$scope","$http","$localStorage","$timeout","lodash","$cordovaKeyboard","$ionicTabsDelegate","Loading","ENV","Utils","Queue"],angular.module("arcanine.controllers").controller("SearchCtrl",SearchCtrl),QueueCtrl.$inject=["$scope","$rootScope","$state","$ionicModal","$cordovaKeyboard","$ionicPopup","lodash","Queue"],angular.module("arcanine.controllers").controller("QueueCtrl",QueueCtrl),ArtistCtrl.$inject=["$rootScope","Artist","ArtistService","Queue","Utils"],angular.module("arcanine.controllers").controller("ArtistCtrl",ArtistCtrl),VenueCtrl.$inject=["$scope","$rootScope","$state","$http","$firebaseArray","$geolocation","$ionicPopup","$ionicHistory","$ionicScrollDelegate","lodash","Loading","Auth","ENV","User","Utils","Player"],angular.module("arcanine.controllers").controller("VenueCtrl",VenueCtrl),ProfileCtrl.$inject=["profileUser"],angular.module("arcanine.controllers").controller("ProfileCtrl",ProfileCtrl),SettingsCtrl.$inject=["$rootScope","$q","$state","$ionicPopup","$cordovaAppVersion","$cordovaEmailComposer","$localStorage","$ionicHistory","Auth","User","Loading","currentAuth"],angular.module("arcanine.controllers").controller("SettingsCtrl",SettingsCtrl);