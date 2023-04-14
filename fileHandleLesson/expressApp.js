const express = require('express')
const logger = require('morgan')
const app = express()

/* 어플리케이션은 use라는 함수를 쓴다. use라는 함수를 써서 미들웨어를 쓸 수 있다. 
    const mw = () => {} 
    mw 함수는 3가지 인자를 받는다. req, res, next
    const mw = (req, res, next) => {}

                                                            */
const mw = (req, res, next) => {
    // 로깅
    console.log('mw!')
    // throw Error('error')

}

const mw2 = (req, res, next) => {
    console.log('mw2')
    next()
}

const errorMw = (err, req, res, next) => {
    console.log(err.message)
}

app.use(logger('dev'))
app.use(mw)
app.use(errorMw)


app.listen(4001, () => console.log('Server started'))