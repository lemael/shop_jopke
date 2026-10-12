import Hilfe from "@/views/hilfe";
import Home from "@/views/home";
import Kontakt from "@/views/kontakt";

const routes = {
  "/": Home,
  "/hilfe": Hilfe,
  "/kontakt": Kontakt,
};

export default function AppRouter({ pathname = "/" }) {
  const Page = routes[pathname];

  return Page ? <Page /> : null;
}
