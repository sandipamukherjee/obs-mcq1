/*
* Author: Ashok Shah
* https://www.shahnashok.com
* Date: 08/06/2017
*/

function MainApp () {

	$("#btn-wrapper-holder").html('<button disabled class="btn submit" id="btn-done">Done</button>' +
	'<button disabled class="btn btn-primary" id="btn-next">Next</button>' +
	'<button disabled class="btn btn-primary" id="btn-tryagain">Try Again</button>' +
	'<button disabled class="btn btn-primary" id="btn-hint">Answer</button>' +
	'<button disabled class="btn btn-primary" id="btn-answers">Answer Key</button>' +
	'<button disabled class="btn btn-primary" id="btn-again">Retry Activity</button>')


	this.appTitle = document.getElementById('app-title');
	this.appInstruction = document.getElementById('app-instruction');
	this.handlerBar = document.getElementById('handler-bar');
	this.btnDone = document.getElementById('btn-done');
	this.btnTryAgain = document.getElementById('btn-tryagain');
	this.btnAnswer	= document.getElementById('btn-answers');
	this.feedback = document.getElementById('feedback-text');
	this.feedbackBox = document.getElementById('modal-feedback');
	
	this.btnAnswer.addEventListener('click', this.submitCorrect);

	this.current = 0;
	this.attempt = 0;
	//this.maxpass = 0;
	if (MASTER_DB.GROUPMODE.ALLOWGROUPS) {
		this.jsongroupname = [];/*group var declare*/
		this.jsongroupscore = [];
		this.grp_details = [];
		this._index = 0;
	}
	this.storageClear();
	this.init();
}
MainApp.prototype.storageClear = function() {
	sessionStorage.removeItem('score');
	sessionStorage.removeItem('totalques');
	sessionStorage.removeItem('grp_details');
}
MainApp.prototype.timerClear = function() {
	$('#app-count_down').find('.jst-seconds').remove();
	$('#app-count_down').find('.jst-minutes').remove();
	$('#app-count_down').find('.jst-hours').remove();
}
MainApp.prototype.showresult = function(index) {
	/*percentage calculation*/
	var percentage = (sessionStorage.score/(MASTER_DB.QUESTIONS.length*MASTER_DB.GROUPMODE.POINTSPERANSWER))*100;
	if(!MASTER_DB.GROUPMODE.ALLOWGROUPS) {
		if (!isNaN(percentage)) { 
			$("#completemsg-text").html(MASTER_DB.COMPLETE.TEXT[index]);
			$("#percentage-text").html(percentage.toFixed(2) + ' %');
			if (percentage >= 90) {
				$("#three_star").show();
			} else if (percentage >= 60) {
				$("#two_star").show();
			} else {
				$("#one_star").show();
			}
		} else {
			$("#completemsg-text").html(MASTER_DB.INCOMPLETE.TEXT);
			$(".complete_img.stars").hide();
			$(".complete_img.bad").show();
			$(".complete_img.good").hide();
			$("#percentage-text").hide();
		}
	} else {
		if (!isNaN(percentage)) { 
			var this_group = jQuery.parseJSON(sessionStorage.grp_details);
			//console.log('thisgrp' + this_group);
			$("#completemsg-text").html(MASTER_DB.COMPLETE.TEXT[index]);
			$("#percentage-text").html(percentage + ' %');
			if (percentage >= 90) {
				$("#three_star").show();
			} else if (percentage >= 60) {
				$("#two_star").show();
			} else {
				$("#one_star").show();
			}
		} else {
			$("#completemsg-text").html(MASTER_DB.INCOMPLETE.TEXT);
			$(".complete_img.stars").hide();
			$(".complete_img.bad").show();
			$(".complete_img.good").hide();
			$("#percentage-text").hide();
		}
	}
	
	/*percentage calculation*/
}
MainApp.prototype.shuffle = function(sourceArray, createdgroupname) {
	var pickup = parseInt(sourceArray.length / createdgroupname);
	sourceArray.length = pickup * createdgroupname;
    for (var i = 0; i < sourceArray.length; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));
        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}
