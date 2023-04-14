const fs = require('fs')
const file = fs.readFile('test.txt', { encoding: 'utf-8'}, (err, data) => {
    if (err) throw err;
    // console.log(data);
})

// 위에서 읽어 온 파일에서 한줄식 읽어서 linux terminal 창에 출력하기
const readline = require('readline');
const rl = readline.createInterface({
    input: fs.createReadStream('test.txt'),
    crlfDelay: Infinity
});



