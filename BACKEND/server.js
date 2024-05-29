import app from "./app.js"
const PORT = process.env.PORT;
console.log(PORT);
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT} successfuly`);
})