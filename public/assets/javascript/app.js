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

    //image data URL
    var opponentDataUrl;
    var imgdataURL;



    //stats 
    var att;
    var def;
    var health;

    var oppAtt;
    var oppDef;
    var oppHP;


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
        imgdataURL = e.target.result;
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
                "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion," +
                    "hair,makeup,occlusion,accessories,blur,exposure,noise"
            };

            //Make Blob for Ajax call
            makeblob = function (dataURL) {
                var BASE64_MARKER = ';base64,';
                if (dataURL.indexOf(BASE64_MARKER) == -1) {
                    var parts = dataURL.split(',');
                    var contentType = parts[0].split(':')[1];
                    var raw = decodeURIComponent(parts[1]);
                    return new Blob([raw], {
                        type: contentType
                    });
                }
                var parts = dataURL.split(BASE64_MARKER);
                var contentType = parts[0].split(':')[1];
                var raw = window.atob(parts[1]);
                var rawLength = raw.length;

                var uInt8Array = new Uint8Array(rawLength);

                for (var i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                }

                return new Blob([uInt8Array], {
                    type: contentType
                });
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
                        defDown += Math.floor(Math.random() * (5 - 1)) + 1;
                        hpUp += Math.floor(Math.random() * (10 - 5)) + 5;
                    };
                    if (emotionData.contempt > 0) {
                        defDown += Math.floor(Math.random() * (5 - 1)) + 1;
                        hpDown += Math.floor(Math.random() * (10 - 5)) + 5;
                    };
                    if (emotionData.disgust > 0) {
                        attDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        defDown += Math.floor(Math.random() * (5 - 1)) + 1;
                        hpDown += Math.floor(Math.random() * (10 - 5)) + 5;
                    };
                    if (emotionData.fear > 0) {
                        attDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        defDown += Math.floor(Math.random() * (5 - 1)) + 1;
                        hpDown += Math.floor(Math.random() * (10 - 5)) + 5;
                    };
                    if (emotionData.happiness > 0) {
                        attDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        defUp += Math.floor(Math.random() * (5 - 1)) + 1;
                        hpUp += Math.floor(Math.random() * (10 - 5)) + 5;
                    };
                    if (emotionData.neutral > 0) {
                        attUp += Math.floor(Math.random() * (100 - 20)) + 20;
                        defUp += Math.floor(Math.random() * (10 - 1)) + 1;
                        hpUp += Math.floor(Math.random() * (100 - 20)) + 20;
                    };
                    if (emotionData.sadness > 0) {
                        attUp += Math.floor(Math.random() * (30 - 10)) + 10;
                        defUp += Math.floor(Math.random() * (5 - 1)) + 1;
                        hpUp += Math.floor(Math.random() * (30 - 10)) + 10;
                    };
                    if (emotionData.surprise > 0) {
                        attDown += Math.floor(Math.random() * (10 - 5)) + 5;
                        defUp += Math.floor(Math.random() * (5 - 1)) + 1;
                        hpUp += Math.floor(Math.random() * (10 - 5)) + 5;
                    };

                    //new stats
                    att = baseatt + attUp - attDown;
                    def = basedef + defUp - defDown;
                    health = basehealth + hpUp - hpDown;

                    //display stats
                    $("#health").text("Health: " + health);
                    $("#attack").text("Attack: " + att);
                    $("#defense").text("Defense: " + def);

                    //Firebase used to store imgdataURL
                    const ref = firebase.database().ref();

                    firebase.database().ref('/Users').push({
                        Health: health,
                        Attack: att,
                        Defense: def,
                        image: imgdataURL
                    })


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
            //click function to generate opponent
            $("#genOpp").on("click", function (e) {
                e.preventDefault();
                firebase.database().ref('/Users').on("value", (snapshot) => {
                    console.log(snapshot.val(), snapshot.key);
                    console.log(snapshot.numChildren())
                    var totalUsers = snapshot.numChildren();
                    var randomNum = Math.random() * totalUsers;
                    var userIndex = parseInt(randomNum, 10);
                    var currentIndex = 0;
                    snapshot.forEach(function (snap) {
                        if (currentIndex == userIndex) {
                            var randomUser = snap.val();
                            console.log(randomUser)
                            opponentDataUrl = randomUser.image;
                            $("#user2-face").attr('src', opponentDataUrl)
                            $("#health2").text("Health: " + randomUser.Health);
                            $("#attack2").text("Attack: " + randomUser.Attack);
                            $("#defense2").text("Defense: " + randomUser.Defense);
                            oppAtt = randomUser.Attack;
                            oppDef = randomUser.Defense;
                            oppHP = randomUser.Health;

                        }
                        currentIndex++

                    })
                }, (error) => {
                    console.log(error.code)
                });

            })



        };

    };

    $("#attack-btn").click(function (e) {
        var newhealth = health;
        var newOppHp = oppHP;
        var damageTaken = oppAtt - def;
        var damageDealt = att - oppDef;
        // if(newhealth === health){
        //     newhealth = health - damageTaken;
        // }
        // if(newOppHp === oppHP) {
        //     newOppHp = oppHP - damageDealt;
        // }
        // if(newhealth !== health){
        //     newhealth = newhealth - damageTaken;
        // }
        // if(newOppHp !== oppHP){
        //     newOppHp = newOppHp - damageDealt;
        // }
        if (health > 0 && oppHP > 0) {
            health = health - damageTaken;
            oppHP = oppHP - damageDealt;
        }


        $("#health").text(`Health: ${health}`)
        $("#health2").text(`Health: ${oppHP}`)

    })







    //Giphy
    var queryURL = "https://api.giphy.com/v1/gifs/ZohjjXBFXojxC?api_key=XKo8op1ySUbCJChDx2u1pqIJ4EMOHQPC";

    // creates ajax call
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        .then(function (response) {
            console.log(response);
            // save results as a variable
            var results = response.data;
            var gameGif = $('<img class=gameGif>');
            gameGif.attr('src', results.images.original.url);
            $("#game-display").prepend(gameGif);

        });

});
