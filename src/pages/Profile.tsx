import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Phone, Mail, LogOut, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { signOut } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile({
        full_name: profileData.full_name || "",
        phone: profileData.phone || "",
        email: user.email || "",
      });
    } catch (error: any) {
      toast.error("Erro ao carregar perfil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao atualizar perfil");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logout realizado");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="p-6 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">Meu Perfil</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="p-6 max-w-md mx-auto space-y-6">
        {/* Profile Avatar */}
        <Card className="p-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold mb-4">
            {profile.full_name.charAt(0) || "U"}
          </div>
          <h2 className="font-semibold text-xl">{profile.full_name}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </Card>

        {/* Profile Form */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold mb-4">Informações Pessoais</h3>

          <div>
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nome Completo
            </Label>
            <Input
              id="name"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefone
            </Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input id="email" value={profile.email} disabled />
          </div>

          <Button variant="default" className="w-full" onClick={handleSaveProfile}>
            Salvar Alterações
          </Button>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/history")}
        >
          <History className="w-4 h-4 mr-2" />
          Ver Histórico de Corridas
        </Button>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </main>
    </div>
  );
};

export default Profile;