MainApp.prototype.init = function() {
	$('title').html(MASTER_DB.CONFIG.TITLE);
	this.appTitle.innerHTML = MASTER_DB.CONFIG.TITLE;
	$("#activity_title").html(MASTER_DB.CONFIG.TITLE);
	this.appInstruction.innerHTML = MASTER_DB.CONFIG.INSTRUCTION;
	$("#instruction-info").html('<li>' + MASTER_DB.CONFIG.INSTRUCTIONS.join("</li><li>") + '</li>');
	this.total = MASTER_DB.QUESTIONS.length;
	/*group start*/
	$("#group_count").attr({
    	min : MASTER_DB.GROUPMODE.DEFAULTGROUPS, 
    	value : MASTER_DB.GROUPMODE.DEFAULTGROUPS
	});
	$("#group_count").on('click', function (e) {
		$("#groupButton").prop("disabled", false);
		$("#namedgroupButton").prop("disabled", true);
	});
	if(MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.SHOWPROMPT) {
		$("#pop_over").css("display", "flex");
		$("#pop_over .popup_start #GROUPPOPUPTEXT_UP").html(MASTER_DB.GROUPMODE.GROUPPOPUPTEXT_UP);
		$("#pop_over .popup_start #GROUPPOPUPTEXT_DOWN").html(MASTER_DB.GROUPMODE.GROUPPOPUPTEXT_DOWN);
		$('#groupButton').on('click', this.creategroup);
		$('#namedgroupButton').on('click', this.namedgroup);
		$("#pop_over").on('click', this.pop_it_up);
    	$("#pop_over .popup_start").on('click', this.dontclose);
	} else if (MASTER_DB.GROUPMODE.ALLOWGROUPS && !MASTER_DB.GROUPMODE.SHOWPROMPT) {
		this.namedgroup();
	}
    /*group end*/
    
	this.loadQuestion(this.current);
	this.loadAudio();
	$('#optionsInput').on('click', '.radio', this.enableDoneBtn);
	$('#btn-done').on('click', this.submitAns);
	$('#btn-next').on('click', this.nextQuestion);
	$('body').on('click', '.next_when_pass', this.tiggerNextQuestion);
	$('body').on('click', '.group_pass', this.passQuestion);
	$('#btn-tryagain').on('click', this.submitAgain);
	$('#btn-hint').on('click', this.showHint);
	$('#btn-answers').on('click', this.submitCorrect);
	

   jQuery('<div class="quantity-nav"><div class="quantity-button quantity-down">-</div><div class="quantity-button quantity-up">+</div></div>').insertAfter('.quantity input');
    jQuery('.quantity').each(function() {
      var spinner = jQuery(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('.quantity-up'),
        btnDown = spinner.find('.quantity-down'),
        min = input.attr('min'),
        max = input.attr('max');

      btnUp.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
      });

      btnDown.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue <= min) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
      });

    });
    $('.quantity-nav').on('click', '.quantity-less', function() {
    	if ($("#groupname").children().length > $("#group_count").attr('min')) {
    		$("#groupname .groupname:last-child").remove();
    	}
    });
    $('.quantity-nav').on('click', '.quantity-more', function() {
    	if ($("#groupname").children().length < $("#group_count").attr('max')) {
    		var moregrp = $("#groupname .groupname:last-child").attr('id');
    		var lastid_for_group = moregrp.split("-")[1];
    		lastid_for_group = parseInt(lastid_for_group) + 1;
    		$('<input class="groupname" value="" id="groupname-'+lastid_for_group+'" type="text">').insertAfter("#"+moregrp);
    	}
    });
	$('.list__item').on('click', function (e) {
		$('.list__item.active').removeClass('active');
		$(this).addClass('active');
	});
};

