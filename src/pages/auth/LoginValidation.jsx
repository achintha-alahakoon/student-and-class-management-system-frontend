function Validation(values) {
    let error = {}
    const email_pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const password_pattern = /^(?=.\d)(?=.[!@#$%^&])(?=.[a-z])(?=.*[A-Z]).{8,}$/;
    if (values.email ==="") {
        error.email = "email is required"
    } else if (!email_pattern.test(values.email)) {
        error.email = "invalid email"
    }
    else { error.email = "" }
    if (values.password === "") {
        error.password = "password is required"
    } else if (!password_pattern.test(values.password)) {
        error.password = "invalid password"
    }
    else { error.password = "" }
    return error

}
export default Validation;
