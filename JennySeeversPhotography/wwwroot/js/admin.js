﻿$(function () {
    var $types = $("#cat-list");
    var $projs = $("#projects");
    var selCat;
    var selProj;

    buildCats($types);

    $types.on("click", ".category", selectCat);
    $types.on("click", "#add-cat", openAdder);
    $types.on("click", ".pencil", openEdit);
    $types.on("keypress", ".adding", addCat);
    $types.on("click", ".deleter", deleteCat);
    //$types.on("focusout", ".editing", cancelEdit); //this needs love

    $projs.on("click", ".category", selectProj);
    $projs.on("click", "#add-proj", openAdder);
    $projs.on("keypress", ".adding", addProj)

    function addProj() {
        if (event.which == "13") {
            var entry = $(this).val();
            $.ajax({
                url: "admin/add-proj",
                method: "post",
                dataType: "json",
                data: {
                    name: entry
                },
                error: function () {
                    alert("This didn't work. Ajax-wise.");
                },
                success: function () {
                    buildCats($projs);
                }
            });
        } else if ($(this).val.length > 20) {
            //tell it what to do if the project name is too long
        }
    }

    function deleteCat() {
        var id = $(this).parent().data("typeID");
        console.log("TypeID = " + id);
        $.ajax({
            url: "admin/delete-cat",
            method: "delete",
            dataType: "json",
            data: {
                id: id
            },
            error: function () {
                alert("AJAX Error");
            },
            success: function () {
                buildCats($types);
            }
        });
    }

    function cancelEdit() {
        alert("this worked");
        var $cat = $(this).parent();
        $(".editing").remove();
        $(".deleter").remove();
        $cat.children().show();
        $cat.find(".pencil").hide();
    }

    function openEdit() {
        var theCat = $(this).parent();
        var theName = theCat.find(".item-name").text();
        theCat.children().hide();
        theCat.append("<input class='editing add-cat' value='" + theName + "' autofocus><span class='deleter'>&#x274c;</span>");
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
        var whatItIs
        if ($(this) == $types) {
            whatItIs = "Class";
        } else {
            whatItIs = "Project";
        }
        $(this).empty().append("<input class='adding add-cat' placeholder='+ Add " + whatItIs + "' autofocus>");
    }

    function selectCat() {
        $(".cat-select").removeClass("cat-select");
        $(this).addClass("cat-select");
        selCat = $(this).data("typeID");
        if (!$(this).hasClass("adder")) {
            if ($(this).has) {  // Fix this shit
                buildCats.call(this, $projs);
            } else {
                alert("I've won the internet.");
            }
        }
    }

    function selectProj() {
        $(".proj-select").removeClass("proj-select");
        $(this).addClass("proj-select");
        selProj = $(this).data("projID");
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