MainApp.prototype.loadAudio = function() {
	this.audioCorrectList = [];
	this.audioIncorrectList = [];
	this.audioCompleteList = [];

	var AUDIO_COMPLETE = MASTER_DB.AUDIO.COMPLETE;
	for(var i=0; i<AUDIO_COMPLETE.length; i++) {
		var id = "complete-" + i;
		this.audioCompleteList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_COMPLETE[i],
			autoLoad:true,
			autoPlay:false
		});
	}

	var AUDIO_POSITIVE = MASTER_DB.AUDIO.POSITIVE;
	for(var i=0; i<AUDIO_POSITIVE.length; i++) {
		var id = "positive-" + i;
		this.audioCorrectList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_POSITIVE[i],
			autoLoad:true,
			autoPlay:false
		});
	}

	var AUDIO_NEGATIVE = MASTER_DB.AUDIO.NEGATIVE;
	for(var i=0; i<AUDIO_NEGATIVE.length; i++) {
		var id = "negative-" + i;
		this.audioIncorrectList.push(id);
		soundManager.createSound({
			id:id,
			url:AUDIO_NEGATIVE[i],
			autoLoad:true,
			autoPlay:false
		});
	}
};
MainApp.prototype.nextQuestion = function() {
	var _this = MasterApp;
	if(_this.total == _this.current + 1) {
		_this.checkForNext();
	} else {
		/*group add*/
		$("#group_score_button").html('<h3 id="team_name_'+(_this.current + 1)+'"></h3>');
		/*group add*/
		_this.loadQuestion(++_this.current);

		/*coutdown*/
		if (MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.TIMEEACHQUESTION) {
			_this.timerenable();
		} else if (!MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.TIMER.ALLOWTIMER && (MASTER_DB.TIMER.TIMERFOR == "question")) {
			_this.timerenable(_this.current);
		}
		/*coutdown*/
	}
	
};
MainApp.prototype.timerenable = function(index) {
	var self = this;
	if (MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.TIMEEACHQUESTION) {
		console.log(1);
		var self = this;
		$('.slider').val(0);
		timer = new Timer();
		timer.start({countdown: true, precision: 'seconds', startValues: {seconds: MASTER_DB.GROUPMODE.TIMEPERQUESTION}});
		$('#app-count_down .values').html(timer.getTimeValues().toString());
		timer.addEventListener('secondsUpdated', function (e) {
		    $('#app-count_down').html(timer.getTimeValues().toString());
		    $('.slider').attr('max', MASTER_DB.GROUPMODE.TIMEPERQUESTION);
		    var val = parseInt($('.slider').val()) + 1;
		    $('.slider').val(val);
		    console.log("seconds"+$('.slider').val());
		});
		timer.addEventListener('targetAchieved', function (e) {
			if (quesion_count < MASTER_DB.QUESTIONS.length - 1) {
				quesion_count = quesion_count + 1;
				self.nextQuestion();
			} else {
				$("#screen-gameplay").hide();
			    $("#screen-result").show();
			  	$("#btn-answers").removeAttr('disabled');
				var index = self.playAudio('audioCompleteList');
				self.showresult(index);
				$("#btn-again").removeAttr('disabled');
			}
		});
	} else if (MASTER_DB.GROUPMODE.ALLOWGROUPS && !MASTER_DB.GROUPMODE.TIMEEACHQUESTION && MASTER_DB.TIMER.ALLOWTIMER && MASTER_DB.TIMER.TOTALTIME && (MASTER_DB.TIMER.TIMERFOR == "activity")) {
		console.log(2);
		$('#app-count_down .values').html(timer.getTimeValues().toString());
		timer.addEventListener('secondsUpdated', function (e) {
		    $('#app-count_down').html(timer.getTimeValues().toString());
		    $('.slider').attr('max', MASTER_DB.TIMER.TOTALTIME);
		    var val = parseInt($('.slider').val()) + 1;
		    $('.slider').val(val);
		});
		timer.addEventListener('targetAchieved', function (e) {
			$("#screen-gameplay").hide();
		  	$("#screen-result").show();
		  	$("#btn-answers").removeAttr('disabled');
			var index = self.playAudio('audioCompleteList');
			$(".complete_img").hide();
			$(".complete_msg").hide();
			$("#leaderboard").css("display", "flex");
			var this_group = jQuery.parseJSON(sessionStorage.grp_details);
			$.each(this_group, function(index, value) {
				$("<li>"+value.title+"<span>"+value.score+"</span></li>").appendTo("#group_score_board");
			});
			$("#btn-again").removeAttr('disabled');
		});
	} else if (!MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.TIMER.ALLOWTIMER && MASTER_DB.TIMER.TIMERFOR == "activity") {
		$('#app-count_down .values').html(timer.getTimeValues().toString());
		timer.addEventListener('secondsUpdated', function (e) {
		    $('#app-count_down').html(timer.getTimeValues().toString());
		    $('.slider').attr('max', MASTER_DB.TIMER.TOTALTIME);
		    var val = parseInt($('.slider').val()) + 1;
		    $('.slider').val(val);
		});
		timer.addEventListener('targetAchieved', function (e) {
		    $("#screen-gameplay").hide();
			$("#screen-result").show();
		  	$("#btn-answers").removeAttr('disabled');
			
			/*percentage calculation*/
			var percentage = (sessionStorage.score/(MASTER_DB.QUESTIONS.length*MASTER_DB.SCORING.POINTSPERANSWER))*100;
			if(!MASTER_DB.GROUPMODE.ALLOWGROUPS) {
				if (!isNaN(percentage)) { 
					var index = self.playAudio('audioCompleteList');
					$("#completemsg-text").html(MASTER_DB.COMPLETE.TEXT[index]);
					$("#percentage-text").html(percentage.toFixed(2) + ' %');
					if (percentage >= 90) {
						$("#three_star").show();
					} else if (percentage >= 60) {
						$("#two_star").show();
					} else {
						$("#one_star").show();
					}
				} else {
					$("#completemsg-text").html(MASTER_DB.INCOMPLETE.TEXT);
					$(".complete_img.stars").hide();
					$(".complete_img.bad").show();
					$(".complete_img.good").hide();
					$("#percentage-text").hide();
					var index = self.playAudio('audioIncorrectList');
				}
			} 
			$("#group_score_button").hide();
			$("#app-count_down").hide();
			$(".slider").hide();
			$("#my_score").hide();
			/*percentage calculation*/
			$("#btn-again").removeAttr('disabled');	
		});
	} else if (!MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.TIMER.ALLOWTIMER && MASTER_DB.TIMER.TIMERFOR == "question") {
		var self = this;
		$('.slider').val(0);
		timer = new Timer();
		timer.start({countdown: true, precision: 'seconds', startValues: {seconds: MASTER_DB.TIMER.TOTALTIME}});
		$('#app-count_down .values').html(timer.getTimeValues().toString());
		timer.addEventListener('secondsUpdated', function (e) {
		    $('#app-count_down').html(timer.getTimeValues().toString());
		    $('.slider').attr('max', MASTER_DB.TIMER.TOTALTIME);
		    var val = parseInt($('.slider').val()) + 1;
		    $('.slider').val(val);
		    console.log("seconds"+$('.slider').val());
		});
		timer.addEventListener('targetAchieved', function (e) {
			if (quesion_count < MASTER_DB.QUESTIONS.length - 1) {
				quesion_count = quesion_count + 1;
				self.nextQuestion();
			} else {
				$("#screen-gameplay").hide();
			    $("#screen-result").show();
			    $("#group_score_button").hide();
				$("#app-count_down").css("display", "none");
				$(".slider").hide();
			  	$("#btn-answers").removeAttr('disabled');
				self.showresult(index);
				$("#btn-again").removeAttr('disabled');
			}	
		});
	}
}
MainApp.prototype.passQuestion = function() {
	maxpass = maxpass + 1;
	console.log(maxpass);
	var presentgrp = $(this).attr('pass-data').split("-")[1];
	this.grp_details = jQuery.parseJSON(sessionStorage.getItem("grp_details"));
	var grplength = this.grp_details.length - 1;
	if (presentgrp < grplength) {
		var futuregrp = parseInt(presentgrp) + 1;
	} else {
		var futuregrp = 0;
	}
	//console.log('futuregrp'+futuregrp);
	$('#team_name_'+presentgrp).html(this.grp_details[futuregrp].title).attr("id", 'team_name_'+futuregrp);
	$("#btn-done").attr('data-grp', futuregrp);
	$("#btn-done").attr('data-grp-pass', 1);
	if (maxpass == MASTER_DB.GROUPMODE.MAXPASSES) {
		$("#group_pass-"+presentgrp).addClass("disabled_opacity");
		$("#group_pass-"+presentgrp).attr({ 
			"id": 'group_pass-'+futuregrp, 
			"pass-data": "grppass-"+futuregrp,
			"disabled": "disabled",
		});
		$(".next_when_pass").removeAttr('disabled').removeClass('disabled_opacity');

	} else {

		$("#group_pass-"+presentgrp).attr({ 
			"id": 'group_pass-'+futuregrp, 
			"pass-data": "grppass-"+futuregrp
		});
	}
};
MainApp.prototype.loadQuestion = function(index) {
	maxpass = 0;
	$("#namedgroupButton").click(function(){	
		this.grp_details = jQuery.parseJSON(this.jsongroupname);
		sessionStorage.setItem("grp_details", this.jsongroupname);
		if(MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.SHOWPROMPT) { 
			if(sessionStorage.getItem("grp_details")) {
				this.grp_details = jQuery.parseJSON(sessionStorage.getItem("grp_details"));
		      	_index = index % this.grp_details.length;
		      	var grp_html_main = $("#group_score_button").html('<h3 id="team_name_'+_index+'"></h3>');
				$('#team_name_'+_index).html(this.grp_details[_index].title);
				$("#btn-done").attr('data-grp', _index);
				if (MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.ALLOWQUESTIONTOPASS) {
					$('<button class="submit next_when_pass disabled_opacity">Next</button>').insertBefore(grp_html_main.children());
					$('<button id="group_pass-'+_index+'" class="group_pass submit" pass-data = "grppass-'+_index+'">Pass</button>').insertAfter("#team_name_"+_index);
				}
			} 
		}
	});
	if(MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.SHOWPROMPT) { 
		if(sessionStorage.getItem("grp_details")) {
			this.grp_details = jQuery.parseJSON(sessionStorage.getItem("grp_details"));
	      	_index = index % this.grp_details.length;
	      	var grp_html_main = $("#group_score_button").html('<h3 id="team_name_'+_index+'"></h3>');
			$('#team_name_'+_index).html(this.grp_details[_index].title);
			$("#btn-done").attr('data-grp', _index);
			if (MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.ALLOWQUESTIONTOPASS) {
				$('<button class="submit next_when_pass disabled_opacity">Next</button>').insertBefore(grp_html_main.children());
				$('<button id="group_pass-'+_index+'" class="group_pass submit" pass-data = "grppass-'+_index+'">Pass</button>').insertAfter("#team_name_"+_index);
			}
		} 
	}
	if(MASTER_DB.GROUPMODE.ALLOWGROUPS && !MASTER_DB.GROUPMODE.SHOWPROMPT) { 
		if(this.jsongroupname){
			this.grp_details = jQuery.parseJSON(this.jsongroupname);
	      	_index = index % this.grp_details.length;
	      	var grp_html_main = $("#group_score_button").html('<h3 id="team_name_'+_index+'"></h3>');
			$('#team_name_'+_index).html(this.grp_details[_index].title);
			$("#btn-done").attr('data-grp', _index);
			if (MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.ALLOWQUESTIONTOPASS) {
				$('<button class="submit next_when_pass disabled_opacity">Next</button>').insertBefore(grp_html_main.children());
				$('<button id="group_pass-'+_index+'" class="group_pass submit" pass-data = "grppass-'+_index+'">Pass</button>').insertAfter("#team_name_"+_index);
			}
		} 
	}
	
	/*countdown start*/
	if (MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.TIMEEACHQUESTION) {
		if (index == 0) {
			timer = new Timer();
			timer.start({countdown: true, precision: 'seconds', startValues: {seconds: MASTER_DB.GROUPMODE.TIMEPERQUESTION}});
			$('#app-count_down .values').html(timer.getTimeValues().toString());
			timer.addEventListener('secondsUpdated', function (e) {
			    $('#app-count_down .values').html(timer.getTimeValues().toString());
			});
		}
	} else if (MASTER_DB.GROUPMODE.ALLOWGROUPS && !MASTER_DB.GROUPMODE.TIMEEACHQUESTION && MASTER_DB.TIMER.ALLOWTIMER && MASTER_DB.TIMER.TOTALTIME && (MASTER_DB.TIMER.TIMERFOR == "activity")) {
		if (index == 0) {
			timer = new Timer();
			timer.start({countdown: true, precision: 'seconds', startValues: {seconds: MASTER_DB.TIMER.TOTALTIME}});
			$('#app-count_down .values').html(timer.getTimeValues().toString());
			timer.addEventListener('secondsUpdated', function (e) {
			    $('#app-count_down .values').html(timer.getTimeValues().toString());
			});
		} else {
			timer.start();
		}
	} else if (!MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.TIMER.ALLOWTIMER && MASTER_DB.TIMER.TIMERFOR == "activity"){
		if (index == 0) {
			timer = new Timer();
			timer.start({countdown: true, precision: 'seconds', startValues: {seconds: MASTER_DB.TIMER.TOTALTIME}});
			$('#app-count_down .values').html(timer.getTimeValues().toString());
			timer.addEventListener('secondsUpdated', function (e) {
			    $('#app-count_down .values').html(timer.getTimeValues().toString());
			});
		} else {
			timer.start();
		}
	} else if (!MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.TIMER.ALLOWTIMER && MASTER_DB.TIMER.TIMERFOR == "question"){
		if (index == 0) {
			timer = new Timer();
			timer.start({countdown: true, precision: 'seconds', startValues: {seconds: MASTER_DB.TIMER.TOTALTIME}});
			$('#app-count_down .values').html(timer.getTimeValues().toString());
			timer.addEventListener('secondsUpdated', function (e) {
			    $('#app-count_down .values').html(timer.getTimeValues().toString());
			});
		} 
	} else {
		$('#app-count_down').hide();
		$(".slider").hide();
	}
	 
	/*countdown end*/
	var dataHTML = "";
	var dataObj = MASTER_DB.QUESTIONS[index];
	$('.attempt-incorrect').removeClass('attempt-incorrect');
	$('.attempt-correct').removeClass('attempt-correct');
	$("input[type='radio']:checked").prop('checked', false);
	$("#btn-next").attr('disabled', 'disabled');
	$(".question-section").removeClass('blocker');
	$("#modal-feedback").hide();
	if(typeof this.app === 'undefined') {
		this.app = new Vue({
			el: '#devilz-content',
			data: {
				q: dataObj
			}
		})
	} else {
		Vue.set(this.app, 'q', dataObj);
	}
	
	this.attempt = 0;

	$('.question-n').removeClass('animated bounceInRight');
	setTimeout(function() {
		$('.question-n').addClass('animated bounceInRight');
	}, 10);
	$(".list__item.active").removeClass('active');
	
	$('.blinking').css('visibility', 'visible');
	$('.blinking').removeClass('blinking');
	$('.feedback_img').hide();
	$("#btn-next").attr('disabled', 'disabled');
	$("#btn-tryagain").attr('disabled', 'disabled');
	$("#btn-again").attr('disabled', 'disabled');
	$("#btn-done").attr('disabled', 'disabled');
	$('#btn-hint').attr('disabled', 'disabled');
};

