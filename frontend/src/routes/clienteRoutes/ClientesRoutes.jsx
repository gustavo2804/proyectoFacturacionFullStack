import { Route, Routes } from "react-router-dom";
import Clientes from "../../pages/Clientes/ClientesList";
import ClientesDetails from "../../pages/Clientes/ClientesDetails";

const ClientesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Clientes />} />
            <Route path="/nuevo" element={<ClientesDetails />} />
            <Route path="/:id" element={<ClientesDetails />} />
        </Routes>
    )
}

export default ClientesRoutes;