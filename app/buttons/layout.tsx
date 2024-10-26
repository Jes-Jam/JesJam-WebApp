export const metadata = {
    title: "Buttons",
    description: "Buttons for the web app",
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body lang="en">
                {children}
            </body>
        </html>
    )
}