import { useEffect , useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";

export default function Room( {roomName} ) {
    const [expenses, setExpenses] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const Navigate = useNavigate();

    useEffect(() => {
        async function loadExpensesFromDb() {
            try {
                const request = await fetch('/getExpenses', {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({roomName})
                })
                const expenses = await request.json();
                console.log(expenses);
                setExpenses(expenses);
            } catch(err) {
                console.log(err);
                console.log('failed to load data')
            }
        }
        loadExpensesFromDb()
    }, [roomName])
    useEffect(() => {
        async function validateUser() {
          try {
            const request = await fetch('/validateUser', {
              method: "post",
              headers: {
                "Content-Type": "application/json"
              },
            })
            console.log(request.ok)
            if(!request.ok) {
              throw new Error('user isnt authenticated')
            }
            else {
              console.log('welcome');
              setIsAuthenticated(true)
            }
          }
          catch(err) {
            Navigate('/login')
          }
        }
        console.log('mount')
        validateUser();
        
    }, [])

    return(
        <>
        {isAuthenticated &&(
            <>
            <Header />
            <h1 style={{color:'orange', textAlign: "center"}}>{roomName}</h1>
        {/* <div style={{
            display:'flex',
            flexDirection: "column",
            alignItems: 'center',
            justifyContent: "center",
            width: "fit-content",
            margin:'auto'
        }}> */}
        <div className="container">

        <table className="imputation-table">
              <tbody>
                <tr>
                    <th>Date</th>
                    <th>Désignation</th>
                    <th>Quantite</th>
                    <th>prix unitaire</th>
                    <th>montant</th>
                    <th>imputation</th>
                    <th>N° de dépense</th>
                </tr>
                {expenses.length && expenses.map((expense, index) => 
                // {console.log('whats up')}
                <tr key={index}>
                  <td>
                    {expense.date}
                  </td>
                  <td>
                    {expense.name}
                  </td>
                  <td>
                    {expense.qty}
                  </td>
                  <td>
                  {expense.uniquePrice}
                  </td>
                  <td>
                  {expense.price}
                  </td>
                  <td>
                  {expense.imputation}
                  </td>
                  <td>
                    {expense.numero}
                  </td>
                </tr>
                )}
                <tr>

                <>{!expenses.length && <td id="noExpense"> pas encore de dépenses</td>}</>
                </tr>
              </tbody>
              
            </table>
        <p id="total" >
         Total = { expenses && expenses.reduce( (accumulator, currentValue) => +currentValue.price + accumulator ,0) } MRU
        </p>
        </div>
            </>
        )}

    </>
    )
}