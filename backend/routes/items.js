const router = require("express").Router();
const Item = require("../models/items");
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Configure multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const dir = 'uploads/';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

// Configure file filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
};

// Configure upload
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

//add item
// router.route("/add").post((req, res)=>{
//     const name = req.body.name;
//     const description = req.body.description;
//     const price = req.body.price;
//     const category = req.body.category;
//     const imageUrl = req.body.imageUrl;
//     const stockQuantity = req.body.stockQuantity;
//     const sellerId = req.body.sellerId;

//     const newItem = new Item({
//         name,
//         description,
//         price,
//         category,
//         imageUrl,
//         stockQuantity,
//         sellerId
//     });

//     newItem.save()
//     .then(()=>res.json("Item added!"))
//     .catch(err=>res.status(400).json("Error: "+err));
// })

router.route("/add").post(upload.single('image'), (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const category = req.body.category;
    const imageUrl = req.file.path; // Use the path of the uploaded file
    const stockQuantity = req.body.stockQuantity;
    const sellerId = req.body.sellerId;

    const newItem = new Item({
        name,
        description,
        price,
        category,
        imageUrl,
        stockQuantity,
        sellerId
    });

    newItem.save()
    .then(()=>res.json("Item added!"))
    .catch(err=>res.status(400).json("Error: "+err));
})

//get all items
router.route("/").get((req, res)=>{
    Item.find()
    .then(items=>res.json(items))
    .carch((e)=>res.status(400).json('error: '+e));
})

//get item by id
router.route("/:id").get((req, res)=>{
    Item.findById(req.params.id)
    .then(item=>res.json(item))
    .catch(err=>res.status(400).json('Error: '+err));
})

router.get('/seller/:sellerId', async (req, res) => {
    try {
      const items = await Item.find({ sellerId: req.params.sellerId });
      res.json(items);
    } catch (error) {
      res.status(400).json('Error: ' + error);
    }
  });

//update item
router.route("/update/:id").put((req, res)=>{
    Item.findById(req.params.id)
    .then(
        item=>{
            item.name = req.body.name;
            item.description = req.body.description;
            item.price = req.body.price;
            item.category = req.body.category;
            item.imageUrl = req.body.imageUrl;
            item.stockQuantity = req.body.stockQuantity;
            item.sellerId = req.body.sellerId;

            item.save()
            .then(()=>res.json("Item updated!"))
            .catch(err=>res.status(400).json('Error: '+err));
        }
    )
    .catch(err=>res.status(400).json('Error: '+err));
})

//delete item
router.route("/delete/:id").delete((req, res)=>{
    Item.findByIdAndDelete(req.params.id)
    .then(()=>res.jason("Item deleted!"))
    .catch(err=>res.status(400).json('Error: '+err));
})

//get items by seller id
router.route("/seller/:id").get((req, res)=>{
    Item.find({sellerId:req.params.id})
    .then(items=>res.json(items))
    .catch(err=>res.status(400).json('Error: '+err));
})

module.exports = router;