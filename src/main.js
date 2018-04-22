// ============================= GLOBALS SETUP =================================
var time = 0;
var count = 1;
var latestData;
var types = {};
var frames = {};
var canShow = false;
var form = document.getElementById("form-selector");
var downloader = document.getElementById("download");
var showfbdata = document.getElementById("showFBData");
var selectedData = document.getElementById("selectedData");
var poseIndex = {
    "warriorii": 0,
    "tree": 1,
    "triangle": 2
};
const formToJSON = elements => [].reduce.call(elements, (data, element) => {
    data[element.name] = element.value;
    return data;
}, {});
// ============================ FIREBASE SETUP =================================
firebase.initializeApp({
    apiKey: "AIzaSyBfzO0wkhLUX0sSKeQi1d7uMvvJrf7Ti4s",
    authDomain: "yoga-master-training-db.firebaseapp.com",
    databaseURL: "https://yoga-master-training-db.firebaseio.com",
    projectId: "yoga-master-training-db",
    storageBucket: "yoga-master-training-db.appspot.com",
    messagingSenderId: "743195328789"
});
var tdb = firebase.database();
var auth = firebase.auth();
auth.signInAnonymously();
// ========================= PASSIVE FIREBASE FUNCTIONS ========================
tdb.ref("lastUpdated").on("value", snap => {
    time = snap.val();
});
tdb.ref("types").on("value", snap => {
    types = snap.val();
    resettingData();
});
tdb.ref("frames").on("value", snap => {
    frames = snap.val();
    resettingData();
});
// ================ LATEST DATA JS DOWNLOAD HANDLING FUNCTIONS ================
setInterval(updateTime, 1000);

