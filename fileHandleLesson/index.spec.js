const assert = require('assert');
// 3rd party 라이브러리
const should = require('should');
//  통합 테스트 모듈 
const request = require('supertest');
const app = require('./expressApp');

// describe 에는 2개의 인자가 들어간다. 
// 테스트 코드는 it() 함수를 쓴다. 

describe('GET /users', () => {
    it('배열을 반환한다', (done) => {
        request(app)
            .get('/users')
            .end((err, res) => {
                console.log(res.body)

                done();
            })
    }) 
})

// 모카를 이용해서 테스트 코드를 돌려야 한다. 
// "test": "mocha" 를 package.json에 추가한다.
// "test": "mocha ./index.spec.js"

// 모카는 테스트를 돌려주는 모듈
// should 모듈: 검증 라이브러리