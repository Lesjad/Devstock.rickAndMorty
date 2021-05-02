const baseUrl = "https://rickandmortyapi.com/api/";
var charactersArray = [], indexStartDisp = 0, dispRange = 3;

fillArrWith("character/");

async function fillArrWith(userQuery) {
    let myResponse, myObject, myQuery;

    myQuery = baseUrl + userQuery;

    do {
        myResponse = await fetch(myQuery);
        myObject = await myResponse.json();
        charactersArray = charactersArray.concat(myObject.results);
        myQuery = myObject.info.next;
    } while (myQuery != null)

    console.log(myObject.info);
    console.log(charactersArray);

    display(indexStartDisp, dispRange);
}

async function fetchQuery(query) {
    let myResponse, myObject;

    console.log("fetching: " + baseUrl + query);

    myResponse = await fetch(baseUrl + query);
    myObject = await myResponse.json();

    console.log(myObject.info);
    console.log(myObject.results);
}

function activateFilters() {
    let endPoint = "character/?";
    charactersArray = [];

    //name filtering:
    let filtName = document.getElementById("nameFilter").value;
    console.log("filtName: " + filtName);
    endPoint += ("name=" + filtName);

    //status filtering:
    if (document.getElementById("status").value == 'alive') {
        endPoint += "&status=alive"
    } else if (document.getElementById("status").value == 'dead') {
        endPoint += "&status=dead"
    } else if (document.getElementById("status").value == 'unknown') {
        endPoint += "&status=unknown"
    } else if (document.getElementById("status").value == 'unchosen') {

    }

    //gender filtering:
    if (document.getElementById("male").checked) {
        console.log("gender = male zaznaczone");
        endPoint += "&gender=male"
    }
    if (document.getElementById("female").checked) {
        console.log("gender = female zaznaczone");
        endPoint += "&gender=female"
    }
    if (document.getElementById("gender-unknown").checked) {
        console.log("gender = unknown zaznaczone");
        endPoint += "&gender=unknown"
    }
    if (document.getElementById("genderless").checked) {
        console.log("gender = genderless zaznaczone");
        endPoint += "&gender=genderless"
    }


    fillArrWith(endPoint);
}

function sortByName() {
    charactersArray.sort(function (a, b) { return a.name.localeCompare(b.name) });
    display(0, dispRange);
}

function sortById() {
    charactersArray.sort(function (a, b) { return a.id - b.id })
    display(0, dispRange)
}

function sortByDate() {
    charactersArray.sort(function (a, b) {
        return (new Date(a.created) - new Date(b.created))
    });
    display(0, dispRange);
}

function sortByGender() {
    charactersArray.sort(function (a, b) { return a.gender.localeCompare(b.gender) });
    display(0, dispRange)
}

function sortArr() {
    let chosenType = document.getElementById("sortType").value;

    if (chosenType == "byId") {
        sortById();
    } else if (chosenType == "byName") {
        sortByName();
    } else if (chosenType == "byDate") {
        sortByDate();
    } else if (chosenType == "byGender") {
        sortByGender();
    } else {
        throw "to jest błąd listy"
    }
}

function displayRequest() {
    display((document.getElementById("page").value - 1) * dispRange, dispRange)
}

function display(startIndex, range) {
    const charContainer = document.querySelector(".singleChar");
    charContainer.innerHTML = "";

    document.getElementById("charNumber").innerHTML = charactersArray.length;

    document.querySelector("#page").value =
        Math.ceil(startIndex / range + 1)

    document.querySelector('#pageId').innerHTML =
        "/" + Math.ceil(charactersArray.length / range) + " stron";

    for (i = startIndex; i < (startIndex + range) && i < charactersArray.length; i++) {
        charContainer.innerHTML = charContainer.innerHTML +
            '<div class="singleCharacter" onclick="testFunction()">' +
            '<div class="charImageHolder">' +
            '<img src="' + charactersArray[i].image + '"/>' +
            '</div>' +
            '<div class="charDescriptionHolder">' +
            '<div class="charDescription">Name: ' + charactersArray[i].name + '</div>' +
            '<div class="charDescription">Status: ' + charactersArray[i].status + '</div>' +
            '<div class="charDescription">Gender: ' + charactersArray[i].gender + '</div>' +
            '<div class="charDescription">Species: ' + charactersArray[i].species + '</div>' +
            '</div>'
    }
}

function testFunction(){
    console.log("odpalono test-funkcje");
}