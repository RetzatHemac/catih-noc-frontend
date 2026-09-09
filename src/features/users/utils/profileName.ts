export interface ProfileName {
  firstName: string;
  lastName: string;
  initials: string;
}

export function getProfileName(fullName: string): ProfileName {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "Usuario";
  const lastName = parts.slice(1).join(" ");
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return { firstName, lastName, initials: initials || "U" };
}
