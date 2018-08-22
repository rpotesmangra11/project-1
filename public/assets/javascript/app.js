$(document).ready( ()=> {
    console.log("not ready")
    var config = {
        apiKey: "AIzaSyCe6RdQ713wNfR_pyx9yFVpRp82_YehtOs",
        authDomain: "project-1-f279d.firebaseapp.com",
        databaseURL: "https://project-1-f279d.firebaseio.com",
        projectId: "project-1-f279d",
        storageBucket: "project-1-f279d.appspot.com",
        messagingSenderId: "840313509707"
    };
    firebase.initializeApp(config);
});

$(function () {
    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
});

function imageIsLoaded(e) {
    $('#user1-face').attr('src', e.target.result);
    console.log(e.target.result)
};
