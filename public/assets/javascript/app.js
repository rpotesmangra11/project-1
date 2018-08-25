$(document).ready(() => {
    console.log("ready")
    var config = {
        apiKey: "AIzaSyCe6RdQ713wNfR_pyx9yFVpRp82_YehtOs",
        authDomain: "project-1-f279d.firebaseapp.com",
        databaseURL: "https://project-1-f279d.firebaseio.com",
        projectId: "project-1-f279d",
        storageBucket: "project-1-f279d.appspot.com",
        messagingSenderId: "840313509707"
    };
    firebase.initializeApp(config);

    //stats 
    var att;
    var def;
    var health;

    //base stats
    var baseatt = 10;
    var basedef = 10;
    var basehealth = 200;

    //Select image file
    $(function () {
        $(":file").change(function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = imageIsLoaded;
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
    //Display image file
    function imageIsLoaded(e) {
        var imgdataURL = e.target.result;
        $('#user1-face').attr('src', imgdataURL);
        var hpUp = 0;
        var hpDown = 0;
        var attUp = 0;
        var attDown = 0;
        var defUp = 0;
        var defDown = 0;
        console.log(imgdataURL);
        processImage()

        //Face API
        function processImage() {
            var subscriptionKey = "06fb82297d134fde9722b84fab719531";
            var uriBase =
                "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

            // Request parameters.
            var params = {
                "returnFaceId": "true",
                "returnFaceLandmarks": "false",
                "returnFaceAttributes":
                    "age,gender,headPose,smile,facialHair,glasses,emotion," +
                    "hair,makeup,occlusion,accessories,blur,exposure,noise"
            };

            //Make Blob for Ajax call
            makeblob = function (dataURL) {
                var BASE64_MARKER = ';base64,';
                if (dataURL.indexOf(BASE64_MARKER) == -1) {
                    var parts = dataURL.split(',');
                    var contentType = parts[0].split(':')[1];
                    var raw = decodeURIComponent(parts[1]);
                    return new Blob([raw], { type: contentType });
                }
                var parts = dataURL.split(BASE64_MARKER);
                var contentType = parts[0].split(':')[1];
                var raw = window.atob(parts[1]);
                var rawLength = raw.length;

                var uInt8Array = new Uint8Array(rawLength);

                for (var i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                }

                return new Blob([uInt8Array], { type: contentType });
            }
            console.log(makeblob(imgdataURL));

            // Perform the REST API call.
            $.ajax({
                url: uriBase + "?" + $.param(params),

                // Request headers.
                beforeSend: function (xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                },

                type: "POST",
                processData: false,
                data: makeblob(imgdataURL),
            })

                .done(function (data) {
                    // Show formatted JSON on webpage.
                    var emotionData = data[0].faceAttributes.emotion;
                    console.log(emotionData);

                    //stat boosts
                    if (emotionData.anger > 0) {
                        attUp += Math.floor(Math.random() * (10 - 5)) + 5;
                        defDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        hpUp += Math.floor(Math.random() * (10 - 5)) + 5;
                    };
                    if (emotionData.contempt > 0) {
                        defDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        hpDown += Math.floor(Math.random() * (10 - 5)) + 5;
                    };
                    if (emotionData.disgust > 0) {
                        attDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        defDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        hpDown += Math.floor(Math.random() * (10 - 5)) + 5;
                    };
                    if (emotionData.fear > 0) {
                        attDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        defDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        hpDown += Math.floor(Math.random() * (10 - 5)) + 5;
                    };
                    if (emotionData.happiness > 0) {
                        attDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        defUp += Math.floor(Math.random() * (10 - 5)) + 5;
                        hpUp += Math.floor(Math.random() * (10 - 5)) + 5;
                    };
                    if (emotionData.neutral > 0) {
                        attUp += Math.floor(Math.random() * (100 - 20)) + 20;
                        defUp += Math.floor(Math.random() * (100 - 20)) + 20;
                        hpUp += Math.floor(Math.random() * (100 - 20)) + 20;
                    };
                    if (emotionData.sadness > 0) {
                        attUp += Math.floor(Math.random() * (30 - 10)) + 10;
                        defUp += Math.floor(Math.random() * (30 - 10)) + 10;
                        hpUp += Math.floor(Math.random() * (30 - 10)) + 10;
                    };
                    if (emotionData.surprise > 0) {
                        attDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        defUp += Math.floor(Math.random() * (10 - 5)) + 5;
                        hpUp += Math.floor(Math.random() * (10 - 5)) + 5;
                    };

                    //new stats
                    att = baseatt + attUp - attDown;
                    def = basedef + defUp - defDown;
                    health = basehealth + hpUp - hpDown;

                    //display stats
                    var hpdiv = $("<h3>");
                    hpdiv.text("Health: " + health);
                    $("#user-stats").append(hpdiv);

                    var attdiv = $("<h3>");
                    attdiv.text("Attack: " + att);
                    $("#user-stats").append(attdiv);

                    var defdiv = $("<h3>");
                    defdiv.text("Defence: " + def);
                    $("#user-stats").append(defdiv);

                })

                .fail(function (jqXHR, textStatus, errorThrown) {
                    // Display error message.
                    var errorString = (errorThrown === "") ?
                        "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                    errorString += (jqXHR.responseText === "") ?
                        "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                            jQuery.parseJSON(jqXHR.responseText).message :
                            jQuery.parseJSON(jqXHR.responseText).error.message;
                    alert(errorString);
                });
        };
    };
});
