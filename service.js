var xtend = require('xtend')
var inherits = require('inherits')
var trumpet = require('trumpet')
var urlencode = require('urlencode')
var { pipe, duplex, through, concat } = require('mississippi')
var Service = require('doujinshop-meta-search-service')

function ServiceEcToranoanaJp () {
  if (!(this instanceof ServiceEcToranoanaJp)) return new ServiceEcToranoanaJp()
  var { urlencode, backoff, hyperquest } = Service.defaultConfig
  var serviceHome = 'https://ec.toranoana.jp'
  var searchHome = `${serviceHome}/tora_r/ec/app/catalog/list/`
  var cookie = 'adflg=0'
  var headers = xtend(hyperquest.headers, { cookie })
  var config = {
    url: { serviceHome, searchHome },
    urlencode: xtend(urlencode),
    backoff: xtend(backoff),
    hyperquest: xtend(hyperquest, { headers })
  }
  Service.call(this, config)
}

inherits(ServiceEcToranoanaJp, Service)
module.exports = ServiceEcToranoanaJp

ServiceEcToranoanaJp.prototype.createURI = function createURI (params) {
  var { category, value, opts } = params
  var map = {
    mak: 'searchMaker',
    act: 'searchActor',
    nam: 'searchCommodityName',
    mch: 'searchChara',
    gnr: 'searchWord',
    kyw: 'searchWord',
    com: 'searchWord'
  }
  var query = xtend({
    searchCategoryCode: '04',
    // searchChildrenCategoryCode: 'cot',
    searchBackorderFlg: 0,
    searchUsedItemFlg: 1,
    searchDisplay: 12,
    detailSearch: true
  }, { [map[category]]: value }, opts)

  return (
    this.config.url.searchHome + '?' +
      urlencode.stringify(query, this.config.urlencode)
  )
}

ServiceEcToranoanaJp.prototype.createOpts = function createOpts (params) {
  return xtend(
    this.config.hyperquest,
    { headers: xtend(this.config.hyperquest.headers) }
  )
}

ServiceEcToranoanaJp.prototype.scraper = function scraper () {
  var sink = trumpet()
  var source = through.obj()
  var isBingo = false
  var count = 0
  var { serviceHome } = this.config.url
  var selector = (
    '#search-result-container.pull-right' +
      ' div ul.list li.list__item div.search-result-inside-container'
  )

  sink.selectAll(selector, div => {
    isBingo = true
    count += 1
    var tr = trumpet()
    var _ = {}
    var links = []

    tr.once('end', () => {
      source.write({ links, ..._ })
      ;(count -= 1) || source.end()
    })

    tr.selectAll('.product_desc section ul[class^="product_"] li a', a => {
      var lnk = {}
      pipe(
        a.createReadStream(),
        concat(title => {
          lnk.title = String(title).replace(/<[^>]+?>/g, '')
        }),
        error => {
          if (error) return source.emit('error', error)
          a.getAttribute('href', href => {
            lnk.href = serviceHome + href
            links.push(lnk)
          })
        }
      )
    })

    tr.select('.product_img a img', img => {
      img.getAttribute('data-src', src => (_.thumbnail = { src }))
    })

    tr.select('.product_desc section h3.product_title a', a => {
      pipe(
        a.createReadStream(),
        concat(buf => {
          _.title = String(buf)
            .replace(/\s/g, '').replace(/\r/g, '').replace(/\n/g, '')
        }),
        error => {
          if (error) return source.emit('error', error)
          a.getAttribute('href', href => {
            _.uri = serviceHome + href
          })
        }
      )
    })

    pipe(
      div.createReadStream(),
      tr,
      error => {
        if (error) return sink.emit('error', error)
      }
    )
  })

  sink.once('end', () => (isBingo || source.end()))
  return duplex.obj(sink, source)
}
