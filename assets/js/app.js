// Initialize Firebase
var config = {
    apiKey: "AIzaSyBTEFaP_4m6vdnCYyT9HgUcGB-oysLJljI",
    authDomain: "train-schedule-30661.firebaseapp.com",
    databaseURL: "https://train-schedule-30661.firebaseio.com",
    projectId: "train-schedule-30661",
    storageBucket: "train-schedule-30661.appspot.com",
    messagingSenderId: "232813586151"
};
firebase.initializeApp(config);

var database = firebase.database()

dateFns.isToday(new Date())
var format = dateFns.format

var today = new Date()

var trainData = {
    trainName: '',
    trainDest: '',
    dateString: '',
    trainFreq: 0,
    freqDate: '',
    nextTrain: ''
}


$("#submit").on("click", function () {
    trainData.trainName = $('#name').val()

    trainData.trainDest = $('#destination').val()

    var timeInput = $('#firstTrain').val()
    var hours = Number(timeInput.substr(0, 2))
    var minutes = Number(timeInput.substr(3, 4))
    var result = dateFns.setHours(today, hours)
    var finalResult = dateFns.setMinutes(result, minutes)

    //trainData.dateString = format(new Date(timeInput), 'HH:mm')

    trainData.trainFreq = $('#freq').val()

    var freq = dateFns.addMinutes(finalResult, trainData.trainFreq)

    var freqHours = dateFns.getHours(freq)
    var freqMin = dateFns.getMinutes(freq)

    if (freqMin === 0) {
        freqMin = '00'
    } else if (freqMin.length = 1) {
        freqMin = '0' + freqMin
    }

    trainData.freqDate = String(freqHours) + ':' + String(freqMin)

    freqDate = freqHours + ':' + freqMin

    var time = [today.getHours(), today.getMinutes()]

    var finalTime = time.join(":")


    trainData.nextTrain = dateFns.distanceInWords(finalTime, finalResult)


    trainData.dateAdded = firebase.database.ServerValue.TIMESTAMP


    database.ref().push(trainData)

    $('#name').val("")
    $('#destination').val("")
    $('#firstTrain').val("")
    $('#freq').val("")
})

database.ref().on("child_added", function (childSnapshot) {
    $('#tableContents').append('<tr>' + '<td>' + childSnapshot.val().trainName + '<td>' + childSnapshot.val().trainDest + '<td>' + childSnapshot.val().trainFreq + '<td>' + childSnapshot.val().freqDate + '<td>' + childSnapshot.val().nextTrain)

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});