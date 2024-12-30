var number = [1, 400, 12, 34];   // 각각의 값 element(원소)
var i = 0;  
var total = 0;
while(i < number.length){
    total = total + number[i];
    i = i + 1;
}
console.log(`total : ${total}`);