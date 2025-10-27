import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, DollarSign, Star, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Driver = () => {
  const navigate = useNavigate();

  const availableRides = [
    {
      id: 1,
      passenger: "Maria Silva",
      rating: 4.9,
      pickup: "Av. Paulista, 1000",
      destination: "Shopping Ibirapuera",
      distance: "3.2 km",
      time: "8 min",
      price: "R$ 15,50",
    },
    {
      id: 2,
      passenger: "João Santos",
      rating: 5.0,
      pickup: "Rua Augusta, 500",
      destination: "Aeroporto Congonhas",
      distance: "12.5 km",
      time: "5 min",
      price: "R$ 42,00",
    },
    {
      id: 3,
      passenger: "Ana Costa",
      rating: 4.8,
      pickup: "Rua Oscar Freire, 200",
      destination: "Parque Ibirapuera",
      distance: "5.8 km",
      time: "12 min",
      price: "R$ 22,30",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-primary">R$ 285</div>
            <div className="text-xs text-muted-foreground">Hoje</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-secondary">12</div>
            <div className="text-xs text-muted-foreground">Corridas</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-accent">4.9★</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </Card>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto">
        {/* Map Preview */}
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

        {/* Available Rides */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Corridas Próximas</h3>
            <span className="text-xs text-muted-foreground">{availableRides.length} disponíveis</span>
          </div>

          {availableRides.map((ride) => (
            <Card 
              key={ride.id} 
              className="p-4 cursor-pointer hover:shadow-[var(--shadow-glow)] hover:border-primary transition-[var(--transition-smooth)] border-2"
            >
              {/* Passenger Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                    {ride.passenger.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{ride.passenger}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      {ride.rating}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary text-lg">{ride.price}</div>
                  <div className="text-xs text-muted-foreground">{ride.distance}</div>
                </div>
              </div>

              {/* Route Info */}
              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Retirada</div>
                    <div className="text-sm font-medium">{ride.pickup}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-secondary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Destino</div>
                    <div className="text-sm font-medium">{ride.destination}</div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ride.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {ride.distance}
                  </span>
                </div>
                <Button variant="default" size="sm">
                  Aceitar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Toggle Online/Offline */}
        <Card className="p-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Status</div>
              <div className="text-xs text-muted-foreground">Você está online</div>
            </div>
            <Button variant="outline">Ficar Offline</Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Driver;
