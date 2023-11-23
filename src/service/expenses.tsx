export interface IExpense {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  mes: string;
  dia: string;
}

export async function getExpensesAPI(month: string): Promise<IExpense[]> {
  const expenses = await fetch(`http://localhost:3001/despesas?mes=${month}&sort=dia`).then(
    (resp) => {
      return resp.json();
    }
  );
  return expenses;
}