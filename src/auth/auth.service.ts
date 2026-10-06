import conectNest from "../app/contexts/conectNest";

export interface AuthMeResponse {
  ok: boolean;
  usuario: {
    id: number;
    public_id: string;
    user_name: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string | null;
    company_id: number;
    company_name: string;
    role_name: string;
    classification_code: string;
    permissions: string[];
  };
}

export async function getCurrentUser(): Promise<AuthMeResponse["usuario"]> {
  const { data } = await conectNest.get<AuthMeResponse>("/auth/me");

  if (!data.ok) {
    throw new Error("No fue posible obtener el usuario actual");
  }

  return data.usuario;
}

export async function logout(): Promise<void> {
  await conectNest.post("/auth/logout");
}

