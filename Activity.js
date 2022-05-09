$(document).ready(function () {                 //POST the create action
    $("#Create_Activity").submit(function () {     
     
        var time = $("#actDate").val();
        var d = new Date(time);
        var meetingTime = d.toJSON();

        console.log(meetingTime);

        const venue = $("#venue").val();
        const type = $("#type").val();
        const name = $("#actName").val();
        const quota = parseInt($("#max_part").val());
        const description = $("#act_detail").val();

        $.ajax({
            url: "/api/activity/create",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ meetingTime, venue, type, name, description, quota }),
        });

        alert("activity added!");

    });
});

function deleteDetail() {           //empty the textare when onfucusin 
    const description = $("#act_detail").val();
    if (description === "Please enter the detail of the activity.") {
        document.getElementById("act_detail").value = '';
    }
}

function Load() {  //load activity list to table in Activity.html

    var preferAcademic = true;
    var preferSports = true;

    $.ajax({
        url: "/api/me",
        method: "GET",
        contentType: "application/json",
        dataType: "JSON",
        async: false,
    })
        .done(function (data) {
            if (data["isLoggedIn"] == true) {
                document.getElementById("test").innerHTML = "You are currently logged in as: " + data["userName"];
                preferAcademic = data["preferAcademic"];
                preferSports = data["preferSports"];
            }
            else {
                alert('Please login first!');
                setTimeout(window.location.href = "./register.html", 100);
            }
        });


    $.ajax({
        url: "/api/activity/",
        method: "GET",
        contentType: "application/json",
        dataType: "JSON",
        async: false,
    })

        .done(function (data) {
            
            var length = data.length;
            var i;
            for (i = 0; i < length; i++) {
                var row = data[i];
                if (row["status"] == "created") {
                    var newRow = document.createElement("tr");
                    var Cell1 = document.createElement("td");
                    var Cell2 = document.createElement("td");
                    var Cell3 = document.createElement("td");
                    var Cell4 = document.createElement("td");
                    var Cell5 = document.createElement("td");
                    var Cell6 = document.createElement("td");
                    var Cell7 = document.createElement("td");
                    var Cell8 = document.createElement("td");
                    var Cell9 = document.createElement("td");

                    var test = document.createElement("span");
                    test.className = "glyphicon glyphicon-ok";
                    var join = document.createElement('a');
                    join.appendChild(test);
                    join.id = "jbtn" + row["activityId"];
                    join.href = "#";
                    join.onclick = function () { Join(this.id) };
                    Cell1.innerHTML = row["activityId"];
                    Cell2.innerHTML = row["name"];

                    var d = new Date(row["meetingTime"]);
                    d.setSeconds(0);
                    Cell3.innerHTML = row["organizer"]["userName"];
                    Cell4.innerHTML = d.toDateString() + " " + d.toLocaleTimeString();
                    Cell5.innerHTML = row["venue"];
                    Cell6.innerHTML = row["description"];
                    Cell7.innerHTML = row["quota"];
                    Cell8.innerHTML = row["participants"].length;
                    Cell9.appendChild(join);
                    //Cell8.appendChild(del);

                    newRow.append(Cell1, Cell2, Cell3, Cell4, Cell5, Cell6, Cell7, Cell8, Cell9);
                    newRow.id = "rid" + row["activityId"];

                    if (row["type"] == "sports") {
                        document.getElementById("srows").appendChild(newRow);
                    }
                    else {
                        document.getElementById("arows").appendChild(newRow);
                    }
                }
            }
        });
    if (preferAcademic == true) {
        document.getElementById("atab").style.visibility = "visible";
    }
    else {
        document.getElementById("atab").style.display = "none";
    }
    if (preferSports == true) {
        document.getElementById("stab").style.visibility = "visible";
    }
    else {
        document.getElementById("stab").style.display = "none";
    }
		
}

function createLoad() {         //display current logged in user
    $.ajax({
        url: "/api/me",
        method: "GET",
        contentType: "application/json",
        dataType: "JSON",
        async: false,
    })
        .done(function (data) {
            if (data["isLoggedIn"] == true) {
                document.getElementById("test").innerHTML = "You are currently logged in as: " + data["userName"];
            }
            else {
                alert('Please login first!');
                setTimeout(window.location.href = "./register.html", 100);
            }
        });

}

