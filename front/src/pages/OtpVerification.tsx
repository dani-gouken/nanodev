import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup"
import { login, verifyOtp } from "../services/auth";
import { useState } from "react";
import { Alert } from "../components/Alert";
import { Link, useParams, Navigate } from "react-router-dom";
import { HeroCard } from "../components/HeroCard";
import { FormInput } from "../components/FormInput";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

const otpSchema = object().shape({
    code: string().length(6)
        .matches(/^[0-9]+$/, "Must be only digits")
        .required('Required'),
});
export function OtpVerificationPage() {
    const [error, setError] = useState("")
    const { uuid } = useParams<{ uuid: string }>();
    const { login } = useAuth();
    return (
        <HeroCard>
            {!uuid && <Navigate to="/login" />}
            <h2 className="card-title">OTP Verification</h2>
            <Formik
                initialValues={{
                    code: '',
                }}
                validationSchema={otpSchema}
                onSubmit={async (values) => {
                    setError("");
                    return verifyOtp({
                        ...values,
                        uuid: uuid ?? ""
                    }).then((res) => {
                        login(res);
                    }).catch((err) => {
                        setError(err.message)
                    })
                }}
            >
                {({ isSubmitting, isValid }) => (
                    <Form>
                        {error != "" && <Alert message={error} type="warning" />}
                        <FormInput name="code" label="A verification code was sent to your email" placeholder="OTP" />
                        <div className="form-control mt-6">
                            <Button loading={isSubmitting} disabled={!isValid || isSubmitting} >Verify</Button>
                        </div>
                    </Form>
                )}
            </Formik>
            <div>
                <Link to="/login" className="link link-info" >Back to login</Link>
            </div>
        </HeroCard>

    )
}
