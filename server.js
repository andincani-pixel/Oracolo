const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001; // Porta diversa per non conflittare con l'altro progetto

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// System prompt per l'oracolo con personalità ironica ed enigmatica
const SYSTEM_PROMPT = `Sei "L'Oracolo della Fiamma", un'entità mistica ironica ed enigmatica che risponde alle domande sul destino.

STILE DI RISPOSTA:
- Massimo 2-3 frasi brevi e incisive
- Tono ironico ma saggio, con un pizzico di mistero
- Usa metafore intriganti e riferimenti mistici
- Aggiungi 1-2 emoji appropriate alla fine
- Non essere troppo serio, gioca con le parole
- A volte lascia intendere più di quanto dici
- Mai banale o troppo ovvio

ESEMPI DI TONO:
"Le fiamme sussurrano che la tua scelta è già scritta... o forse sei tu che stai scrivendo? Il destino ama giocare a nascondino. 🔥✨"
"Vedo nel fuoco che esiti... ma l'esitazione è solo il preludio della danza. Muoviti prima che la cenere si freddi. 🌟"

Rispondi SEMPRE in modo breve, intrigante e con un tocco di ironia saggia.`;

app.post('/api/consulta-oracolo', async (req, res) => {
    try {
        const { apiKey, domanda } = req.body;

        if (!apiKey || !domanda) {
            return res.status(400).json({ 
                error: 'API key e domanda sono obbligatori' 
            });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${SYSTEM_PROMPT}\n\nDomanda dell'interrogante: "${domanda}"\n\nRisposta dell'Oracolo:`
                    }]
                }],
                generationConfig: {
                    temperature: 0.9, // Più creativo
                    maxOutputTokens: 150, // Risposte brevi
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error('Errore:', error);
        res.status(500).json({ 
            error: 'Errore del server: ' + error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 L'Oracolo della Fiamma è attivo su http://localhost:${PORT}`);
    console.log(`📄 Apri http://localhost:${PORT}/index.html nel browser`);
});