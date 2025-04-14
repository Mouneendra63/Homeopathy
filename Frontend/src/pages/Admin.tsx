import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Edit, Eye, X, CheckCircle, Users, Clipboard, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';

// Type definitions
interface MonthlyData {
  name: string;
  patients: number;
  goodReviews: number;
  badReviews: number;
}

interface Prescription {
  tablets: string;
  dosage: string;
  duration: string;
  _id: string;
  date: string;
}

interface Patient {
  _id: string;
  name: string;
  email: string;
  phno: string;
  age: string;
  address: string;
  medicalConcern: string[];
  isCompleted: boolean;
  prescription: Prescription[];
  newPrescription: Prescription[];
  createdAt: string;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}

// Sample data
const monthlyData: MonthlyData[] = [
  { name: 'Jan', patients: 65, goodReviews: 48, badReviews: 12 },
  { name: 'Feb', patients: 75, goodReviews: 52, badReviews: 8 },
  { name: 'Mar', patients: 90, goodReviews: 65, badReviews: 10 },
];

const samplePatients: Patient[] = [
  {
    _id: "67fbf443447b90e23974d16f",
    name: "Emma Johnson",
    email: "emma.j@example.com",
    phno: "9988776655",
    age: "35",
    address: "221B Baker Street",
    medicalConcern: ["Thyroid", "Migraines"],
    isCompleted: false,
    prescription: [
      {
        tablets: "Amoxicillin",
        dosage: "500mg",
        duration: "7 days",
        _id: "67fbf6fc0b1ac99377597c94",
        date: "2025-04-13T17:40:12.461Z"
      }
    ],
    newPrescription: [
      {
        tablets: "Paracetamol",
        dosage: "650mg",
        duration: "3 days",
        _id: "67fbf6fc0b1ac99377597c92",
        date: "2025-04-13T17:40:12.460Z"
      }
    ],
    createdAt: "2025-04-13T17:28:35.751Z"
  },
  {
    _id: "67fbf443447b90e23974d170",
    name: "John Smith",
    email: "john.s@example.com",
    phno: "8877665544",
    age: "42",
    address: "42 Park Avenue",
    medicalConcern: ["Hypertension", "Diabetes"],
    isCompleted: true,
    prescription: [
      {
        tablets: "Metformin",
        dosage: "1000mg",
        duration: "30 days",
        _id: "67fbf6fc0b1ac99377597c96",
        date: "2025-04-10T14:22:12.461Z"
      }
    ],
    newPrescription: [],
    createdAt: "2025-04-10T10:15:35.751Z"
  },
  {
    _id: "67fbf443447b90e23974d171",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phno: "7766554433",
    age: "28",
    address: "789 Oak Street",
    medicalConcern: ["Asthma", "Allergies"],
    isCompleted: false,
    prescription: [],
    newPrescription: [],
    createdAt: "2025-04-12T09:45:22.751Z"
  },
  {
    _id: "67fbf443447b90e23974d172",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phno: "6655443322",
    age: "55",
    address: "567 Pine Street",
    medicalConcern: ["Arthritis", "High Cholesterol"],
    isCompleted: true,
    prescription: [
      {
        tablets: "Atorvastatin",
        dosage: "20mg",
        duration: "30 days",
        _id: "67fbf6fc0b1ac99377597c97",
        date: "2025-04-08T11:30:12.461Z"
      }
    ],
    newPrescription: [],
    createdAt: "2025-04-08T09:20:15.751Z"
  }
];

