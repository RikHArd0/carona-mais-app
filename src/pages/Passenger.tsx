import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Navigation, Search, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Passenger = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
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
        {/* Map Preview */}
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

        {/* Location Inputs */}
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

        {/* Ride Options */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground">Escolha uma opção</h3>
          
          <Card className="p-4 cursor-pointer hover:border-primary transition-[var(--transition-smooth)] border-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  🚗
                </div>
                <div>
                  <div className="font-semibold">RideConnect X</div>
                  <div className="text-xs text-muted-foreground">2-3 min • Econômico</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">R$ 12,50</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 cursor-pointer hover:border-secondary transition-[var(--transition-smooth)] border-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  🚙
                </div>
                <div>
                  <div className="font-semibold">RideConnect Comfort</div>
                  <div className="text-xs text-muted-foreground">3-4 min • Confortável</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-secondary">R$ 18,90</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 cursor-pointer hover:border-accent transition-[var(--transition-smooth)] border-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  🏎️
                </div>
                <div>
                  <div className="font-semibold">RideConnect Premium</div>
                  <div className="text-xs text-muted-foreground">1-2 min • Luxuoso</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-accent">R$ 28,50</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Method */}
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

        {/* Request Ride Button */}
        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          disabled={!origin || !destination}
        >
          Solicitar Corrida
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Ao solicitar, você concorda com nossos termos
        </p>
      </main>
    </div>
  );
};

export default Passenger;
