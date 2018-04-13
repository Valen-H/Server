const ss = require('selfsigned'),
fs = require('fs');

try {
	fs.statSync('cert.pem');
	return;
} catch(err) { }

process.env.ssl = process.env.ssl || {};

module.exports = async () => {
	return new Promise((rsl, rjc) => {
		ss.generate([
			{
				name: 'commonName',
				value: process.env.ssl.commonName || 'localhost'
			},
			{
				name: 'countryName',
				value: process.env.ssl.countryName || 'GR'
			},
			{
				shortName: 'ST',
				value: process.env.ssl.ST || 'Greece'
			},
			{
				name: 'localityName',
				value: process.env.ssl.localityName || 'Greece'
			},
			{
				name: 'organizationName',
				value: process.env.ssl.organisationName || 'Ellestris'
			},
			{
				shortName: 'OU',
				value: process.env.ssl.OU || 'Cyber'
			}
		],
		{
			keySize: process.env.ssl.keySize || 2048,
			algorithm: process.env.ssl.algorithm || 'sha256',
			clientCertificate: true,
			clientCertificateCN: process.env.ssl.clientCertificateCN || 'VHaX'
		}, (err, pems) => {
			if (err) rjc(err);
			for (let a in pems.filter(pem => !pem.includes('fingerprint'))) {
				fs.writeFileSync(`${a}.pem`, pems[a]);
			}
			rsl(true);
		});
	});
};
