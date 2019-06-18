const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(WebpackConfig)

const cookieParser = require('cookie-parser')

const multipart = require('connect-multiparty') // 前端用multipart/form-data的形式上传数据，后端通过中间件connect-multipary接收。 
const atob = require('atob')

const path = require('path')

require('./server2')

const axios = require('axios')

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))



// app.use(express.static(__dirname, {
//   setHeaders (res) {
//     res.cookie('XSRF-TOKEN-D', '1234abc')
//   },
//   setHeaders (res) {
//     res.header('Referer', 'https://cyber.chepass.com/IndexPage/Index')
//   }

// }))


app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(multipart({
  uploadDir: path.resolve(__dirname, 'upload-file')
}))

//添加路由开始
const router = express.Router()

router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/base/get', function(req, res) {
    res.json(req.query)
  })


router.post('/base/post', function(req, res) {
  console.log('/base/postpostpostpost---->',req.body)
  res.json(req.body)
})

router.post('/base/buffer', function(req, res) {
  let msg = []
  req.on('data', (chunk) => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

router.get('/error/get', function(req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    })
  }, 3000)
})

router.get('/interceptor/get', function(req, res) {
  res.json({
    data: 'hello'
  })
  res.end()
})


registerExtendRouter()
registerConfigRouter()
registerCancelRouter()
registerMoreRouter()

app.use(router)
//添加路由结束



function registerExtendRouter() {
  router.get('/extend/get', function(req, res) {
    res.json({
      msg: 'hello world'
    })
  })

  router.options('/extend/options', function(req, res) {
    res.end()
  })

  router.delete('/extend/delete', function(req, res) {
    res.end()
  })

  router.head('/extend/head', function(req, res) {
    res.end()
  })

  router.post('/extend/post', function(req, res) {
    res.json(req.body)
  })

  router.put('/extend/put', function(req, res) {
    res.json(req.body)
  })

  router.patch('/extend/patch', function(req, res) {
    res.json(req.body)
  })

  router.get('/extend/user', function(req, res) {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        name: 'jack',
        age: 18
      }
    })
  })
}

// function registerConfigRouter () {
//   router.post('/config/post', function(req, res) {
//     res.json({
//       data:req.body
//     })
//   })
// }
function registerConfigRouter () {
  
  router.post('/config/post', function(req, res) {
    console.log(req.body)
    res.json(req.body)
  })
}
function registerCancelRouter () {
  router.get('/cancel/get', function(req, res) {
    setTimeout(() => {
      res.json('hello')
    }, 1000)
  })

  router.post('/cancel/post', function(req, res) {
    setTimeout(() => {
      res.json(req.body)
    }, 1000)
  })
}
function registerMoreRouter () {


  
  router.get('/more/get', function(req, res) {
    res.json(req.cookies)
  })

  router.post('/more/upload', function(req, res) {
    console.log(req.body, req.files)
    res.end('upload success!')
  })

  router.post('/more/post', function(req, res) {
    const auth = req.headers.authorization
    const [type, credentials] = auth.split(' ')
    console.log(atob(credentials))
    const [username, password] = atob(credentials).split(':')
    if (type === 'Basic' && username === 'Yee' && password === '123456') {
      res.json(req.body)
    } else {
      res.status(401)
      res.end('UnAuthorization')
    }
  })

  router.get('/more/304', function(req, res) {
    res.status(304)
    res.json({a: 12})
    res.end()
  })

  router.get('/more/A', function(req, res) {
    res.end('A')
  })

  router.get('/more/B', function(req, res) {
    res.end('B')
  })
  const cors = {
    'Access-Control-Allow-Origin': 'https://cyber.chepass.com',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  // router.get('/more/OpenCard', function(req, res) {
  //   res.end('B')
  // })
  router.get('/more/OpenCard', function(req, res) {
    // res.set(cors)
    // res.json(req.body)
    // res.end('Bddd') 
    // 等打包后使用自己的axios试试
    axios.get('https://cyber.chepass.com/System/Stats/OpenCard', {
      // headers: {
      //   referer: 'https://cyber.chepass.com/',
      //   host: 'cyber.chepass.com'
      // },
      // params: req.query
    }).then((response) => {
      let ret = response.data
      // if (typeof ret === 'string') {
      //   const reg = /^\w+\(({.+})\)$/
      //   const matches = ret.match(reg)
      //   if (matches) {
      //     ret = JSON.parse(matches[1])
      //   }
      // }
      res.json(ret)
      // res.end('Bddd')
    }).catch((e) => {
      console.log(e)
    })
  })
  // https://cyber.chepass.com/System/Stats/OpenCard
}


const port = process.env.PORT || 8888
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})