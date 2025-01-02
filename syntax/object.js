var members = ['ga', 'na', 'da', 'ra', 'ma'];
console.log(members[1]);    // na
var i = 0;
while(i<members.length){
        console.log('array loop >> ', members[i]);
        i = i + 1;
}


var roles = {
    'programmer': 'ga'
    , 'designer': 'na'
    , 'manager': 'da'
};
console.log(roles.designer);    // na
for(var name in roles) {
    console.log('object >> ', name, '|| value >> ', roles[name]);
}