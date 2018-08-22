$(document).ready( ()=> {
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
});

$("#add-file").on("click", function(event) {
    event.preventDefault();

    var face = $("#file-input").val();
    
    $.ajax({
        url:'upload.php',
        type: 'POST',   
         
    });
});
