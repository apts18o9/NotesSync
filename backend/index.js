//all define here
require ("dotenv").config()

//connecting mongoose

const config = require("./config.json");
const mongoose = require("mongoose");
const User = require("./models/user.models")
const Note = require("./models/note.model")
mongoose.connect(config.connectionString)

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities")

const express = require('express');
const cors = require('cors');
const noteModel = require("./models/note.model");
const app = express();


app.use(express.json());

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.json({data: "hello"});
});



//creating account of user (api)
app.post("/create-account", async (req, res) => {
    const {fullName, email, password} = req.body;

    //checking if any entry is null

    if(!fullName){
        return res.status(400)
        .json({error: true, message: "full name is required"});
    }

    if(!email){
        return res.status(400)
        .json({error: true, message: "email is required"});
    }

    if(!password){
        return res.status(400)
        .json({error: true, message: "password is required"});
    }


    const isUser = await User.findOne({email: email, unique: true});

    if(isUser){
        return res.status(400)
        .json({error: true, message: "user already exists"});
    }

    const user = new User({
        fullName,
        email,
        password
    })

    await user.save();

    //creating access token for the new user
    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m"
    })

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration successful",
    });
});


//creating login api
app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if(!email){
        return res.status(400)
        .json({error: true, message: "email is required"});
    }

    if(!password){
        return res.status(400)
        .json({error: true, message: "password is required"})
    }

    const userInfo = await User.findOne({email: email});

    if(!userInfo){
        return res.status(400)
        .json({error: true, message: "user not found"});
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m"
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email, 
            accessToken,
        });

    }else{
        return res.status(400)
        .json({error: true, message: "invalid credentialss"});
    }
})


//adding notes api 
app.post("/add-note", authenticateToken, async (req, res) =>{
    const {title, content, tags} = req.body;
    const { user }  = req.user;

    if(!title){
        return res.status(400)
        .json({error: true, message: "Title is Required"});
    }


    if(!content){
        return res.status(400)
        .json({error: true, message: "Content is Required"});
    }


    try{
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id
        })

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added Successfully",
        })
    }catch(error){
        console.log("error", error);
        return res.status(500)
        .json({error: true, message: "Internal Server Error"});
    }


})


//editing notes api
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {title, content, tags, isPinned} = req.body;
    const user = req.user;


    if(!title && !content && !tags){
        return res.status(400)
        .json({error: true, message: "no changes provided"});
    }

    try{    
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note){
            return res.status(400)
            .json({error: true, message: "note not found"});
        }

        if(title){
            note.title = title;
        }
        if(content){
            note.content = content;
        }
        if(tags){
            note.tags = tags;
        }
        if(isPinned){
            note.isPinned = isPinned;
        }

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated Successfully",
        });
    }catch(err){
        console.log("error", err);
        return res.status(500)
        .json({error: true, message: "Internal Server Error"})
    }
})


//fetch all notes api
app.get("/get-notes/", authenticateToken, async (req, res) => {
    const user = req.user

    try{
        const notes = await Note.find({userId: user._id}).sort({isPinned: -1});
        // console.log("fetching notes for userid", user)
        console.log("notes", notes);
        
        return res.json({
            error: false,
            notes,
            message: "Notes fetched successfully",
        });
    }catch(err){
        return res.status(500)
        .json({error: true, message: "Internal Server Error"});
    }
})

//delete note api
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user;

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});
        if(!note){
            return res.status(400)
            .json({error: true, message: "note not found"});
        }

        await Note.deleteOne({_id: noteId, userId: user._id});
        return res.json({
            error: false,
            message: "note deleted successfully",
        })
    }
    catch(err){
        return res.status(500)
        .json({error: true, message: "Internal Server Error"});
    }
})


//update isPinned value api
app.put("/update-note-pin/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const user = req.user;  


    // if(!isPinned){
    //     return res.status(400)
    //     .json({error: true, message: "no changes provided"});
    // }

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});
        if(!note){
            return res.status(400)
            .json({error: true, message: "note not found"});
        }

        if(isPinned){
            note.isPinned = isPinned || false;
        }

        await note.save();

        return res.json({
            error: false,
            note,
            message: "note pinned successfully"
        })
    }catch(err){
        // console.log("error", err);
        return res.status(500)
        .json({error: true, message: "internal server error"});
    }
})

//getting user details 
app.get("/get-user", authenticateToken, async (req, res) => {
    try{
        const user = req.user.user;
        const isUser = await User.findOne({_id: user._id});

        if(!isUser){
            return res.sendStatus(401);
        
        }
        // console.log("isUser", isUser);

        return res.json({
            user: isUser,
            message: "fetched",
        })
    }catch(err){
        return res.status(500)
        .json({error: true, message: "Internal Server Error"});
    }
    
});


//to delete every note
app.delete("/delete-all-notes", authenticateToken, async (req, res) => {
    // If your JWT payload is { user: { _id: ... } }
    const userId = req.user.user ? req.user.user._id : req.user._id;

    try {
        const result = await Note.deleteMany({ userId: userId });
        // console.log("deleteing notes", userId);
        
        return res.json({
            error: false,
            message: `${result.deletedCount} notes deleted successfully`,
        });
    } catch (err) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

//to search note via tag
app.get("/search-notes", authenticateToken, async (req, res)=> {
     const userId = req.user.user ? req.user.user._id : req.user._id;
     const query = req.query.q;
    //  console.log("req.query:", req.query);
    //  console.log("Query value before check:", query, "| Length:", query.length);


     if(!query){
        return res.status(400).json({error: true, message: "Search query is requird"});
     }

     try{
        const matchingNotes = await Note.find({
            userId: userId._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: {$regex: new RegExp(query, "i" ) } }, 
            ],
        }
        )
        // console.log("macthing notes", matchingNotes);
        

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching search query retrieved successfully"
        })

     }catch(error){
        console.log("notes e");
        
        return res.status(500).json({error: true, message: "Internal Server Error"})
     }
})


// app.delete("/delete-all-notes", authenticateToken, async (res, req) => {
//     const userId = req.user;

//     try{
//         const result = await Note.deleteMany({userId: userId});

//         return res.json({
//             error: false,
//             message: `${result.deletedCount} notes deleted`,
//         })
//     }catch(err){
//         return res.status(500).json({error: true, message: "inter"})
//     }
// })
app.listen(8000);

module.exports = app;
