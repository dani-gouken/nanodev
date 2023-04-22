import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup"
import { login } from "../services/auth";
import { useState } from "react";
import { Alert } from "../components/Alert";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HeroCard } from "../components/HeroCard";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

const loginSchema = object().shape({
    email: string().email('Invalid email').required('Required'),
    password: string().required('Required'),
});
export function LoginPage() {
    const [error, setError] = useState("")
    const [searchParams, _] = useSearchParams({ "register": "" });
    const navigate = useNavigate();
    return (
        <HeroCard>
            <h2 className="card-title">Login</h2>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={loginSchema}
                onSubmit={async (values) => {
                    setError("");
                    return login(values).then((e) => {
                        navigate(`/otp/${e.otp.uuid}`)
                    }).catch((err) => {
                        setError(err.message)
                    })
                }}
            >
                {({ isSubmitting, isValid }) => (
                    <Form>
                        {searchParams.get("register") && <Alert message="Registration successfull, you can now login" type="success" />}
                        {error != "" && <Alert message={error} type="warning" />}

                        <FormInput name="email" label="Email" />
                        <FormInput name="password" label="Password" type="password" />
                        <div className="form-control mt-6">
                            <Button loading={isSubmitting} disabled={!isValid || isSubmitting} >Login</Button>
                        </div>
                    </Form>
                )}
            </Formik>
            <div>
                <Link to="/register" className="link link-info" >Register instead</Link>
            </div>
        </HeroCard>

    )
}
