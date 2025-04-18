import express from 'express';
import User from './schemas/user.js';
import Review from './schemas/review.js';
import cors from 'cors';
import { userValid } from './validators/user.js';
import  cookieParser  from 'cookie-parser';

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173", // ✅ Not '*'
    credentials: true
  }));

const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
});

app.get('/api/userDetails',async(req,res)=>
{
    try {
        const result=await User.find();
        res.status(200).json(result);
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/api/userDetails/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

app.post('/api/userDetails', async (req, res) => {
    try {
        const { name,age, email, phno, address,sex, medicalConcern } = req.body;

        const medicalConcernData = medicalConcern || [];
        const valid=userValid.safeParse(req.body);
        if (!valid.success) {
            return res.status(400).json({ error: valid.error.errors });
        }
        else{
            const user = await User.create({
                name,
                age,
                email,
                phno,
                address,
                sex,
                medicalConcern: medicalConcernData
            });
    
            res.status(201).json({ message: 'User created successfully', user });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.put('/api/userDetails/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { prescription = [], newPrescription = [] } = req.body;

        const updateFields = {};
        if (prescription.length) {
            updateFields.prescription = { $each: prescription };
        }
        if (newPrescription.length) {
            updateFields.newPrescription = { $each: newPrescription };
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $push: updateFields },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


app.post('/api/review', async (req, res) => {
    try {
      const { name, email, rating, comment } = req.body;
  
      const result = await Review.create({
        name,
        email,
        rating,
        comment,
      });
  
      res.status(201).json({ success: true, message: 'Review created', data: result });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/reviews', async (req,res)=>
{
    try {
        const result=await Review.find();
        return res.status(200).json({success:true,message:'Reviews fetched successfully',data: result});
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }

});

app.put('/api/userDetail/:id/complete', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(
            id,
            { isCompleted: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User marked as completed', user });
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
        
    }
});

const ADMIN_USER = process.env.ID;
const ADMIN_PASS = process.env.password;

app.get("/adminsignin", (req, res) => {
    console.log(req.cookies);
    const token = req.cookies.admin_session;

    if (token === "secure_admin_token") {
      res.status(200).json({ data: "Secret admin stuff" });
    } else {
      res.status(401).json({ error: "Not authorized" });
    }
  });
  
  app.post("/adminlogin", (req, res) => {
    res.cookie("admin_session", "secure_admin_token", {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
  
    res.status(200).json({ success: true });
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

