import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Car, User, MapPin, Clock, LogIn, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="p-6 pb-0">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RideConnect
            </h1>
            <p className="text-muted-foreground mt-1">Seu transporte, sua escolha</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
              >
                <UserCircle className="w-6 h-6" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="p-6 pt-12 max-w-md mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-[var(--shadow-glow)] animate-pulse">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <Car className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Bem-vindo!</h2>
          <p className="text-muted-foreground">Como deseja usar o RideConnect hoje?</p>
        </div>

        {/* Mode Selection Cards */}
        <div className="space-y-4">
          <Card 
            className="p-6 cursor-pointer hover:shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)] border-2 hover:border-primary"
            onClick={() => navigate('/passenger')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Solicitar Corrida</h3>
                <p className="text-sm text-muted-foreground">Viaje com conforto e segurança</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Rápido
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Rastreamento
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)] border-2 hover:border-secondary"
            onClick={() => navigate('/driver')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Modo Motorista</h3>
                <p className="text-sm text-muted-foreground">Ganhe dinheiro dirigindo</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Flexível
                  </span>
                  <span>Ganhos diários</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">50k+</div>
            <div className="text-xs text-muted-foreground mt-1">Motoristas</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">1M+</div>
            <div className="text-xs text-muted-foreground mt-1">Viagens</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">4.9★</div>
            <div className="text-xs text-muted-foreground mt-1">Avaliação</div>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          {!isLoggedIn && (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                Novo por aqui?
              </p>
              <Button
                variant="outline"
                size="lg"
                className="w-full max-w-xs"
                onClick={() => navigate("/auth")}
              >
                Criar Conta
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
