let correctCount = 0;
let falseCount = 0;
let qCount = 1;
let timeOutId;
let secondTimeOut;
let time = 15;
let startState = false;

let triviaUrl = "https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986";

var shuffledAnswers = new Array();
let correctAnswer = "";

function getQuestions() {
    clearTimeout(secondTimeOut);

    $.ajax({
        url: triviaUrl,
        method: 'GET'
    }).then(function (response) {

        if(qCount <= 10){
            //get the answers from the json and push them in to an array
            shuffledAnswers =[];
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

            timeOutId = setInterval(countDown, 1000);
        }
        else{
            displayResults();
        }
    

    }).catch(function (err) {
        console.log(err);
    });
}

//reset the game
function reset() {
    correctCount = 0;
    falseCount = 0;
    qCount = 1;
    time = 15;
    clearInterval(timeOutId);

    startState = false;
    $("#triviaDiv").empty();
    $("#triviaDiv").append(`<button type="button" id ="startBut" class="btn btn-info btn-lg btn-block my-5"> START! </button>`);
}

function displayResults(){
    $("#triviaDiv").empty();
    $("#triviaDiv").append(`<h4> Correct : ${correctCount} </h4>`);
    $("#triviaDiv").append(`<h4> Incorrect : ${falseCount} </h4>`);
    $("#triviaDiv").append(`<button type="button" id = "resetBut"> Restart! </button>`);
}

function countDown(){
    time--;
    $("#time").text(`Time Left: ${time}`);

    if(time == 0){
        clearInterval(timeOutId);
        falseCount++;
        qCount++;
        time = 15;
        getQuestions();
     }
     
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
    $("#triviaDiv").empty();

    //get the question and render it 
    let tQuestion = unescape(response.results[0].question);//decode the question string
    let questionDiv = $("<div>");//create a div for the question
    questionDiv.addClass("questionDiv");//add the class to the div
    questionDiv.html(`<h4 id = "question"> ${tQuestion} </h4>
                        <h5 id ="time"> Time Left: ${time} </h5>`);//add the html for the div
    questionDiv.appendTo($("#triviaDiv"));//append the questionDiv to TriviaDiv

    //displaying the answers
    shuffledAnswers.forEach(element => {
        let tAnswer = unescape(element);//decode the answers string
        let answersButton = $(`<button type="button" class="btn btn-primary btn-lg btn-block">`);//create a div for the answers
        answersButton.addClass("answersButton");//add the class for the div
        
        //tagging the correct and incorrect answers
        if(element === correctAnswer){
            answersButton.attr("data-value", "correct");
        }else{
            answersButton.attr("data-value", "incorrect");
        }

        answersButton.html(`<p> ${tAnswer}  </p>`);//add the html to the div

        answersButton.appendTo("#triviaDiv");
    });

    

}

$("#triviaDiv").on("click", ".answersButton", function() {
    clearInterval(timeOutId);

    if ($(this).attr("data-value") === "correct" ) {
        $(this).removeClass().addClass("btn btn-success btn-lg btn-block m-3");
        $(this).attr("")
        correctCount++;
    }
    else{
        $(this).removeClass().addClass("btn btn-danger btn-lg btn-block");
        falseCount++;
    }

    qCount++;
    time = 15;

    let secondTimeOut = setTimeout(getQuestions, 500);
    //getQuestions();

    console.log("Correct : " +correctCount);
    console.log("Incorrect : " + falseCount);
});

$("#triviaDiv").on("click","#resetBut",function(){
    reset();
});

$("#triviaDiv").on("click","#startBut",function(){
    startState = true;
    getQuestions();
});