MainApp.prototype.enableDoneBtn = function (e) {
	if($('input[type="radio"]:checked').length)
		$("#btn-done").removeAttr('disabled')
};

MainApp.prototype.playAudio = function(type) {
	var randomIndex = Math.floor(Math.random() * this[type].length);
	var id = this[type][randomIndex];
	soundManager.stopAll();
	soundManager.getSoundById(id).play();
	return randomIndex;
}
MainApp.prototype.submitAns = function () {
	var _this = MasterApp;
	timer.pause();
	$('.attempt-incorrect').removeClass('attempt-incorrect');
	
	var isCorrect;
	var $itemEle = $('input[type="radio"]:checked').parents('li');
	
	var ans = $itemEle.find('.secrectkey').text();
	$("#feedback-correct, #feedback-incorrect").hide();
	if(ans == "true") {
		isCorrect = true;
		$itemEle.addClass('attempt-correct');
		_this.playAudio('audioCorrectList');
		$("#feedback-correct").show();
		/*percentage calculation*/
		
		if (sessionStorage.score) {
			if (MASTER_DB.GROUPMODE.ALLOWGROUPS) {
				var this_group = jQuery.parseJSON(sessionStorage.grp_details);
				if ($(this).attr("data-grp-pass")) {
					sessionStorage.score = Number(sessionStorage.score) + MASTER_DB.GROUPMODE.POINTSPERPASS;
        			this_group[$(this).attr("data-grp")].score = this_group[$(this).attr("data-grp")].score + MASTER_DB.GROUPMODE.POINTSPERPASS;
				} else {
					sessionStorage.score = Number(sessionStorage.score) + MASTER_DB.GROUPMODE.POINTSPERANSWER;
        			this_group[$(this).attr("data-grp")].score = this_group[$(this).attr("data-grp")].score + MASTER_DB.GROUPMODE.POINTSPERANSWER;
				}
        		sessionStorage.grp_details = JSON.stringify(this_group);
        		$(this).removeAttr("data-grp-pass");
        	} else if (MASTER_DB.SCORING.ALLOWSCORING){
        		sessionStorage.score = Number(sessionStorage.score) + MASTER_DB.SCORING.POINTSPERANSWER;
        	}
        } else {
        	if (MASTER_DB.GROUPMODE.ALLOWGROUPS) {
        		var this_group = jQuery.parseJSON(sessionStorage.grp_details);
        		if ($(this).attr("data-grp-pass")) {
        			sessionStorage.score = this_group[$(this).attr("data-grp")].score = MASTER_DB.GROUPMODE.POINTSPERPASS;
        		} else {
        			sessionStorage.score = this_group[$(this).attr("data-grp")].score = MASTER_DB.GROUPMODE.POINTSPERANSWER;
        		}
        		$(this).removeAttr("data-grp-pass");
        		sessionStorage.grp_details = JSON.stringify(this_group);
        	} else if (MASTER_DB.SCORING.ALLOWSCORING){
        		sessionStorage.score = MASTER_DB.SCORING.POINTSPERANSWER;
        	}
        }
        //
        /*percentage calculation*/
	} else {
		isCorrect = false;
		$itemEle.addClass('attempt-incorrect');
		_this.playAudio('audioIncorrectList');
		$("#feedback-incorrect").show();
	}
	if (!MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.SCORING.ALLOWSCORING) {
		if (sessionStorage.score) {
			console.log("score: "+sessionStorage.score);
			$("#my_score").show();
			$("#my_score h5").html(sessionStorage.score);
		} else {
			$("#my_score").show();
			$("#my_score h5").html(0);
		}
	}
	if (MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.SCORING.ALLOWSCORING) {
		$("#leaderboard2").css("display", "flex");
		var this_group = jQuery.parseJSON(sessionStorage.grp_details);
		$.each(this_group, function(index, value) {
			$("<li>"+value.title+"<span>"+value.score+"</span></li>").appendTo("#group_score_board2");
		});
		$(".cross_section").click(function(){
			$("#leaderboard2").css("display", "none");
			$("#group_score_board2").empty();
		});
	}
	console.log("score: "+sessionStorage.score);
	console.log("total: "+MASTER_DB.QUESTIONS.length);
	try {
		clearTimeout(kidTimeout);
	} catch(e) {}
	$('.feedback_img').show();
	window.kidTimeout = setTimeout(function() {
		$('.feedback_img').hide();
		$("#feedback-correct, #feedback-incorrect").hide();
	}, MASTER_DB.CONFIG.FEEDBACK_TIME);

	if (MASTER_DB.SCORING.ALLOWSCORING) {
		_this.checkForNext();
	} else {
		if(!isCorrect) {
			$("#btn-tryagain").removeAttr('disabled');
			
			_this.attempt++;
			if(_this.attempt >= MASTER_DB.CONFIG.HINT) {
				$("#btn-hint").removeAttr('disabled'); 			
				$("#btn-tryagain").attr('disabled', 'disabled');
				//$("#btn-next").removeAttr('disabled');
			}
		} else {
			_this.checkForNext();
		}
	}
		

	var feedbackObj = _this.app.q.feedback;
	if(typeof feedbackObj == "object") {
		var feedbackHTML = isCorrect ? feedbackObj.positive : feedbackObj.negative;
		$("#feedback-text").html(feedbackHTML);
		//$("#modal-feedback").show();
	}
	
	$("#btn-done").attr('disabled', 'disabled');
	$(".question-section").addClass('blocker');
};

