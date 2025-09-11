import { Route, Routes } from "react-router-dom";
import ProductosList from "../../pages/Productos/ProductosList";
import ProductosDetails from "../../pages/Productos/ProductosDetails";

const ProductosRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductosList />} />
            <Route path="/nuevo" element={<ProductosDetails />} />
            <Route path="/:id" element={<ProductosDetails />} />
        </Routes>
    )
}

export default ProductosRoutes;
