import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center max-w-md px-6">
        <h1 className="mb-4 text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">Oops! Página não encontrada</p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-primary to-secondary"
        >
          <Home className="w-4 h-4 mr-2" />
          Voltar para Início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
