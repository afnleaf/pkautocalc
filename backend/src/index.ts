import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
//import { html } from '@elysiajs/html'
import { runCalculations } from './server'

const PORT = process.env.PORT || 8080;

const app = new Elysia();

// enable cors
app.use(cors());

// send text in textbox to server
app.post("/calculation", async ({ body }) => {
    console.log(body);
    // parse out
    //const tbody = body as { body: { team1: any, team2: any }};
    try {
        //const htmlResponse = await main();
        //const htmlResponse = await runCalculations(tbody["body.team1"].toString(), tbody["body.team2"].toString());
        const { team1, team2, field } = body as { team1: string; team2: string, field: any }
        const htmlResponse = await runCalculations(team1, team2, field);
        //console.log(htmlResponse);
        return htmlResponse;
    } catch(error) {
        console.error('Error during processing:', error);
    }
});

app.get("/test", () => {
    return "test";
});

// port
app.listen(PORT, () => {
    console.log(
        `Backend is running at ${app.server?.hostname}:${app.server?.port}`
    );
});