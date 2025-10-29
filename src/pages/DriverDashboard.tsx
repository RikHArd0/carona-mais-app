import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Car, MapPin, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type TransportRequest = Tables<"transport_requests">;

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchRequests();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profile?.user_type !== "driver") {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("transport_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as solicitações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("transport_requests")
        .update({ 
          status: "accepted",
          driver_id: session.user.id 
        })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Solicitação aceita!",
      });

      fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: "Erro",
        description: "Não foi possível aceitar a solicitação",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      <header className="p-6 pb-0">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Modo Motorista
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Car className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Solicitações Disponíveis</h2>
              <p className="text-muted-foreground text-sm">Aceite uma solicitação para iniciar</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Nenhuma solicitação disponível</h3>
            <p className="text-sm text-muted-foreground">
              No momento não há solicitações pendentes
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Origem</p>
                      <p className="font-medium">{request.origin_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Destino(s)</p>
                      <p className="font-medium">
                        {Array.isArray(request.destinations) 
                          ? request.destinations.map((d: any) => d.address).join(", ")
                          : "Não especificado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {request.created_at && new Date(request.created_at).toLocaleString("pt-BR")}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-secondary to-primary"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Aceitar Solicitação
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