function Load2() {          //Load database into viewActivity.html

    var me;
    
    $.ajax({
        url: "/api/me",
        method: "GET",
        contentType: "application/json",
        dataType: "JSON",
        async: false,
    })
        .done(function (data) {
            if (data["isLoggedIn"] == true) {
                document.getElementById("test").innerHTML = "You are currently logged in as: " + data["userName"];
                me = data["userName"];
            }
            else {
                alert('Please login first!');
                setTimeout(window.location.href = "./register.html", 100);
            }
        });

    console.log(me);

    $.ajax({
        url: "/api/me/history",
        method: "GET",
        contentType: "application/json",
        dataType: "JSON",
        async: false,
    })
        .done(function (data) {
            let olength = data["organized"].length;
            let jlength = data["participated"].length;
            //console.log(olength);
            //console.log(jlength);
            for (var i = 0; i < olength; i++) {
                var row = data["organized"][i];
                if (row["status"] == "created" || row["status"] == "finished") {
                    //console.log(row["activityId"]);
                    var newRow = document.createElement("tr");
                    var Cell1 = document.createElement("td");
                    var Cell2 = document.createElement("td");
                    var Cell3 = document.createElement("td");
                    var Cell4 = document.createElement("td");
                    var Cell5 = document.createElement("td");
                    var Cell6 = document.createElement("td");
                    var Cell7 = document.createElement("td");

                    var finish = document.createElement('a');                    
                    var finishlogo = document.createElement("span");
                    finishlogo.className = "glyphicon glyphicon-ok";
                    finish.appendChild(finishlogo);
                    finish.id = "fbtn" + row["activityId"];
                    finish.href = "#";
                    finish.onclick = function () { finishAct(this.id) };
                    var cancel = document.createElement('a');
                    var cancellogo = document.createElement("span");                  
                    cancellogo.className = "glyphicon glyphicon-trash";                    
                    cancel.appendChild(cancellogo);                  
                    cancel.id = "cbtn" + row["activityId"];
                    cancel.href = "#";
                    cancel.onclick = function () { deleteAct(this.id) };

                    var joinChat = document.createElement('a');         //testing
                    var joinChatlogo = document.createElement("span");
                    joinChatlogo.className = "glyphicon glyphicon-comment";
                    joinChat.appendChild(joinChatlogo);
                    joinChat.id = "tbtn" + row["activityId"];
                    joinChat.href = "/chatpublic/chat.html?username=" + me + "&room=" + row["activityId"];

                    Cell1.innerHTML = row["activityId"];
                    Cell2.innerHTML = row["name"];

                    var d = new Date(row["meetingTime"]);
                    d.setSeconds(0);
                    Cell3.innerHTML = d.toDateString() + " " + d.toLocaleTimeString();
                    Cell4.innerHTML = row["status"];
                    Cell5.appendChild(finish);
                    Cell6.appendChild(cancel);
                    Cell7.appendChild(joinChat);

                    var tempCell = document.createElement("td");
                    tempCell.innerHTML = "";
                    var tempCell2 = document.createElement("td");
                    tempCell2.innerHTML = "";
                    var tempCell3 = document.createElement("td");
                    tempCell3.innerHTML = "";

                    if (row["status"] == "created") {
                        newRow.append(Cell1, Cell2, Cell3, Cell4, Cell5, Cell6, Cell7);
                        document.getElementById("orows").appendChild(newRow);
                    }
                    else {
                        newRow.append(Cell1, Cell2, Cell3, Cell4, tempCell, tempCell2, tempCell3);
                        document.getElementById("orows").appendChild(newRow);
                    }
                }
            }

            for (var i = 0; i < jlength; i++) {
                var row = data["participated"][i];
                var newRow = document.createElement("tr");
                var Cell1 = document.createElement("td");
                var Cell2 = document.createElement("td");
                var Cell3 = document.createElement("td");
                var Cell4 = document.createElement("td");
                var Cell5 = document.createElement("td");
                var Cell6 = document.createElement("td");

                var withdraw = document.createElement('a');
                var withdrawlogo = document.createElement("span");
                withdrawlogo.className = "glyphicon glyphicon-trash";
                withdraw.appendChild(withdrawlogo);
                withdraw.id = "wbtn" + row["activityId"];
                withdraw.href = "#";
                withdraw.onclick = function () { withdrawAct(this.id) };


                var joinChat = document.createElement('a');         //testing
                var joinChatlogo = document.createElement("span");
                joinChatlogo.className = "glyphicon glyphicon-comment";
                joinChat.appendChild(joinChatlogo);
                joinChat.id = "tbtn" + row["activityId"];
                joinChat.href = "/chatpublic/chat.html?username=" + me + "&room=" + row["activityId"];

                Cell1.innerHTML = row["activityId"];
                Cell2.innerHTML = row["name"];

                var d = new Date(row["meetingTime"]);
                d.setSeconds(0);
                Cell3.innerHTML = d.toDateString() + " " + d.toLocaleTimeString();
                Cell4.innerHTML = row["status"];
                Cell5.appendChild(withdraw);

                Cell6.appendChild(joinChat);                    //testing

                var tempCell = document.createElement("td");
                tempCell.innerHTML = "";
                var tempCell2 = document.createElement("td");
                tempCell2.innerHTML = "";

                if (row["status"] == "created") {
                    newRow.append(Cell1, Cell2, Cell3, Cell4, Cell5, Cell6);   //testing
                    document.getElementById("jrows").appendChild(newRow);
                }
                else {
                    newRow.append(Cell1, Cell2, Cell3, Cell4, tempCell, tempCell2);
                    document.getElementById("jrows").appendChild(newRow);
                }

            }


            document.getElementById("otab").style.visibility = "visible";

            document.getElementById("jtab").style.visibility = "visible";

        });
}


