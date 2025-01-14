export default function once<TFunction extends (...args: any[]) => any>(fn: TFunction): TFunction {
    let haveResult = false;
    let result: any = null;

    return (function (this: any, ...args: any[]) {
        if (!haveResult) {
            haveResult = true;
            result = fn.apply(this, args);
        }

        return result;
    }) as any;
}