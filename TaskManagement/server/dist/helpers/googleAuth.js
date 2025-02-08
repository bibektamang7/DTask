"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../models/user.model");
function getPhoto(profile) {
    return profile.photos && profile.photos.length > 0
        ? profile.photos[0].value
        : "";
}
function getEmail(profile) {
    return profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : "";
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_model_1.UserModel.findOne({ googleId: profile.id });
        if (!user) {
            user = yield user_model_1.UserModel.create({
                googleId: profile.id,
                username: profile.displayName,
                avatar: getPhoto(profile),
                email: getEmail(profile),
            });
        }
        console.log("authenticated user: ", user);
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
})));
exports.default = passport_1.default;
