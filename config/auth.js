
module.exports = {

	'facebookAuth' : {
		'clientID'		: process.env.NEP_FACEBOOK_CLIENT_ID, // your App ID
		'clientSecret' 	: process.env.NEP_FACEBOOK_CLIENT_SECRET, // your App Secret
		'callbackURL' 	: process.env.NEP_FACEBOOK_CALLBACK
	},

	'googleAuth' : {
		'clientID' 		: process.env.NEP_GOOGLE_CLIENT_ID,
		'clientSecret' 	: process.env.NEP_GOOGLE_CLIENT_SECRET,
		'callbackURL' 	: process.env.NEP_GOOGLE_CALLBACK
	}

};