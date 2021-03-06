import httpTransport from 'http';
import {VAJEHYAB_TOKEN} from "../../../secrets";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchWordMeanings = (query: string) => {
	return new Promise((resolve, reject) => {
		const responseEncoding = 'utf8';
		const word = encodeURIComponent(query);
		const httpOptions = {
			hostname: 'api.vajehyab.com',
			port: '80',
			path: `/v3/search?token=${VAJEHYAB_TOKEN}&q=${word}&type=exact&filter=dehkhoda,moein,amid`,
			method: 'GET',
			headers: {}
		};
		httpOptions.headers['User-Agent'] = 'node ' + process.version;

		const request = httpTransport
			.request(httpOptions, (res) => {
				const responseBufs = [];
				let responseStr = '';

				res
					.on('data', (chunk) => {
						if (Buffer.isBuffer(chunk)) {
							responseBufs.push(chunk);
						} else {
							responseStr = responseStr + chunk;
						}
					})
					.on('end', () => {
						responseStr =
							responseBufs.length > 0
								? Buffer.concat(responseBufs).toString(responseEncoding)
								: responseStr;

						const data = JSON.parse(responseStr);
						resolve({
							error: null,
							status: res.statusCode,
							response: {
								count: data?.data?.num_found || 1
							}
						});
					});
			})
			.setTimeout(0)
			.on('error', (error) => {
				reject({
					message: error,
					status: 500
				});
			});
		request.write('');
		request.end();
	});
};
