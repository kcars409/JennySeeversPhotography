﻿$(function () {
    login();

    var $types = $("#cat-list");
    var $projs = $("#projects");
    var $pics = $("#photos");
    var $picDisp = $("#photo-display");
    var typeList = [{}];
    var projList = [{}];
    var selCat;
    var selProj;
    var selPics = [];
    var uploads = [];
    var $main = $("main");

    function init() {
        initUpload();
        pullCats($types);
        selPics.length = 0;
    }


    $main.on("click", ".item-name", selectCat);
    $main.on("click", "#add-cat", openAdder);
    $main.on("click", "#add-proj", openAdder);
    $main.on("click", ".pencil", openEdit);
    $main.on("keypress", ".adding", addCat);
    $main.on("keypress", ".editing", editName);
    $main.on("click", ".deleter", deleteCat);
    $main.on("focusout", ".editing", cancelEdit);

    $picDisp.on("click", ".photo-group", togSelPics);
    $("#pic-delete").click(function () {
        deletePics(selPics);
    });

    function login() {
        $("main").hide();
        $("#submit-login").click(checkLogin);

        function checkLogin() {
            alert("You clicked this, fool.");
        }
    }

    function togSelPics() {
        var picID = $(this).data("picID");

        if (!$(this).hasClass("sel-pic")) {
            $(this).addClass("sel-pic");
            selPics.push(picID);
        } else {
            $(this).removeClass("sel-pic");
            var index = selPics.indexOf(picID);
            selPics.splice(index, 1);
        }
        console.log(selPics);
    }

    function initUpload() {
        var $dzdiv = $("#add-pics");
        $dzdiv.addClass("dropzone").hide();

        var dz = new Dropzone("#add-pics", {
            paramName: "file",
            url: "admin/upload",
            init: function () {
                this.on("sending", function (file, xhr, formData) {
                    formData.append("typeID", selCat);
                    formData.append("projID", selProj);
                });
            }
        });
        dz.on("success", uploadComplete);
        dz.on("error", function () {
            alert("Upload Failed");
        });
    }

    function uploadComplete(event, response) {
        uploads.push(response);
        pullCats($pics);
    }

    function deleteCat() {
        var $theCat = $(this).parent().parent();
        var $whichColumn = $theCat.parent();
        var sayWhich;
        var id;
        var url = "admin/delete-";

        if ($whichColumn.attr("id") == "cat-list") {
            id = selCat;
            sayWhich = "category";
            url += "cat";
        } else if ($whichColumn.attr("id") == "projects") {
            id = selProj;
            sayWhich = "project";
            url += "proj";
        }
        
        if (confirm("Are you sure you want to delete this "+sayWhich+" and everything in it??")) {
            if (confirm("Are you REALLY sure you want to delete this "+sayWhich+" and everything in it??")) {
                $.ajax({
                    url: url,
                    method: "delete",
                    dataType: "json",
                    data: {
                        id: id
                    },
                    error: ajaxError,
                    success: function () {
                        pullCats($whichColumn);
                        resetPics();
                    }
                });
            } else {
                pullCats($whichColumn);
                return
            }
        } else {
            pullCats($whichColumn);
            return
        }
    }

    function deletePics(picArray) {
        if (picArray.length > 0) {
            for (var i = 0; i < picArray.length; i++) {
                $.ajax({
                    url: "admin/delete-pic",
                    method: "delete",
                    dataType: "json",
                    data: { id: picArray[i] },
                    error: ajaxError,
                    success: function () {
                        hidePic(picArray[i]);
                    }
                });
            }
            pullCats($pics);
        }
    }

    function hidePic(picID) {
        var len = $pics.children().length;
        for (var i = 0; i < len; i++) {
            if ($pics.find(".photo-group:nth-of-type("+i+")").data("picID") == picID) {
                $pics.find(".photo-group:nth-of-type(" + i + ")").remove();
            }
        }
    }

    function cancelEdit() {
        var $cat = $(this).parent();
        $(".editing").remove();
        $(".deleter").remove();
        $cat.children().removeClass("edit-hide");
    }

    function openEdit() {
        selectCat.call(this);

        var $cat = $(this).parent();
        var theName = $cat.find(".item-name").text();
        var whichColumn = $cat.parent().attr("id");
        var sayWhich;
        if (whichColumn == "cat-list") {
            sayWhich = "add-cat";
        } else if (whichColumn == "projects") {
            sayWhich = "add-proj";
        }
        $cat.children().addClass("edit-hide");
        $cat.append("<div class='editing'><input class='" + sayWhich + "' autofocus><span class='deleter'>&#x274c;</span></div>");
        $(".editing").find("input").attr("value", theName);
        $(".editing").select();
    }

    function editName(event) {
        if (event.which == "13") {
            var entry = $(this).find("input").val();
            var $parentCat = $(this).parent();
            var path;
            var data = { name: entry };

            if ($parentCat.hasClass("cat-select")) {
                path = "cat";
                data.id = selCat;
            } else if ($parentCat.hasClass("proj-select")) {
                path = "proj";
                data.id = selProj ;
            }

            $.ajax({
                url: "admin/edit-" + path,
                method: "post",
                dataType: "json",
                data: data,
                error: ajaxError,
                success: function () {
                    pullCats($parentCat.parent());
                }
            })
        } else if (event.which == "27") {
            pullCats($parentCat.parent());
            $parentCat.addClass(path + "-select");
        }
    }

    function addCat(event) {
        if (event.which == "13") {
            var data = { name: $(this).val() };
            var url = "admin/add-";
            var $col = $(this).parent().parent();

            if ($col.attr("id") == $types.attr("id")) {
                url += "cat";
            } else if ($col.attr("id") == $projs.attr("id")) {
                url += "proj";
                data.typeID = selCat;
            }

            $.ajax({
                url: url,
                method: "post",
                dataType: "json",
                data: data,
                error: ajaxError,
                success: function () {
                    pullCats($col);
                }
            });
        } else if (event.which == "27") {
            cancelEdit.call(this);
        } else if ($(this).val.length > 20) {
            //tell it what to do if the category name is too long
        }
    }

    function openAdder() {
        var whatItIs;
        var $col = $(this).parent();

        $("#add-pics").hide();

        if ($col.attr("id") == "cat-list") {
            whatItIs = "Class";
        } else {
            if (selCat > 0) {
                whatItIs = "Project";
            } else {
                alert("No Project Category selected.");
                $(".proj-select").removeClass("proj-select");
                return
            }
        }
        $(this).contents().hide();
        $(this).append("<input class='adding add-cat' placeholder='+ Add " + whatItIs + "' autofocus>");
    }

    function selectCat() {
        cancelEdit();
        selPics.length = 0;

        var $cat = $(this).parent();
        var column = $cat.parent().attr("id");
        var type;

        if (column == "cat-list") {
            type = "cat";
            selCat = $cat.data("typeID");
            changeSel(type);

            if (!$cat.hasClass("adder")) {
                $("#add-pics").hide()
                pullCats($projs);
            }
        } else if (column == "projects") {
            type = "proj";
            selProj = $cat.data("projID");
            changeSel(type);

            if (!$cat.hasClass("adder")) {
                $("#add-pics").show();
                pullCats($pics);
            }
        }

        function changeSel (type) {
            $("." + type + "-select").removeClass(type + "-select");
            $cat.addClass(type + "-select");
            resetPics();
        }
    }

    function pullCats($whichColumn) {
        var url;
        var data = {};

        if ($whichColumn.attr("id") == "cat-list") {
            url = "get-cats";
        } else if ($whichColumn.attr("id") == "projects") {
            url = "get-projs";
            data = { typeID: selCat };
        } else if ($whichColumn.attr("id") == "photos") {
            url = "images/get-proj";
            data = { id: selProj };
        }

        $.ajax({
            url: url,
            dataType: "json",
            data: data,
            error: ajaxError,
            success: function (data) {
                if ($whichColumn.attr("id") == $projs.attr("id") || $whichColumn.attr("id") == $types.attr("id")) {
                    buildCats(data, $whichColumn);
                    fillColumn($whichColumn);
                } else if ($whichColumn.attr("id") == $pics.attr("id")) {
                    fillPics(data);
                }
            }
        });
    }

    function buildCats(data, $whichColumn) {
        // This part breaks down the data back from the ajax call and assigns it to an array of JS objects.
        if ($whichColumn.attr("id") == $types.attr("id")) {
            typeList.length = 0;
            for (var i = 0; i < data.length; i++) {
                typeList.push({
                    name: data[i].typeName,
                    id: data[i].typeID
                });
            }
        } else if ($whichColumn.attr("id") == $projs.attr("id")) {
            projList.length = 0;
            for (var i = 0; i < data.length; i++) {
                projList.push({
                    name: data[i].projName,
                    id: data[i].projID
                });
            }
        }
    }

    function fillPics(data) {
        var $display = $("#photo-display").empty();
        selPic = undefined;
        for (var i = 0; i < data.length; i++) {
            $display.append("<div class='photo-group'><figure class='pic' ><img src='" + data[i].thumbURL + "'/></figure><figcaption>" + data[i].title + "</figcaption></div>");
            $display.find(".photo-group:last-of-type").data("picID", data[i].picID);
        }
    }

    function fillColumn($whichColumn) {
        $(".adding").remove();

        var $add = $whichColumn.find(".adder").clone();
        var dataName = "";
        
        $whichColumn.empty();

        if ($whichColumn.attr("id") == $types.attr("id")) {
            dataName = "typeID"; //This is the data name to retrieve in the project builder
            selCat = undefined;
            selProj = undefined;
            constructor(typeList);
        } else if ($whichColumn.attr("id") == $projs.attr("id")) {
            dataName = "projID"; //This is the data name to retrieve in the project category builder
            selProj = undefined;
            constructor(projList);
        }

        // tell the function which listCat/listProj to use
        function constructor(list) {
            for (var i = 0; i < list.length; i++) {
                $whichColumn.append("<div class='category'><span class='item-name' id='this-un' /><span class='pencil hid-pencil'>&#x270E;</span></div>");
                $("#this-un").text(list[i].name).removeAttr("id");
                $whichColumn.find(".category:last-of-type").data(dataName, list[i].id);
            }
        }
        
        $whichColumn.append($add);
        $add.removeClass("cat-select").removeClass("proj-select").contents().show();
    }

    function ajaxError() {
        alert("AJAX Error");
    };

    function resetPics() {
        $("#photo-display").empty();
    }
});