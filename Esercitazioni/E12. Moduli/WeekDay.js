const weekDay = function() {
    const names = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return {
        name(number) { return names[number]; },
        number(name) { return names.indexOf(name); }
    };
}();