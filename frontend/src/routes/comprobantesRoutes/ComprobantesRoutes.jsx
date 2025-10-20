import { Route, Routes } from "react-router-dom";
import ComprobantesList from "../../pages/Comprobantes/ComprobantesList";
import ComprobantesDetails from "../../pages/Comprobantes/ComprobantesDetails";
import TiposComprobantesList from "../../pages/Comprobantes/TiposComprobantesList";
import TipoComprobanteDetails from "../../pages/Comprobantes/TipoComprobanteDetails";

const ComprobantesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ComprobantesList />} />
            <Route path="/nuevo" element={<ComprobantesDetails />} />
            <Route path="/:id" element={<ComprobantesDetails />} />
            <Route path="/tipos" element={<TiposComprobantesList />} />
            <Route path="/tipos/nuevo" element={<TipoComprobanteDetails />} />
            <Route path="/tipos/:id" element={<TipoComprobanteDetails />} />
        </Routes>
    )
}

export default ComprobantesRoutes;
