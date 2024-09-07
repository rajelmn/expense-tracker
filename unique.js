const chars = 'abcdefghijklmnopqrstuvwynjxz';
const nums = '123456789';
const specialChar = '!#@~$%^&*()_-[]{}\|"/?>.<,';

export function generateId() {
    const arr = [...chars.split(''), ...nums.split(''), ...specialChar.split('')];
    console.log(arr)
    shuffleArray(arr);
    return arr.slice(0 , 16).join('')
}

function shuffleArray(arr) {
    return arr.sort( () => Math.random() - 0.5)
}

// console.log(shuffleArray([1, 3, 4, 9 , 1 , 66 , 93 , -23]))
console.log(generateId())