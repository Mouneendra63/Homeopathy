import express from 'express';
import User from './schemas/user.js';
import Review from './schemas/review.js';
import cors from 'cors';
import { userValid } from './validators/user.js';
import  cookieParser  from 'cookie-parser';
import {reviewValid} from './validators/review.js'

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

  app.post('/api/review', async (req, res) => {
    try {
      const { name, email, rating, comment } = req.body;
  
      const valid = reviewValid.safeParse(req.body);
      if (!valid.success) {
        // If validation fails, return the errors
        return res.status(400).json({ error: valid.error.errors });
      }
  
      // Proceed with creating the review if validation is successful
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

        const valid = reviewValid.safeParse(req.body);
        if (!valid.success) {

  
            const result = await Review.create({
                name,
                email,
                rating,
                comment,
            });
        }
        else{
            return res.status(400).json({ error: valid.error.errors });
        }
      res.status(201).json({ success: true, message: 'Review created', data: result });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
      const result = await Review.find({ rating: { $gt: 3 } }) // Filter reviews with rating > 3
        .sort({ createdAt: -1 }); // Sort by most recently added (createdAt is assumed to be present)
      
      return res.status(200).json({
        success: true,
        message: 'Reviews fetched successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
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

app.delete('/api/userDetails/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await User.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

