const PALETTE = [
  { bg: "#e0e7ff", fg: "#4338ca" },
  { bg: "#dcfce7", fg: "#15803d" },
  { bg: "#fee2e2", fg: "#b91c1c" },
  { bg: "#fef3c7", fg: "#92400e" },
  { bg: "#e0f2fe", fg: "#0369a1" },
  { bg: "#fae8ff", fg: "#a21caf" },
  { bg: "#ffe4e6", fg: "#be123c" },
  { bg: "#ecfccb", fg: "#4d7c0f" },
];

export function getAvatarColor(name) {
  if (!name) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function avatarStyle(name) {
  const { bg, fg } = getAvatarColor(name);
  return { background: bg, color: fg };
}
