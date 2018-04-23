
var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../helloworldin.zip');
var kuduApi = 'https://helloworldin.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$helloworldin';
var password = 'v60FK1ahW7dCJutQ1GP4Az57B1ha3pjztJMwqBvv3vcPgELsNxRYbtavTAu2';
console.log('heelo');
function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  console.log('start publish...');
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      console.log('OK publish...');
      uploadZip(callback);
    } else {
      console.log('err publish...');
      callback(err);
    }
  })
  console.log('end publish...');
}
console.log('publish' , publish);
publish(function(err) {
  console.log('start publish...');
  if (!err) {
    console.log('helloworldin publish');
  } else {
    console.error('failed to publish helloworldin', err);
  }
  console.log('finish publish...');
});