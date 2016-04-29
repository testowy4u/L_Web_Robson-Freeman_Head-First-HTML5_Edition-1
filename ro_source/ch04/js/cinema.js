//

window.onload = function() {
    // 1
    getNextShowing(movie1);
    
    // 2
    movie1.getNextShowing();
    
    // 3
    var banzaiMovie = new Movie("Beckaroo Banzai", "Cult Classic", 5, ["1:00pm", "5:00pm", "7:00pm", "11:00pm"]);
    console.log(banzaiMovie.getNextShowing());
    
    var plan9Movie = new Movie("Plan 9 from Outer Space", "Cult Classic", 2, ["3:00pm", "7:00pm", "11:00pm"]);
    console.log(plan9Movie.getNextShowing());
    
    var forbiddenPlanetMovie = new Movie("Forbidden Planet", "Classic Sci-Fi", 5, ["5:00pm", "9:00pm"]);
    console.log(forbiddenPlanetMovie.getNextShowing());
};

function Movie(title, genre, rating, showtimes) {
    this.title = title;
    this.genre = genre;
    this.rating = rating;
    this.showtimes = showtimes;

    this.getNextShowing = function() {
        var now = new Date().getTime();
        for (var i = 0; i < showtimes.length; i++) {
            var showtime = getTimeFromString(this.showtimes[i]);
            if ((showtime - now) > 0) {
                return "Next showing of " + this.title + " is " + this.showtimes[i];
            }
        }
        return null;
    };
}

var movie1 = {
    title: "Plan 9 from Outer Space",
    genre: "Cult Classic",
    rating: 2,
    showtimes: ["3:00pm", "7:00pm", "11:00"],
    getNextShowing: function() {
        var now = new Date().getTime();
        for (var i = 0; i < this.showtimes.length; i++) {
            var showtime = getTimeFromString(this.showtimes[i]);
            if ((showtime - now) > 0) {
                return "Next showing of " + this.title + " is " + this.showtimes[i];
            }
        }
    }
};

var movie2 = {
    title: "Forbidden Planet",
    genre: "Classic Sci-Fi",
    rating: 5,
    showtimes: ["5:00pm", "9:00pm"],
    getNextShowing: function() {
        var now = new Date().getTime();
        for (var i = 0; i < this.showtimes.length; i++) {
            var showtime = getTimeFromString(this.showtimes[i]);
            if ((showtime - now) > 0) {
                return "Next showing of " + this.title + " is " + this.showtimes[i];
            }
        }
    }
};

function getNextShowing(movie) {
    var now = new Date().getTime();
    for (var i = 0; i < movie.showtimes.length; i++) {
        var showtime = getTimeFromString(movie.showtimes[i]);
        if ((showtime - now) > 0) {
            return "Next showing of " + movie.title + " is " + movie.showtimes[i];
        }
    }
    return null;
}

function getTimeFromString(str) {
    var theTime =  new Date();
    var time = str.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    theTime.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
    theTime.setMinutes(parseInt(time[2]) || 0);
    return theTime.getTime();
}
