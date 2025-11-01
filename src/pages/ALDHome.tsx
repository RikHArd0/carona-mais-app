import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Car, LogIn, UserCircle, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

const ALDHome = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (session) {
        setIsLoggedIn(true);
        // Defer Supabase call to avoid deadlock
        setTimeout(() => {
          supabase
            .from("profiles")
            .select("user_type")
            .eq("id", session.user.id)
            .maybeSingle()
            .then(({ data: profile, error }) => {
              console.log("Auth change - Profile:", profile);
              console.log("Auth change - Error:", error);
              setUserType(profile?.user_type || null);
            });
        }, 0);
      } else {
        setIsLoggedIn(false);
        setUserType(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Session:", session);
    if (session) {
      setIsLoggedIn(true);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", session.user.id)
        .maybeSingle();
      console.log("Profile data:", profile);
      console.log("Profile error:", error);
      setUserType(profile?.user_type || null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <ThemeToggle />
        {isLoggedIn ? (
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
            <UserCircle className="w-6 h-6" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
            <LogIn className="w-4 h-4 mr-2" />
            Entrar
          </Button>
        )}
      </div>
      <div className="w-full max-w-md mx-auto px-6">
        <header className="py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ALD Transportes
            </h1>
            <p className="text-muted-foreground mt-1">Sistema de Gestão de Transporte</p>
          </div>
        </header>

        <main className="flex items-center justify-center min-h-[calc(100vh-300px)]">
          <div className="w-full">
          {isLoggedIn ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta!</h2>
                <p className="text-muted-foreground">O que deseja fazer hoje?</p>
              </div>

            <div className="space-y-4">
              {userType === "company" && (
                <Card 
                  className="p-6 cursor-pointer hover:shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)] border-2 hover:border-primary"
                  onClick={() => navigate('/request')}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Nova Solicitação</h3>
                      <p className="text-sm text-muted-foreground">Solicite um transporte para sua empresa</p>
                    </div>
                  </div>
                </Card>
              )}

              {userType === "driver" && (
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
                      <p className="text-sm text-muted-foreground">Ver e aceitar solicitações</p>
                    </div>
                  </div>
                </Card>
              )}

              {userType === "controller" && (
                <Card 
                  className="p-6 cursor-pointer hover:shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)] border-2 hover:border-accent"
                  onClick={() => navigate('/dashboard')}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <LayoutDashboard className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Dashboard</h3>
                      <p className="text-sm text-muted-foreground">Painel administrativo</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-12 space-y-4">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary p-1 shadow-[var(--shadow-glow)]">
                <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    ALD
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold">Sistema de Transporte</h2>
              <p className="text-muted-foreground">Gestão inteligente de transporte corporativo</p>
            </div>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Faça login para acessar:</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Solicitar transportes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    Gerenciar motoristas
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Acompanhar em tempo real
                  </li>
                </ul>
              </Card>

              <Button
                variant="default"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-secondary"
                onClick={() => navigate("/auth")}
              >
                Começar Agora
              </Button>
              </div>
            </>
          )}
          </div>
        </main>
      </div>
    </div>
  );
};


export default ALDHome;
