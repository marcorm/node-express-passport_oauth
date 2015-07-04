
module.exports = {

	'facebookAuth' : {
		'clientID' 		: process.env.NODE_EXPRESS_PASSPORT_FACEBOOK_CLIENT_ID, // your App ID
		'clientSecret' 	: process.env.NODE_EXPRESS_PASSPORT_FACEBOOK_CLIENT_SECRET, // your App Secret
		'callbackURL' 	: process.env.NODE_EXPRESS_PASSPORT_FACEBOOK_CALLBACK
	},

	'googleAuth' : {
		'clientID' 		: process.env.NODE_EXPRESS_PASSPORT_GOOGLE_CLIENT_ID,
		'clientSecret' 	: process.env.NODE_EXPRESS_PASSPORT_GOOGLE_CLIENT_SECRET,
		'callbackURL' 	: process.env.NODE_EXPRESS_PASSPORT_GOOGLE_CALLBACK
	}

};