MainApp.prototype.checkForNext = function () {
	
	if(this.total == this.current + 1) {
		var _this = this;
		setTimeout(function() {
			$("body").addClass('completed');
			$("#screen-gameplay").hide();
			$("#screen-result").show();
			$("#btn-answers").removeAttr('disabled');
			var index = _this.playAudio('audioCompleteList');
			$("#completemsg-text").html(MASTER_DB.COMPLETE.TEXT[index]);
			/*percentage calculation*/
			if (MASTER_DB.GROUPMODE.ALLOWGROUPS) {
				$("#group_score_button").hide();
				$(".complete_img").hide();
				$(".complete_msg").hide();
				$("#app-count_down").hide();
				$(".slider").hide();
				$("#leaderboard").css("display", "flex");
				var this_group = jQuery.parseJSON(sessionStorage.grp_details);
				//console.log(this_group);
				$.each(this_group, function(index, value) {
					$("<li>"+value.title+"<span>"+value.score+"</span></li>").appendTo("#group_score_board");
				});
        	} else if (!MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.SCORING.ALLOWSCORING){
        		$("#app-count_down").hide();
			    $(".slider").hide();
			    $("#my_score").hide();
        		var percentage = (sessionStorage.score/(MASTER_DB.QUESTIONS.length*MASTER_DB.SCORING.POINTSPERANSWER))*100;
        		$("#percentage-text").html(percentage.toFixed(2) + ' %');
        		$("#group_score_button").hide();
				if (percentage >= 90) {
					$("#three_star").show();
				} else if (percentage >= 60) {
					$("#two_star").show();
				} else {
					$("#one_star").show();
				}
        	} else if (!MASTER_DB.GROUPMODE.ALLOWGROUPS && !MASTER_DB.SCORING.ALLOWSCORING) {
        		$("#percentage-text").hide();
        		$("#app-count_down").hide();
			    $(".slider").hide();
        	} 
			
			
			/*percentage calculation*/
			$("#btn-again").removeAttr('disabled');
		}, MASTER_DB.CONFIG.RESULT_TIME);
	} else {
		$("#btn-next").removeAttr('disabled');
	}
};

