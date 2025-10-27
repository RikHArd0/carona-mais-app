import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Navigation, Search, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PassengerConnected = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRideType, setSelectedRideType] = useState<"economy" | "comfort" | "premium">("economy");

  const rideOptions = [
    {
      type: "economy" as const,
      name: "RideConnect X",
      emoji: "🚗",
      description: "2-3 min • Econômico",
      price: 12.50,
      color: "primary"
    },
    {
      type: "comfort" as const,
      name: "RideConnect Comfort",
      emoji: "🚙",
      description: "3-4 min • Confortável",
      price: 18.90,
      color: "secondary"
    },
    {
      type: "premium" as const,
      name: "RideConnect Premium",
      emoji: "🏎️",
      description: "1-2 min • Luxuoso",
      price: 28.50,
      color: "accent"
    }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);
  };

  const handleRequestRide = async () => {
    if (!origin || !destination || !userId) {
      toast.error("Preencha origem e destino");
      return;
    }

    setLoading(true);
    try {
      const selectedOption = rideOptions.find(r => r.type === selectedRideType);
      
      // Simulate geocoding - in production, use a real geocoding service
      const pickupLat = -23.5505 + Math.random() * 0.1;
      const pickupLng = -46.6333 + Math.random() * 0.1;
      const destLat = -23.5505 + Math.random() * 0.1;
      const destLng = -46.6333 + Math.random() * 0.1;

      const { error } = await supabase
        .from("rides")
        .insert({
          passenger_id: userId,
          pickup_location: origin,
          pickup_lat: pickupLat,
          pickup_lng: pickupLng,
          destination_location: destination,
          destination_lat: destLat,
          destination_lng: destLng,
          ride_type: selectedRideType,
          price: selectedOption?.price || 12.50,
          status: "pending"
        });

      if (error) throw error;

      toast.success("Corrida solicitada com sucesso!");
      navigate("/history");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Erro ao solicitar corrida");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="p-6 flex items-center gap-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-semibold">Solicitar Corrida</h1>
          <p className="text-xs text-muted-foreground">Para onde vamos?</p>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto">
        <Card className="h-64 mb-6 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Navigation className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Mapa em tempo real</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block mb-1">Origem</label>
                <Input 
                  placeholder="Sua localização atual" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="border-0 p-0 h-auto focus-visible:ring-0"
                />
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Navigation className="w-4 h-4 text-primary" />
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-secondary flex-shrink-0" />
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block mb-1">Destino</label>
                <Input 
                  placeholder="Para onde você vai?" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="border-0 p-0 h-auto focus-visible:ring-0"
                />
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Search className="w-4 h-4 text-secondary" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground">Escolha uma opção</h3>
          
          {rideOptions.map((option) => (
            <Card 
              key={option.type}
              className={`p-4 cursor-pointer transition-[var(--transition-smooth)] border-2 ${
                selectedRideType === option.type 
                  ? `border-${option.color}` 
                  : "hover:border-primary"
              }`}
              onClick={() => setSelectedRideType(option.type)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${option.color}/10 flex items-center justify-center`}>
                    {option.emoji}
                  </div>
                  <div>
                    <div className="font-semibold">{option.name}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-${option.color}`}>R$ {option.price.toFixed(2)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-sm">Forma de pagamento</div>
                <div className="text-xs text-muted-foreground">Dinheiro</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">Alterar</Button>
          </div>
        </Card>

        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          disabled={!origin || !destination || loading}
          onClick={handleRequestRide}
        >
          {loading ? "Solicitando..." : "Solicitar Corrida"}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Ao solicitar, você concorda com nossos termos
        </p>
      </main>
    </div>
  );
};

export default PassengerConnected;
