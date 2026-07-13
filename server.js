require("dotenv").config();
const app = require("./server/index");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Coffer server running on port ${PORT}`);
});