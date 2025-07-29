import { use } from "react";

export default  function StatusPages ({params}: {params: Promise<{status: string}>}) {
    const {status} =use(params);
    return (
        <div>
            <h1>{status}</h1>
        </div>
    )
}