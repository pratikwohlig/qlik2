
    myApp.controller('HomeCtrl', function ($scope,$rootScope, TemplateService, NavigationService,Menuservice, $timeout,$http,apiService,$state) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();


        
    })
    
    

    
    .controller('FormCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/form.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        // $scope.data = {
        //     name: "Chintan",
        //     "age": 20,
        //     "email": "chinyan@wohlig.com",
        //     "query": "query"
        // };
        $scope.submitForm = function (data) {
            console.log("This is it");
            return new Promise(function (callback) {
                $timeout(function () {
                    callback();
                }, 5000);
            });
        };
    })

    
    .controller('SpeechRecognitionController', function ($scope, $rootScope) {

        var vm = this;

        vm.displayTranscript = displayTranscript;
        vm.transcript = '';
        function displayTranscript() {
            vm.transcript = $rootScope.transcript;
            console.log("transcript",$rootScope.transcript);
            $(".chatinput").val($rootScope.transcript);
            $rootScope.pushMsg(0,$rootScope.transcript);
            //This is just to refresh the content in the view.
            if (!$scope.$$phase) {
                $scope.$digest();
                console.log("transcript",$rootScope.transcript);
            }
        }
        $rootScope.startspeech = function() {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            console.log("new func");
        // recognition.onresult = function(event) 
            { 
                console.log(event); 
            }
            recognition.start();
        };
        /**
         * Handle the received transcript here.
         * The result from the Web Speech Recognition will
         * be set inside a $rootScope variable. You can use it
         * as you want.
         */
        $rootScope.speechStarted = function() {
            console.log("speech Started");
        };
    

    })
    .controller('ChatCtrl', function ($scope, $rootScope,TemplateService, NavigationService, $timeout,$http,apiService,$state,$uibModal,Menuservice,$sce,$base64) {
        
        $rootScope.autocompletelist = [];
        $rootScope.chatOpen = false;
        $rootScope.showTimeoutmsg = false;
        $rootScope.firstMsg=false;
        $rootScope.chatmsg = "";
        $rootScope.chatmsgid = "";
        
        $rootScope.msgSelected = false;
        var mylist = $.jStorage.get("chatlist");
        //var mylist = [];
        if(!mylist || mylist == null)
            $rootScope.chatlist = [];
        else
        {
            $rootScope.chatlist = $.jStorage.get("chatlist");
            //$rootScope.chatlist = mylist;
        }
        $rootScope.autolistid="";
        $rootScope.autolistvalue="";
        $rootScope.showMsgLoader=false;
        $rootScope.rate_count= 0;
        $scope.formSubmitted = false;
        $scope.loginerror=0;
        $rootScope.isLoggedin = false;
        if($.jStorage.get("isLoggedin"))
            $rootScope.isLoggedin = true;
        $scope.login = function(username,password)
        {
            
            $scope.formData = {username:username,password:sha256_digest(password)};
            
            apiService.login($scope.formData).then(function (callback){
                $.jStorage.flush();
                //if(username == "admin@exponentiadata.com" && password == "admin")
                if(callback.data.value)
                {
                    $.jStorage.set("id", callback.data.data._id);
                    $.jStorage.set("fname", callback.data.data.fname);
                    $.jStorage.set("lname", callback.data.data.lname);
                    $.jStorage.set("email", callback.data.data.email);
                    $.jStorage.set("branch", callback.data.data.branch);
                    $.jStorage.set("access_role", callback.data.data.accessrole);
                    $.jStorage.set("sessionid", callback.data.data._id);
                    $.jStorage.set("isLoggedin", true);
                    $rootScope.chatlist=[];
                    $rootScope.isLoggedin = true;
                    $rootScope.firstMsg = true;  
                    //if(!$rootScope.firstMsg)
                    {
                        msg = {Text:"Hi, How may I help you ?",type:"SYS_FIRST"};
                        $rootScope.pushSystemMsg(0,msg);  
                    }
                }
                else if(callback.data.error.message == -1)
                {
                    $scope.loginerror = -1;
                }
            });
            
        };
        
        function displayTranscript() {
            vm.transcript = $rootScope.transcript;
            console.log("transcript",$rootScope.transcript);
            $(".chatinput").val($rootScope.transcript);
            //This is just to refresh the content in the view.
            if (!$scope.$$phase) {
                $scope.$digest();
                console.log("transcript",$rootScope.transcript);
            }
        }
        // function displayTranscript() {
        //     vm.transcript = $rootScope.transcript;
        //     $(".chatinput").val($rootScope.transcript);
        //     console.log("Speech",$rootScope.transcript);
        //     //This is just to refresh the content in the view.
        //     if (!$scope.$$phase) {
        //         $scope.$digest();
        //     }
        // }
        $rootScope.saveBookmark = function(name) {
            $scope.formData = {name:name,chatlist:$.jStorage.get("chatlist"),userid:$.jStorage.get("sessionid")};
            
            apiService.savebookmark($scope.formData).then(function (callback){
                if(callback.data.value)
                {
                    $(".savebookmarktext").val("");
                    $rootScope.bookmarkCancel();
                    alert("Saved Successfully");
                }
            });
        };
        
        $rootScope.getBookmark = function(selected) {
             $scope.formData = {userid:$.jStorage.get("sessionid"),selected:selected._id};
            apiService.getbookmark($scope.formData).then(function (callback){
                //console.log(callback.data.data.chatlist);
                if(callback.data.data)
                {
                    _.forEach(callback.data.data.chatlist,function(value,key){
                        
                        if(value.position == "right")
                        {
                            $rootScope.appendMsg(value.msg.id,value.msg);
                        }
                        if(value.position == "left" && value.msg.type != "SYS_FIRST")
                            $rootScope.appendSysMsg(value.msg.id,value.msg);
                    });
                    $rootScope.selectbookmarkCancel();
                }
            });
        };
        $rootScope.sendMail = function(selectCheck) {
            console.log(selectCheck);
            var values = new Array();
            var emailist = "pratik.shah429@gmail.com";
            var imgarr = new Array();
            var m_html = "<html><body>";
            var isdone=false;
            $.each($("input[name='formailing[]']:checked"), function(k,v) {
                //values.push($(this).val());
                var imgname = 'scr'+$(this).val()+'.png';
                var node = document.getElementById('scr'+$(this).val());
                var div="#scr"+$(this).val();
                //var div="#chat_window_1";
                console.log(div);
                $timeout(function(){
                    var chatHeight = $("ul.chat").height();
                    $(div).animate({scrollTop: chatHeight});
                });
                
                //var node = document.getElementById("chat_window_1");
                $(div).html2canvas({
                //$('#chat_window_1').html2canvas({
                    onrendered: function (canvas) {
                        //Set hidden field's value to image data (base-64 string)
                        //$('#img_val').val(canvas.toDataURL("image/png"));
                        //console.log(canvas.toDataURL("image/png"));
                        imgarr.push($base64.decode(canvas.toDataURL("image/png")));
                        m_html += "<img src='"+(canvas.toDataURL("image/png"))+"'>";
                        console.log(m_html);
                        if($("input[name='formailing[]']:checked").length == k+1)
                        {
                            isdone = true;
                            m_html += "</body></html>";
                    
                            var formData = {email:emailist,bodytag:m_html};
                            console.log(formData);
                            apiService.sendmail(formData).then(function (callback){

                            });
                        }
                        //Submit the form manually
                        //document.getElementById("myForm").submit();
                        //window.saveAs($base64.decode(canvas.toDataURL("image/png")),imgname );
                    }
                });
                // domtoimage.toPng(node).then(function (dataUrl) {
                //     var img = new Image();
                //     img.src = dataUrl;
                //     console.log(dataUrl);
                    
                // }).catch(function (error) {
                //     console.error('oops, something went wrong!', error);
                // });
                // domtoimage.toBlob(node)
                // .then(function (blob) {
                //     window.saveAs(blob,imgname );
                //     console.log(blob);
                // })
                // .catch(function (error) {
                //     console.error('oops, something went wrong!', error);
                // });
                // function filter (node) {
                //     return (node.tagName !== 'i');
                // }
                console.log(k,"key");
            // or you can do something to the actual checked checkboxes by working directly with  'this'
                
                    
            // something like $(this).hide() (only something useful, probably) :P
            });
            console.log(m_html);
            if(isdone)
            {
                m_html += "</body></html>";
            
                var formData = {email:emailist,images:imgarr,bodytag:m_html};
                console.log(formData);
                apiService.sendmail(formData).then(function (callback){

                });
            }
        };
        $rootScope.scrollChatWindow = function() {
            $timeout(function(){
                var chatHeight = $("ul.chat").height();
                $('.panel-body').animate({scrollTop: chatHeight});
            });
        };
        $rootScope.iframeHeight = window.innerHeight-53;
        
        $rootScope.getDatetime = function() {
            //return (new Date).toLocaleFormat("%A, %B %e, %Y");
            return currentTime = new Date();
        };
        $rootScope.chatText = "";
        $rootScope.getAutocomplete = function(chatText) {
            /*$rootScope.showTimeoutmsg = false;
            if($rootScope.showTimeoutmsg == false && chatText=="") 
            {
                $timeout(function () {
                    $rootScope.showTimeoutmsg = true;
                    msg = {Text:"Any Confusion ? How May I help You ?",type:"SYS_INACTIVE"};
                    $rootScope.pushSystemMsg(0,msg);
                },60000);
            }
            $rootScope.chatText = chatText;
            if(chatText == "" || chatText == " " || chatText == null)
                $rootScope.autocompletelist = [];
            else {
                $rootScope.chatdata = { string:$rootScope.chatText};
                // apiService.getautocomplete($rootScope.chatdata).then(function (response){
                //        // console.log(response.data);
                //     $rootScope.autocompletelist = response.data.data;
                // });
            }*/
        };
        $rootScope.pushSystemMsg = function(id,value) {
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.chatlist.push({id:"id",msg:value,position:"left",curTime: $rootScope.getDatetime()});
            $.jStorage.set("chatlist",$rootScope.chatlist);
            $timeout(function(){
                $rootScope.scrollChatWindow();
            });
            
        };
        $scope.logout = function()
        {
            $scope.formData = {sessionid:$.jStorage.get("sessionid"),user:$.jStorage.get("id")};
            apiService.logout($scope.formData).then(function (callback){
                $.jStorage.flush();
                $rootScope.isLoggedin = false;
                $rootScope.chatlist = [];
                $.jStorage.set("showchat",false);
                $rootScope.chatOpen = true;
                  
            });
            
            
        };
        $rootScope.showChatwindow = function () {
            newlist = $.jStorage.get("chatlist");
            //console.log(newlist);
            if(!newlist || newlist == null)
            {
                $rootScope.firstMsg = false;
            }
            else
            { 
                $rootScope.firstMsg = true;
            }
            $.jStorage.set("showchat",true);
            if(!$rootScope.firstMsg)
            {
                $rootScope.firstMsg = true;
                msg = {Text:"Hi, How may I help you ?",type:"SYS_FIRST"};
                $rootScope.pushSystemMsg(0,msg);  
            }
            $('#chat_panel').slideDown("slow");
            //$('#chat_panel').find('.panel-body').slideDown("fast");
            //$('#chat_panel').find('.panel-footer').slideDown("slow");
            $('.panel-heading span.icon_minim').removeClass('panel-collapsed');
            $('.panel-heading span.icon_minim').removeClass('glyphicon-plus').addClass('glyphicon-minus');
            $(".clickImage").hide();
            $rootScope.chatOpen = true;
            $rootScope.scrollChatWindow();
        };
        $rootScope.minimizeChatwindow = function() {
            $.jStorage.set("showchat",false);
            $rootScope.showTimeoutmsg = false;
            $rootScope.autocompletelist = [];
            $('#chat_panel').slideUp();
            //$('#chat_panel').find('.panel-body').slideUp("fast");
            //$('#chat_panel').find('.panel-footer').slideUp("fast");
            $('.panel-heading span.icon_minim').addClass('panel-collapsed');
            $('.panel-heading span.icon_minim').addClass('glyphicon-plus').removeClass('glyphicon-minus');
            $(".clickImage").show( "fadeIn");
        };
        $rootScope.appendSysMsg = function(id,value) {
            //console.log(value);
            if(!value.flag)
                value.flag = 2;
            $rootScope.currentProjectUrl = value.url;
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.chatlist.push({id:"id",msg:value,position:"left",curTime: $rootScope.getDatetime()});
            $.jStorage.set("chatlist",$rootScope.chatlist);
            $timeout(function(){
                $rootScope.scrollChatWindow();
            });
        };
        $rootScope.appendMsg = function(id,value) {
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.autocompletelist = [];
            $rootScope.chatlist.push({id:"id",msg:value,position:"right",curTime: $rootScope.getDatetime()});
            //console.log("msgid="+id+"chatmsg="+$rootScope.msgSelected);
            $.jStorage.set("chatlist",$rootScope.chatlist);
            $rootScope.msgSelected = false;
            $rootScope.scrollChatWindow();
        };
        $rootScope.pushMsg = function(id,value) {
            $rootScope.msgSelected = true;
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.autocompletelist = [];
            $rootScope.chatlist.push({id:"id",msg:value,position:"right",curTime: $rootScope.getDatetime()});
            //console.log("msgid="+id+"chatmsg="+$rootScope.msgSelected);
            $rootScope.getSystemMsg(id,value);
            $.jStorage.set("chatlist",$rootScope.chatlist);
            $rootScope.msgSelected = false;
            $rootScope.showMsgLoader=true;
            $rootScope.scrollChatWindow();
        };
        // if($.jStorage.get("showchat"))
        //     $rootScope.showChatwindow();
        // else
        //     $rootScope.minimizeChatwindow();

        
        $rootScope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };
        $rootScope.getSystemMsg = function(id,value){
            formData = {input:value,csrfmiddlewaretoken:"DapgmpQ2uiWHYVhBZspLD0o9rjce2H3NJHJbc1FOhYYYZ6TuaGyNwVFxO4Sie0my"};
            console.log(formData);
			framedata = {};
            apiService.getQlikChart(formData).then(function (data){
                console.log(data);
                framedata = data.data;
                framedata.type = "iframe";
                // if(!framedata.flag)
                //     framedata.flag = 1;
                // if(!framedata.flag)
                //     framedata.flag = 3;
                if(!framedata.flag)
                    framedata.flag = 2;
                $rootScope.currentProjectUrl = framedata.url;
                console.log(framedata,"Response");
                $rootScope.pushSystemMsg(0,framedata);
                $rootScope.showMsgLoader = false;
                $timeout(function(){
                    $(".chatinput").val("");
                });
            });
                // var myscript = "<script type='text/javascript'>";
                // if(value == "chart1")
                // {
                //     myscript += "app.visualization.create('barchart',";
                //     myscript += "['City','=Avg([Sales Amount])'],"; // one dimension, one measure
                //     myscript += "{'title':'On the fly barchart'})";                   // and we set the title
                //     myscript += "   .then(   ";
                //     myscript += " function(vis){";
                //     myscript += " vis.show('QV03'); });";
                //     myscript += "</script>";                            
                //     iframedata = {type:"iframe",url:"http://localhost:4848/extensions/PRJ4/PRJ4.html",text:"Lorem ipsum dolor sit amet"};
                    
                //     $rootScope.currentProjectUrl = iframedata.url;
                //     var myIframe = document.getElementById("framechart");
                //     //var script = myIframe.contentWindow.document.createElement("script");
                //     // script.type = "text/javascript";
                //     // script.src = src;
                //     //myIframe.contentWindow.document.body.appendChild(script);
                //     //myIframe.contentWindow.document.body.appendChild(myscript);
                //     //$('.framechart').contents().find('body').append(myscript);
                //     // var qlikIsolatedLoadConfig = {
                //     //     url : 'http://localhost:4848',
                //     //     prefix : '/'
                //     // }
                //     // var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
                //     var config = {
                //         host: "localhost",
                //         prefix: "/",
                //         port: 4848,
                //         isSecure: window.location.protocol === "https:",
                //         baseUrl: "http://localhost:4848"
                //     };
                //     qlikIsolated.getQlik('http://localhost:4848')
                //     .then(function(qlik){
                //         // qlik object can be access here 
                //         //console.log(qlik);
                //         var app = qlik.openApp('Consumer_Sales.qvf', config);
                //         //console.log(app);
                //         //var newobj = app.getObject("qFrame","prgzES");
                //         //console.log(newobj);
                //         app.visualization.create('barchart',                       // we want a barchart
                //         ["City","=Avg([Sales Amount])"], // one dimension, one measure
                //         {"title":"On the fly barchart"}).then(function(vis){
                //             vis.show("qFrame");                              // show the chart in a HTML element with id "QV03"
                //         }, function(error){
                //             console.log(error);
                //             /* error info */
                //         });
                        
                //     })
                //     // qlikIsolated.getObjectIsolated(	$('#qlikdiv'),  // element
                //     //     'Consumer_Sales.qvf', // app id
                //     //     'zswLzs',     // object id
                //     //     '',
                //     //     //'eRxSeT',     // sheet id (optional, if object id is specified)
                //     //     'http://localhost:4848'
                //     // ); 
                // }
                // if(value == "chart1")
                // {
                //     iframedata = {type:"iframe",url:"http://localhost:4848/extensions/PRJ2/PRJ2.html",text:"Lorem ipsum dolor sit amet"};
                    
                //     $rootScope.currentProjectUrl = iframedata.url;
                // }
                // else
                // {
                //     iframedata = {type:"iframe",url:"http://localhost:4848/extensions/PRJ3/PRJ3.html",text:"Lorem ipsum dolor sit amet"};
                    
                //     $rootScope.currentProjectUrl = iframedata.url;
                // }
                //console.log($rootScope.currentProjectUrl);
                
                
              
        };
        
        $rootScope.Speaktext = function() {
            //console.log(text);
            var _iOS9voices = [
                { "data-name": "Maged", voiceURI: "com.apple.ttsbundle.Maged-compact", "data-lang": "ar-SA", localService: true, "default": true },
                { "data-name": "Zuzana", voiceURI: "com.apple.ttsbundle.Zuzana-compact", "data-lang": "cs-CZ", localService: true, "default": true },
                { "data-name": "Sara", voiceURI: "com.apple.ttsbundle.Sara-compact", "data-lang": "da-DK", localService: true, "default": true },
                { "data-name": "Anna", voiceURI: "com.apple.ttsbundle.Anna-compact", "data-lang": "de-DE", localService: true, "default": true },
                { "data-name": "Melina", voiceURI: "com.apple.ttsbundle.Melina-compact", "data-lang": "el-GR", localService: true, "default": true },
                { "data-name": "Karen", voiceURI: "com.apple.ttsbundle.Karen-compact", "data-lang": "en-AU", localService: true, "default": true },
                { "data-name": "Daniel", voiceURI: "com.apple.ttsbundle.Daniel-compact", "data-lang": "en-GB", localService: true, "default": true },
                { "data-name": "Moira", voiceURI: "com.apple.ttsbundle.Moira-compact", "data-lang": "en-IE", localService: true, "default": true },
                { "data-name": "Samantha (Enhanced)", voiceURI: "com.apple.ttsbundle.Samantha-premium", "data-lang": "en-US", localService: true, "default": true },
                { "data-name": "Samantha", voiceURI: "com.apple.ttsbundle.Samantha-compact", "data-lang": "en-US", localService: true, "default": true },
                { "data-name": "Tessa", voiceURI: "com.apple.ttsbundle.Tessa-compact", "data-lang": "en-ZA", localService: true, "default": true },
                { "data-name": "Monica", voiceURI: "com.apple.ttsbundle.Monica-compact", "data-lang": "es-ES", localService: true, "default": true },
                { "data-name": "Paulina", voiceURI: "com.apple.ttsbundle.Paulina-compact", "data-lang": "es-MX", localService: true, "default": true },
                { "data-name": "Satu", voiceURI: "com.apple.ttsbundle.Satu-compact", "data-lang": "fi-FI", localService: true, "default": true },
                { "data-name": "Amelie", voiceURI: "com.apple.ttsbundle.Amelie-compact", "data-lang": "fr-CA", localService: true, "default": true },
                { "data-name": "Thomas", voiceURI: "com.apple.ttsbundle.Thomas-compact", "data-lang": "fr-FR", localService: true, "default": true },
                { "data-name": "Carmit", voiceURI: "com.apple.ttsbundle.Carmit-compact", "data-lang": "he-IL", localService: true, "default": true },
                { "data-name": "Lekha", voiceURI: "com.apple.ttsbundle.Lekha-compact", "data-lang": "hi-IN", localService: true, "default": true },
                { "data-name": "Mariska", voiceURI: "com.apple.ttsbundle.Mariska-compact", "data-lang": "hu-HU", localService: true, "default": true },
                { "data-name": "Damayanti", voiceURI: "com.apple.ttsbundle.Damayanti-compact", "data-lang": "id-ID", localService: true, "default": true },
                { "data-name": "Alice", voiceURI: "com.apple.ttsbundle.Alice-compact", "data-lang": "it-IT", localService: true, "default": true },
                { "data-name": "Kyoko", voiceURI: "com.apple.ttsbundle.Kyoko-compact", "data-lang": "ja-JP", localService: true, "default": true },
                { "data-name": "Yuna", voiceURI: "com.apple.ttsbundle.Yuna-compact", "data-lang": "ko-KR", localService: true, "default": true },
                { "data-name": "Ellen", voiceURI: "com.apple.ttsbundle.Ellen-compact", "data-lang": "nl-BE", localService: true, "default": true },
                { "data-name": "Xander", voiceURI: "com.apple.ttsbundle.Xander-compact", "data-lang": "nl-NL", localService: true, "default": true },
                { "data-name": "Nora", voiceURI: "com.apple.ttsbundle.Nora-compact", "data-lang": "no-NO", localService: true, "default": true },
                { "data-name": "Zosia", voiceURI: "com.apple.ttsbundle.Zosia-compact", "data-lang": "pl-PL", localService: true, "default": true },
                { "data-name": "Luciana", voiceURI: "com.apple.ttsbundle.Luciana-compact", "data-lang": "pt-BR", localService: true, "default": true },
                { "data-name": "Joana", voiceURI: "com.apple.ttsbundle.Joana-compact", "data-lang": "pt-PT", localService: true, "default": true },
                { "data-name": "Ioana", voiceURI: "com.apple.ttsbundle.Ioana-compact", "data-lang": "ro-RO", localService: true, "default": true },
                { "data-name": "Milena", voiceURI: "com.apple.ttsbundle.Milena-compact", "data-lang": "ru-RU", localService: true, "default": true },
                { "data-name": "Laura", voiceURI: "com.apple.ttsbundle.Laura-compact", "data-lang": "sk-SK", localService: true, "default": true },
                { "data-name": "Alva", voiceURI: "com.apple.ttsbundle.Alva-compact", "data-lang": "sv-SE", localService: true, "default": true },
                { "data-name": "Kanya", voiceURI: "com.apple.ttsbundle.Kanya-compact", "data-lang": "th-TH", localService: true, "default": true },
                { "data-name": "Yelda", voiceURI: "com.apple.ttsbundle.Yelda-compact", "data-lang": "tr-TR", localService: true, "default": true },
                { "data-name": "Ting-Ting", voiceURI: "com.apple.ttsbundle.Ting-Ting-compact", "data-lang": "zh-CN", localService: true, "default": true },
                { "data-name": "Sin-Ji", voiceURI: "com.apple.ttsbundle.Sin-Ji-compact", "data-lang": "zh-HK", localService: true, "default": true },
                { "data-name": "Mei-Jia", voiceURI: "com.apple.ttsbundle.Mei-Jia-compact", "data-lang": "zh-TW", localService: true, "default": true }
                ];
            //var voices = window.speechSynthesis.getVoices();
            var speech = new SpeechSynthesisUtterance($.jStorage.get("texttospeak"));
            //speech.text = $.jStorage.get("texttospeak");
            //speech.text = "Hello";
            speech.volume = 1; // 0 to 1
            speech.rate = 1; // 0.1 to 9
            speech.pitch = 1; // 0 to 2, 1=normal
            speech.lang = "en-US";
            //speech.lang = {lang: 'en-US', desc: 'English (United States)'};
            //speech.voice = voices[8]; 
            speech.voiceURI = 'native';
            speechSynthesis.speak(speech);
            $.jStorage.set("texttospeak","");
        };
        

        $rootScope.tappedKeys = '';

        $rootScope.onKeyUp = function(e){
            //if(e.key == "ArrowDown" || e.key == "ArrowUp")
            /*
			if(e.which == 40 )
            {
                if($("ul#ui-id-1 li.active").length!=0) {
                    var storeTarget	= $('ul#ui-id-1').find("li.active").next();
                    $("ul#ui-id-1 li.active").removeClass("active");
                    storeTarget.focus().addClass("active");
                    $(".chatinput").val(storeTarget.text());
                    $rootScope.autolistid = $(storeTarget).attr("data-id");
                    $rootScope.autolistvalue = $(storeTarget).attr("data-value");
                }
                else
                {
                    $('ul#ui-id-1').find("li:first").focus().addClass("active");
                    $(".chatinput").val($('ul#ui-id-1').find("li:first").text());
                    $rootScope.autolistid = $('ul#ui-id-1').find("li:first").attr("data-id");
                    $rootScope.autolistvalue = $('ul#ui-id-1').find("li:first").attr("data-value");
		    	}

                return;
            }
            if(e.which == 38 )
            {
                if($("ul#ui-id-1 li.active").length!=0) {
                    var storeTarget	= $('ul#ui-id-1').find("li.active").prev();
                    $("ul#ui-id-1 li.active").removeClass("active");
                    storeTarget.focus().addClass("active");
                    $(".chatinput").val(storeTarget.text());
                    $rootScope.autolistid = $(storeTarget).attr("data-id");
                    $rootScope.autolistvalue = $(storeTarget).attr("data-value");
                }
                else
                {
                    $('ul#ui-id-1').find("li:last").focus().addClass("active");
                    $(".chatinput").val($('ul#ui-id-1').find("li:last").text());
                    $rootScope.autolistid = $('ul#ui-id-1').find("li:last").attr("data-id");
                    $rootScope.autolistvalue = $('ul#ui-id-1').find("li:last").attr("data-value");
		    	}

                return;
            }*/
            if(e.which == 13)
            {
                if($rootScope.autolistid=="" || $rootScope.autolistid == null || $rootScope.autolistid == 0)
                {
                    $rootScope.pushMsg("",$(".chatinput").val());
					$(".chatinput").val("");
                    
                }
                else {
                    $rootScope.pushMsg($rootScope.autolistid,$rootScope.chatText);
                }
            }
        };
        $rootScope.likeChatClick = function(){
            $timeout(function(){
                $('span.thumbsup').css("color", "#ed232b");
                $('.thumbsdown').css("color", "#444");
            },200);
        };
        
        $rootScope.$viewmodalInstance = {};
        $rootScope.selectbookmarkerror = 0;
        $rootScope.openviewBookmark = function() {
            $scope.formData = {userid:$.jStorage.get("sessionid")};
            
            
            apiService.viewbookmark($scope.formData).then(function (callback){
                $("#selectbookmark_list").html("");
                
                
                $rootScope.$viewmodalInstance = $uibModal.open({
                    scope: $rootScope,
                    animation: true,
                    size: 'sm',
                    templateUrl: 'views/modal/selectbookmark.html',
                    resolve: {
                        items: function () {
                        return callback.data.data;
                        }
                    },
                    controller: 'ViewCtrl'
                });
                
            });
        };
        $rootScope.selectbookmarkCancel = function() {
            //console.log("dismissing");
            $rootScope.$viewmodalInstance.dismiss('cancel');
        };
        
        $rootScope.savebookmarkerror = 0;
        $rootScope.$savemodalInstance = {};
        $scope.opensaveBookmark = function() {
            $rootScope.$savemodalInstance = $uibModal.open({
                scope: $rootScope,
                animation: true,
                size: 'sm',
                templateUrl: 'views/modal/savebookmark.html',
                //controller: 'CommonCtrl'
            });
        };
        $rootScope.bookmarkCancel = function() {
            //console.log("dismissing");
            $rootScope.$savemodalInstance.dismiss('cancel');
        };
        $rootScope.$dislikemodalInstance = {};
        $rootScope.dislikesuggestionerror = 0;
        $rootScope.dislikeChatClick = function(){
            $rootScope.$dislikemodalInstance = $uibModal.open({
                scope: $rootScope,
                animation: true,
                size: 'sm',
                templateUrl: 'views/modal/dislikechat.html',
                //controller: 'CommonCtrl'
            });
            $timeout(function(){ 
                $('span.thumbsdown').css("color", "#ed232b");
                $('.thumbsup').css("color", "#444");
            },200);
        };
        $rootScope.dislikeCancel = function() {
            //console.log("dismissing");
            $scope.$dislikemodalInstance.dismiss('cancel');
        };
        $rootScope.dislikesuggestionsubmit = function(suggestion){
            console.log("suggestion",suggestion);
            $rootScope.dislikesuggestionSuccess = 1;
            $timeout(function(){
                $rootScope.dislikesuggestionSuccess = 0;
                $rootScope.dislikeCancel();
            },500);
        };
        
       $timeout(function(){
            //$('#chatTabs a:last').tab('show');
       },200);
    })

    .controller('ViewCtrl', function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        // $scope.selected = {
        //     item: $scope.items[0]
        // };
        var dt = "";
        _.each($scope.items,function(v,k){
            console.log(v);
            dt += "<option value='"+v._id+"'>"+v.name+"</option>";
            
        });
        console.log(dt);
        //$("select#selectbookmark_list").html(dt);
    })
    // Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });

    