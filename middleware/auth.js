export default function ({store, redirect, error}) {
    if (!store.state.authUser) {
        error({
            message: 'You are not authenticated.',
            statusCode: 403
        })
    }
}
