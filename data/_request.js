var S = require('../service')
var s = new S()
var category = 'mak'
var value = 'downbeat'
var params = { category, value }
var hook = a => b => (error, data) => (error ? a(error) : b(data))
var h = hook(error => console.error(error))
s.makeRequest(params, h(response => response.pipe(process.stdout, { end: false })))
