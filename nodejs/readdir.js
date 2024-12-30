var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist){
    // 배열형식으로 전달 [ 'CSS', 'HTML', 'JavaScript' ]
    console.log(filelist);  
});