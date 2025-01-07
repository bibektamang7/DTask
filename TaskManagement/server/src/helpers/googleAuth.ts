import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/user.model";
import { User } from "../models/user.model";

interface Profile {
  photos?: { value: string }[];
  emails?: { value: string; verified: boolean }[];
}

function getPhoto(profile: Profile): string {
  return profile.photos && profile.photos.length > 0
    ? profile.photos[0].value
    : "";
}
function getEmail(profile: Profile): string {
  return profile.emails && profile.emails.length > 0
    ? profile.emails[0].value
    : "";
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ googleId: profile.id });
          if (!user) {
          user = await UserModel.create({
            googleId: profile.id,
            username: profile.displayName,
            avatar: getPhoto(profile),
            email: getEmail(profile),
          });
        }
        console.log("authenticated user: ", user);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);


export default passport;