function resettingData() {
    downloader.disabled = true;
    showfbdata.disabled = true;
    selectedData.disabled = true;
    document.querySelectorAll('#selectedData option').forEach(option => option.remove());
    for (const key in types) {
        var option = document.createElement("option");
        option.text = types[key].toUpperCase();
        option.value = key;
        selectedData.appendChild(option);
    }
    if (document.getElementById("dataTypes")) document.getElementById("dataTypes").innerHTML = JSON.stringify(types);
    var jsonDATA = "const DEFAULT_CLASSES = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];\nconst DEFAULT_NUM_CLASSES = DEFAULT_CLASSES.length;\nconst DEFAULT_DATA = [[5.1, 3.5, 1.4, 0.2, 0], [4.9, 3.0, 1.4, 0.2, 0], [4.7, 3.2, 1.3, 0.2, 0], [4.6, 3.1, 1.5, 0.2, 0], [5.0, 3.6, 1.4, 0.2, 0], [5.4, 3.9, 1.7, 0.4, 0], [4.6, 3.4, 1.4, 0.3, 0], [5.0, 3.4, 1.5, 0.2, 0], [4.4, 2.9, 1.4, 0.2, 0], [4.9, 3.1, 1.5, 0.1, 0], [5.4, 3.7, 1.5, 0.2, 0], [4.8, 3.4, 1.6, 0.2, 0], [4.8, 3.0, 1.4, 0.1, 0], [4.3, 3.0, 1.1, 0.1, 0], [5.8, 4.0, 1.2, 0.2, 0], [5.7, 4.4, 1.5, 0.4, 0], [5.4, 3.9, 1.3, 0.4, 0], [5.1, 3.5, 1.4, 0.3, 0], [5.7, 3.8, 1.7, 0.3, 0], [5.1, 3.8, 1.5, 0.3, 0], [5.4, 3.4, 1.7, 0.2, 0], [5.1, 3.7, 1.5, 0.4, 0], [4.6, 3.6, 1.0, 0.2, 0], [5.1, 3.3, 1.7, 0.5, 0], [4.8, 3.4, 1.9, 0.2, 0], [5.0, 3.0, 1.6, 0.2, 0], [5.0, 3.4, 1.6, 0.4, 0], [5.2, 3.5, 1.5, 0.2, 0], [5.2, 3.4, 1.4, 0.2, 0], [4.7, 3.2, 1.6, 0.2, 0], [4.8, 3.1, 1.6, 0.2, 0], [5.4, 3.4, 1.5, 0.4, 0], [5.2, 4.1, 1.5, 0.1, 0], [5.5, 4.2, 1.4, 0.2, 0], [4.9, 3.1, 1.5, 0.1, 0], [5.0, 3.2, 1.2, 0.2, 0], [5.5, 3.5, 1.3, 0.2, 0], [4.9, 3.1, 1.5, 0.1, 0], [4.4, 3.0, 1.3, 0.2, 0], [5.1, 3.4, 1.5, 0.2, 0], [5.0, 3.5, 1.3, 0.3, 0], [4.5, 2.3, 1.3, 0.3, 0], [4.4, 3.2, 1.3, 0.2, 0], [5.0, 3.5, 1.6, 0.6, 0], [5.1, 3.8, 1.9, 0.4, 0], [4.8, 3.0, 1.4, 0.3, 0], [5.1, 3.8, 1.6, 0.2, 0], [4.6, 3.2, 1.4, 0.2, 0], [5.3, 3.7, 1.5, 0.2, 0], [5.0, 3.3, 1.4, 0.2, 0], [7.0, 3.2, 4.7, 1.4, 1], [6.4, 3.2, 4.5, 1.5, 1], [6.9, 3.1, 4.9, 1.5, 1], [5.5, 2.3, 4.0, 1.3, 1], [6.5, 2.8, 4.6, 1.5, 1], [5.7, 2.8, 4.5, 1.3, 1], [6.3, 3.3, 4.7, 1.6, 1], [4.9, 2.4, 3.3, 1.0, 1], [6.6, 2.9, 4.6, 1.3, 1], [5.2, 2.7, 3.9, 1.4, 1], [5.0, 2.0, 3.5, 1.0, 1], [5.9, 3.0, 4.2, 1.5, 1], [6.0, 2.2, 4.0, 1.0, 1], [6.1, 2.9, 4.7, 1.4, 1], [5.6, 2.9, 3.6, 1.3, 1], [6.7, 3.1, 4.4, 1.4, 1], [5.6, 3.0, 4.5, 1.5, 1], [5.8, 2.7, 4.1, 1.0, 1], [6.2, 2.2, 4.5, 1.5, 1], [5.6, 2.5, 3.9, 1.1, 1], [5.9, 3.2, 4.8, 1.8, 1], [6.1, 2.8, 4.0, 1.3, 1], [6.3, 2.5, 4.9, 1.5, 1], [6.1, 2.8, 4.7, 1.2, 1], [6.4, 2.9, 4.3, 1.3, 1], [6.6, 3.0, 4.4, 1.4, 1], [6.8, 2.8, 4.8, 1.4, 1], [6.7, 3.0, 5.0, 1.7, 1], [6.0, 2.9, 4.5, 1.5, 1], [5.7, 2.6, 3.5, 1.0, 1], [5.5, 2.4, 3.8, 1.1, 1], [5.5, 2.4, 3.7, 1.0, 1], [5.8, 2.7, 3.9, 1.2, 1], [6.0, 2.7, 5.1, 1.6, 1], [5.4, 3.0, 4.5, 1.5, 1], [6.0, 3.4, 4.5, 1.6, 1], [6.7, 3.1, 4.7, 1.5, 1], [6.3, 2.3, 4.4, 1.3, 1], [5.6, 3.0, 4.1, 1.3, 1], [5.5, 2.5, 4.0, 1.3, 1], [5.5, 2.6, 4.4, 1.2, 1], [6.1, 3.0, 4.6, 1.4, 1], [5.8, 2.6, 4.0, 1.2, 1], [5.0, 2.3, 3.3, 1.0, 1], [5.6, 2.7, 4.2, 1.3, 1], [5.7, 3.0, 4.2, 1.2, 1], [5.7, 2.9, 4.2, 1.3, 1], [6.2, 2.9, 4.3, 1.3, 1], [5.1, 2.5, 3.0, 1.1, 1], [5.7, 2.8, 4.1, 1.3, 1], [6.3, 3.3, 6.0, 2.5, 2], [5.8, 2.7, 5.1, 1.9, 2], [7.1, 3.0, 5.9, 2.1, 2], [6.3, 2.9, 5.6, 1.8, 2], [6.5, 3.0, 5.8, 2.2, 2], [7.6, 3.0, 6.6, 2.1, 2], [4.9, 2.5, 4.5, 1.7, 2], [7.3, 2.9, 6.3, 1.8, 2], [6.7, 2.5, 5.8, 1.8, 2], [7.2, 3.6, 6.1, 2.5, 2], [6.5, 3.2, 5.1, 2.0, 2], [6.4, 2.7, 5.3, 1.9, 2], [6.8, 3.0, 5.5, 2.1, 2], [5.7, 2.5, 5.0, 2.0, 2], [5.8, 2.8, 5.1, 2.4, 2], [6.4, 3.2, 5.3, 2.3, 2], [6.5, 3.0, 5.5, 1.8, 2], [7.7, 3.8, 6.7, 2.2, 2], [7.7, 2.6, 6.9, 2.3, 2], [6.0, 2.2, 5.0, 1.5, 2], [6.9, 3.2, 5.7, 2.3, 2], [5.6, 2.8, 4.9, 2.0, 2], [7.7, 2.8, 6.7, 2.0, 2], [6.3, 2.7, 4.9, 1.8, 2], [6.7, 3.3, 5.7, 2.1, 2], [7.2, 3.2, 6.0, 1.8, 2], [6.2, 2.8, 4.8, 1.8, 2], [6.1, 3.0, 4.9, 1.8, 2], [6.4, 2.8, 5.6, 2.1, 2], [7.2, 3.0, 5.8, 1.6, 2], [7.4, 2.8, 6.1, 1.9, 2], [7.9, 3.8, 6.4, 2.0, 2], [6.4, 2.8, 5.6, 2.2, 2], [6.3, 2.8, 5.1, 1.5, 2], [6.1, 2.6, 5.6, 1.4, 2], [7.7, 3.0, 6.1, 2.3, 2], [6.3, 3.4, 5.6, 2.4, 2], [6.4, 3.1, 5.5, 1.8, 2], [6.0, 3.0, 4.8, 1.8, 2], [6.9, 3.1, 5.4, 2.1, 2], [6.7, 3.1, 5.6, 2.4, 2], [6.9, 3.1, 5.1, 2.3, 2], [5.8, 2.7, 5.1, 1.9, 2], [6.8, 3.2, 5.9, 2.3, 2], [6.7, 3.3, 5.7, 2.5, 2], [6.7, 3.0, 5.2, 2.3, 2], [6.3, 2.5, 5.0, 1.9, 2], [6.5, 3.0, 5.2, 2.0, 2], [6.2, 3.4, 5.4, 2.3, 2], [5.9, 3.0, 5.1, 1.8, 2]];\n\n";
    var data = frames;
    var trainingData = {};
    for (const type in types) trainingData[type] = [];
    for (const key of Object.keys(data)) {
        for (const type in types) {
            if (data[key][type] && !(data[key][type] == 0 || data[key][type] == 1)) {
                data[key][type].push(poseIndex[data[key].pose]);
                trainingData[type].push(data[key][type]);
            }
        }
    }
    for (const type in types) {
        var dType = types[type].toUpperCase();
        jsonDATA += "const " + dType + "_CLASSES = " + JSON.stringify(Object.keys(poseIndex)) + ";\nconst " + dType + "_NUM_CLASSES = " + dType + "_CLASSES.length;\nconst " + dType + "_DATA = " + JSON.stringify(trainingData[type]) + ";\n\n";
    }
    jsonDATA += "const IRIS_CLASSES = DEFAULT_CLASSES;\nconst IRIS_NUM_CLASSES = DEFAULT_NUM_CLASSES;\nconst IRIS_DATA = DEFAULT_DATA;";
    latestData = jsonDATA;
    console.log("Got latest JSON data downloaded and ready to use!");
    downloader.disabled = false;
    showfbdata.disabled = false;
    selectedData.disabled = false;
    if (canShow) showData();
}

