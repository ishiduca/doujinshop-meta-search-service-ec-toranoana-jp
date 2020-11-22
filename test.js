var test = require('tape')
var fs = require('fs')
var url = require('url')
var path = require('path')
var { pipe, through } = require('mississippi')
var Service = require('./service')

test('', t => {
  t.plan(1)
  t.ok(Service)
})

test('var instance = new Constructor()', t => {
  t.test('client = new Service()', t => {
    t.plan(1)
    var s = new Service()
    t.ok(s instanceof Service)
  })
  t.test('client = Service()', t => {
    t.plan(1)
    var s = Service()
    t.ok(s instanceof Service)
  })
})

test('client.config = { urlencode, url, backoff, hyperquest }', t => {
  var s = new Service()
  t.test('client.config.urlencode has a "charset" prop', t => {
    t.plan(1)
    var charset = 'utf8'
    t.is(s.config.urlencode.charset, charset, `charset "${charset}"`)
  })
  t.test('client.config.url has "searchHome", "serviceHome" props', t => {
    t.plan(2)
    var serviceHome = 'https://ec.toranoana.jp'
    var searchHome = 'https://ec.toranoana.jp/tora_r/ec/app/catalog/list/'
    t.is(s.config.url.serviceHome, serviceHome, `serviceHome is "${serviceHome}"`)
    t.is(s.config.url.searchHome, searchHome, `searchHome is "${searchHome}"`)
  })
  t.test('client.config.backoff has a "failAfter" prop', t => {
    t.plan(1)
    var failAfter = 10
    t.is(s.config.backoff.failAfter, failAfter, `failAfter is ${failAfter}`)
  })
  t.test('client.config.hyperquest has "method", "headers" props', t => {
    t.plan(2)
    var method = 'GET'
    var cookie = 'adflg=0'
    var userAgent = 'hyperquest/2.13'
    var headers = { cookie, 'user-agent': userAgent }
    t.is(s.config.hyperquest.method, method, `method eq "${method}"`)
    t.deepEqual(s.config.hyperquest.headers, headers, `headers eq "${JSON.stringify(headers)}"`)
  })
  t.end()
})

test('requestURI = client.createURI({ category, value, opts = {} )', t => {
  var s = new Service()
  t.test('category "nam"', t => {
    var category = 'nam'
    var value = 'あの子がアイツのオモチャになった日 菅崎日菜編 after'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/tora_r/ec/app/catalog/list/?searchCategoryCode=04&searchCommodityName=%E3%81%82%E3%81%AE%E5%AD%90%E3%81%8C%E3%82%A2%E3%82%A4%E3%83%84%E3%81%AE%E3%82%AA%E3%83%A2%E3%83%81%E3%83%A3%E3%81%AB%E3%81%AA%E3%81%A3%E3%81%9F%E6%97%A5+%E8%8F%85%E5%B4%8E%E6%97%A5%E8%8F%9C%E7%B7%A8+after&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.is(expected.protocol, result.protocol, `protocol "${result.protocol}"`)
    t.is(expected.host, result.host, `host "${result.host}"`)
    t.is(expected.hostname, result.hostname, `hostname "${result.hostname}"`)
    t.is(expected.port, result.port, `port "${result.port}"`)
    t.is(expected.pathname, result.pathname, `pathname "${result.pathname}"`)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "act"', t => {
    var category = 'act'
    var value = 'みずきえいむ'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/tora_r/ec/app/catalog/list/?searchCategoryCode=04&searchActor=%E3%81%BF%E3%81%9A%E3%81%8D%E3%81%88%E3%81%84%E3%82%80&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "mak"', t => {
    var category = 'mak'
    var value = 'O.riginal brand'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/tora_r/ec/app/catalog/list/?searchCategoryCode=04&searchMaker=O.riginal+brand&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "mch"', t => {
    var category = 'mch'
    var value = '愛野美奈子'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/tora_r/ec/app/catalog/list/?searchCategoryCode=04&searchChara=%E6%84%9B%E9%87%8E%E7%BE%8E%E5%A5%88%E5%AD%90&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "gnr"', t => {
    var category = 'gnr'
    var value = 'ラブプラス'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/tora_r/ec/app/catalog/list/?searchCategoryCode=04&searchWord=%E3%83%A9%E3%83%96%E3%83%97%E3%83%A9%E3%82%B9&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "kyw"', t => {
    var category = 'kyw'
    var value = '眼鏡'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/tora_r/ec/app/catalog/list/?searchCategoryCode=04&searchWord=%E7%9C%BC%E9%8F%A1&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.test('category "com"', t => {
    var category = 'com'
    var value = '人妻×ネトラレ×眼鏡'
    var params = { category, value }
    var _expected = 'https://ec.toranoana.jp/tora_r/ec/app/catalog/list/?searchCategoryCode=04&searchWord=%E4%BA%BA%E5%A6%BB%C3%97%E3%83%8D%E3%83%88%E3%83%A9%E3%83%AC%C3%97%E7%9C%BC%E9%8F%A1&searchBackorderFlg=0&searchUsedItemFlg=1&searchDisplay=12&detailSearch=true'
    var _result = s.createURI(params)
    var expected = url.parse(_expected, true)
    var result = url.parse(_result, true)
    t.deepEqual(expected.query, result.query, `requestURI.query = ${JSON.stringify(result.query)}`)
    t.end()
  })
  t.end()
})

test('requestOpts = client.createOpts({ category, value, opts = {} })', t => {
  var s = new Service()
  var category = 'mak'
  var value = 'xration'
  var params = { category, value }
  var requestOpts = s.createOpts(params)
  var expected = {
    method: 'GET',
    headers: {
      'user-agent': 'hyperquest/2.13',
      cookie: 'adflg=0'
    }
  }
  t.deepEqual(requestOpts, expected, `requestOpts "${JSON.stringify(requestOpts)}"`)
  t.end()
})

var valid = require('is-my-json-valid')
var schema = require('doujinshop-meta-search-service/schema-results')

test('duplexStream = client.scraper()', t => {
  var s = new Service()
  var html = path.join(__dirname, 'data/result.html')
  var spy = []
  var v = valid(schema)
  pipe(
    fs.createReadStream(html),
    s.scraper(),
    through.obj((article, _, done) => {
      t.ok(v(article), `valid result ${JSON.stringify(article)}`)
      spy.push(article)
      done()
    }),
    error => {
      t.error(error, 'no error')
      t.is(spy.length, 11, 'results of scrape is 11')
      t.end()
    }
  )
})