// Main Dashboard Component
function Admin(): JSX.Element {
    const [data,setAllData]=useState([]);
  const [patients, setPatients] = useState<Patient[]>(samplePatients);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(samplePatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showPatientModal, setShowPatientModal] = useState<boolean>(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<boolean>(false);
  const [newPrescription, setNewPrescription] = useState<Omit<Prescription, '_id' | 'date'>>({
    tablets: '',
    dosage: '',
    duration: ''
  });
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending'>('all');
  useEffect(() => {
    const fetchPatients = async () => {
        try {
            const response = await fetch('http://localhost:3000/patients');
            const data = await response.json();
            setAllData(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };
    fetchPatients();
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phno.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // Filter patients based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredPatients(
        patients.filter(patient => 
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phno.includes(searchTerm)
        )
      );
    } else if (activeTab === 'completed') {
      setFilteredPatients(
        patients.filter(patient => 
          patient.isCompleted && (
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phno.includes(searchTerm)
          )
        )
      );
    } else if (activeTab === 'pending') {
      setFilteredPatients(
        patients.filter(patient => 
          !patient.isCompleted && (
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phno.includes(searchTerm)
          )
        )
      );
    }
  }, [activeTab, searchTerm, patients]);

  // Mark patient as completed
  const markAsComplete = (id: string): void => {
    const updatedPatients = patients.map(patient => 
      patient._id === id ? {...patient, isCompleted: true} : patient
    );
    setPatients(updatedPatients);
    setShowPatientModal(false);
  };

  // Handle new prescription submission
  const handlePrescriptionSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (!newPrescription.tablets || !newPrescription.dosage || !newPrescription.duration) {
      alert('Please fill all fields');
      return;
    }
    
    const updatedPatients = patients.map(patient => {
      if (patient._id === selectedPatient?._id) {
        return {
          ...patient,
          newPrescription: [
            ...patient.newPrescription,
            {
              ...newPrescription,
              _id: Date.now().toString(),
              date: new Date().toISOString()
            }
          ]
        };
      }
      return patient;
    });
    
    setPatients(updatedPatients);
    setNewPrescription({ tablets: '', dosage: '', duration: '' });
    setShowPrescriptionModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Medical Admin Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard title="Total Patients" value={patients.length} icon={<Users className="h-8 w-8 text-blue-500" />} bgColor="bg-blue-100" />
          <StatsCard title="Completed Checkups" value={patients.filter(p => p.isCompleted).length} icon={<CheckCircle className="h-8 w-8 text-green-500" />} bgColor="bg-green-100" />
          <StatsCard title="Good Reviews" value={monthlyData.reduce((acc, curr) => acc + curr.goodReviews, 0)} icon={<ThumbsUp className="h-8 w-8 text-indigo-500" />} bgColor="bg-indigo-100" />
          <StatsCard title="Bad Reviews" value={monthlyData.reduce((acc, curr) => acc + curr.badReviews, 0)} icon={<ThumbsDown className="h-8 w-8 text-red-500" />} bgColor="bg-red-100" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Monthly Patient Growth</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="patients" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Reviews Comparison</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="goodReviews" fill="#4ADE80" name="Good Reviews" />
                  <Bar dataKey="badReviews" fill="#F87171" name="Bad Reviews" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Patients Tab and Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <button 
                onClick={() => setActiveTab('all')} 
                className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              >
                All Patients
              </button>
              <button 
                onClick={() => setActiveTab('pending')} 
                className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              >
                Pending Checkups
              </button>
              <button 
                onClick={() => setActiveTab('completed')} 
                className={`px-4 py-2 font-medium ${activeTab === 'completed' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              >
                Completed Checkups
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Patients Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Concerns</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">Age: {patient.age}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.email}</div>
                        <div className="text-sm text-gray-500">{patient.phno}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {patient.medicalConcern.map((concern, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {concern}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patient.isCompleted ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowPatientModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold">Patient Details</h2>
              <button onClick={() => setShowPatientModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedPatient.name}</p>
                    <p><span className="font-medium">Age:</span> {selectedPatient.age}</p>
                    <p><span className="font-medium">Email:</span> {selectedPatient.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedPatient.phno}</p>
                    <p><span className="font-medium">Address:</span> {selectedPatient.address}</p>
                    <p><span className="font-medium">Registered:</span> {new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Medical Concerns:</span></p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medicalConcern.map((concern, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                          {concern}
                        </span>
                      ))}
                    </div>
                    <p><span className="font-medium">Status:</span> {selectedPatient.isCompleted ? 'Completed' : 'Pending'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Prescription History</h3>
                  <button 
                    onClick={() => {
                      setShowPrescriptionModal(true);
                      setShowPatientModal(false);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" /> New Prescription
                  </button>
                </div>
                
                {selectedPatient.prescription.length === 0 && selectedPatient.newPrescription.length === 0 ? (
                  <p className="text-gray-500">No prescriptions found</p>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[...selectedPatient.prescription, ...selectedPatient.newPrescription].map((prescription, index) => (
                          <tr key={prescription._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(prescription.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {prescription.tablets}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {prescription.dosage}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {prescription.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index < selectedPatient.prescription.length ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Previous</span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">New</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4 flex justify-end space-x-3">
                {!selectedPatient.isCompleted && (
                  <button
                    onClick={() => markAsComplete(selectedPatient._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark as Complete
                  </button>
                )}
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Prescription Modal */}
      {showPrescriptionModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold">New Prescription</h2>
              <button 
                onClick={() => {
                  setShowPrescriptionModal(false);
                  setShowPatientModal(true);
                }} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handlePrescriptionSubmit} className="p-6">
              <div className="mb-6">
                <p className="text-lg font-medium mb-2">Patient: {selectedPatient.name}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPatient.medicalConcern.map((concern, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={newPrescription.tablets}
                  onChange={(e) => setNewPrescription({...newPrescription, tablets: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={newPrescription.dosage}
                  onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={newPrescription.duration}
                  onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPrescriptionModal(false);
                    setShowPatientModal(true);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, bgColor }: StatsCardProps): JSX.Element {
  return (
    <div className={`${bgColor} rounded-lg shadow-sm p-6`}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default Admin;