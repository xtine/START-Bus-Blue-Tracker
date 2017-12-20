(function() {

  $.getJSON('timetable.json').done(function (timetable) {

    var getBusTime = function (destination) {
      var timeNow = moment();
      var $destinationClass = $('.' + destination);
      var incomingBus = false;

      // set current time
      $('.now').html(timeNow.format('h:mm a'));

      // run through the bus timetable
      $.each(timetable[destination], function (i, time) {
        var busTime = moment(time, 'H:mm');
        var formattedBusTime = busTime.format('h:mm a');

        // get the next bus
        if (busTime.isAfter(timeNow)) {
          $destinationClass.find('.time').html(formattedBusTime);

          var timeLeft;
          var minutesLeft = moment.duration(busTime.diff(timeNow)).asMinutes();

          // over an hour wait
          if (minutesLeft > 59) {
            timeLeft = "In ";
            timeLeft += Math.abs(parseInt(
              moment.duration(busTime.diff(timeNow)).asHours()
            ));
            timeLeft += " hours";
          }
          // show minutes left
          else {
            timeLeft = "In ";
            timeLeft += Math.abs(parseInt(
              moment.duration(busTime.diff(timeNow)).asMinutes()
            ));
            timeLeft += " minutes";

            $destinationClass.find('.next-buses ul').empty();

            // show next three buses
            for (b = 1; b < 4; b++) {
              var nextBusTime = timetable[destination][i + b];
              if (nextBusTime) {
                $destinationClass.find('.next-buses ul')
                .append('<li>')
                .append(moment(nextBusTime, 'H:mm').format('h:mm a'));
              }
              else if (!nextBusTime && b === 1) {
                $destinationClass.find('.next-buses ul')
                .append('<li>')
                .append('No more for today.');
              }
            }
          }

          if (minutesLeft > 1) {
            $destinationClass.find('.time-left').html(timeLeft);
          }
          else {
            $destinationClass.find('.time-left').html('Leaving now!');
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

      $destinationClass.on('click', function () {
        $(this).find('.next-buses').show();
      });
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
