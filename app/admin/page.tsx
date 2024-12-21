import dynamic from "next/dynamic";

const App = dynamic(() => import('./app').then(mod => mod.default), { ssr: false });

const AdminPage = () => {
    return (
        <App />
    )
}

export default AdminPage;


