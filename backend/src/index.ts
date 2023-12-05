import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
//import { html } from '@elysiajs/html'
import { main, runCalculations } from './server.js'

const PORT = process.env.PORT || 8080;

const app = new Elysia();

// enable cors
app.use(cors())
// get results of calculation
app.get("/results", async () => {
    try {
        const htmlResponse = await main("https://pokepast.es/2c7b8e8730f3c772", "https://pokepast.es/2022cd4afb1928d9");
        return htmlResponse;
    } catch(error) {
        console.error('Error during processing:', error);
    }
})

// get results of calculation
/*
app.get("/calculation", async () => {
    try {
        const htmlResponse = await main("https://pokepast.es/2c7b8e8730f3c772", "https://pokepast.es/2022cd4afb1928d9");
        return htmlResponse;
    } catch(error) {
        console.error('Error during processing:', error);
    }
})
*/

// send text in textbox to server
app.post("/calculation", async ({body}) => {
    console.log(body);
    // parse out
    const tbody = body as { team1: any, team2: any };
    try {
        //const htmlResponse = await main();
        const htmlResponse = await runCalculations(tbody["team1"], tbody["team2"]);
        //console.log(htmlResponse);
        return htmlResponse;
    } catch(error) {
        console.error('Error during processing:', error);
    }
});

/*
app.post("/calculation", ({ body }) => {
    try {
      // Assert type of body
      const typedBody = body;
      console.log(typedBody);
  
      // Perform calculations or other processing
      const htmlResponse = calculate(typedBody.team1, typedBody.team2);
  
      // Send the HTML response
      res.status(200).send(htmlResponse);
    } catch (error) {
      console.error('Error during processing:', error);
      res.status(500).send('Internal Server Error');
    }
});
*/


// port
app.listen(PORT, () => {
    console.log(
        `Backend is running at ${app.server?.hostname}:${app.server?.port}`
    );
});




