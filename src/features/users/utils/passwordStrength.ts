export interface PasswordStrength {
  score: number;
  label: string;
}

const STRENGTH_LABELS = [
  "Sin contraseña",
  "Muy débil",
  "Débil",
  "Aceptable",
  "Fuerte",
] as const;

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: STRENGTH_LABELS[0] };
  }

  const score = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  return { score, label: STRENGTH_LABELS[score] ?? STRENGTH_LABELS[0] };
}
