const client = require("../lib/redis.js");
const IVLE = require("./ivle.js");

async function init() {
  const ivle = new IVLE(process.env.LAPI_KEY);
  const userToken = await client.get("token");

  if (!userToken) {
    throw "not logged in!";
    return;
  }

  console.log("Token acquired! " + userToken);

  const user = await ivle.getUser(userToken);
  validateUser(user).catch(e => {
    console.error(e);
    throw "not logged in!";
  });
  console.log("retrieving modules");
  const modules = await updateUserModules(user);
  console.log(user);
  console.log(modules);
  // const workbins = await updateModules(user);
  // let moduleWorkbins = await updateUserModules(user, workbins);
  // moduleWorkbins = moduleWorkbins.reduce((acc, mW) => acc.concat(mW), []);
  // processWorkbins(user, moduleWorkbins);
}

function showLogin(app) {
  return () => {
    console.log("User token not found, please log in");
    $("login").show();
    app.auth($("#login-button"), window.location.href);
    return;
  };
}
// Validates the user and returns a promise
function validateUser(user) {
  return user.validate();
}

async function updateUserModules(user) {
  try {
    let result = await user.modules();
    var arrayedResults = result["Results"].map(mod => {
      return {
        name: mod["CourseName"],
        code: mod["CourseCode"],
        id: mod["ID"]
      };
    });
    console.log(result);
    localStorage.setItem("modules", JSON.stringify(arrayedResults));
  } catch (e) {
    console.error(e);
  }
}

var updateModules = (user, modules) => {
  return Promise.all(
    modules.map(
      module =>
        new Promise((fulfill, reject) => {
          var config = JSON.parse(localStorage.getItem(module.id));
          if (!config) {
            config = module;
          }
          user.workbin(
            module.id,
            result => {
              var workbins = result["Results"].map(workbin => ({
                id: workbin["ID"],
                name: workbin["Title"],
                folders: workbin["Folders"]
              }));
              fulfill(workbins);
            },
            error => {
              reject(error);
            }
          );
        })
    )
  );
};

var processWorkbins = (user, workbins) => {
  return Promise.all(
    workbins.map(
      workbin =>
        new Promise((fulfill, reject) => {
          var localStorage = window.localStorage;
          var moduleData = JSON.parse(localStorage.getItem(workbin.id));
          console.log(moduleData);
          if (!moduleData) {
            // Entry does not exist, create and notify
            moduleData = Object.assign({ sync: false }, workbin);
            //localStorage.setItem(Object.)
            var notif = new Notification(
              `New Workbin Found: ${moduleData.name}`,
              {
                body: "Click to set sync options"
              }
            );
            console.log(notif);
          }
        })
    )
  );
};

// From https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

module.exports = {
  init
};
