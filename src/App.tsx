import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Formation from "./pages/Formation";
import Discord from "./pages/Discord";
import Minecraft from "./pages/Minecraft";
import Socials from "./pages/Socials";
import Contact from "./pages/Contact";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/formation" element={<Formation />} />
        <Route path="/discord" element={<Discord />} />
        <Route path="/minecraft" element={<Minecraft />} />
        <Route path="/reseaux" element={<Socials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<LegalPage kind="mentions" />} />
        <Route path="/cgv" element={<LegalPage kind="cgv" />} />
        <Route path="/confidentialite" element={<LegalPage kind="confidentialite" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
