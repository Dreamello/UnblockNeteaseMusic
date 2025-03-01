const request = require('../request')
const host = 'http://localhost:9000'

module.exports = () => {
  console.log("[INFO] insure create proxy\n")
	const proxy = new Proxy(() => {}, {
		get: (target, property) => {
			target.route = (target.route || []).concat(property)
			return proxy
		},
		apply: (target, _, payload) => {
			if (module.exports.disable || !host) return Promise.reject()
      console.log("[INFO] did not return reject\n")
			const path = target.route.join('/')
			const query = typeof(payload[0]) === 'object' ? JSON.stringify(payload[0]) : payload[0]
			// if (path != 'qq/ticket') return Promise.reject()
			return request('GET', `${host}/${path}?${encodeURIComponent(query)}`)
			.then(response => response.body())
		}
	})
	return proxy
}
