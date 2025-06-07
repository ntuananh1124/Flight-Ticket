export default function CheckLogin(state = false, action) {
    switch (action.isLogin) {
        case "CHECK_LOGIN":
            return action.isLogin;
        default:
            return state
    }
}