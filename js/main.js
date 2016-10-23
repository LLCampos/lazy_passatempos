$().ready(function($) {

    $("#passatempos").on('click', 'ul li', function() {
        $(this).toggleClass('checked');
    });

    getPassatempos();

    /*
    if (localStorage.length == 0) {
    }
    */

});

var pcrawler_domain = 'http://localhost:5001/';

var getPassatempos = function() {
    var url = pcrawler_domain + 'passatempos';

    $.get(url, function(data) {
        fillPassatempos(data);
    });
};

var getLastUpdate = function() {
    var url = pcrawler_domain + 'last_update';

    $.get(url, function(data) {
        return data;
    });
};

var fillPassatempos = function(passatempos_obj) {

    for (var website_name in passatempos_obj) {

        passatempo_elem = $('<div class="passatempo">');
        passatempo_elem.append('<h2>' + website_name + '</h2>');


        var ul = $('<ul class="passatempos-list"></ul>');

        for (var i in passatempos_obj[website_name]) {
            var passatempo_obj =  passatempos_obj[website_name][i];
            var li = $('<li>');
            li.append('<a href="' + passatempo_obj.url + '">' + passatempo_obj.name + '</a>');
            ul.append(li);
        }

        passatempo_elem.append(ul);
        $('#passatempos').append(passatempo_elem);
    }
};
