/* jshint esversion: 6 */

const passatempos = {

  crawler_server_domain: 'http://localhost:5001/',
  passatempos_obj: '',

  // Loads the object with the list of passatempos into memory.
  loadFromLocalStorage() {
    if (passatempos.isStored()) {
      passatempos.passatempos_obj = passatempos.getLocalPassatempos();
      passatempos.showPassatempos();
    } else {
      passatempos.getNewPassatempos();
    }
  },

  loadFromLocalMachine() {
    const passatemposFile = $('#input-load')[0].files[0];
    const reader = new FileReader();
    reader.readAsText(passatemposFile, 'UTF-8');
    reader.onload = (evt) => {
      const jsonString = evt.target.result;
      passatempos.setLocalPassatempos(JSON.parse(jsonString));
      passatempos.loadFromLocalStorage();
    };
    reader.onerror = () => {
      window.alert('There was some error.');
    };
  },

  // Saves the current passatempos object into the browser local storage
  saveInLocalStorage() {
    passatempos.setLocalPassatempos(passatempos.passatempos_obj);
  },

  // Saves the current passatempos object in the user computer
  saveInLocalMachine() {
    const text = JSON.stringify(passatempos.passatempos_obj);

    const a = document.createElement('a');
    a.setAttribute('href', `data:application/json;charset=utf-u,${encodeURIComponent(text)}`);
    a.setAttribute('download', 'passatempos.json');
    a.click();
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
    $('#get-passatempos-spinner').css('display', 'inline');

    $.get(url, (newPassatemposObj) => {
      // Checks if passatempos being received are already in the user storage and maintain its
      // state.
      if (passatempos.isStored()) {
        Object.keys(newPassatemposObj).forEach((websiteName) => {
          newPassatemposObj[websiteName].forEach((NewPassatempo) => {
            if (passatempos.passatempos_obj.hasOwnProperty(websiteName)) {
              const passatempoName = NewPassatempo.name;
              const oldPassatempo = passatempos.getPassatempo(websiteName, passatempoName);
              if (oldPassatempo !== undefined && oldPassatempo.checked) {
                NewPassatempo.checked = true;
              }
            }
          });
        });
      }

      passatempos.passatempos_obj = newPassatemposObj;
      passatempos.saveInLocalStorage();
      passatempos.showPassatempos();
    }).fail(() => window.alert("Can't connect to pcrawler server."))
      .always(() => $('#get-passatempos-spinner').css('display', 'none'));
  },

  showPassatempos() {
    $('#passatempos').empty();

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

  getPassatempo(websiteName, passatempoName) {
    const websitePassatempos = passatempos.passatempos_obj[websiteName];
    const passatempoWanted = websitePassatempos.find(passatempo =>
                                                              passatempo.name === passatempoName);
    return passatempoWanted;
  },

  toogleCheckPassatempo(websiteName, passatempoName) {
    const passatempoToCheck = passatempos.getPassatempo(websiteName, passatempoName);
    if (passatempoToCheck.checked) {
      passatempoToCheck.checked = false;
    } else {
      passatempoToCheck.checked = true;
    }

    passatempos.saveInLocalStorage();
  },

  getLastUpdate() {
    const url = `${passatempos.crawler_server_domain}last_update`;
    $.get(url, data => data);
  },
};


$().ready(($) => {
  $('#passatempos').on('click', 'ul li', function toogleChecked(e) {
    // The conditional is to avoid that the passatempo gets checked when the user clicks on the
    // hyperlink.
    if (e.target === this) {
      $(this).toggleClass('checked');

      const websiteName = $(this).parent().siblings('.website-name').text();
      const passatempoName = $(this).text();

      passatempos.toogleCheckPassatempo(websiteName, passatempoName);
    }
  });

  $('#btn-get-passatempos').on('click', () => passatempos.getNewPassatempos());
  $('#btn-save').on('click', () => passatempos.saveInLocalMachine());
  $('#btn-load').on('click', () => {
    const result = confirm('Are you sure you want to upload the file? The current list of' +
                           'passatempos will be deleted!');
    if (result) {
      $('#input-load').click();
    }
  });

  passatempos.loadFromLocalStorage();
});
