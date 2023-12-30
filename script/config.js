"use strict";
let particippayer = [];

fetch("script/data.json")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        document.querySelector("#eventname").innerHTML = data.eventTitle;
        for (var k in data.firstPayer) {
            document.querySelector("#participant").innerHTML += data.firstPayer[k].participant + "<br>";
            document.querySelector("#payinfo").innerHTML += data.firstPayer[k].paymentInformation + "<br>";
            document.querySelector("#paydomain").innerHTML += data.firstPayer[k].paymentDomain + "<br>";
        }
        for (var k in data.participants) {
            document.querySelector("#particip").innerHTML += data.participants[k].participant + "<br>";
            document.querySelector("#total-price").innerHTML += data.participants[k].total + "<br>";
            if (data.participants[k].itemname.length == 1) {
                for (var i in data.participants[k].itemname) {
                    document.querySelector("#item").innerHTML += data.participants[k].itemname[i].item + "<br>";
                }
            } else {
                for (var i in data.participants[k].itemname) {
                    if (i == data.participants[k].itemnamelength - 1) {
                        document.querySelector("#item").innerHTML += data.participants[k].itemname[i].item + "<br>";
                    } else {
                        document.querySelector("#item").innerHTML += data.participants[k].itemname[i].item + ", ";
                    }
                }
            }
            if (data.participants[k].itemname.length == 1) {
                for (var i in data.participants[k].items) {
                    document.querySelector("#price").innerHTML += data.participants[k].items[i].itemprice + "<br>";
                }
            } else {
                for (var i in data.participants[k].items) {
                    if (i == data.participants[k].itemnamelength - 1) {
                        document.querySelector("#price").innerHTML += data.participants[k].items[i].itemprice + "<br>";
                    } else {
                        document.querySelector("#price").innerHTML += data.participants[k].items[i].itemprice + ", ";
                    }
                }
            }
            if (data.participants[k].payTo.length == 1) {
                for (var i in data.participants[k].payTo) {
                    document.querySelector("#fpayer").innerHTML += data.participants[k].payTo + "<br>";
                }
            } else {
                for (var i in data.participants[k].payTo) {
                    if (i == data.participants[k].payTo.length - 1) {
                        document.querySelector("#fpayer").innerHTML += data.participants[k].payTo[i] + "<br>";
                    } else {
                        document.querySelector("#fpayer").innerHTML += data.participants[k].payTo[i] + ", ";
                    }
                }
            }
        }
    }
);

function changeBackgroundColor() {
    var body = document.body;
    body.style.backgroundColor = getRandomColor();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}