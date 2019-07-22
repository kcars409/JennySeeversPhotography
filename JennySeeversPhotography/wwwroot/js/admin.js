$(function () {
    var $types = $("#cat-list");
    var $projs = $("#projects");

    buildCats($types);

    $types.on("click", ".category", selectCat);
    $types.on("click", "#add-cat", openAdder);

    $types.on("click", ".pencil", openEdit);
    $types.on("keypress", ".adding", addCat);
    $(".editing").on("focusout", ".editing", cancelEdit); //this needs love

    $projs.on("click", ".category", selectCat);

    function cancelEdit() {
        alert("this worked");
        var $cat = $(".editing").parent();
        $(".editing").remove();
        $cat.children().show();
    }

    function openEdit() {
        var theCat = $(this).parent();
        var theName = theCat.find(".item-name").text();
        theCat.children().hide();
        theCat.append("<input class='editing add-cat' value='" + theName + "' autofocus>");
        $(".editing").select();
    }

    function addCat(event) {
        if (event.which == "13") {
            var entry = $(this).val();
            $.ajax({
                url: "admin/add-cat",
                method: "post",
                dataType: "json",
                data: {
                    name: entry
                },
                error: function () {
                    alert("This didn't work. Ajax-wise.");
                },
                success: function () {
                    buildCats($types);
                }
            });
        } else if ($(this).val.length > 20) {
            //tell it what to do if the category name is too long
        }
    }

    function openAdder() {
        $(this).empty().append("<input class='adding add-cat' placeholder='+ Add Class' autofocus>");
    }

    function selectCat() {
        $(".cat-select").removeClass("cat-select");
        $(this).addClass("cat-select");
        if (!$(this).hasClass("adder")) {
            if ($(this).has) {  // Fix this shit
                buildCats.call(this, $projs);
            } else {
                alert("I've won the internet.");
            }
        }
    }

    function buildCats(whichColumn) {
        var url = "admin/";
        var data = {};

        if (whichColumn == $types) {
            url += "get-cats";
        } else {
            url += "get-projs";
            data = { typeID: $(this).data("typeID") };
        }

        $.ajax({
            url: url,
            dataType: "json",
            data: data,
            error: function () {
                alert("AJAX error!")
            },
            success: function (data) {
                fillColumn(data, whichColumn);
            }
        });
    }

    function fillColumn(data, whichColumn) {
        var $add = whichColumn.find(".adder").clone();
        var names = [];
        var ids = [];
        var dataName = "";

        whichColumn.find(".adder").remove();
        whichColumn.empty();

        // This part breaks down the data back from the ajax call
        if (whichColumn == $types) {
            for (var i = 0; i < data.length; i++) {
                names.push(data[i].typeName);
                ids.push(data[i].typeID);
            }
            dataName = "typeID"; //This is the data name to retrieve in the project category builder
        } else if (whichColumn == $projs) {
            for (var i = 0; i < data.length; i++) {
                names.push(data[i].projName);
                ids.push(data[i].projID);
            }
            dataName = "projID"; //This is the data name to retrieve in the project builder
        }
        for (var ci = 0; ci < data.length; ci++) {
            whichColumn.append("<div class='category'><span class='item-name' id='this-un' /><span class='pencil hid-pencil'>&#x270E;</span></div>");
            $("#this-un").text(names[ci]).removeAttr("id");
            whichColumn.find(".category:last-of-type").data(dataName, ids[ci]);
        }

        whichColumn.append($add);
    }
});
