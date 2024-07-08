const btn = document.getElementById('btn');
const table = document.querySelector('table');
const dateInput = document.querySelector('.second-input .date input');
const amountInput = document.querySelector('.second-input .amount input');
const textInput = document.querySelector('.top-inputs .first-input input'); 
let arr = [];
let i = 2;
btn.addEventListener('click', () => {
    if(dateInput.value && amountInput.value && textInput.value) {
        let defaultValue = document.getElementById('noExpense') ;
        defaultValue ? defaultValue.style.display = 'none': '';
        let tr = document.createElement('tr');
        console.log(tr)
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let remove = document.createElement('td');
        remove.textContent = 'X'
        remove.className = 'remove'
        table.appendChild(tr).append(td1, td2 , td3, remove)
        td1.innerHTML = textInput.value;
        td2.innerHTML = dateInput.value;
        td3.innerHTML = amountInput.value;
        arr.push(remove)

        arr.forEach( e => {
            e.addEventListener('click', () => {
                e.parentElement.style.display = 'none';
            })
        } )
    }
    else {
        alert('you must full the data required')
    }
})


