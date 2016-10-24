/* jshint esversion: 6 */

const passatempos = {

  crawler_server_domain: 'http://localhost:5001/',

  isStored() {
    if (localStorage.passatempos) {
      return true;
    }
    return false;
  },

  getLocalPassatempos() {
    return JSON.parse(localStorage.passatempos);
  },

  setLocalPassatempos(passatemposObj) {
    if (!passatempos.isStored) {
      Object.keys(passatemposObj).forEach((website) => {
        passatemposObj[website].forEach((obj, i) => {
          passatemposObj[website][i].checked = false;
        });
      });
    }

    const passatemposStr = JSON.stringify(passatemposObj);
    localStorage.setItem('passatempos', passatemposStr);
  },

  getNewPassatempos() {
    const url = `${this.crawler_server_domain} passatempos`;

    $.get(url, (passatemposObj) => {
      passatempos.setLocalPassatempos(passatemposObj);
      passatempos.showPassatempos();
    });
  },

  showPassatempos() {
    const passatemposObj = passatempos.getLocalPassatempos();

    Object.keys(passatemposObj).forEach((websiteName) => {
      const passatempoElem = $('<div class="passatempo">');
      passatempoElem.append(`<h2>${websiteName}</h2>`);

      const ul = $('<ul class="passatempos-list"></ul>');

      passatemposObj[websiteName].forEach((obj, i) => {
        const passatempoObj = passatemposObj[websiteName][i];

        const li = $('<li>');
        if (passatempoObj.checked) {
          li.addClass('checked');
        }

        li.append(`<a href="${passatempoObj.url}">${passatempoObj.name}</a>`);
        ul.append(li);
      });

      passatempoElem.append(ul);
      $('#passatempos').append(passatempoElem);
    });
  },

  checkPassatempo(website, index) {
    const passatemposObj = passatempos.getLocalPassatempos();
    passatemposObj[website][index].checked = true;
    passatempos.setLocalPassatempos(passatemposObj);
  },

  uncheckPassatempo(website, index) {
    const passatemposObj = passatempos.getLocalPassatempos();
    passatemposObj[website][index].checked = false;
    passatempos.setLocalPassatempos(passatemposObj);
  },

  getLastUpdate() {
    const url = `${passatempos.crawler_server_domain}last_update`;
    $.get(url, data => data);
  },

};


$().ready(($) => {
  $('#passatempos').on('click', 'ul li', function toogleChecked() {
    $(this).toggleClass('checked');
  });

  if (passatempos.isStored()) {
    passatempos.showPassatempos();
  } else {
    passatempos.getNewPassatempos();
  }
});
