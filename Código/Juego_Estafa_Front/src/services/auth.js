async function realizarSolicitud(path, values) {
  let response;

  try {
    response = await fetch(`/api/v1/auth/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success || !data?.token) {
    const validationMessage = data?.errors?.[0]?.message;

    throw new Error(
      validationMessage ||
        data?.message ||
        'Ocurrió un error. Inténtalo de nuevo.',
    );
  }

  return data;
}

export function iniciarSesion({ username, password }) {
  return realizarSolicitud('login', {
    username: username.trim(),
    password,
  });
}

export function registrarUsuario({
  name,
  username,
  password,
  profile,
}) {
  return realizarSolicitud('register', {
    name: name.trim(),
    username: username.trim(),
    password,
    profile,
  });
}

export function guardarSesion(data, remember = false) {
  const key = 'antiestafas.session';
  const selectedStorage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  otherStorage.removeItem(key);

  selectedStorage.setItem(
    key,
    JSON.stringify({
      token: data.token,
      user: data.user,
    }),
  );
}