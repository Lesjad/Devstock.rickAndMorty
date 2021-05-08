const baseUrl = "https://rickandmortyapi.com/api/";
var charactersArray = [], indexStartDisp = 0, dispRange = 3;

fillArrWith("character/");

async function fillArrWith(userQuery) {
    let myResponse, myObject, myQuery;

    myQuery = baseUrl + userQuery;

    do {
        myResponse = await fetch(myQuery);
        myObject = await myResponse.json();
        if (myObject.results) {
            charactersArray = charactersArray.concat(myObject.results);
        }
        try {
            myQuery = myObject.info.next;
        } catch (error) {
            window.alert("Brak postaci do wyświetlenia\nSerwer nie odpowieada lub Zmień filtry");
            // document.getElementById("nameFilter").value="";
            break;
        }
    } while (myQuery != null)

    //    console.log(myObject.info);
    //    console.log(charactersArray);

    display(indexStartDisp, dispRange);
}

async function fetchQuery(query) {
    let myResponse, myObject;

    console.log("fetching: " + baseUrl + query);

    myResponse = await fetch(baseUrl + query);
    myObject = await myResponse.json();

    console.log("myObject: "+myObject);
    console.log("myObject.info: "+myObject.info);
    console.log("myObject.results: "+myObject.results);

    return myObject;
}

function activateFilters() {
    let endPoint = "character/?";
    charactersArray = [];

    //name filtering:
    let filtName = document.getElementById("nameFilter").value;
    endPoint += filtName === "" ? "" : ("name=" + filtName);

    //status filtering:
    if (document.getElementById("status").value == 'alive') {
        endPoint += "&status=alive"
    } else if (document.getElementById("status").value == 'dead') {
        endPoint += "&status=dead"
    } else if (document.getElementById("status").value == 'unknown') {
        endPoint += "&status=unknown"
    } else if (document.getElementById("status").value == 'unchosen') {

    }

    //gender filtering: checkbox is unfortunate to use in this place
    //Rick and Morty API does not support filtering with multiple choice
    //the first checked box will be the one taken for filtering
    let genderEndPoint = "";

    genderEndPoint += document.getElementById("male").checked ? "&gender=male" : ""
    genderEndPoint += document.getElementById("female").checked ? "&gender=female" : ""
    genderEndPoint += document.getElementById("gender-unknown").checked ? "&gender=unknown" : ""
    genderEndPoint += document.getElementById("genderless").checked ? "&gender=genderless" : ""

    endPoint += genderEndPoint != "" ? genderEndPoint : "";

    console.log("I'm filtering via API with endpoint: " + endPoint);

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
        throw "wrong sort selection"
    }
}

function displayRequest() {
    display((document.getElementById("page").value - 1) * dispRange, dispRange)
}

function nextPage(){
    let currPage=document.getElementById("page").value;

    if (currPage==Math.ceil(charactersArray.length / dispRange)) {
        return;
    } else {
        document.getElementById("page").value=parseInt(currPage)+1;
        displayRequest();
    }
}

function previousPage(){
    let currPage=document.getElementById("page").value;

    if (currPage<=1) {
        return;
    } else {
        document.getElementById("page").value=parseInt(currPage)-1;
        displayRequest();
    }
}

