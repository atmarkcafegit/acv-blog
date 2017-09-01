import {Controller} from "../core/decorators/controllers/Controller";
import {Post} from "../core/decorators/methods/Post";
import {User} from "../models/User";
import {Data} from "../core/decorators/parameters/Data";
import {Session} from "../core/decorators/parameters/Session";
import {Error} from "../core/common/Error";

@Controller()
class IndexController {

    @Post('login')
    private async login(@Data('username') username: string,
                        @Data('password') password: string,
                        @Session() session: any) {

        let user = await User.findOne({username: username});

        if (user) {
            let compare = await user.comparePassword(password);
            if (compare) {
                let authUser = {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                };

                session.authUser = authUser;

                return {
                    ok: true,
                    user: authUser,
                };
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
        return {ok: true}
    }
}