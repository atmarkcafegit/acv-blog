import {HttpMethod} from "./HttpMethod";
import {Route} from "./Route";

export class HttpRoute implements Route {
    constructor(public id: string,
                public name: string,
                public url: string,
                public method: HttpMethod,
                public callback: Function) {
    }
}