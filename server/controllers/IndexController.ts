import {Controller} from "../core/decorators/controllers/Controller";
import {Post} from "../core/decorators/methods/Post";
import {UserModel} from "../models/UserModel";
import {Data} from "../core/decorators/parameters/Data";
import {Session} from "../core/decorators/parameters/Session";
import {Error, Result} from "../core/common/Response";

@Controller()
class IndexController {

    @Post('login')
    private async login(@Data('username') username: string,
                        @Data('password') password: string,
                        @Session() session: any) {

        let user = await UserModel.findOne({username: username});

        if (user) {
            let compare = await user.comparePassword(password);
            if (compare) {
                let authUser = {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                };

                session.authUser = authUser;

                return new Result('user', authUser);
            } else {
                return new Error(401, "Invalid username or password.");
            }
        } else {
            return new Error(404, "Username not found.");
        }
    }

    @Post('logout')
    private logout(@Session() session: any) {
        delete session.authUser;
        return new Result()
    }

    @Post('register')
    private async register(@Data('username') username: string,
                           @Data('password') password: string,
                           @Data('email') email: string) {
        let user = await UserModel.findOne({username: username});

        if (!user) {
            let user = UserModel.create({
                username: username,
                password: password,
                email: email
            });

            if (user) {
                return new Result('user', user);
            } else {
                return new Error(500, "Internal server error.");
            }
        } else {
            return new Error(500, "User already exists.");
        }
    }
}