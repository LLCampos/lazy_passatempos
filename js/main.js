$().ready(function($) {

    $("#passatempos").on('click', 'ul li', function() {
        $(this).toggleClass('checked');
    });


    if (passatempos.isStored()) {
        passatempos.showPassatempos();
    } else {
        passatempos.getNewPassatempos();
    }

});


var getLastUpdate = function() {
    var url = pcrawler_domain + 'last_update';

    $.get(url, function(data) {
        return data;
    });
};


var passatempos = {

    crawler_server_domain: 'http://localhost:5001/',

    isStored: function() {
        if (localStorage.passatempos) {
            return true;
        }
        return false;
    },

    getLocalPassatempos: function() {
        return JSON.parse(localStorage.passatempos);
    },

    setLocalPassatempos: function(passatempos_obj) {

        if (!passatempos.isStored) {
            for (var website in passatempos_obj) {
                for (var i in passatempos_obj[website]) {
                    passatempos_obj[website][i].checked = false;
                }
            }
        }

        passatempos_str = JSON.stringify(passatempos_obj);
        localStorage.setItem("passatempos", passatempos_str);
    },

    getNewPassatempos: function() {
        var url = this.crawler_server_domain + 'passatempos';

        $.get(url, function(passatempos_obj) {
            passatempos.setLocalPassatempos(passatempos_obj);
            passatempos.showPassatempos();
        });
    },

    showPassatempos: function() {

        passatempos_obj = passatempos.getLocalPassatempos();

        for (var website_name in passatempos_obj) {

            passatempo_elem = $('<div class="passatempo">');
            passatempo_elem.append('<h2>' + website_name + '</h2>');


            var ul = $('<ul class="passatempos-list"></ul>');

            for (var i in passatempos_obj[website_name]) {
                var passatempo_obj =  passatempos_obj[website_name][i];

                var li;
                if (passatempos_obj.checked) {
                    li = $('<li class="checked">');
                } else {
                    li = $('<li>');
                }
                li.append('<a href="' + passatempo_obj.url + '">' + passatempo_obj.name + '</a>');
                ul.append(li);
            }

            passatempo_elem.append(ul);
            $('#passatempos').append(passatempo_elem);
        }
    },

    checkPassatempo: function(website, index) {
        passatempos_obj = passatempos.getLocalPassatempos();
        passatempos_obj[website][index].checked = true;
        passatempos.setLocalPassatempos(passatempos_obj);
    }
};
