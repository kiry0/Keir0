import { Auth } from "../models/Auth.js";

export default { 
    view: () => {
        return m(".register", [
            m("input[type=text]", {
                oninput: (e) => Auth.setFirstName(e.target.value),
                value: Auth.firstName
            }),
            m("input[type=text]", {
                oninput: (e) => Auth.setMiddleName(e.target.value),
                value: Auth.middleName
            }),
            m("input[type=text]", {
                oninput: (e) => Auth.setLastName(e.target.value),
                value: Auth.lastName
            }),
            m("input[type=email]", {
                oninput: (e) => Auth.setEmailAddress(e.target.value),
                value: Auth.emailAddress
            }),
            m("input[type=tel]", {
                oninput: (e) => Auth.setPhoneNumber(e.target.value),
                value: Auth.phoneNumber
            }),
            m("input[type=text]", {
                oninput: (e) => Auth.setUsername(e.target.value),
                value: Auth.username
            }),
            m("input[type=password]", {
                oninput: (e) => Auth.setPassword(e.target.value),
                value: Auth.password
            }),
            m("button", {
                disabled: !Auth.canSubmit(),
                onclick: Auth.register
            }, "Register")
        ]);
    }
};