function Join(clickedID) {          //Check Whether i am the organizer of the clicked activity

    let activityId = clickedID.substring(4);
    var check = false;
    var confirmjoin = confirm("Sure to join this activity?");


    if (confirmjoin == true) {
        $.ajax({
            url: "/api/me/history",
            method: "GET",
            contentType: "application/json",
            dataType: "JSON",
        })

            .done(function (data) {

                var length = data["organized"].length;
                var i;

                for (i = 0; i < length; i++) {
                    if (data["organized"][i]["activityId"] == activityId) {
                        check = true;
                        break;
                    }
                }

                if (check == true) {
                    alert('You can not join your own activity !');
                    location.reload();
                }
                else {
                    joinCheckDup(activityId);
                }
            });
    }
}

function joinSuccess(activityId) {      //Join the activity, alert error if something went worng

    //document.getElementById("test").innerHTML = "join success function with activity ID: " + activityId;

    //console.log(activityId);

    $.ajax({
        url: "/api/activity/" + activityId + "/join",
        method: "POST",
        contentType: "application/json",
    })
        .done(function () {
            alert('Activity joined !');
            location.reload();
        })

        .fail(function (jqXHR) {
            console.log(jqXHR.responseJSON);
            if (jqXHR.responseJSON.error === "Activity Quota Full") {
                alert("You can't join this activity since " + jqXHR.responseJSON.message);
                location.reload();
            }
        });

}

function joinCheckDup(activityId) {     //Check if i already join the activity


    $.ajax({
        url: "/api/me/history",
        method: "GET",
        contentType: "application/json",
        dataType: "JSON",
    })
        .done(function (data) {
            var check = false;
            let length = data["participated"].length;
            if (length == 0) {
                joinSuccess(activityId);
            }
            else {
                var i, j;

                for (i = 0; i < length; i++) {
                    /*
                    var length2 = data["participated"][i]["participants"].length;
                    var participants = data["participated"][i]["participants"];

                    //console.log(data["participated"][3]);
                    console.log(me);

                    for (j = 0; j < length2; j++) {

                        if (participants[j]["userId"] == me && data["participated"][i]["activityId"] == activityId) {
                            check = true;
                            console.log(participants[j]["userId"]);
                            alert('You have already join this activity before!');
                            break;
                        }
                    }*/
                    if (data["participated"][i]["activityId"] == activityId) {
                        check = true;
                        //console.log(participants[j]["userId"]);
                        alert('You have already join this activity before!');
                        break;
                    }
                    
                }
                //console.log(check);
                if (check == false) {
                    joinSuccess(activityId);
                }
            }
        });
    
}

function deleteAct(clickedID) {

    let activityId = clickedID.substring(4);

    var check = confirm("Are you sure to cancel this activity?");

    if (check == true) {
        //console.log(activityId);
        $.ajax({
            url: "/api/activity/" + activityId + "/cancel",
            method: "POST",
            contentType: "application/json",
        })
            .done(function () {
                alert('Activity cancelled !');
                location.reload();
            });
    }

}

function finishAct(clickedID) {

    let activityId = clickedID.substring(4);

    var check = confirm("Are you sure to finish this activity?");

    if (check == true) {
        //console.log(activityId);
        $.ajax({
            url: "/api/activity/" + activityId + "/finish",
            method: "POST",
            contentType: "application/json",
        })
            .done(function () {
                alert('Activity finished !');
                location.reload();
            });
    }
}

function withdrawAct(clickedID) {

    let activityId = clickedID.substring(4);

    var check = confirm("Are you sure to withdraw this activity?");

    if (check == true) {

        $.ajax({
            url: "/api/activity/" + activityId + "/withdraw",
            method: "POST",
            contentType: "application/json",
        })
            .done(function () {
                alert('Activity withdrew!');
                location.reload();
            });
    }
}

function logout() {             //logout function
    $.ajax({
        url: "/api/user/logout",
        type: "POST",
    })
        .done(function (data) {
            alert("Successfully Logout!");
            setTimeout(window.location.href = "./index.html",100);
        });
}


//reference for search(): https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_table
function search() {         //fitler the table to perform searching
    var input, filter, table, tr, td, txtValue;
    input = document.getElementById("search");
    var option = $("#search_option").val();

    //console.log(option);
    filter = input.value.toUpperCase();

    table = document.getElementById("atab");
    table1 = document.getElementById("stab");
    tr = table.getElementsByTagName("tr");


    for (var i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[option];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    tr = table1.getElementsByTagName("tr");

    for (var i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[option];
        if (td) {
            txtValue = td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function testing(clickedID) {
    
}