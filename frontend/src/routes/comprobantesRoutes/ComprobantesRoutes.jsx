import { Route, Routes } from "react-router-dom";
import ComprobantesList from "../../pages/Comprobantes/ComprobantesList";
import ComprobantesDetails from "../../pages/Comprobantes/ComprobantesDetails";

const ComprobantesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ComprobantesList />} />
            <Route path="/nuevo" element={<ComprobantesDetails />} />
            <Route path="/:id" element={<ComprobantesDetails />} />
        </Routes>
    )
}

export default ComprobantesRoutes;
