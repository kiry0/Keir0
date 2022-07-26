export const Auth = {
    firstName: "",
    middleName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    username: "",
    password: "",
    setFirstName: (v) => {
        Auth.firstName = v;
    },
    setMiddleName: (v) => {
        Auth.middleName = v;
    },
    setLastName: (v) => {
        Auth.lastName = v;
    },
    setEmailAddress: (v) => {
        Auth.emailAddress = v;
    },
    setPhoneNumber: (v) => {
        Auth.phoneNumber = v;
    },
    setUsername: (v) => {
        Auth.username = v;
    },
    setPassword: (v) => {
        Auth.password = v;
    },
    canSubmit: () => {
        return Auth.username !== "" && Auth.password !== "";
    },
    register: () => {
        return console.log("Successfully registered!");
    }
};