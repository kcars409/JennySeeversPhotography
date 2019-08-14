$(function () {
    var cats;

    pageInit();

    // This pulls the categories and their projects into cats[]
    function pageInit() {
        $.ajax({
            url: "get-cats",
            dataType: "json",
            error: dbError,
            success: function (data) {
                cats = data;
                buildNav();
            }
        });
    }

    function buildNav() {
        var temp = $("#cats-template").html();
        var $nav = $("nav");

        for (var i = 0; i < cats.length; i++) {
            var $c = $(temp);
            $c.find(".proj-category").text(cats[i].typeName);
            $nav.append($c);
        }
    }

    function dbError() {
        alert("There was an error accessing the database. Please try again later.");
    }
});