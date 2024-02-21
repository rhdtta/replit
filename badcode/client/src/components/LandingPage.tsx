import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

// constants 
const SLUG_WORKS = ["car", "dog", "computer", "person", "inside", "word", "for", "please", "to", "cool", "open", "source"];
const SERVICE_URL = "http://localhost:3000";

// Helper Func 
function getRandomSlug() {
    let slug = "";
    for (let i = 0; i < 3; i++) {
        slug += SLUG_WORKS[Math.floor(Math.random() * SLUG_WORKS.length)];
    }
    return slug;
}


export const LandingPage = () => {
    const [replId, setReplId] = useState(getRandomSlug())
    const [language, setLanguage] = useState('node')
    const navigate = useNavigate();
    return (
        <div>
            Landing Page
            
            Project Name
            <input className="replId" type="text" value={replId} placeholder="Repl Id" onChange={(e) => setReplId(e.target.value)}/>

            <br/>

            Language
            <select defaultValue={language} className="language" onChange={(e) => setLanguage(e.target.value)}>
                <option value="node">Node</option>
                <option value="python">Python</option>
            </select>

            <br/>
            <button onClick={async () => {
                await axios.post(`${SERVICE_URL}/projects`, {replId, language});
                navigate(`coding/?replId=${replId}`)
            }
            }>Submit</button>
        </div>
    )
}