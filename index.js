const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
app.use(express.urlencoded())
const port = 3000;
// Connect to MongoDB with Mongoose
mongoose.connect('mongodb://127.0.0.1/p1', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

// Define a schema for your model
const infoSchema = new mongoose.Schema({
  // Define the fields for your model
  // For example:
  name: String,
  photo: String,
  googlescholar: String,
  orcid:String
});

// Create a model from the schema
const Info = mongoose.model('info', infoSchema);
app.use("/styles",express.static("styles"))
app.use("/images",express.static("images"))
app.use("/json",express.static("json"))

app.set('view engine', 'ejs');
app.get('/', async (req,res)=>{
    console.log("Getting home page.");
    console.log(req.params.id);
    try{
    res.sendFile(path.join(__dirname+"/home.html"));
    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
})

app.get('/teachers', async (req, res) => {
  res.json((await Info.find()).flat());
})

app.get('/about',(req,res)=>{
    console.log("Getting ABOUT page.");
    console.log(req.method);
    try{
    res.render(path.join(__dirname+"/about.ejs"));
    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
})
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("9e9ce323ae78f22d3e1ae7fcc0e8ce13531fe66b55da01c53dbcd3e1cd1d2eb0");

//app.post method to be defined

app.get('/teacher/:id', async (req, res) => {
  const teacher_id = req.params.id;
  const teacher = await Info.findById(teacher_id);

  let citations = []
  search.json({
      engine: "google_scholar_profiles",
      hl: "en",
      mauthors: teacher.name + ' SSN'
  }, ({ profiles }) => {
    console.log(profiles);
      let authorid = profiles[0]['author_id']
      search.json({
        engine: "google_scholar_author",
        hl: "en",
        author_id: authorid
      },({articles})=>{articles.forEach(result => {
        // console.log(result.title,result.link)
        var jsondata = {title:result.title,link:result.link}
        citations.push(jsondata);
        
      })
      console.log(citations)
      res.render(path.join(__dirname+"/teacher"),  {i: teacher,result:citations,source:"googlescholar"})
    });
    // console.log(citations);
  })
  
  
})
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
// const axios=require('axios');
// const cheerio = require('cheerio')
// const url = "https://www.ssn.edu.in/staff/"
// staffs=[]
// const fetchData= async ()=>
// {
//   try{
//     let res = await axios.get(url);
//     let $ = await cheerio.load(res.data);
//     $(
//       "#staff_list_a8149ae366a254a5989a > div:nth-child(1) > div > div.staff-member-overlay > div > h3"
//     ).each((i,e)=>{
//       console.log(e);
//     })
//   }
//   catch(e)
//   {
//     console.log(e);
//   }
// };
// fetchData();