MainApp.prototype.tiggerNextQuestion = function(){
	if (MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.TIMEEACHQUESTION) {
		$('#app-count_down').trigger('complete');
	} else{
		MasterApp.nextQuestion();
	}
}

MainApp.prototype.submitAgain = function () {	
	timer.start();/*coutdown*/
	$('.attempt-incorrect').removeClass('attempt-incorrect');
	$('.attempt-correct').removeClass('attempt-correct');
	$("input[type='radio']:checked").prop('checked', false);
	$("#btn-next").attr('disabled', 'disabled');
	$("#btn-tryagain").attr('disabled', 'disabled');
	$("#btn-done").attr('disabled', 'disabled');
	$("#btn-hint").attr('disabled', 'disabled');
	$(".question-section").removeClass('blocker');
	$('.list__item.active').removeClass('active');
};

MainApp.prototype.showHint = function () {
	$("#btn-hint").attr('disabled', 'disabled');
	var _this = MasterApp;

	var rightEles = $('#optionsInput').find('li').map(function() {
		var val = $(this).find('.secrectkey').text();
		if(val == 'true')
			return this;
	}).get();
	$(rightEles).addClass('blinking');
	
	var intervalHolder;
	$('.blinking').each(function() {
		var elem = $(this);
		intervalHolder = setInterval(function() {
			if (elem.css('visibility') == 'hidden') {
				elem.css('visibility', 'visible');
			} else {
				elem.css('visibility', 'hidden');
			}    
		}, 500);
	});
	
	
	
	setTimeout(function() {
		//_this.submitAgain();
		clearInterval(intervalHolder);
		$('.blinking').css('visibility', 'visible');
		$('.blinking').removeClass('blinking');
		if(MasterApp.current+1 == MasterApp.total) {
			//$("#btn-answers").removeAttr('disabled');
			MasterApp.checkForNext();
		} else {
			$("#btn-next").removeAttr('disabled');
		}
	}, 3100);

	$("#btn-tryagain").attr('disabled', 'disabled');
	
	
}
	

