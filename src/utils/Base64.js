import crypto from 'crypto-es';

const salt = '9hPhEOGD01O2SCsev';

const toUtf8 = function (text) {
	return unescape(encodeURIComponent(text));
};

const fromUtf8 = function (text) {
	return decodeURIComponent(escape(text));
};

export const Base64 = {
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	encode: function (text) {
		return crypto.AES.encrypt(btoa(toUtf8(text)), salt).toString();
	},
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	decode: function (base64) {
		return fromUtf8(atob(crypto.AES.decrypt(base64, salt).toString(crypto.enc.Utf8)));
	}
};
