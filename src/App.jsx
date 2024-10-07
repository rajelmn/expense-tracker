import { useEffect,useState,useRef } from "react";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { CiEdit as Edit } from "react-icons/ci";
import Header from "./header";
export default function App() {

  const [expenses, setExpenses] = useState([]);
  const [disable, setDisable] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [InputValue, setInputValue] = useState(1)
  const Navigate = useNavigate()
  const form = useRef(null);

  async function storeExpensesInDb(expense) {
    try {
      fetch('/storeExpense', {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(expense),
        credentials: 'include'
      })
    } catch(err) {
      console.error(err);
    }
  }

  async function handleSubmitEdit(id) {
    try {
      const newExpense = expenses.find(expense => expense.id === id)
      setExpenses(prev => prev.map(expense => {
        if(expense.id === id) {
          console.log(Number(expense.qty) * Number(expense.uniquePrice) || expense.uniquePrice)
          return {...expense, isEditing:false, price: Number(expense.qty) * Number(expense.uniquePrice)} || expense.uniquePrice
        }
        return expense
      }))
      const req = await fetch('/editExpense', {
        method: "post",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({newExpense}),
        credentials: "include"
      })
      console.log(JSON.stringify({newExpense}), 'json')
    } catch(err) {
      console.log(err)
    }
  }

  async function handleEditExpense(id) {
    try {
      console.log('what');
      const editedExpense = expenses.find(expense => expense.id === id);
      setExpenses(prev => prev.map(item => {
        if(item.id === id) {
          return {...item, isEditing: true}
        }
        return {...item, isEditing: false}
      }))
    } catch(err) {
      console.log(err)
    }
  }

  async function handleRemoveFromDb(id) {
    try{
      fetch('/removeExpense', {
        method: 'DELETE',
        body: JSON.stringify({id}),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
    }catch(err) {
      console.log(err)
    }
  }

  function handleExpenseChange(e, id) {
    const {name} = e.target;
    try {
      setExpenses(prev => prev.map(expense => {
        if(expense.id === id) {
          return {...expense, [name]: e.target.value}
        }
        return expense
      }))
    } catch(err) {
      console.log(err)
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // if(e.target.price.value === 'salaire'){
    //   setInputValue('')
    // }
    const uniqueId = crypto.randomUUID();

    const expense = {
          date: e.target.date.value,
          name: e.target.name.value,
          qty: e.target.qty.value || 1,
          uniquePrice: e.target.uniquePrice.value,
          imputation: e.target.imputation.value,
          price:e.target.price.value === 'salaire' ?e.target.uniquePrice.value : e.target.uniquePrice.value * e.target.qty.value,
          numero:e.target.numero.value,
          id: uniqueId,
    }
    const doesNumeroExist = expenses.find((item) => +item.numero === +expense.numero) ? true : false; 
    console.log(doesNumeroExist)
    if(doesNumeroExist) {
      return alert("il y'a deja une expense avec le meme N~ de depense")
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
          const request = await fetch('/validateUser', {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include"
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
          const allExpenses = await fetch('/getExpenses', {credentials: "include"}).then(res => res.json());
          setExpenses(allExpenses);
        } catch(err) {
          console.log(err)
          console.log('couldnt get messages from db')
        }
      }
      validateUser()
      getExpensesFromDb()
      
        
    }, [Navigate])
  
  return(
    <>
    {isAuthenticated && (
    <>
   <Header />
    <div className="container">
        <div className="top-inputs">
            <h1 style={{color:'orange', marginBottom:'20px'}}>MAURITANIE 2E2D</h1>
            <h2>JOURNAL DES COMPTES</h2>
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
                    <input type="number" name="uniquePrice" id="drop-down" /> 
                </div>
                
            </div>
            <div className="second-input">
                <div className="date">
                    <p>Date: </p>
                    <input type="date" name="date" required/>
                </div>
    
                <div className="amount">
                    <p>Quantite: </p>
                   <input type="number" name="qty" onChange={(e) => setInputValue(e.target.value) } disabled={disable} value={InputValue} placeholder="1"/>
                </div>
            </div>
            <div style={{
              display: "flex"
            }} id="bottom-div">
              <div style={{display: 'flex'}}>
                <p>
                sélectionner une imputation
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
              <div id="numero-depense">
                <label htmlFor="">N° de depense</label>
                <input type="text" style={{marginLeft:'30px'}} name="numero" required/>
              </div>
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
                    <th>N° de dépense</th>
                    
                </tr>
                {expenses && expenses.sort((a, b) => Number(a.numero) - Number(b.numero) ).map((expense, index) => 
                <tr key={index}>
                  {/* <form>'</form> */}
                  {console.log(Number(expense.numero))}
                  <td>
                    {expense.isEditing ? (
                      <input type={"date"} name="date" value={expense.date} onChange={(e) => handleExpenseChange(e, expense.id)} />
                    ): <>{expense.date}</>}
                  </td>
                  <td>
                  {expense.isEditing ? (
                      <input name="name" value={expense.name || ""} type="text"  onChange={(e) => handleExpenseChange(e, expense.id)}/>
                    ): <>{expense.name}</>}
                  </td>
                  <td>
                  {expense.isEditing ? (
                      <input name="qty" type="number"  value={expense.qty || ""} onChange={(e) => handleExpenseChange(e, expense.id)}/>
                    ): <>{expense.qty}</>}
                  </td>
                  <td>
                   {expense.isEditing ? (
                      <input name="uniquePrice"  style={{
                      width:'100px'
                    }}  value={expense.uniquePrice || ''} onChange={(e) => handleExpenseChange(e, expense.id)}  type="text"/>
                    ): <>{expense.uniquePrice}</>}
                  </td>
                  <td>
                   {expense.price || expense.uniquePrice}
                  </td>
                  <td>
                   {expense.isEditing ? (
                      <input  style={{
                        width:'100px'
                      }}  name="imputation" value={expense.imputation || ""} onChange={(e) => handleExpenseChange(e, expense.id)} type="text"/>
                    ): <>{expense.imputation}</>}  
                  </td>
                  <td>
                  {expense.isEditing ? (
                      <input  style={{
                        width:'100px'
                      }}  name="numero" value={expense.numero || ""} onChange={(e) => handleExpenseChange(e, expense.id)} type="text"/>
                    ): <>{expense.numero}</>}  
                  </td>
                  <td className="remove" onClick={() => handleRemove(expense.id)}>
                  X
                  </td>
                  <td className="no-border">
                    {expense.isEditing ? (
                      <button className="edit ml-1" onClick={() => handleSubmitEdit(expense.id)}>Save</button>
                    ): (

                  <button className="edit ml-1" onClick={() => handleEditExpense(expense.id)}>Edit</button>
                    )}

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

