const ONESECOND = 1000;
const ONEMINUTE = 60000;
const ONEHOUR = 3600000;
const ONEDAY = 86400000;
const ONEMONTH = 30 * ONEDAY;
const ONEYEAR = 365 * ONEDAY;

const WEEKDAYS = ['Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

function timeInterval(date1, date2) {
    if (date2.getTime() > date1.getTime()) {
        let time = date2.getTime() - date1.getTime();

        let years = Math.floor(time / ONEYEAR);
        let months = Math.floor((time - years * ONEYEAR) / ONEMONTH);
        let days = Math.floor((time - years * ONEYEAR - months * ONEMONTH) / ONEDAY);

        console.log(`From ${date1.toLocaleDateString()} to ${date2.toLocaleDateString()} passed ${years} years, ${months} months, and ${days} days!`);

    } else {
        console.log('the second date preceeds the first one!')
    }

}

let today = new Date();
let yesterday = new Date(today.getTime() - ONEDAY);

function clock() {
    console.log(new Date().toLocaleTimeString());
    //setTimeout(clock, ONESECOND);
}

function weekDay(date) {
    console.log(WEEKDAYS[date.getDay()]);
}

//clock();
setInterval(clock, ONESECOND);