//display - used to refresh the view everytime the content changes
function display(startIndex, range) {
    const charListContainer = document.querySelector(".charListContainer");
    charListContainer.innerHTML = "";

    document.getElementById("charsNumber").innerHTML = charactersArray.length;

    document.getElementById("page").value =
        Math.ceil(startIndex / range + 1)

    document.getElementById('pageId').innerHTML =
        "/" + Math.ceil(charactersArray.length / range) + " stron";

    for (i = startIndex; i < (startIndex + range) && i < charactersArray.length; i++) {

        charListContainer.innerHTML = charListContainer.innerHTML +
            '<div class="singleCharacter" id="charIdCard' + charactersArray[i].id + '" onclick="showDetails(' + charactersArray[i].id + ')">' +
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

function dispChange(){
    console.log(document.styleSheets[0]);
    let secStyle=document.getElementById("secStyleId").getAttribute("href");

    if (secStyle) {
        document.getElementById("secStyleId").setAttribute("href", "")
    } else {
        document.getElementById("secStyleId").setAttribute("href", "./style-column.css")
    }
    console.log(document.styleSheets);
}

function appendChildElement(parentId, childType, childID, childClass, childEventName, childEventValue) {
    let parentElement = document.getElementById(parentId);
    let childElement = document.createElement(childType);

    console.log("created childElement: "+childElement);

    let attrId = document.createAttribute("id");
    attrId.value = childID;

    let attrClass = document.createAttribute("class");
    attrClass.value = childClass;

    let attrEvent = document.createAttribute(childEventName);
    attrEvent.value = childEventValue;

    childElement.setAttributeNode(attrId);
    childElement.setAttributeNode(attrClass);
    childElement.setAttributeNode(attrEvent);

    console.log("final structure of childElement"+childElement);
    console.log("parentElement: "+parentElement);
    parentElement.appendChild(childElement);
}

//TODO: create nicer way to display character
// function createCharacterCard(id){

//     appendChildElement()
//     for (i = startIndex; i < (startIndex + range) && i < charactersArray.length; i++) {

//         charListContainer.innerHTML = charListContainer.innerHTML +
//             '<div class="singleCharacter" id="charIdCard'+charactersArray[i].id+'" onclick="testFunction('+charactersArray[i].id+ ')">' +
//             '<div class="charImageHolder">' +
//             '<img src="' + charactersArray[i].image + '"/>' +
//             '</div>' +
//             '<div class="charDescriptionHolder">' +
//             '<div class="charDescription">Name: ' + charactersArray[i].name + '</div>' +
//             '<div class="charDescription">Status: ' + charactersArray[i].status + '</div>' +
//             '<div class="charDescription">Gender: ' + charactersArray[i].gender + '</div>' +
//             '<div class="charDescription">Species: ' + charactersArray[i].species + '</div>' +
//             '</div>'
//     }
//     let divCharacterContainer=document.createElement("div");
//     let divCharacterContainerClass=document.createAttribute("class");

//     divCharacterContainerClass.value="singleCharacter";

//     charListContainer.appendChild("BUTTON")

// }

async function showDetails(id) {
    let parentId = "charIdCard" + id;
    let parentElement = document.getElementById(parentId);

    let charDetails=await fetchQuery("character/"+id);

    let x=document.getElementById("detailChar"+id+"Display");
    if (x){   
        x.remove();
    } else{
        parentElement.innerHTML+='<div class="detailCharDisplay" id="detailChar'+id+'Display" onclick="hideDetails()">' +
        '<div class="imageHolder">' + 
        '<image src="'+charDetails.image+'" width="400px"/> </div>'+
        '<div class="dataHolder">'+
        '<div class="charDetailDescription" id="charDetailsName">Name of the character: <u>'+charDetails.name+'</u></div>'+
                '<div class="charDetailDescription" id="charDetailsGender">Gender: <u>'+charDetails.gender+'</u></div>'+
                '<div class="charDetailDescription" id="charDetailsId">Id of the character: <u>'+charDetails.id+'</u></div>'+
                '<div class="charDetailDescription" id="charDetailsCreated">Date of creation: <u>'+new Date(charDetails.created)+'</u></div>'+
                '<div class="charDetailDescription" id="charDetailsOrigin">Origin of the character: <u>'+charDetails.origin.name+'</u></div>'+
                '<div class="charDetailDescription" id="charDetailsEpisodes">This character played in following number of Episodes: <u>'+charDetails.episode.length+'</u></div>'+
                '<div class="charDetailDescription" id="charDetailsLocations">This character currently is in location: <u>'+charDetails.location.name+'</u></div>'+'</div>' +
    '</div>'

    }
}

function hideDetails(){
    console.log("i'm hiding details");
    let x=document.getElementById("detailCharDisplay");
    if (x){       
        x.remove();
    }
}
function parseCharDetails(character){
    let charParsed="";


    return charParsed;
}
function testFunction() {
    appendChildElement("testDiv", "div", "Id-stworzonego-diva", "klasa-nowego-diva", "onclick", "jakasfunkcja");
}
