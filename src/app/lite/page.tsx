"use client"

import ContextInput from '@/components/business/ContextInput';
import WorkNode from '@/components/workflow/WorkNode';

const steps = ["upload", "execute", "export"];
export default function Page() {
    return (
        <WorkNode>
            <ContextInput title='Context Input' handleFinishAction={() => { }} />
        </WorkNode>
    );
}