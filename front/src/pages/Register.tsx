import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup"
import { register } from "../services/auth";
import { useState } from "react";
import { Alert } from "../components/Alert";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { HeroCard } from "../components/HeroCard";
import { useNavigate } from "react-router-dom";

const registrationSchema = object().shape({
    email: string().email().required(),
    username: string().required(),
    password: string().required(),
});
export function RegistrationPage() {
    const [error, setError] = useState("")
    const navigate = useNavigate()
    return (
        <HeroCard>
            <h2 className="card-title">Register</h2>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    username: ''
                }}
                validationSchema={registrationSchema}
                onSubmit={async (values) => {
                    setError("");
                    return register(values).then(() => {
                        return navigate("/login?register=1")
                    }).catch((err) => {
                        setError(err.message)
                    })
                }}
            >
                {({ isSubmitting, isValid }) => (
                    <Form>
                        {error != "" && <Alert message={error} type="warning" />}
                        <FormInput label="Username" name="username" />
                        <FormInput label="Email" name="email" />
                        <FormInput label="Password" name="password" type="password" />
                        <div className="form-control mt-6">
                            <Button loading={isSubmitting} disabled={!isValid || isSubmitting} >Register</Button>
                        </div>
                    </Form>
                )}
            </Formik>
            <a className="link link-info" >Login instead</a>
        </HeroCard>

    )
}
