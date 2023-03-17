'use strict';
var returnResult;
var OKey;
var maxTokens;
var messageBanner;

(function () {

    Office.onReady(function () {
        // Office is ready.

        // Initialize the notification mechanism and hide it

        $(document).ready(function () {
            // The document is ready.
            // Use this to check whether the API is supported in the Word client.
            OKey = getCookie('iKanKey');
            maxTokens = getCookie('iKanTokens');
            document.getElementById('txtKey').value = OKey;
            // set default max tokens
            if (maxTokens == null) {
                maxTokens = 200;
            }
            document.getElementById('txtmaxtokens').value = maxTokens;

            if (Office.context.requirements.isSetSupported('WordApi', '1.1')) {
                // Do something that is only available via the new APIs.
                $('#btnrewrite').click(btnrewrite);
                $('#btnIdeas').click(btnIdeas);
                $('#btnSaveSettings').click(btnSaveSettings);
                $('#supportedVersion').html('This code is using Word 2016 or later.');

            }
            else {
                // Just letting you know that this code will not work with your version of Word.
                $('#supportedVersion').html('This code requires Word 2016 or later.');
            }
        });
    });

    function getCookie(cookieName) {
        const returnItem = localStorage.getItem(cookieName);
        if (returnItem != "") {
            return returnItem;
        } else {
            return returnItem = "";
        }

    }

    async function btnIdeas() {
        if (OKey != null) {

            document.getElementById('circleloader-2').style.visibility = "visible";
            await Word.run(async (context) => {

                returnResult = "";
                const body = context.document.body;

                callGPT3(document.getElementById('txtIdeas').value, "circleloader-2").then(
                    function (value) {
                        body.insertText(returnResult, Word.InsertLocation.end);
                        context.sync();
                        document.getElementById('circleloader-2').style.visibility = "hidden";
                    },
                    function (error) { document.getElementById('message').innerText = "error"; }
                );

            })
                .catch(function (error) {
                    //console.log('Error: ' + JSON.stringify(error));
                    errorHandler('Error: ' + JSON.stringify(error));
                    if (error instanceof OfficeExtension.Error) {
                        //console.log('Debug info: ' + JSON.stringify(error.debugInfo));
                        errorHandler('Debug info: ' + JSON.stringify(error.debugInfo));
                    }
                });
        } else {
            errorHandler("Please add a OpenAI key in the Settings.");
            }

    }

    function btnrewrite() {
        write("", false);
        if (OKey != null) {
            document.getElementById('circleloader-1').style.visibility = "visible";
            var prompt = "Rewrite the following \n";

            var result;
            Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, function (asyncResult) {
                if (asyncResult.status == Office.AsyncResultStatus.Failed) {
                    errorHandler('Action failed. Error: ' + asyncResult.error.message, true);
                }
                else {

                    if (asyncResult.value.length < 20) {
                        errorHandler('Text is not selected or is less than 20 characters.');
                        document.getElementById('circleloader-1').style.visibility = "hidden";
                    } else {

                        prompt += asyncResult.value;
                        callGPT3(prompt, "circleloader-1").then(
                            function (value) {
                                write(returnResult, false);
                                document.getElementById('circleloader-1').style.visibility = "hidden";
                            },
                            function (error) {
                                errorHandler(error.message);
                                document.getElementById('circleloader-1').style.visibility = "hidden";
                            }
                        );

                    }
                }
            });


        } else {
            errorHandler("Please add a OpenAI key in the Settings.");

        }

    }

    async function write(message, isError) {
        if (isError) {
            document.getElementById('message').style.color = "red";
            document.getElementById('message').style.fontWeight = "bold";
        } else {
            document.getElementById('message').style.color = "black";
            document.getElementById('message').style.fontWeight = "normal";
        }
        document.getElementById('message').innerText = message;

    }

    async function callGPT3(prompt, loaderName) {

        let myPromise = new Promise(function (resolve) {

            document.getElementById(loaderName).style.visibility = "visible";
            const params = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    { "role": "system", "content": "You are a helpful English professor ." },
                    { "role": "user", "content": +'"'  + prompt +'"'  }
                    ],
                "max_tokens": parseInt(maxTokens),
                "temperature": 0.7,
                "frequency_penalty": 0.5
            };
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://api.openai.com/v1/chat/completions", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Authorization", `Bearer ${OKey}`);  
            xhr.send(JSON.stringify(params));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    returnResult = json.choices[0].message.content // json.choices[0].text;
                    resolve("done!");
                }
            };
            
        });

        await myPromise

    }

    function btnSaveSettings() {

        localStorage.clear();
        OKey = document.getElementById('txtKey').value;
        maxTokens = document.getElementById('txtmaxtokens').value;

        localStorage.setItem('iKanKey', OKey);
        localStorage.setItem('iKanTokens', maxTokens);

    }

    function errorHandler(error) {
        document.getElementById('alert-message').style.display = "block";
        document.getElementById('errDesc').innerText = error;
    }

 
})();