function download(filename, text) {
    var element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function getLatestData() {
    return latestData;
}

function updateTime() {
    document.getElementById("lastUpdated").innerHTML = "Last updated @ " + (new Date(time)).toLocaleString() + ", " + Math.round((Date.now() - time) / 1000) + " seconds ago";
}
// ================== LATEST DATA SHOWING HANDLING FUNCTIONS ==================
selectedData.onchange = function (e) {
    showData();
}

function showData() {
    canShow = true;
    console.log("Showing Firebase Training Data of dataType " + selectedData.options[selectedData.selectedIndex].textContent + "...");
    var count = 1;
    var time = Date.now();
    var data = Object.values(frames).sort((o1, o2) => o2.timestamp - o1.timestamp);
    var table = document.getElementById("tdb");
    table.innerHTML = "<tr><th>pose</th><th>trainingFrame</th><th>openposeFrame</th><th>" + selectedData.options[selectedData.selectedIndex].textContent.toUpperCase() + "</th><th>key</th></tr>";
    for (const frame of data) {
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + frame.pose + "</td><td class='tf'><img src='" + frame.trainingFrame + "'></td><td class='tf'><img src='" + frame.openposeFrame + "'></td><td>" + JSON.stringify(frame[selectedData.options[selectedData.selectedIndex].value]) + "</td><td class='deleteBtn'><a onclick='delData(\"" + frame.key + "\");' href='javascript:void(0);'>Delete " + frame.key + "</a></td>"; //<input type='button' value='Delete "+frame.key+"' onclick='delData(\""+frame.key+"\");'/></td>";
        table.appendChild(row);
        console.log("Writing row " + count + ", key " + frame.key + " after " + (Date.now() - time) + "ms.");
        count++;
    }
}

function delData(key) {
    tdb.ref("frames/" + key).set(null, () => {
        console.log("Deleted frame key " + key);
    });
}
// ==================== FORM HANDLING PROCESSING FUNCTIONS ===================
function handleFormSubmit(event) {
    event.preventDefault();
    var data = formToJSON(form.elements);
    delete data[""];
    tdb.ref("queue").push(data, () => {
        location.reload();
    });
};
form.addEventListener('submit', handleFormSubmit);

function addFields() { //code for adding the next three fields again
    var newStartMin = document.createElement('input');
    newStartMin.setAttribute("placeholder", "TimeStamp Minute Start " + count);
    newStartMin.setAttribute("name", "startTimeStampMin" + count);
    newStartMin.setAttribute("id", "startTimeStampMin" + count);
    newStartMin.setAttribute("type", "number");
    newStartMin.setAttribute("step", "1");
    newStartMin.setAttribute("min", "0");
    newStartMin.setAttribute("required", true);
    document.getElementById("add").appendChild(newStartMin);
    var newStartSec = document.createElement('input');
    newStartSec.setAttribute("placeholder", "TimeStamp Second Start " + count);
    newStartSec.setAttribute("name", "startTimeStampSec" + count);
    newStartSec.setAttribute("id", "startTimeStampSec" + count);
    newStartSec.setAttribute("type", "number");
    newStartSec.setAttribute("step", "1");
    newStartSec.setAttribute("min", "0");
    newStartSec.setAttribute("max", "60");
    newStartSec.setAttribute("required", true);
    document.getElementById("add").appendChild(newStartSec);
    var newEndMin = document.createElement('input');
    newEndMin.setAttribute("placeholder", "TimeStamp Minute End " + count);
    newEndMin.setAttribute("name", "endTimeStampMin" + count);
    newEndMin.setAttribute("id", "endTimeStampMin" + count);
    newEndMin.setAttribute("type", "number");
    newEndMin.setAttribute("min", "0");
    newEndMin.setAttribute("step", "1");
    newEndMin.setAttribute("required", true);
    document.getElementById("add").appendChild(newEndMin);
    var newEndSec = document.createElement('input');
    newEndSec.setAttribute("placeholder", "TimeStamp Second End " + count);
    newEndSec.setAttribute("name", "endTimeStampSec" + count);
    newEndSec.setAttribute("id", "endTimeStampSec" + count);
    newEndSec.setAttribute("type", "number");
    newEndSec.setAttribute("step", "1");
    newEndSec.setAttribute("min", "0");
    newEndSec.setAttribute("max", "60");
    newEndSec.setAttribute("required", true);
    document.getElementById("add").appendChild(newEndSec);
    var newSelect = document.createElement('select')
    newSelect.setAttribute("name", "selectedPose" + count);
    newSelect.setAttribute("id", "selectedPose" + count);
    newSelect.setAttribute("required", true);
    var array = ["warriorii", "tree", "triangle"];
    var arrayText = ["Warrior 2 Pose", "Tree Pose", "Triangle Pose"];
    for (var i = 0; i < 3; i++) {
        var option = document.createElement("option");
        option.value = array[i];
        option.text = arrayText[i];
        newSelect.appendChild(option);
    }
    document.getElementById("add").appendChild(newSelect);
    console.log("Adding #" + count + " fields...");
    count += 1;
}

function delFields() {
    if (count == 1) return;
    count -= 1;
    console.log("Deleting #" + count + " fields...");
    document.getElementById('startTimeStampMin' + count).remove();
    document.getElementById('startTimeStampSec' + count).remove();
    document.getElementById('endTimeStampMin' + count).remove();
    document.getElementById('endTimeStampSec' + count).remove();
    document.getElementById('selectedPose' + count).remove();
}