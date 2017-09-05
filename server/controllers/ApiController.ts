import {Controller} from "../core/decorators/controllers/Controller";
import {Get} from "../core/decorators/methods/Get";
import {PostModel} from "../models/PostModel";
import {UserModel} from "../models/UserModel";
import {Error, Result} from "../core/common/Response";
import {Data} from "../core/decorators/parameters/Data";
import {Param} from "../core/decorators/parameters/Param";
import {Post} from "../core/decorators/methods/Post";
import {Session} from "../core/decorators/parameters/Session";

const PAGE_LIMIT = 5;

@Controller('api')
class ApiController {

    @Get('posts')
    private async posts(@Param('page', true) page: number) {
        let posts = await PostModel.paginate({}, {
            page: page ? page : 1,
            populate: 'user',
            limit: PAGE_LIMIT
        });

        if (posts) {
            if (posts.docs.length === 0) {
                return new Error(404, "No post.");
            }

            return new Result('posts', posts);
        }
    }

    @Post('post')
    private async post(@Data('title') title: string,
                       @Data('content') content: string,
                       @Session() session: any) {

        let post = await PostModel.create({
            title: title,
            content: content,
            user: session.authUser._id
        });

        if (post) {
            let user = await UserModel.findById(session.authUser._id);

            if (user) {
                user.posts.push(post);
                user.save();

                return new Result();
            } else {
                return new Error(404, "User not found.");
            }
        } else {
            return new Error(500, "Internal server error.");
        }
    }
}
