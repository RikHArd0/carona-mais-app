import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, DollarSign, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Ride {
  id: string;
  pickup_location: string;
  destination_location: string;
  ride_type: string;
  status: string;
  price: number;
  created_at: string;
  driver_id: string | null;
}

const History = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    checkAuthAndLoadRides();
  }, []);

  const checkAuthAndLoadRides = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      await loadRides(user.id);
    } catch (error) {
      toast.error("Erro ao carregar histórico");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRides = async (userId: string) => {
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("passenger_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar corridas");
      console.error(error);
      return;
    }

    setRides(data || []);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Aguardando", variant: "secondary" },
      accepted: { label: "Aceita", variant: "default" },
      in_progress: { label: "Em andamento", variant: "default" },
      completed: { label: "Concluída", variant: "outline" },
      cancelled: { label: "Cancelada", variant: "destructive" },
    };

    const { label, variant } = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getRideTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      economy: "Econômico",
      comfort: "Conforto",
      premium: "Premium",
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="p-6 flex items-center gap-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-semibold">Histórico de Corridas</h1>
          <p className="text-xs text-muted-foreground">{rides.length} corridas</p>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto">
        {rides.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Nenhuma corrida ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Suas corridas aparecerão aqui
            </p>
            <Button onClick={() => navigate("/passenger")}>
              Solicitar Corrida
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {rides.map((ride) => (
              <Card key={ride.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {getRideTypeLabel(ride.ride_type)}
                      </span>
                      {getStatusBadge(ride.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ride.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary text-lg">
                      R$ {ride.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Origem</div>
                      <div className="text-sm">{ride.pickup_location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Destino</div>
                      <div className="text-sm">{ride.destination_location}</div>
                    </div>
                  </div>
                </div>

                {ride.status === "completed" && (
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Star className="w-3 h-3 mr-2" />
                    Avaliar Corrida
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
