const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passportJs = require("passport");

passportJs.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            consumerKey: process.env.GOOGLE_CLIENT_ID,
            consumerSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:"/auth/google/callback",
            scope:["profile", "email"],
        },
        function (accessToken,refreshToken,profile,callback) {
            callback(null, profile);

        }
    )
)

passportJs.serializeUser((user,done)=>{
    done(null, user);
});
passportJs.deserializeUser((user,done)=>{
    done(null, user);
});
