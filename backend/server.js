import cors from "cors";
import "dotenv/config";
import express from "express";


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ message: "Hello, it's working..." });
});



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));