import { PropsWithChildren } from "react";

export function HeroCard({ children }: PropsWithChildren) {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col w-full  lg:flex-row-reverse">
                <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
                    <div className="card-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
