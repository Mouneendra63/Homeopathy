import React, { useState } from 'react';
import { Award, Users, Clock, Star } from 'lucide-react';

// ✅ Define the interface outside the component
interface FormData {
  name: string;
  email: string;
  message: string;
  rating: number;
}

function About() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    rating: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (rate: number): void => {
    setFormData({ ...formData, rating: rate });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setFormData({ name: '', email: '', message: '', rating: 0 });
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white">
      {/* Contact Form Section with Star Rating */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-teal-50 p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-gray-700 mb-1">Rate Your Experience</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => handleRating(star)}
                      className={`w-6 h-6 cursor-pointer ${
                        formData.rating >= star ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                      fill={formData.rating >= star ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;