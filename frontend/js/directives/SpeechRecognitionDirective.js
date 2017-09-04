/**
 * Author: Nizar BOUSEBSI
 * Description: AngularJS directive to process Speech Recognition in your Cordova & Web application.
 * Usage: Add this directive in your Directives folder.
 */

angular.module('app.directives', []).directive('ngSpeechRecognitionStart', function ($timeout, $rootScope,apiService) {
	return {
		restrict: 'A',
		link: function ($scope, $element, $attrs) {
			
			// if (typeof Windows !== 'undefined' &&
			// 	typeof Windows.UI !== 'undefined' &&
			// 	typeof Windows.ApplicationModel !== 'undefined') 
			//{
			// Subscribe to the Windows Activation Event
				// $element.bind('touchstart mousedown', function (event) {
				
				// Window.UI.WebUI.WebUIApplication.addEventListener("activated", function (args) {
				// 	var activation = Window.ApplicationModel.Activation;
				// 	// Check to see if the app was activated by a voice command
				// 	if (args.kind === activation.ActivationKind.voiceCommand) {
				// 	// Get the speech reco
				// 	var speechRecognitionResult = args.result;
				// 	var textSpoken = speechRecognitionResult.text;
				// 	// Determine the command type {search} defined in vcd
				// 	if (speechRecognitionResult.rulePath[0] === "search") {
				// 		// Determine the stream name specified
				// 		if (textSpoken.includes('foo') || textSpoken.includes('Foo')) {
				// 		console.log("The user is searching for foo");
				// 		}
				// 		else if (textSpoken.includes('bar') || textSpoken.includes('Bar') ) {
				// 		console.log("The user is searching for a bar");
				// 		}
				// 		else {
				// 		console.log("Invalid search term specified by user");
				// 		}
				// 	}
				// 	else { 
				// 		console.log("No valid command specified");
				// 	}
				// 	}
				// });
				// });
			//} 
			// else {
			// console.log("Windows namespace is unavaiable");
			// }
			//if($rootScope.browser=="safari") 
			{

			if($rootScope.browser=="chrome") {
				var recognition = new window.webkitSpeechRecognition();
			} else if($rootScope.browser=="firefox") {
				//var recognition = new ( SpeechRecognition || webkitSpeechRecognition || mozSpeechRecognition)();
				var recognition = new SpeechRecognition();
			} else if($rootScope.browser=="safari") {
				var recognition = new window.msSpeechRecognition();
			}
			else if($rootScope.browser=="opera") {
				var recognition = new window.oSpeechRecognition();
			}
			else if($rootScope.browser=="msie") {
				var recognition = new window.msSpeechRecognition();
			}
			else if($rootScope.browser=="android") {
				//alert("android");
				var recognition = new window.webkitSpeechRecognition();
			}
			else if($rootScope.browser=="ios") {
				var recognition = new window.webkitSpeechRecognition();
			}
			//var recognition = new window.webkitSpeechRecognition();
			var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

			var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
			recognition.continuous = true;
			recognition.interimResults = false;
			ignore_onend = false;
			final_transcript = '';
			recognition.lang = 'en-us';
			
			var recognitionIsAlreadyCalled = false;

			$element.bind('touchstart mousedown', function (event) {
				$scope.isHolded = true;
				$(this).addClass('hover_effect');
				$timeout(function () {
					if ($scope.isHolded) {
						$scope.$apply(function () {

							if ($attrs.ngSpeechRecognitionStart) {
								$scope.$eval($attrs.ngSpeechRecognitionStart)
								
							}

							if (recognitionIsAlreadyCalled === false) {
								recognitionIsAlreadyCalled = true;
								recognition.start();
								
								recognition.onstart = function() {
									recognizing = true;
									console.log("Started event");
								};
							}
						});
					}
				}, 600);
			});

			$element.bind('touchend mouseup', function (event) {
				$scope.isHolded = false;
				$(this).removeClass('hover_effect');
                console.log($attrs.ngSpeechRecognitionEnd);
				if ($attrs.ngSpeechRecognitionEnd) {
					
					$scope.$apply(function () {
						
						recognition.onerror = function(event) {
							if (event.error == 'no-speech') {
							ignore_onend = true;
							console.log("No speech");
							}
							if (event.error == 'audio-capture') {
							ignore_onend = true;
							console.log("No mic");
							}
							if (event.error == 'not-allowed') {
								// if (event.timeStamp - start_timestamp < 100) {
								// 	//showInfo('info_blocked');
								// } else {
								// 	//showInfo('info_denied');
								// }
								ignore_onend = true;
							}
						};
						recognition.onresult = function (event) {
                            console.log("display+--",event);
							if (event.results[0][0].transcript !== undefined) {
								$rootScope.transcript = event.results[0][0].transcript;
                                console.log($rootScope.transcript);
								if (typeof $rootScope.transcript === 'string') {
									 for (var i = event.resultIndex; i < event.results.length; ++i) {
										if (event.results[i].isFinal) {
											final_transcript += event.results[i][0].transcript;
										} else {
											interim_transcript += event.results[i][0].transcript;
										}
									}
                                    $scope.$eval($attrs.ngSpeechRecognitionEnd);
                                     console.log($attrs.ngSpeechRecognitionEnd);
								}
							}
						}
						recognition.stop();
						recognitionIsAlreadyCalled = false;
					});
				}
			});
			}
			// /else
			// {
			// 	$element.bind('touchstart mousedown', function (event) {
			// 		apiService.startRecording("").then(function (response){
            //            // console.log(response.data);
			// 			//$rootScope.autocompletelist = response.data.data;
			// 		});
			// 	});
			// 	$element.bind('touchend mouseup', function (event) {
			// 		// apiService.stopRecording("").then(function (response){
            //         //    // console.log(response.data);
			// 		// 	//$rootScope.autocompletelist = response.data.data;
			// 		// });
			// 	});
			// }
		}
	};
})