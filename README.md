# node-express-passport_oauth
A simple implementation of Google and Facebook Oauth with node, express4, passportjs and mongodb (mongoose)

### installation guide
To try this project on you local machine you must set some environment variables:

Env Variable  | Value
------------- | -------------
NODE_EXPRESS_PASSPORT_FACEBOOK_CLIENT_ID      | *your FB client id*
NODE_EXPRESS_PASSPORT_FACEBOOK_CLIENT_SECRET  | *your FB client secret*
NODE_EXPRESS_PASSPORT_FACEBOOK_CALLBACK       | *{your_address:port}/auth/facebook/callback*
NODE_EXPRESS_PASSPORT_GOOGLE_CLIENT_ID        | *your Google client id*
NODE_EXPRESS_PASSPORT_GOOGLE_CLIENT_SECRET    | *your Google secret*
NODE_EXPRESS_PASSPORT_GOOGLE_CALLBACK         | *{your_address:port}/auth/google/callback*
NODE_EXPRESS_PASSPORT_MONGOLAB_URI            | *mongodb://{dbuser}:{dbpassword}@{dbaddress}:{dbport}/{dbname}*

### usage guide
```
npm install
npm start
```
visit localhost:3000
