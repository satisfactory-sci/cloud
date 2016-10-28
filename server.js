const express = require('express');
const port = process.env.PORT | 3000;
const app = express()
.get('/', (req, res) => {
	res.json({status:"up"});
})
.listen(process.env.PORT | 3000, () => console.log('Running on ' + port));
