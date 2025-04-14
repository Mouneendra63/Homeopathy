import React, { useState } from 'react';
import { ChevronRight, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import Success from '../components/success';
import Failure from '../components/failure';
function Home() {
  const [medicalConcern, setmedicalConcern] = useState([""]);
  const [name, setname] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phno, setphno] = useState("");
  const [address, setAddress] = useState("");
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [alertComponent, setAlertComponent] = useState<JSX.Element | null>(null);

  const addConcern = () => {
    setmedicalConcern([...medicalConcern, ""]);
  };

  const handleConcernChange = (index: number, value: string) => {
    const updated = [...medicalConcern];
    updated[index] = value;
    setmedicalConcern(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name,
      age,
      email,
      phno,
      address,
      medicalConcern
    };

    try {
      const response = await axios.post('http://localhost:3000/api/userDetails', formData);
      console.log('Form submitted:', response);
    
      if (response.status >= 200 && response.status < 300) {
        setAlertComponent(<Success head={"Success"} message={"Your request submitted successfully"} />);
      } else {
        setAlertComponent(<Failure head={"Error"} message={"Your request failed"} />);
      }
    
      // Clear form
      setname("");
      setAge("");
      setEmail("");
      setphno("");
      setAddress("");
      setmedicalConcern([""]);
      setSubmittedData(null);
    
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlertComponent(<Failure head={"Error"} message={"Submission failed. Please try again."} />);
    
      setTimeout(() => {
        setAlertComponent(null);
      }, 3000);
    }
  }

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Natural Healing Through
                <span className="text-teal-600"> Homeopathy</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Experience the gentle power of natural healing with our expert homeopathic treatments. 
                We focus on treating the whole person, not just the symptoms.
              </p>
              <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300 flex items-center">
                Book Consultation <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            <div className="relative max-w-md mx-auto">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-300 rounded-full opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
                alt="Doctor consulting patient"
                className="relative z-10 rounded-lg shadow-xl w-full h-auto max-w-sm mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Working Hours Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-teal-50 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-8">
              <Clock className="h-8 w-8 text-teal-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Working Hours</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-teal-600 mb-4">Weekdays</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-teal-600 mb-4">Saturday</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-teal-600 mb-4">Sunday</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-red-500">Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Care",
                description: "Treatment plans tailored to your unique health needs and constitution."
              },
              {
                title: "Natural Healing",
                description: "Using natural remedies that work with your body's healing mechanisms."
              },
              {
                title: "Holistic Approach",
                description: "Addressing both physical and emotional aspects of health."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-teal-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="py-20 bg-gradient-to-b from-white to-teal-50">
      {alertComponent && (
          <div className="fixed top-5 right-5 z-50">
            {alertComponent}
          </div>
        )}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Request Consultation</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">phno</label>
                <input
                  type="tel"
                  value={phno}
                  onChange={(e) => setphno(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical medicalConcern</label>
                {medicalConcern.map((concern, index) => (
                  <input
                    key={index}
                    type="text"
                    value={concern}
                    onChange={(e) => handleConcernChange(index, e.target.value)}
                    placeholder={`Concern ${index + 1}`}
                    className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                ))}
                <button
                  type="button"
                  onClick={addConcern}
                  className="text-teal-600 text-sm mt-2 hover:underline"
                >
                  + Add More
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300 flex items-center justify-center"
              >
                Schedule Consultation <Calendar className="ml-2 h-5 w-5" />
              </button>
            </form>

            {/* Display Submitted Data */}
            {submittedData && (
              <div className="mt-10 p-6 bg-gray-50 rounded-xl shadow-inner">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Submitted Data:</h3>
                <p><strong>Full Name:</strong> {submittedData.name}</p>
                <p><strong>Age:</strong> {submittedData.age}</p>
                <p><strong>Email:</strong> {submittedData.email}</p>
                <p><strong>phno:</strong> {submittedData.phno}</p>
                <p><strong>Address:</strong> {submittedData.address}</p>
                <p><strong>Medical medicalConcern:</strong></p>
                <ul className="list-disc ml-6 text-gray-700">
                  {submittedData.medicalConcern.map((concern: string, index: number) => (
                    <li key={index}>{concern}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;