import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/auth-ald";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Car } from "lucide-react";

const ALDAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"company" | "driver">("company");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    companyName: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
      } else {
        if (!formData.fullName || !formData.phone) {
          toast.error("Preencha todos os campos");
          setLoading(false);
          return;
        }
        if (userType === "company" && !formData.companyName) {
          toast.error("Informe o nome da empresa");
          setLoading(false);
          return;
        }
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          formData.phone,
          userType,
          formData.companyName
        );
        if (error) throw error;
        toast.success("Conta criada com sucesso!");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary p-1 mb-4 shadow-[var(--shadow-glow)]">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ALD
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {isLogin ? "Bem-vindo!" : "Criar Conta"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Entre para continuar" : "ALD Transportes"}
          </p>
        </div>

        {!isLogin && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              type="button"
              variant={userType === "company" ? "default" : "outline"}
              onClick={() => setUserType("company")}
              className="h-auto py-4 flex-col gap-2"
            >
              <Building2 className="w-6 h-6" />
              <span className="text-xs">Empresa</span>
            </Button>
            <Button
              type="button"
              variant={userType === "driver" ? "default" : "outline"}
              onClick={() => setUserType("driver")}
              className="h-auto py-4 flex-col gap-2"
            >
              <Car className="w-6 h-6" />
              <span className="text-xs">Motorista</span>
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
              
              {userType === "company" && (
                <div>
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            disabled={loading}
          >
            {loading
              ? "Carregando..."
              : isLogin
              ? "Entrar"
              : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? "Não tem uma conta? Cadastre-se"
              : "Já tem uma conta? Faça login"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ALDAuth;
