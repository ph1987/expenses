export interface IExpense {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  mes: string;
  dia: string;
}

export interface IUser {
  email: string;
  senha: string;
}

export interface ISummary {
  id: number;
  categoria: string;
  valor: number;
}

export async function getExpensesAPI(month: string): Promise<IExpense[]> {
  const resp = await fetch(`http://localhost:3001/despesas?mes=${month}&sort=dia`, {
    credentials: "include",
  });
  return handleResponse(resp);
}

export function getUserEndpoint(): Promise<IUser> {
  return fetch(`http://localhost:3001/sessao/usuario`, {
    credentials: "include",
  }).then(handleResponse);
}

export async function signInEndpoint(email: string, senha: string): Promise<IUser> {
  const resp = await fetch(`http://localhost:3001/sessao/criar`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });
  return handleResponse(resp);
}

export async function signOutEndpoint(): Promise<IUser> {
  const resp = await fetch(`http://localhost:3001/sessao/finalizar`, {
    credentials: "include",
    method: "POST",
  });
  return handleResponse(resp);
}

function handleResponse(resp: Response) {
  if (resp.ok) {
    return resp.json();
  } else {
    throw new Error(resp.statusText);
  }
}