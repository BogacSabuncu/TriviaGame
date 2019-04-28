let correctCount = 0;
let falseCount = 0;
let triviaUrl = "https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986";

var shuffledAnswers = new Array();
let correctAnswer = "";

function getQuestions() {
    $.ajax({
        url: triviaUrl,
        method: 'GET'
    }).then(function (response) {

        //get the answers from the json and push them in to an array
        shuffledAnswers.push(response.results[0].correct_answer);
        correctAnswer = response.results[0].correct_answer;

        response.results[0].incorrect_answers.forEach(element => {
            shuffledAnswers.push(element)
        });

        //shuffle the array
        shuffledAnswers = shuffleArr(shuffledAnswers);

        console.log(correctAnswer);
        console.log(shuffledAnswers);

        renderQuestion(response);

    }).catch(function (err) {
        console.log(err);
    });
}

//reset the game
function reset() {
    correctCount = 0;
    falseCount = 0;
}

//shuffle the array function
function shuffleArr(arr){
    var j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}

function renderQuestion(response) {

    //get the question and render it 
    let tQuestion = unescape(response.results[0].question);//decode the question string
    let questionDiv = $("<div>");//create a div for the question
    questionDiv.addClass("questionDiv");//add the class to the div
    questionDiv.html(`<h4> ${tQuestion} </h4>`);//add the heml for the dic
    questionDiv.appendTo($("#triviaDiv"));//append the questionDiv to TriviaDiv

    //displaying the answers
    shuffledAnswers.forEach(element => {
        let tAnswer = unescape(element);//decode the answers string
        let answersDiv = $("<div>");//create a div for the answers
        answersDiv.addClass("answersDiv");//add the class for the div
        
        //tagging the correct and incorrect answers
        if(element === correctAnswer){
            answersDiv.attr("data-value", "correct");
        }else{
            answersDiv.attr("data-value", "incorrect");
        }

        answersDiv.html(`<p> ${tAnswer}  </p>`);//add the html to the div

        answersDiv.appendTo("#triviaDiv");
    });

}

getQuestions();



