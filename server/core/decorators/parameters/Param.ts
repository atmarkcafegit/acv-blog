import {Request} from 'express';
import {getParameters, IParameter, Parameter} from "../../common/Parameter";

export function Param<Function>(name?: string): ParameterDecorator {
    return (target: Object, method: string, index: number) => {
        let parameters = getParameters(target);
        if (!parameters[method]) {
            parameters[method] = [];
        }

        let type = Reflect.getOwnMetadata('design:paramtypes', target, method)[index];
        parameters[method].push(new ParamParameter(name, type, index));
    };
}

export class ParamParameter extends Parameter implements IParameter {

    constructor(public name: string,
                public type: Function,
                public index: Number) {
        super(type);
        if (!this.name) {
            this.name = 'value' + this.index;
        }
    }

    public getValue(req: Request) {
        return this.getRawValue(req.params[this.name]);
    }
}