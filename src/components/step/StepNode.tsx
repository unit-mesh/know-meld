import { ReactNode } from "react";

export default function StepNode({ children }: { children: ReactNode }) {
    return (
        <div className="w-full mx-auto justify-between mt-4">
            {children}
        </div>
    );
}
