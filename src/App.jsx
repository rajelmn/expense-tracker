import { useEffect,useState,useRef } from "react";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "./header";
export default function App() {

  const [expenses, setExpenses] = useState([]);
  const [disable, setDisable] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const Navigate = useNavigate()
  const form = useRef(null);

  async function storeExpensesInDb(expense) {
    try {
      fetch('/api/storeExpense', {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(expense),
      })
    } catch(err) {
      console.error(err);
    }
  }

  async function handleRemoveFromDb(id) {
    try{
      fetch('/api/removeExpense', {
        method: 'DELETE',
        body: JSON.stringify({id}),
        headers: {
          "Content-Type": "application/json"
        }
      })
    }catch(err) {
      console.log(err)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const uniqueId = crypto.randomUUID();
    const expense = {
          date: e.target.date.value,
          name: e.target.name.value,
          qty: e.target.qty.value,
          uniquePrice: e.target.priceInput.value,
          imputation: e.target.imputation.value,
          price:e.target.price.value === 'salaire' ?e.target.priceInput.value : e.target.priceInput.value * e.target.qty.value,
          id: uniqueId
    }
    setExpenses(prev => [
        ...prev,
        expense
      ]);
      storeExpensesInDb(expense)
    }

    function handleFormChange(e) {
      console.log(e.target.value)
      if(e.target?.value === 'salaire') {
        setDisable(true);
      }
      else {
        setDisable(false)
      }
    }

    function handleRemove(id) {
      // if(expenses.length === 1) {
      //   localStorage.clear()
      // }
      handleRemoveFromDb(id);
      setExpenses(prev =>prev.filter((item) => item?.id !== id))
    }

    useEffect(() => {
      async function validateUser() {
        try {
          const request = await fetch('/api/validateUser', {
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
      async function getExpensesFromDb() {
        try {
          const allExpenses = await fetch('/api/getExpenses').then(res => res.json());
          setExpenses(allExpenses);
        } catch(err) {
          console.log(err)
          console.log('couldnt get messages from db')
        }
      }
      validateUser()
      getExpensesFromDb()
      
        
    }, [])
    
    // useEffect(() => {
    //   // if(!expenses.length) return
    //   if(expenses.length > 0) {
    //     localStorage.setItem('items', JSON.stringify(expenses))
    //   }
    // }, [expenses])
  
  return(
    <>
    {isAuthenticated && (
    <>
   <Header />
    <div className="container">
        <div className="top-inputs">
            <h1 style={{color:'orange', marginBottom:'20px'}}>MAURITANIE 2E2D</h1>
            <h2>JOURNAL DES COMPTE</h2>
            <h4>Ajouter une nouvelle ligne:</h4>
            <form ref={form} onSubmit={handleSubmit}>  
            <div className="first-input">
                <div className="designation">
                <p>Désignation:</p>
                <input type="text" name="name" required/>
                </div>
                <div className="other-expenses">
                    <select name="price" id="select" required onChange={handleFormChange}>
                        <option value="prix">prix</option>
                        <option value="salaire">salaire</option>
                        <option value="autre">autre</option>
                    </select>
                    <input type="number" name="priceInput" id="drop-down" /> 
                </div>
                
            </div>
            <div className="second-input">
                <div className="date">
                    <p>Date: </p>
                    <input type="date" name="date" required/>
                </div>
    
                <div className="amount">
                    <p>Quantite: </p>
                   <input type="number" name="qty" disabled={disable}/>
                </div>
            </div>
            <div style={{
              display: "flex"
            }}>
                <p>
                select a room
                </p>
              <select name="imputation" id="imputation">
                <option value="AF1">Ateliers Formations/ AF1</option>
                <option value="ET1">Etudes et Production/ET1</option>
                <option value="CL1">Contrats et Location/CL1</option>
                <option value="HR1">Honraires et Rémunération/HR1</option>
                <option value="AI1">Acquisitions informatique /AI1</option>
                <option value="DI1">Divers imprévus/DI1</option>
              </select>
            </div>
            <button type="submit" id="btn" >ajouter une dépense</button>
            </form>
            
        </div>
            <table>
              <tbody>
                <tr>
                    <th>Date</th>
                    <th>Désignation</th>
                    <th>Quantite</th>
                    <th>prix unitaire</th>
                    <th>montant</th>
                    <th>imputation</th>
                    
                </tr>
                {expenses && expenses.map((expense, index) => 
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
                  <td className="remove" onClick={() => handleRemove(expense.id)}>
                  X
                  </td>
                </tr>
                )}
                <tr>

                <>{!expenses.length && <td id="noExpense"> pas encore de dépenses</td>}</>
                </tr>
              </tbody>
              
            </table>
        <p id="total">
           Total = { expenses.reduce( (accumulator, currentValue) => +currentValue.price + accumulator ,0) } MRU
        </p>
    </div>
    </>
      )}
    </>
  )
}