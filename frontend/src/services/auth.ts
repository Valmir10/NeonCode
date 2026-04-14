const STORAGE_KEY = 'neoncode_users';

interface StoredUser {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'neoncode_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  const users = getUsers();

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'This username is already taken.' };
  }

  const passwordHash = await hashPassword(password);

  users.push({
    username,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: Date.now(),
  });

  saveUsers(users);
  return { success: true };
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; username?: string; error?: string }> {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, error: 'No account found with this email.' };
  }

  const passwordHash = await hashPassword(password);

  if (user.passwordHash !== passwordHash) {
    return { success: false, error: 'Incorrect password.' };
  }

  return { success: true, username: user.username };
}
