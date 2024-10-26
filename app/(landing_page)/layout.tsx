import Header from "./header";
import Footer from "./footer";

type Props = {
    children: React.ReactNode;
}

const LandingPageLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default LandingPageLayout;