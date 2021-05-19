var ManageSurvey = {};
(function (out) {
    "use strict";

    // Consts 
    var SIMPLE_ANSWER   = 0;
    var MULTIPLE_ANSWER = 1;

    // Cache Retrieved Data
    var questionTypeDB  = false; // Current Survey Question Type (Simple, Multiple)
    var questionIdDB    = false; // Survey ID
    var sbookID         = false;
    var createdBy       = false;
    var traceID         = false;
    var pin             = false;

    // Flags
    var ready           = false; // Page not loaded? Don't Submit anything
    var submitted       = false; // Form State? Pre/Post Submission

    function SendPayload (answers) {

        var data = {
            SbookID     : sbookID,
            SurveyID    : questionIdDB,
            Answers     : "abandoned",
            CreatedBy   : createdBy,
            TraceID     : traceID,
            PIN         : pin
        };

        if (answers) data.Answers = answers

        $.ajax({

            type: "POST",
            url : "../components/controllers/controllerProcessSurvey.asp",
            data : data,

            success : function (payload) {},
            error   : function (err) {}
        });
    }

    // Handle Submit/Close Button
    $('#survey_send').click(function() {
        // Page Loaded?
        if (ready) {

            // If we haven't submitted, then submit.
            if (!submitted) {

                var userAnswers = "";

                if (questionTypeDB === SIMPLE_ANSWER) {

                    var answer0 = document.getElementById("survey_answer_0");
                    var answer1 = document.getElementById("survey_answer_1");

                    if (answer0.checked) {
                        userAnswers = answer0.value;
                    }
                    else if (answer1.checked) {
                        userAnswers = answer1.value;
                    }
                }
                else if (questionTypeDB === MULTIPLE_ANSWER) {
                    
                    var answers = document.getElementsByClassName("simple-bigcheckbox");
                    for (var i = 0; i < answers.length; i += 1) {

                        // var inputAnswer = answers[i].childNodes[1];
                        var inputAnswer = answers[i].childNodes[0];
                        var isChecked   = inputAnswer.checked;
                        var answer      = inputAnswer.value;

                        if (isChecked) userAnswers += answer + "/";
                    }
                    // Trimp that last slash in the string
                    userAnswers = userAnswers.substring(0, userAnswers.length - 1);
                }

                var mainTxt     = document.getElementById("survey_apology");
                var mainSub     = document.getElementById("survey_apology_sub");
                var sendBtn     = document.getElementById("survey_send");

                SendPayload(userAnswers);

                mainTxt.innerHTML = "Thank you for your feedback!";
                mainSub.innerHTML = "Your survey has been submitted.";
                sendBtn.innerHTML = "CLOSE";

                // Prepare "Thank you" view by hiding elements
                $('#question').hide();
                $('#survey_question').hide();
                $('#survey_answer').hide();

                // Show sports book phone number in "Thank You" view
                $('#survey_contact').show();

                submitted = true; // Set Flag
            }
            // We've already submitted answers? This button now closes view
            else $('#survey_view').hide(); 
        }

    });

    // Handle X Exit Button
    $('#close_survey').click(function() {
        if (!submitted) SendPayload(false); // No answers, pressed X = ignored. We need to save this too.
        $('#survey_view').hide();
    });

    // Simple Answer Template
    function singleAnswerTemplate (answer, index) {

        var defaultAnswer = "";

        // Will create class and remote the inline style...
        var template = "<label class='simple-bigcheckbox' style='display: inline-block; width: 100px;'><input id='survey_answer_"+ index +"' name='answer0' value='"+ answer +"' type='checkbox' "+ defaultAnswer +"><span class='simple-bigcheckbox-proxy'></span>"+ answer + "</label>";

        return template;
    }

    // Multiple Answer Template
    function multipleAnswerTemplate (answer, index) {

        // Will create class and remote the inline style...
        var template = "<label class='simple-bigcheckbox' style='display: inline-block; width: 100px;'><input id='survey_answer_"+ index +"' name='answer1' value='"+ answer +"' type='checkbox'><span class='simple-bigcheckbox-proxy'></span>"+ answer +"</label>";
        return template;
    }


    // Create and Render retrieved answers
    function instantiateAnswers () {

        var answersDB = document.getElementById("survey_answersDB").value;

        switch (questionTypeDB) {

            case SIMPLE_ANSWER:
                var surveyView = document.getElementById("survey_view");
                surveyView.style.opacity = 1;
                // Parse Answers
                var tokens          = answersDB.split("/");
                var answerContainer = document.getElementById("survey_answer");

                // Add answer Elements to Container
                answerContainer.innerHTML += singleAnswerTemplate(tokens[0], 0);
                answerContainer.innerHTML += singleAnswerTemplate(tokens[1], 1);

                // Create Event Listeners for the only two possible answers
                // We're also making sure we don't uncheck an already checked element
                $('#survey_answer_0').change(function() {
                    var checked = $(this).prop('checked');
                    if (checked)  $('#survey_answer_1').prop("checked", false);
                    else  $('#survey_answer_0').prop("checked", true);
                });

                $('#survey_answer_1').change(function() {
                    var checked = $(this).prop('checked');
                    if (checked)  $('#survey_answer_0').prop("checked", false);
                    else  $('#survey_answer_1').prop("checked", true);
                });

            break;

            case MULTIPLE_ANSWER:
                var surveyView = document.getElementById("survey_view");
                surveyView.style.opacity = 1;
                // Parse Answer String
                var tokens          = answersDB.split("/");
                var answerContainer = document.getElementById("survey_answer");

                // Create Answer Elements
                for (var i = 0; i < tokens.length; i += 1) answerContainer.innerHTML += multipleAnswerTemplate(tokens[i], i);

            break;

            default:
            console.warn("Unrecognized Survey Question Type or no Questions/Answers in record.");
            var questionDB = document.getElementById("survey_questionDB").value;
            if (answersDB === "" || questionDB === "") {
                var surveyView = document.getElementById("survey_view");
                surveyView.style.display = "none";
            }

            break;
        }

        $('.simple-bigcheckbox').change(function() {

            var answers             = document.getElementsByClassName("simple-bigcheckbox");
            var itemStillSelected   = false;

            for (var i = 0; i < answers.length; i += 1) {

                var inputAnswer = answers[i].childNodes[0];
                var isChecked   = inputAnswer.checked;

                if (isChecked) itemStillSelected = true;
            }

            if (itemStillSelected) $("#survey_send").prop('disabled', false);
            else $("#survey_send").prop('disabled', true);            
        });

    }

    function init () {

        // Get Hidden Inputs containing Question type and answers
        var questionDB      = document.getElementById("survey_questionDB").value;
        questionTypeDB      = document.getElementById("survey_questionTypeDB").value;
        questionIdDB        = document.getElementById("survey_questionIdDB").value;
        sbookID             = document.getElementById("survey_sbookID").value;
        createdBy           = document.getElementById("survey_createdby").value;
        traceID             = document.getElementById("survey_traceID").value;
        pin                 = document.getElementById("survey_pin").value;
        // Check if we found something in the hidden elements before using parseInt
        if (questionIdDB !== "")    questionIdDB    = parseInt(questionIdDB);
        if (questionTypeDB !== "")  questionTypeDB  = parseInt(questionTypeDB);

        // Actual Survey DOM Elements
        var question        = document.getElementById("survey_question");
        question.innerHTML  = questionDB; // Update Question Element

        // Render Answers
        instantiateAnswers();
        ready = true; // Survey ready for answers...
    }

    window.onload = init;

})(ManageSurvey);