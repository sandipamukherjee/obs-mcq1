const MASTER_DB = {
  "CONFIG": {
    "HINT": 2,
    "TITLE": "READ THE GRAPH",
    "INSTRUCTION": "Click the correct option. Press <b>Done</b>.",
    "INSTRUCTIONS": [
      "Click <b>Start</b> to begin the activity.",
      "Questions will appear one by one.",
      "Click the correct option. You can change your answer.",
	    "Once you have decided on your answer, press <b>Done.</b>"
    ],
    "FEEDBACK_TIME": 3000,
    "RESULT_TIME": 2000,
    "COUNT_DOWN" : 3600,
    "DEFAULT_GROUP_NAME" : "Group"
  },

	"AUDIO": {
		"COMPLETE": [
			"audio/Activity-completion/Encouragement-files-09-yippee-you-have-completed.mp3",
			"audio/Activity-completion/Encouragement-files-10-congratulations-you-are.mp3"
		],
		"POSITIVE": [
			"audio/Positive-encouragement-files/Encouragement-files-01-yippee.mp3",
			"audio/Positive-encouragement-files/Encouragement-files-02-yay.mp3",
			"audio/Positive-encouragement-files/Encouragement-files-03-well done.mp3",
			"audio/Positive-encouragement-files/Encouragement-files-04-good.mp3",
			"audio/Positive-encouragement-files/Encouragement-files-05-thats right.mp3",
			"audio/Positive-encouragement-files/Encouragement-files-06-correct.mp3",
			"audio/Positive-encouragement-files/Encouragement-files-08-very good.mp3"
		],
		"NEGATIVE": [
			"audio/Negative-encouragement-files/Negative-Encouragement-files-01-oops.mp3",
			"audio/Negative-encouragement-files/Negative-Encouragement-files-02-oops.mp3",
			"audio/Negative-encouragement-files/Negative-Encouragement-files-03-oh no.mp3",
			"audio/Negative-encouragement-files/Negative-Encouragement-files-05-that is not right.mp3",
			"audio/Negative-encouragement-files/Negative-Encouragement-files-06-incorrect answer.mp3"
		]
	},

  "COMPLETE": {
    "TEXT": [
      "YIPPEE! <br/> You have completed the activity!",
      "CONGRATULATIONS! You are a star!"
    ]
  },
  "INCOMPLETE": {
    "TEXT": [
      "SORRY! <br/> You can not complete the activity!"
    ]
  },

  "QUESTIONS": [
    
    {
      "figure": "img/question.png",
      "figcaption": "Distance–time graph for non-uniform motion of a car",
      "title": "What is the speed of the car at 17 min from the start?",
      "options": {
        "4 km/min": false,
        "40 m/min": false,
        "40 km/h": false,
        "0 km/min": true
      },
      "feedback": {
        "positive": "Good Job. That's correct.",
        "negative": "Oh no, Try again."
      }
    },
    {
      "figure": "img/question.png",
      "figcaption": "Distance–time graph for non-uniform motion of a car",
      "title": "What distance does the car cover between 20 min and 30 min from the start?",
      "options": {
        "4 km": false,
        "9 km": false,
        "5 km": true,
        "7 km": false
      },
      "feedback": {
       "positive": "Good Job. That's correct.",
        "negative": "Oh no, Try again."
      }
    },
    {
      "figure": "img/question.png",
      "figcaption": "Distance–time graph for non-uniform motion of a car",
      "title": "What is the total distance travelled by the car? ",
      "options": {
        "30 km": false,
        "9 km": true,
        "25 km": false,
        "39 km": false
      },
      "feedback": {
        "positive": "Good Job. That's correct.",
        "negative": "Oh no, Try again."
      }
    },
    {
      "figure": "img/question.png",
      "figcaption": "Distance–time graph for non-uniform motion of a car",
      "title": "What is the average speed of the car? ",
      "options": {
        "<img src='img/options/option1.png' alt=''>": false,
        "<img src='img/options/option2.png' alt=''>": false,
        "<img src='img/options/option3.png' alt=''>": true,
        "<img src='img/options/option4.png' alt=''>": false
      },
      "feedback": {
        "positive": "Good Job. That's correct.",
        "negative": "Oh no, Try again."
      }
    }
  ],
  "ANSWERS": {
    "INSTRUCTION": "Answer key"
  },
  "SCORING": {
      "ALLOWSCORING" : true,
      "POINTSPERANSWER": 3.5
  },
  "TIMER": {
    "ALLOWTIMER": true,
    "TOTALTIME": 300,
    "TIMERFOR": "activity"
  },
  "GROUPMODE": {
    "ALLOWGROUPS": true,
    "SHOWPROMPT": true,
    "DEFAULTGROUPS": 2,
    "TIMEEACHQUESTION": true,
    "TIMEPERQUESTION": 30,
    "ALLOWQUESTIONTOPASS": true,
    "MAXPASSES": 2,
    "POINTSPERANSWER": 10,
    "POINTSPERPASS": 5,
    "RANDOMIZE": true,
    "GROUPPOPUPTEXT_UP" : "Divide the class into teams and label them A, B, C and so on.",
    "GROUPPOPUPTEXT_DOWN" : "How many teams do you want to have?"
  }
}