import {useState, useEffect} from 'react'
import { redirect, useNavigate } from "react-router-dom";

export function Form() {
    const Navigate = useNavigate()
    async function handleSubmit(e){
        e.preventDefault();
        try {
            const request = await fetch('/api/login', {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify({user: e.target.name.value, password: e.target.password.value}),
                headers: {
                    "Content-Type": "application/json"
                }
            } )
    
            if(request.ok) {
                const res = await request.json();
                // document.cookie = `id=${res.id}` 
                Navigate('/')
            }
            else {
                throw new Error('failed to login')
            }
        } catch(err) {
            alert('failed to login try after a while');
            console.error(err)
        }
    }
    return(
        <div className="form-container">
        <form className="my-form" onSubmit={handleSubmit}>
            <h3 style={{
                textAlign: 'center',
                fontWeight: "500",
                fontFamily: "fantasy",
                color: 'green'
            }}>login page</h3>
            <div style={{
                margin:'20px',
                marginBottom: "0px",
                display: 'flex',
                flexDirection: 'column',
            }}>
            <label htmlFor="user">user</label>
            <input type="text" name='name' id="user"/>
            </div>
            <div style={{
                margin:'20px',
                marginBottom: "0px",
                display: 'flex',
                flexDirection: 'column',
            }}>
            <label htmlFor="pass">password</label>
            <input type="password" name="password"  id="pass"/>
            </div>
            <button type="submit" id="login">login</button>
        </form>
        </div>
    )
}