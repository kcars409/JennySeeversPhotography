$(function () {
    var $types = $("#cat-list");
    var $projs = $("#projects");
    var $pics = $("#photo-display");
    var selCat;
    var selProj;
    var selPic = [];
    var uploads = [];

    initUpload();
    buildCats($types);

    $types.on("click", ".category", selectCat);
    $types.on("click", "#add-cat", openAdder);
    $types.on("click", ".pencil", openEdit);
    $types.on("keypress", ".adding", addCat);
    $types.on("keypress", ".editing", editName);
    $types.on("click", ".deleter", deleteCat);
    //$types.on("focusout", ".editing", cancelEdit); //this needs love

    $projs.on("click", ".category", selectProj);
    $projs.on("click", "#add-proj", openAdder);
    $projs.on("click", ".pencil", openEdit);
    $projs.on("keypress", ".adding", addProj);
    $projs.on("keypress", ".editing", editName);
    $projs.on("click", ".deleter", deleteCat);

    //$pics.on("click", "#add-pics", initUpload); use this for something else

    function initUpload() {
        var $dzdiv = $("#add-pics");
        $dzdiv.addClass("dropzone");

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
    }

    function addProj() {
        if (event.which == "13") {
            var entry = $(this).val();
            $.ajax({
                url: "admin/add-proj",
                method: "post",
                dataType: "json",
                data: {
                    name: entry,
                    typeID: selCat
                },
                error: ajaxError,
                success: function () {
                    $(".proj-select").removeClass("proj-select");
                    buildCats.call($("#cat-list .cat-select"), $projs);
                }
            });
        } else if (event.which == "27") {
            cancelEdit.call(this);
        } else if ($(this).val.length > 20) {
            //tell it what to do if the project name is too long
        }
    }

    function deleteCat() {
        var theCat = $(this).parent();
        var whichColumn = theCat.parent().attr("id");
        var sayWhich;
        var id;
        var url = "admin/delete-";

        if (whichColumn == "cat-list") {
            id = selCat;
            sayWhich = "category";
            url += "cat";
        } else if (whichColumn == "projects") {
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
                        buildCats(theCat);
                    }
                });
            } else {
                buildCats(theCat);
                return
            }
        } else {
            buildCats(theCat);
            return
        }
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
        var whichColumn = theCat.parent().attr("id");
        var sayWhich;
        if (whichColumn == "cat-list") {
            selCat = theCat.data("typeID");
            sayWhich = "add-cat";
        } else if (whichColumn == "projects") {
            selCat = theCat.data("projID");
            sayWhich = "add-proj";
        }
        theCat.children().hide();
        theCat.append("<input class='editing " + sayWhich + "' autofocus><span class='deleter'>&#x274c;</span>"); // value='" + theName + "'
        $(".editing").attr("value", theName);
        $(".editing").select();
    }

    function editName(event) {
        if (event.which == "13") {
            var entry = $(this).val();
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
                    buildCats($parentCat.parent());
                }
            })
        } else if (event.which == "27") {
            buildCats($parentCat.parent());
            $parentCat.addClass(path + "-select");
        }
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
                error: ajaxError,
                success: function () {
                    buildCats($types);
                }
            });
        } else if ($(this).val.length > 20) {
            //tell it what to do if the category name is too long
        }
    }

    function openAdder() {
        var whatItIs;
        var $nav = $(this).parent();
        if ($nav.attr("id") == "cat-list") {
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
        $(".cat-select").removeClass("cat-select");
        $(this).addClass("cat-select");
        //resetPics();
        selCat = $(this).data("typeID");
        if (!$(this).hasClass("adder")) {
            buildCats($projs);
        }
    }

    function selectProj() {
        $(".proj-select").removeClass("proj-select");
        $(this).addClass("proj-select");
        selProj = $(this).data("projID");


        buildCats($pics);


        if (!$(this).hasClass("adder")) {
            if ($(this).has) {  // Fix this shit
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
        } else if (whichColumn == $projs) {
            url += "get-projs";
            data = { typeID: selCat };
        } else if (whichColumn == $pics) {
            url += "get-pics";
            data = { id: selProj };
        }

        $.ajax({
            url: url,
            dataType: "json",
            data: data,
            error: ajaxError,
            success: function (data) {
                fillColumn(data, whichColumn);
            }
        });
    }

    function fillColumn(data, whichColumn) {
        $(".adding").remove();

        var $add = whichColumn.find(".adder").clone();
        var names = [];
        var ids = [];
        var dataName = "";
        
        whichColumn.empty();

        // This part breaks down the data back from the ajax call
        if (whichColumn == $types) {
            for (var i = 0; i < data.length; i++) {
                names.push(data[i].typeName);
                ids.push(data[i].typeID);
            }
            dataName = "typeID"; //This is the data name to retrieve in the project category builder
            selCat = 0;
        } else if (whichColumn == $projs) {
            for (var i = 0; i < data.length; i++) {
                names.push(data[i].projName);
                ids.push(data[i].projID);
            }
            dataName = "projID"; //This is the data name to retrieve in the project builder
            selProj = 0;
        } else if (whichColumn == $pics) {
            for (var i = 0; i < data.length; i++) {
                names.push(data[i].title);
                ids.push(data[i].picID);
            }
            dataName = "picID"; //This is the data name to retrieve in the project builder
            selPic = 0;
        }
        for (var ci = 0; ci < data.length; ci++) {
            whichColumn.append("<div class='category'><span class='item-name' id='this-un' /><span class='pencil hid-pencil'>&#x270E;</span></div>");
            $("#this-un").text(names[ci]).removeAttr("id");
            whichColumn.find(".category:last-of-type").data(dataName, ids[ci]);
        }
        
        whichColumn.append($add);
        $add.removeClass("cat-select").removeClass("proj-select").contents().show();
    }

    function ajaxError() {
        alert("AJAX Error");
    };

    function resetPics() {
        $add = $("#add-pics").clone().hide();
        $pics.empty().append($add);
    }
});