import { generateId } from "./unique.js";
const btn = document.getElementById('btn');
const table = document.querySelector('table');
const dateInput = document.querySelector('.second-input .date input');
const amountInput = document.querySelector('.second-input .amount input');
const textInput = document.querySelector('.top-inputs .first-input input'); 
const selectOptions = document.getElementById('select');
const dropDownInput = document.getElementById('drop-down');
const defaultValue = document.getElementById('noExpense') ;
let total = document.getElementById('total');

// function that will be used when deleting

function handleDelete(remove, id) {
    remove.addEventListener('click', () => {
        let sum = 0;
        remove.parentElement.style.display = 'none';
        const test = JSON.parse(localStorage.getItem('items'));
        const filteredItems = test.filter((item) => item.id !== id);

        for(let item of filteredItems) {
            sum += (+item.price || +item.salary || +item.other)
        }

        
        localStorage.setItem('items', JSON.stringify(filteredItems));
        localStorage.setItem('total', sum)
        total.textContent = `Total = ${localStorage.getItem('total')} MRU`
       })
}

btn.addEventListener('click', () => {
    let sum = 0; 
    const uniqueId = Math.random();
    if(dateInput.value && amountInput.value && textInput.value ) {
        defaultValue ? defaultValue.style.display = 'none': '';
        let tr = document.createElement('tr');
        console.log(tr)
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        const id = generateId();
        const remove = document.createElement('td');
        remove.textContent = 'X';
        remove.className = 'remove';


        switch(selectOptions.value) {
            case 'prix':
             td4.innerHTML = dropDownInput.value
             break
            case 'autre': 
            td6.innerHTML = dropDownInput.value;
            break
            case 'salaire': 
            td5.innerHTML = dropDownInput.value
        }
        
        handleDelete(remove, id, sum);
        table.appendChild(tr).append(td2, td1 , td3, td4, td5, td6, remove)
        td1.innerHTML = textInput.value;
        td2.innerHTML = dateInput.value;
        td3.innerHTML = amountInput.value;
        console.log(selectOptions.value)
        const expenseArr = [];
        expenseArr.push({
            name: td1.textContent,
            purchaseDate: td2.textContent,
            qty: td3.textContent,
            price: td4.textContent,
            salary: td5.textContent,
            other: td6.textContent,
            remove: remove.textContent,
            id,
        })
        
        if(localStorage.length) {
            localStorage.setItem('items', JSON.stringify([...JSON.parse(localStorage.getItem('items')), ...expenseArr]));
            console.log(localStorage.getItem('items'))
        } else {
            localStorage.setItem(`items`,JSON.stringify(expenseArr) )
        }
        
        const expense = expenseArr[0];
        sum += (+expense.price || +expense.salary || +expense.other ) 
        if(localStorage.getItem('total')) {
            sum += Number(localStorage.getItem('total'))
            total.textContent = `Total = ${sum} MRU`;
            localStorage.setItem('total', sum);
            return
        }

  
        total.textContent = `total = ${sum} MRU`
        localStorage.setItem('total', sum);
        
    }
    else {
        alert('il faut fullfiler les ligne ')
    }
})


window.addEventListener('load', () => {
    if(!localStorage.length) return;

    defaultValue.style.display = 'none';
    const expenses = JSON.parse(localStorage.getItem('items'));
    // console.log(expenses)
    for(let item of expenses) {
        let tr = document.createElement('tr');
        let name = document.createElement('td')
        let qty = document.createElement('td')
        let purchaseDate = document.createElement('td')
        let price = document.createElement('td')
        let salary = document.createElement('td')
        let other = document.createElement('td');
        let remove = document.createElement('td');
        let id = item.id;
        name.textContent = item.name;
        qty.textContent = item.qty;
        purchaseDate.textContent = item.purchaseDate;
        price.textContent = item.price;
        salary.textContent = item.salary;
        other.textContent = item.other;
        remove.textContent = item.remove;
        remove.className = 'remove';
        handleDelete(remove, id);
        table.appendChild(tr).append(purchaseDate, name, qty, price, salary, other, remove)
    }
    total.textContent = `total = ${localStorage.getItem('total')} MRU`
})