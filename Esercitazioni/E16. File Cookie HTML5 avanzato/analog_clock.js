/**
 * @author Roberto Pirrone
 */


var analog_clock = (function() {

    const HOUR_THICK = Math.PI / 6;
    const MINUTE_THICK = Math.PI / 30;
    const SECOND_THICK = Math.PI / 30;

    var canvas = document.createElement("canvas");
    canvas.height = canvas.width = 200;

    var ctx = canvas.getContext("2d");

    function draw_clock() {

        var now = new Date();

        var hour = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();

        // avoid transform accumulation
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // puts all the stuff in the center
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // draw the clock display
        ctx.beginPath();
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = "black";
        ctx.arc(0, 0, 90, 0, 2 * Math.PI);

        // draw ticks
        for (var i = 0, angle = 0.0; i < 12; i++, angle += HOUR_THICK) {

            var sin = Math.sin(angle),
                cos = Math.cos(angle);

            ctx.moveTo(85 * cos, 85 * sin);
            ctx.lineTo(90 * cos, 90 * sin);
        }

        ctx.stroke();

        // draw the clock hands
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "red";

        // hour hand: hours are scaled in 0-12
        if (hour >= 12) hour -= 12;
        ctx.moveTo(0, 0);

        // angles are clockwise but count from the position
        // of three oclock
        var theta = -Math.PI / 2 + (hour * HOUR_THICK);
        ctx.lineTo(60 * Math.cos(theta), 60 * Math.sin(theta));

        // minute hand
        ctx.moveTo(0, 0);
        theta = -Math.PI / 2 + (minutes * MINUTE_THICK);
        ctx.lineTo(80 * Math.cos(theta), 80 * Math.sin(theta));

        ctx.stroke();

        // seconds hand
        ctx.beginPath()
        ctx.lineWidth = 1;
        ctx.strokeStyle = "blue";

        ctx.moveTo(0, 0);
        theta = -Math.PI / 2 + (seconds * SECOND_THICK);
        ctx.lineTo(80 * Math.cos(theta), 80 * Math.sin(theta));
        ctx.stroke();


        // restore the context
        // and start the timeout for the next drawing

        ctx.restore();

        setTimeout("analog_clock.draw_clock()", 1000);
    }

    function startClock(parent) {
        parent.appendChild(canvas);
        draw_clock();
    }

    return {
        startClock: startClock,
        draw_clock: draw_clock
    };
})();