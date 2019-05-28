import { CancelExcetor, CancelTokenSource, Canceler } from "../types";
import Cancel from "./Cancel";

interface ResolvePromise {
    (reason?: Cancel): void
}

export default class CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel

    constructor(executor: CancelExcetor) {
        let resolvePromise: ResolvePromise
        this.promise = new Promise<Cancel>(reslove => {
            resolvePromise = reslove
        })

        executor(message => {
            if (this.reason) {
                return
            }
            this.reason = new Cancel(message)
            resolvePromise(this.reason)
        })
    }


    throwIfRequested(): void { // 
        if (this.reason) {
            throw this.reason
        }
    }

    static source(): CancelTokenSource {
        let cancel!: Canceler
        const token = new CancelToken(c => {
            cancel = c
        })
        return {
            cancel,
            token /// Property 'throwIfRequest' is missing in type 'CancelToken' but required in type 'CancelToken'.ts(2741) --->class CancelToken 缺少throwIfRequested 方法的实现，方法名写错了导致
        }
    }
}