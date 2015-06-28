
module.exports = {

	// 'facebookAuth' : {
	// 	'clientID' 		: process.env.FACEBOOK_CLIENT_ID || '1449190045338326', // your App ID
	// 	'clientSecret' 	: process.env.FACEBOOK_CLIENT_SECRET || '2c1b27113aefeff6b7169c4d50ee7af1', // your App Secret
	// 	'callbackURL' 	: process.env.FACEBOOK_CALLBACK || 'http://local.host:5000/auth/facebook/callback'
	// },

	'googleAuth' : {
		'clientID' 		: process.env.BOREDOM_GOOGLE_CLIENT_ID,
		'clientSecret' 	: process.env.BOREDOM_GOOGLE_CLIENT_SECRET,
		'callbackURL' 	: process.env.BOREDOM_GOOGLE_CALLBACK
	}

};