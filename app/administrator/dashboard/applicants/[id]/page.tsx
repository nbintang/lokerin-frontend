export default async function Page({
    params
}: {
    params: Promise<{ param: string }>;
}) {
    const { param } = await params;
    return (
        <div></div>
    );
}