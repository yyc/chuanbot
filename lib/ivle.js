const request = require("request-promise-native");
const { parseString } = require("xml2js");

const baseurl = "https://ivle.nus.edu.sg/api/Lapi.svc/";

function urlFor(endpoint) {
  return baseurl + endpoint;
}

//public
function ivle(apikey, proxy) {
  this.apikey = apikey;
  this.proxy = proxy;

  this.getAuthURL = function(callbackurl) {
    authUrl =
      "https://ivle.nus.edu.sg/api/login/?apikey=" +
      apikey +
      "&url=" +
      encodeURIComponent(callbackurl);
    return authUrl;
  };

  //create user with auth token
  this.getUser = async function(authToken) {
    const user = new User(authToken);
    await user.validate();
    return user;
  };

  function User(authtoken) {
    this.authtoken = authtoken;

    //set auth token
    this.setauthtoken = function(newauthtoken) {
      this.authtoken = newauthtoken;
    };

    //validate user
    this.validate = async function() {
      const endpoint = "Validate";
      response = await request({
        uri: urlFor(endpoint),
        qs: {
          APIKey: apikey,
          Token: this.authtoken,
          output: "json"
        },
        json: true,
        method: "GET"
      });
      return response;
    };

    //modules
    this.modules = async function() {
      const endpoint = "Modules";
      const params = {
        APIKey: apikey,
        AuthToken: this.authtoken,
        Duration: 0,
        //whether to display basic info or all or it.
        IncludeAllInfo: false,
        output: "json"
      };
      const response = await fetch(urlFor(endpoint, params), {
        method: "GET"
      });
      return await response.json();
    };

    //workbin
    this.workbin = function(courseId, success, error) {
      const endpoint = "Workbins";
      const params = {
        APIKey: apikey,
        AuthToken: this.authtoken,
        CourseId: courseId,
        Duration: 0,
        //"WorkbinID" : 0, // undefined means all
        //whether to display basic info or all or it.
        // "TitleOnly" : true,
        TitleOnly: false,
        output: "json"
      };
      const url = baseurl + endpoint;
      jsonp(url, params, success, error, proxy);
    };

    //file download
    this.file = function(fileId) {
      //dont like this. but it works
      const url =
        "https://ivle.nus.edu.sg/api/downloadfile.ashx?APIKey=" +
        apikey +
        "&AuthToken=" +
        this.authtoken +
        "&ID=" +
        fileId +
        "&target=workbin";
      window.location.href = url;
    };

    //file download
    this.fileURL = function(fileId) {
      //dont like this. but it works
      const url =
        "https://ivle.nus.edu.sg/api/downloadfile.ashx?APIKey=" +
        apikey +
        "&AuthToken=" +
        this.authtoken +
        "&ID=" +
        fileId +
        "&target=workbin";
      return url;
    };

    //announcements
    this.announcements = function(courseId, success, error) {
      const endpoint = "Announcements";
      const params = {
        APIKey: apikey,
        AuthToken: this.authtoken,
        CourseId: courseId,
        Duration: 0,
        //whether to display basic info or all or it.
        // "TitleOnly" : true,
        TitleOnly: false,
        output: "json"
      };
      const url = baseurl + endpoint;
      jsonp(url, params, success, error, proxy);
    };

    //gradebook
    this.gradebook = function(courseId, success, error) {
      const endpoint = "Gradebook_ViewItems";
      const params = {
        APIKey: apikey,
        AuthToken: this.authtoken,
        CourseId: courseId,
        output: "json"
      };
      const url = baseurl + endpoint;
      jsonp(url, params, success, error, proxy);
    };

    //forums
    this.forum = function(courseId, success, error) {
      const endpoint = "Forums";
      const params = {
        APIKey: apikey,
        AuthToken: this.authtoken,
        CourseId: courseId,
        Duration: 0,
        IncludeThreads: true, //whether to display threads
        //whether to display basic info or all or it.
        // "TitleOnly" : true,
        TitleOnly: false,
        output: "json"
      };
      const url = baseurl + endpoint;
      jsonp(url, params, success, error, proxy);
    };

    //webcasts
    this.webcasts = function(courseId, success, error) {
      const endpoint = "Webcasts";
      const params = {
        APIKey: apikey,
        AuthToken: this.authtoken,
        CourseId: courseId,
        Duration: 0,
        output: "json"
      };
      const url = baseurl + endpoint;
      jsonp(url, params, success, error, proxy);
    };
  }
}

module.exports = ivle;
