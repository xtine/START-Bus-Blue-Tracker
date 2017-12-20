(function() {

  $.getJSON('timetable.json').done(function (timetable) {

    var getBusTime = function (destination) {
      var timeNow = moment();
      var $destinationClass = $('.' + destination);
      var incomingBus = false;

      // set current time
      $('.now').html(timeNow.format('h:mm a'));

      // loop through the bus timetable
      $.each(timetable[destination], function (i, time) {
        var busTime = moment(time, 'H:mm');
        var formattedBusTime = busTime.format('h:mm a');

        // get the next bus
        if (busTime.isAfter(timeNow)) {
          $destinationClass.find('.time').html(formattedBusTime);

          // show hours or minutes until next bus
          var minutesLeft = moment.duration(busTime.diff(timeNow)).asMinutes();
          var hoursLeft = moment.duration(busTime.diff(timeNow)).asHours();
          var timeLeft;

          // show minutes until bus arrives
          if (parseInt(minutesLeft) < 59) {
            timeLeft = "In ";
            timeLeft += Math.abs(parseInt(minutesLeft));

            if (parseInt(minutesLeft) > 1) {
              timeLeft += " minutes";
            }
            else {
              timeLeft += " minute";
            }
          }
          // if over an hour wait (early mornings)
          else {
            timeLeft = "In over ";
            timeLeft += Math.abs(parseInt(hoursLeft));

            if (hoursLeft < 2) {
              timeLeft += " hour";
            }
            else {
              timeLeft += " hours";
            }
          }

          if (minutesLeft > 1) {
            $destinationClass.find('.time-left').html(timeLeft);
          }
          else {
            $destinationClass.find('.time-left').html('Leaving now!');
          }

          // clear any previous next bus info
          $destinationClass.find('.next-buses ul').empty();

          // show next three buses
          for (b = 1; b < 4; b++) {
            // get next bus
            var nextBusTime = timetable[destination][i + b];

            // if there is a bus, append to next bus info
            if (nextBusTime) {
              $destinationClass.find('.next-buses ul')
              .append('<li>')
              .append(moment(nextBusTime, 'H:mm').format('h:mm a'));
            }
            // if there are no more buses
            else if (!nextBusTime && b === 1) {
              $destinationClass.find('.next-buses ul')
              .append('<li>')
              .append('No more for today.');
            }
          }

          // set flag for incoming bus
          incomingBus = true;
          return false;
        }
      });

      // no buses left
      if (!incomingBus) {
        $destinationClass.find('.time').html(
          moment(timetable[destination][0], 'h:mm').format('h:mm a')
        );
        $destinationClass.find('.time-left').html('Next bus leaves tomorrow morning');
      }
      else {
        $destinationClass.on('click', function () {
          $(this).find('.next-buses').show();
        });
      }
    };

    var getBusTimes = function () {
      getBusTime('to-village');
      getBusTime('to-aspens');
    }

    getBusTimes();

    // fetch bus times every ten seconds to update
    setInterval(function () {
      getBusTimes();
    }, 10000);
  });

})();
