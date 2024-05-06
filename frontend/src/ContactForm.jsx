import { useState } from "react";

const ContactForm = () => {
    const [firstName, setFirstname] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()

        const date = {
            firstName,
            lastName,
            email
        }

        const url = "http://127.0.0.1:5000/create_contact"
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(date)
        }
        const response = await fetch(url, options)
        if (response.state !== 201 && response.status !== 200)
            {
                const message = await response.json()
                alert(date.message) 
            }
            else
            {
                // success
            }
    }


    return (<form onSubmit={onsubmit}>
        <div>
            <label htmlFor="firstName">First Name:</label>
            <input 
                type="text" 
                id = "firstName" 
                value={firstName} 
                onChange={(e) = setFirstname(e.target.value)}/>
        </div>
        <div>
            <label htmlFor="lastName">Last Name:</label>
            <input 
                type="text" 
                id = "lastName" 
                value={lastName} 
                onChange={(e) = setLastname(e.target.value)}/>
        </div>
        <div>
            <label htmlFor="email">Email:</label>
            <input 
                type="text" 
                id = "email" 
                value={email} 
                onChange={(e) = setEmail(e.target.value)}/>
        </div>
        <button type = "submit">Create Contact </button>
    </form>)
}

export default ContactForm