/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, useHistory } from "react-router-dom";
import { IExpense, ISummary, getExpensesAPI } from "../service/expenses";
import { useCallback, useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { MONTHS } from "../utils/dateFunctions";
import CircularProgress from "@mui/material/CircularProgress";

export function Expenses() {
  const history = useHistory();
  const { period } = useParams<{ period: string }>();

  const [ expensesState, setExpensesState ] = useState<IExpense[]>([]);
  const [ summaryState, setSummaryState ] = useState<ISummary[]>([]);
  const [ totalExpense, setTotalExpense ] = useState('R$ 0,00');
  const [ year, setYear ] = useState('');
  const [ month, setMonth ] = useState('');
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState('');
  const [ showDetails, setShowDetails ] = useState(true);
  const [ showSummary, setShowSummary ] = useState(false);

  const handleYearChange = (event: SelectChangeEvent) => {
    const selectedYear = event.target.value;
    history.push(`/expenses/${selectedYear}-${month}`);
  };

  const handleMonthChange = (event: SelectChangeEvent) => {
    const formatedMonth = formatMonth(event.target.value);
    history.push(`/expenses/${year}-${formatedMonth}`);
  };

  const formatMonth = (monthFromSelect: string): string => {
    return monthFromSelect.padStart(2, "0");
  };

  const getExpenses = useCallback(async () => {
    try {
      if (period) {
        const expenses = await getExpensesAPI(period);
        setExpensesState(expenses);

        const totalCost = expenses.reduce((sum, expense) => sum += expense.valor, 0);
        setTotalExpense(totalCost.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));

        const splittedPeriod = period.split('-');
        setYear(splittedPeriod[0]);
        setMonth(splittedPeriod[1]);

        const summary = expenses.reduce((acc, expense) => {
          const categoryIndex = acc.findIndex(
            (item) => item.categoria === expense.categoria
          );
          if (categoryIndex === -1) {
            acc.push({
              id: expense.id,
              categoria: expense.categoria,
              valor: expense.valor,
            });
          } else {
            acc[categoryIndex].valor += expense.valor;
          }
          return acc;
        }, [] as ISummary[]);
        setSummaryState(summary);

        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError('Erro!');
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  const handleShowSummary = () => {
    setShowDetails(false);
    setShowSummary(true);
  }

  const handleShowDetails = () => {
    setShowDetails(true);
    setShowSummary(false);
  }

  return (
    <Box>
      {!isLoading ? (
        <Box display="flex" flexDirection="column" width="60%" marginTop="2rem" marginLeft="auto" marginRight="auto">
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Box>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
                <InputLabel id="age-label">Ano</InputLabel>
                <Select
                  labelId="age-select-label"
                  id="age-select"
                  value={year}
                  label="Ano"
                  onChange={handleYearChange}
                >
                  <MenuItem value="2020">2020</MenuItem>
                  <MenuItem value="2021">2021</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="month-label">Mês</InputLabel>
                <Select
                  labelId="month-select-label"
                  id="month-select"
                  value={month}
                  label="Mês"
                  onChange={handleMonthChange}
                >
                  {MONTHS.map((monthName, i) => (
                    <MenuItem
                      key={`month-item${formatMonth((i+1).toString())}`}
                      value={formatMonth((i+1).toString())} 
                    >
                      {monthName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <p>Despesa total: <b>{totalExpense}</b></p>
          </Box>
          
          <Box 
            style={{ marginTop: '1rem', textAlign: 'center' }}
          >
            <span onClick={() => handleShowSummary()} style={{ cursor: 'pointer'}}>SUMMARY</span>
            <span style={{ marginRight: '2rem' }}></span>
            <span onClick={() => handleShowDetails()} style={{ cursor: 'pointer'}}>DETAILS</span>
          </Box>

          <TableContainer component={Paper} sx={{ marginTop: 6, marginBottom: 6 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              {showDetails && (
                <>
                  <TableHead>
                    <TableRow>
                      <TableCell>Despesa</TableCell>
                      <TableCell align="left">Categoria</TableCell>
                      <TableCell align="left">Dia</TableCell>
                      <TableCell align="right">Valor (R$)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expensesState.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.descricao}
                        </TableCell>
                        <TableCell align="left">{row.categoria}</TableCell>
                        <TableCell align="left">{row.dia}</TableCell>
                        <TableCell align="right">
                          {row.valor.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              )}
              {showSummary && (
                <>
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" scope="row">Categoria</TableCell>
                      <TableCell align="right">Valor (R$)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summaryState.map((row) => (
                      <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left">{row.categoria}</TableCell>
                        <TableCell align="right">
                          {row.valor.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              )}
            </Table>
          </TableContainer>
          {error ? (<p style={{ textAlign: 'center', color: 'red' }}>Erro de API</p>) : <></> }
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', marginTop: '10rem'  }}>
          <CircularProgress size="8rem" />
        </Box>
      )}
    </Box>
  );
}