# doujinshop-meta-search-service-ec-toranoana-jp

```js
var { pipe, through, concat } = require('mississippi')
var yo = require('yo-yo')
var ServiceEcToranoanaJp = require('doujinshop-meta-search-service-ec-toranoana-jp')
var client = new ServiceEcToranoanaJp()

var category = 'mak'
var value = 'ひとのふんどし'
var params = { category, value }
var dup = client.createDuplex()

pipe(
  dup,
  through.obj((result, _, done) => {
    done(null, article(result))
  }),
  concat(articles => {
    console.log(String(yo`<main>${articles}</main>`))
  }),
  error => {
    if (error) {
      console.log(String(yo`<p>${String(error)}</p>`))
    }
  }
)

dup.end(params)

function article ({ uri, title, thumbnail, links }) {
  return yo`<article>
  <section>
    <p>
      <cite>${link(uri, title)}</cite>
    </p>
    <figure>
      ${link(uri, img(thumbnail))}
    </figure>
  </section>
  <aside>
    <ul>
    ${links.map(({ href, title }) => yo`<li>${link(href, title)}</li>`)}
    </ul>
  </aside>
</article>
`
}
function link (uri, content) { return yo`<a href=${link} target="_blank">${content}</a>` }
function img ({ src }) { return yo`<img src=${src} />` }
```
