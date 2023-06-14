import async from "async"

interface POpt {
  limit?: number
}

export const p = <T = any>(items: Iterable<T> = [], opt: POpt = {}) => {
  return {
    get promise() {
      return Promise.all(Array.from(items))
    },

    then(fn?: () => PromiseLike<any>) {
      const p = this.promise
      if (fn) return p.then(fn)
      return p
    },

    async map<U>(fn: (value: Awaited<T>) => U) {
      return async.mapLimit<T, U>(
        await this.promise,
        opt.limit || 5,
        async.asyncify(fn),
      ) as unknown as Awaited<U>[]
    },
  }
}
