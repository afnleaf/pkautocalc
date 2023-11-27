const server = Bun.serve({
    fetch(req) {
     const url = new URL(req.url);
      if (url.pathname.endsWith("/") || url.pathname.endsWith("/index.html"))
         return new Response(Bun.file(import.meta.dir + "/index.html"));
      
       // all other routes
       return new Response("Hello!");
    }
});

/*
const server = Bun.serve({
  //port: 8080, set in .env file
  hostname: "0.0.0.0",
  fetch(request) {
      //return new Response("Hello Bun!!");
      const url = new URL(request.url)
      if(url.pathname === "/")  {
          return new Response("home page")
      }
      if(url.pathname === "/blog") {
          return new Response("blog")
      }
      if(url.pathname === "/envs") {
          return new Response(`\tall env list:\n\t${objToString(Bun.env)}`)
      }
      if(url.pathname === "/results") {
          return new Response(
              `<pre>${content}</pre>`, 
              {
                  headers: {
                      "Content-Type": "text/html",
                  },
              }
          )
      }
      return new Response("404")
  },
});
*/

console.log(`listening on http://localhost:${server.port} ...`);