MainApp.prototype.submitCorrect = function () {
	var _this = MasterApp;
	$("#area-action").hide();
	$("#area-static").show(); 
	var qs = MASTER_DB.QUESTIONS;
	var ansHTML = "";
	for(var i=0; i<qs.length; i++) {
		ansHTML += '<tr><td><p class="ans-opt-static">' + (i+1) + '. ' + qs[i].title + '</p></td><td>' + _this.getAns(qs[i].options) + '</td></tr>';
	}
	$("#gatherAnswer tbody").html(ansHTML);
	$("#btn-answers").attr('disabled', 'disabled');
	$("#btn-again").removeAttr('disabled', 'disabled');
	$("#app-instruction").text('');
	

	var obj = MasterApp.app.q;
	obj.title = MASTER_DB.ANSWERS.INSTRUCTION;
	//$("#ans-title").html(MASTER_DB.ANSWERS.INSTRUCTION);
	Vue.set(MasterApp.app, 'q', obj);
	$("#btn-again").removeAttr('disabled');
	$("body").addClass('gamecompleted-screen');
	$("#screen-result").hide();
	$("#screen-gameplay").show();
};

MainApp.prototype.playAgain = function() {
	window.location.reload();
};

MainApp.prototype.getAns = function (opts) {
	var result = [];
	for(var key in opts) {
		if(opts[key] == true)
			result.push(key);
	}
	return result.join(", ")
};

