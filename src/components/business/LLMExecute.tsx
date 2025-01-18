
import { useState } from "react";

interface Props {
    handleFinishAction: (content: string) => void;
}

export default function LLMExecute({ handleFinishAction }: Props) {

    return (
        <div>Execute</div>
    );
}
