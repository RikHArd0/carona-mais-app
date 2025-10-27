import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Users, Calendar } from "lucide-react";

const TransportRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin_address: "",
    origin_lat: -23.5505,
    origin_lng: -46.6333,
    destinations: [{ address: "", lat: -23.5505, lng: -46.6333 }],
    num_passengers: 1,
    vehicle_type: "sedan",
    scheduled_time: "",
    notes: "",
  });

  const handleAddDestination = () => {
    setFormData({
      ...formData,
      destinations: [...formData.destinations, { address: "", lat: -23.5505, lng: -46.6333 }],
    });
  };

  const handleDestinationChange = (index: number, value: string) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index].address = value;
    setFormData({ ...formData, destinations: newDestinations });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para fazer uma solicitação.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("transport_requests").insert({
        company_id: user.id,
        origin_address: formData.origin_address,
        origin_lat: formData.origin_lat,
        origin_lng: formData.origin_lng,
        destinations: formData.destinations,
        num_passengers: formData.num_passengers,
        vehicle_type: formData.vehicle_type,
        scheduled_time: formData.scheduled_time || null,
        notes: formData.notes || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Solicitação criada com sucesso.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Nova Solicitação de Transporte</CardTitle>
            <CardDescription>
              Preencha os dados para solicitar um transporte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="origin">
                  <MapPin className="inline mr-2 h-4 w-4" />
                  Endereço de Origem
                </Label>
                <Input
                  id="origin"
                  value={formData.origin_address}
                  onChange={(e) =>
                    setFormData({ ...formData, origin_address: e.target.value })
                  }
                  placeholder="Ex: Av. Paulista, 1000 - São Paulo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  <MapPin className="inline mr-2 h-4 w-4" />
                  Destino(s)
                </Label>
                {formData.destinations.map((dest, index) => (
                  <Input
                    key={index}
                    value={dest.address}
                    onChange={(e) => handleDestinationChange(index, e.target.value)}
                    placeholder={`Destino ${index + 1}`}
                    required
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddDestination}
                  className="w-full"
                >
                  + Adicionar Destino
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passengers">
                    <Users className="inline mr-2 h-4 w-4" />
                    Passageiros
                  </Label>
                  <Input
                    id="passengers"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.num_passengers}
                    onChange={(e) =>
                      setFormData({ ...formData, num_passengers: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle">Tipo de Veículo</Label>
                  <Select
                    value={formData.vehicle_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, vehicle_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="bus">Ônibus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled">
                  <Calendar className="inline mr-2 h-4 w-4" />
                  Data/Hora Agendada (Opcional)
                </Label>
                <Input
                  id="scheduled"
                  type="datetime-local"
                  value={formData.scheduled_time}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduled_time: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações (Opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Informações adicionais..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Solicitar Transporte"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransportRequest;