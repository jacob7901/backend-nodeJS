require('dotenv').config();
const express = require('express');
// import { MongoClient } from 'mongodb';
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');


const app = express();
// .env 파일의 설정이 우선하고 프로젝트 root 디렉토리에 .env 파일이 없으면
// process.env.PORT 는 3005 가 된다.

// client 에서 서버로 데이터를 전송할 때
// json 형식으로 전송하면 body-parser 가 이를 파싱해서
// req.body 에 넣어준다.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
//  path.join 후 __dirname 은 현재 디렉토리를 의미한다. (nodejsLesson1)
app.use(express.static(path.join(__dirname)));

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
        //  counter라는 파일을 만들고 post의 총 게시물 개수와 이름을 저장해서 거기에서 값을 가져온다. 
        db.collection('counter').findOne({ name: '게시물 갯수'}, (err, result) => {
            if(err) { console.log('데이터 조회 실패', err); return; }
            console.log('총 게시물 조회 성공' + result.totalPost);
            var totalPostNumber = result.totalPost;

            db.collection(target).insertOne({ _id : totalPostNumber + 1, title, date }, (err, result) => {
                if (err) {
                    console.log('데이터 저장 실패', err);
                return;
            }
                console.log('데이터 저장 성공');
                res.send('전송 완료');    
                // DB 업데이트 (counter 페이지에 있는 총 게시물 개수를 +1 해준다.)
                // update 할때는 오퍼레이터(연산자)를($set) 이용해야 한다. $inc 
                // { $set: { totalPost: 1 }}} -> totalPost 값을 1로 바꿔준다.
                // { $inc: { totalPost: 1 }}} -> totalPost 값을 1 증가시켜준다.
                db.collection('counter').updateOne({ name: '게시물 갯수'}, { $inc: { totalPost: 1 } }, (err, result) => {
                    if(err) { console.log('데이터 조회 실패', err); return; }
                    console.log('[게시물이 업데이트되었습니다.]: 번호:' + result);
                });
            // res.render('list', { posts : result } )
            });
        // end of db.collection 
        });
        //  ID 를 추가하려면 title 앞에 _id: 를 추가하면 된다. 총 게시물 + 1 
        // auto increment 를 하면 되는데 

    // app.post finished
    })



    app.get('/list.ejs', (req, res) => {
        const target = 'post';
        db.collection(target).find().toArray((err, result) => {
            if (err) {
                console.log('데이터 조회 실패', err);
                return;
            }
            console.log(result);
            // res.send(result);
            res.render('list', { posts : result } );

        // db.collection finished
        });
    });

    app.delete('/delete', (req, res) => {
        console.log(`요청내용 : ${req.body._id}`);
        req.body._id = parseInt(req.body.id);
        db.collection('post').deleteOne( req.body._id, (err, result) => {
            res.status(200).send( {message : '성공했습니다.' + result} );
        })
    })

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

// app.get( '/list.ejs', (req, res) => {
    // res.render('list.ejs')
// });

// app.post('/add', (req, res) => {
//     res.send('전송 완료');
//     console.log(req.body.title);
//     console.log(req.body.date);
// });

