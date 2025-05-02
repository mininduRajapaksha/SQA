const router = require("express").Router();
const Item = require("../models/items");

//add item
router.route("/add").post((req, res)=>{
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const category = req.body.category;
    const imageUrl = req.body.imageUrl;
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
