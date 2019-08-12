$(function () {
    var cats = [];

    buildTypes();

    function buildTypes() {
        $.ajax({
            url: "get-cats",
            dataType: "json",
            error: dbError,
            success: buildButtons
        });
    }

    function buildButtons(data) {
        cats.length = 0;
        var temp = $("#cats-template").html();
        var $nav = $("nav");

        for (var i = 0; i < data.length; i++) {
            var $c = $(temp);
            cats.push(data[i].typeName)
            $c.text(cats[i]);
            $nav.append($c);
        }
    }

    function dbError() {
        alert("There was an error accessing the database. Please try again later.");
    }
});