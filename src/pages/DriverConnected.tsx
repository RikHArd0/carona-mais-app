import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Star, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Ride {
  id: string;
  pickup_location: string;
  destination_location: string;
  ride_type: string;
  price: number;
  distance_km: number | null;
  created_at: string;
  passenger_id: string;
}

const DriverConnected = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState<Ride[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

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
      
      setUserId(user.id);
      await loadAvailableRides();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('rides-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'rides',
            filter: `status=eq.pending`
          },
          (payload) => {
            setRides(prev => [payload.new as Ride, ...prev]);
            toast.success("Nova corrida disponível!");
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao carregar corridas");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRides = async () => {
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading rides:", error);
      toast.error("Erro ao carregar corridas");
      return;
    }

    setRides(data || []);
  };

  const handleAcceptRide = async (rideId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("rides")
        .update({ 
          driver_id: userId, 
          status: "accepted" 
        })
        .eq("id", rideId);

      if (error) throw error;

      toast.success("Corrida aceita com sucesso!");
      setRides(prev => prev.filter(r => r.id !== rideId));
    } catch (error: any) {
      console.error("Error accepting ride:", error);
      toast.error("Erro ao aceitar corrida");
    }
  };

  const getRideTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      economy: "Econômico",
      comfort: "Conforto",
      premium: "Premium",
    };
    return typeMap[type] || type;
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Agora";
    if (diffMins === 1) return "1 min";
    if (diffMins < 60) return `${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando corridas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="p-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">Modo Motorista</h1>
            <p className="text-xs text-muted-foreground">Corridas disponíveis</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
            Online
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-primary">R$ 0</div>
            <div className="text-xs text-muted-foreground">Hoje</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-secondary">0</div>
            <div className="text-xs text-muted-foreground">Corridas</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-accent">5.0★</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </Card>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto">
        <Card className="h-48 mb-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Navigation className="w-6 h-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Sua localização</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Corridas Próximas</h3>
            <span className="text-xs text-muted-foreground">{rides.length} disponíveis</span>
          </div>

          {rides.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Nenhuma corrida disponível</h3>
              <p className="text-sm text-muted-foreground">
                Aguardando novas solicitações...
              </p>
            </Card>
          ) : (
            rides.map((ride) => (
              <Card 
                key={ride.id} 
                className="p-4 cursor-pointer hover:shadow-[var(--shadow-glow)] hover:border-primary transition-[var(--transition-smooth)] border-2"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                      P
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{getRideTypeLabel(ride.ride_type)}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {getTimeSince(ride.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary text-lg">R$ {ride.price.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      {ride.distance_km ? `${ride.distance_km.toFixed(1)} km` : "~5 km"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Retirada</div>
                      <div className="text-sm font-medium">{ride.pickup_location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-secondary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Destino</div>
                      <div className="text-sm font-medium">{ride.destination_location}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeSince(ride.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {ride.distance_km ? `${ride.distance_km.toFixed(1)} km` : "~5 km"}
                    </span>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleAcceptRide(ride.id)}
                  >
                    Aceitar
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DriverConnected;
