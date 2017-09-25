import {Controller, Error, Get, Param, Result} from "minmin";
import {UserModel} from "../models/UserModel";

@Controller('api')
class UserController {

    @Get('users')
    private async getUsers(@Param('page', true) page: number) {
        let users = await UserModel.paginate({}, {
            page: page ? page : 1,
            sort: {
                createdAt: '-1'
            },
            populate: ['score'],
            limit: 10
        });

        if (users) {
            if (users.docs.length === 0) {
                return new Error(404, "No user.");
            }

            return new Result('users', users);
        }
    }

    @Get('user')
    private async getUser(@Param('username') username: string) {
        let user = await (UserModel.findOne({username: username}) as any)
            .deepPopulate(['score', 'posts']);

        if (user) {
            return new Result('user', user);
        } else {
            return new Error(404, "User not found.");
        }
    }

    private async updateUser() {

    }
}