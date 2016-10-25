/* jshint esversion: 6 */

const passatempos = {

  crawler_server_domain: 'http://localhost:5001/',
  passatempos_obj: '',

  // Loads the object with the list of passatempos into memory.
  load() {
    if (passatempos.isStored()) {
      passatempos.passatempos_obj = passatempos.getLocalPassatempos();
      passatempos.showPassatempos();
    } else {
      passatempos.getNewPassatempos();
    }
  },

  // Saves the current passatempos object into the browser local storage
  save() {
    passatempos.setLocalPassatempos(passatempos.passatempos_obj);
  },

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
    const passatemposStr = JSON.stringify(passatemposObj);
    localStorage.setItem('passatempos', passatemposStr);
  },

  // Request new passatempos data to the crawler webservice.
  getNewPassatempos() {
    const url = `${this.crawler_server_domain}passatempos`;

    $.get(url, (passatemposObj) => {
      passatempos.passatempos_obj = passatemposObj;
      passatempos.showPassatempos();
    });
  },

  showPassatempos() {
    const passatemposObj = passatempos.passatempos_obj;

    Object.keys(passatemposObj).forEach((websiteName) => {
      const passatempoElem = $('<div class="passatempo">');
      passatempoElem.append(`<h2 class="website-name">${websiteName}</h2>`);

      const ul = $('<ul class="passatempos-list"></ul>');

      passatemposObj[websiteName].forEach((obj, i) => {
        const passatempoObj = passatemposObj[websiteName][i];

        const li = $('<li>');
        if (passatempoObj.checked) {
          li.addClass('checked');
        }

        li.append(`<a href="${passatempoObj.url}" target="_blank">${passatempoObj.name}</a>`);
        ul.append(li);
      });

      passatempoElem.append(ul);
      $('#passatempos').append(passatempoElem);
    });
  },

  toogleCheckPassatempo(websiteName, passatempoName) {
    const websitePassatempos = passatempos.passatempos_obj[websiteName];
    const passatempoToCheck = websitePassatempos.find(passatempo =>
                                                              passatempo.name === passatempoName);
    if (passatempoToCheck.checked) {
      passatempoToCheck.checked = false;
    } else {
      passatempoToCheck.checked = true;
    }

    passatempos.save();
  },

  getLastUpdate() {
    const url = `${passatempos.crawler_server_domain}last_update`;
    $.get(url, data => data);
  },
};


$().ready(($) => {
  $('#passatempos').on('click', 'ul li', function toogleChecked() {
    $(this).toggleClass('checked');

    const websiteName = $(this).parent().siblings('.website-name').text();
    const passatempoName = $(this).text();

    passatempos.toogleCheckPassatempo(websiteName, passatempoName);
  });

  $('#passatempos').off('click', 'ul li a');

  passatempos.load();
});