function closeModal (eleId) {
	$("#" + eleId).fadeOut();
}
/*group func start*/
MainApp.prototype.creategroup = function() {
	$(".quantity-down").addClass("quantity-less");
	$(".quantity-up").addClass("quantity-more");
	$("#groupButton").attr('disabled', 'disabled');
	$("#namedgroupButton").prop("disabled", false);
	$(".groupname").remove();
	var first = "a", last = "z";
	var groupcount = $("#group_count").val();
	var inc_group = 1;
	for(var i = first.charCodeAt(0); i <= last.charCodeAt(0); i++) {
		if (inc_group <= groupcount){
			var element = $("#groupname").
			append('<input class = "groupname" value = "'+ MASTER_DB.CONFIG.DEFAULT_GROUP_NAME + " "  + String.fromCharCode(i).toUpperCase() +'" id = "groupname-'+i+'" type = "text">');
			inc_group++;
		}
	}
};

MainApp.prototype.pop_it_up = function(e) {
	$(this).hide();
};

MainApp.prototype.dontclose = function(e) {
	//e.preventDefault();
	return false;
};

MainApp.prototype.namedgroup = function() {
	if(MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.SHOWPROMPT) {
		var groupname = [];
		$(".groupname").each(function( index ) {
			if ($(this).val() != "") {
				groupname.push({
			        title: $(this).val(),
			        score: 0
			    });
			} else {
				groupname.push({
			        title: MASTER_DB.CONFIG.DEFAULT_GROUP_NAME + (index + 1),
			        score: 0
			    });
			}
		});
		this.jsongroupname = JSON.stringify(groupname);
	    $("#pop_over").hide();
	} else if (MASTER_DB.GROUPMODE.ALLOWGROUPS && !MASTER_DB.GROUPMODE.SHOWPROMPT) {
		var inc_group = 1;
		var first = "a", last = "z";
		for(var i = first.charCodeAt(0); i <= last.charCodeAt(0); i++) {
			if (inc_group <= MASTER_DB.GROUPMODE.DEFAULTGROUPS){
				var element = $("#groupname").
				append('<input class = "groupname" value = "'+ MASTER_DB.CONFIG.DEFAULT_GROUP_NAME + " "  + String.fromCharCode(i).toUpperCase() +'" id = "groupname'+i+'" type = "text">');
				inc_group++;
			}
		}
		var groupname = [];
		
		$(".groupname").each(function( index ) {
			if ($(this).val() != "") {
				groupname.push({
			        title: $(this).val(),
			        score: 0
			    });
			} else {
				groupname.push({
			        title: MASTER_DB.CONFIG.DEFAULT_GROUP_NAME + (index + 1),
			        score: 0
			    });
			}
		});
		this.jsongroupname = JSON.stringify(groupname);
		sessionStorage.setItem("grp_details", this.jsongroupname);
	}
	var _this = MasterApp;
	if(MASTER_DB.GROUPMODE.ALLOWGROUPS && MASTER_DB.GROUPMODE.RANDOMIZE) {
		MASTER_DB.QUESTIONS = _this.shuffle(MASTER_DB.QUESTIONS, jQuery.parseJSON(this.jsongroupname).length);
	}
};

/*group func end*/
var MasterApp, timer;
var quesion_count = maxpass = 0;
$(document).ready(function(e) {
	MasterApp = new MainApp();
	$("#btn-again").click(function(e) {
		MasterApp.playAgain();
	});
	$("#end_quiz").click(function(e) {
		MasterApp.playAgain();
	});
	$('#startButton').click(function() {
		$('.starterScreen').hide();	
		$('.container').show();
		MasterApp.timerenable(quesion_count);
	});
	
});