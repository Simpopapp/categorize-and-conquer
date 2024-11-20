import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: `${username}@user.com`,
        password,
      });

      if (error) throw error;
      navigate("/");
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: `${username}@user.com`,
        password,
      });

      if (error) throw error;
      
      // Auto login after signup
      await supabase.auth.signInWithPassword({
        email: `${username}@user.com`,
        password,
      });
      
      navigate("/");
      toast.success("Conta criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    const guestUser = `guest_${Math.random().toString(36).substring(7)}`;

    try {
      // Create and login as guest in one step
      const { error } = await supabase.auth.signInWithPassword({
        email: "guest@guest.com",
        password: "sema123",
      });

      if (error) {
        // If guest account doesn't exist, create it
        if (error.message.includes("Invalid login credentials")) {
          await supabase.auth.signUp({
            email: "guest@guest.com",
            password: "sema123",
          });
          
          // Try logging in again
          await supabase.auth.signInWithPassword({
            email: "guest@guest.com",
            password: "sema123",
          });
        } else {
          throw error;
        }
      }

      navigate("/");
      toast.success("Bem-vindo, convidado!");
    } catch (error) {
      toast.error("Erro ao entrar como convidado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Task Timer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={loading}>
                Entrar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSignUp}
                disabled={loading}
              >
                Criar Conta
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleGuestLogin}
                disabled={loading}
              >
                Entrar como Convidado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}