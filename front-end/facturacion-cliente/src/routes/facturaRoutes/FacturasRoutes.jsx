import { Route, Routes } from "react-router-dom";
import FacturasList from "../../pages/Facturas/FacturasList";
import FacturasDetails from "../../pages/Facturas/FacturasDetails";

const FacturasRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<FacturasList />} />
            <Route path="/nueva" element={<FacturasDetails />} />
            <Route path="/:id" element={<FacturasDetails />} />
        </Routes>
    )
}

export default FacturasRoutes;
