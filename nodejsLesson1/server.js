require('dotenv').config();
const express = require('express');
// import { MongoClient } from 'mongodb';
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
// .env 파일의 설정이 우선하고 프로젝트 root 디렉토리에 .env 파일이 없으면
// process.env.PORT 는 3005 가 된다.

// client 에서 서버로 데이터를 전송할 때
// json 형식으로 전송하면 body-parser 가 이를 파싱해서
// req.body 에 넣어준다.
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3006;

const mongoPort = process.env.MONGO_PORT || 27023;
const mongoURL = process.env.mongoURL || `mongodb://localhost:${mongoPort}`;

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const dbName = 'todoapp';

const client = new MongoClient(mongoURL, mongoOptions);
client.connect((err) => {
    if (err) {
        console.log('MongoDB 연결 실패', err);
        return;
    }

    console.log('MongoDB 연결 성공');
    const db = client.db(dbName);

    app.post('/add', (req, res) => {
        const target = 'post';
        const { title, date } = req.body;
        db.collection(target).insertOne({ title, date }, (err, result) => {
            if (err) {
                console.log('데이터 저장 실패', err);
                return;
            }
            console.log('데이터 저장 성공');
            res.send('전송 완료');    
        });
    // app.post finished
    })


    app.get('/list', (req, res) => {
        // res.sendFile(__dirname + '/list.html');
        const target = 'post';
        const { title, date } = req.body;
        db.collection(target).find().toArray((err, result) => {
            if (err) {
                console.log('데이터 조회 실패', err);
                return;
            }
            console.log('데이터 조회 성공');
            res.send(result);
        });
    });

    // db.collection('post').insertOne({name: 'Jacob', _id : 100, age: 30}, () => {
        // console.log('저장 완료');
    // });


    /* 윗줄에서 client.db(dbName) 을 연결해주면 
        db.collection() 을 이용해서 컬렉션(collection, 즉 테이블)을 안에 넣어서 이용한다.
        따라서 앞에 부분은 db.collection('post') 이 되고 뒤에 insertOne() 이나 find() 등을 이용한다.  
        insertOne('저장할 데이터', 콜백함수(err, result와 같이)를 넣는다.) 
        저장할 데이터는 json 형식(object 자료형)으로 넣어준다. 따라서 {title: '제목', content: '내용'} 이런 식으로 넣어준다.
        db.collection('post').insertOne({title: '제목', content: '내용'}, (err, result) => {
                                                               */
// Client 연결 종결
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.get([ '/', '/index.html' ], (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.get( ['/write', '/write.html'], (req, res) => {
    res.sendFile(__dirname + '/write.html')
});

app.get( '/list.ejs', (req, res) => {
    res.render('list.ejs')
});

// app.post('/add', (req, res) => {
//     res.send('전송 완료');
//     console.log(req.body.title);
//     console.log(req.body.date);
// });

