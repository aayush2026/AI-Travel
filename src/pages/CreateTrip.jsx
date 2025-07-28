import React, { useEffect, useState } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";

import { createChatInstance } from '@/config/AIModel';
import { selectBudgetList, selectTravelsList, USER_PROMPT } from '@/constants/options';
import { Loader2Icon } from 'lucide-react';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router';
import { useAuth } from '@/context/AuthContext'; // ✅ Import Auth Context

const CreateTrip = () => {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({
    budget: "",
    location: null,
    noOfDays: 0,
    traveller: ""
  });
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const pendingTripData = localStorage.getItem("pendingTripData");
        // This runs when the user state changes from null to a logged-in user.
        if (user && pendingTripData) {
            toast.info("Resuming trip generation...");
            localStorage.removeItem("pendingTripData"); 
            setTimeout(() => {
                onGenerateTrip();
            }, 100);
        }
    }, [user]);

  const handleInputChange = (name, value) => {
    setFormData({
    ...formData,
    [name]: value
    });
  };

  const normalizeFormData = (formData) => {
    const location = formData.location;
    let safeLocation = location;
    if (
      location?.geometry?.location &&
      typeof location.geometry.location.lat === "function"
    ) {
      safeLocation = {
        ...location,
        geometry: {
          ...location.geometry,
          location: {
            lat: location.geometry.location.lat(),
            lng: location.geometry.location.lng(),
          },
        },
      };
    }
    return {
      ...formData,
      location: safeLocation,
    };
  };

  const loginWithFirebase = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setOpenDialog(false);
    } catch (error) {
      console.error("Firebase login error:", error);
      toast.error("Login failed. Try again.");
    }
  };

  const onGenerateTrip = async () => {
    if (!user) {
      toast.info("Please sign in to generate a trip.");
      localStorage.setItem("pendingTripData", JSON.stringify(formData));
      setOpenDialog(true);
      return;
    }

    if (!formData.location || !formData.noOfDays || !formData.budget || !formData.traveller) {
      toast.error("Fill all the fields");
      return;
    }

    if (formData?.noOfDays > 7) {
      toast.error("Trip should be less than 7 days");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = USER_PROMPT
      .replace(/{location}/g, formData.location.formatted_address)
      .replace(/{noOfDays}/g, formData.noOfDays)
      .replace(/{budget}/g, formData.budget)
      .replace(/{traveller}/g, formData.traveller);

    try {
      const chat = await createChatInstance();
      const result = await chat.sendMessage({ message: FINAL_PROMPT });

      const response = await result.text;
      let parsedTripPlan;

      try {
        parsedTripPlan = JSON.parse(response);
        await saveToDatabase(parsedTripPlan, user);
        toast.success("Trip generated successfully!");
      } catch (error) {
        console.error("Error parsing AI response:", error);
        toast.error("Invalid trip format. Try again.");
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip.");
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async (TripData, user) => {
    const docID = Date.now().toString();
    const normalizedFormData = normalizeFormData(formData);

    try {
      await setDoc(doc(db, "AITrips", docID), {
        userSelection: normalizedFormData,
        tripData: TripData,
        userEmail: user?.email,
        userId: user?.uid,
        id: docID,
      });

      navigate('/view-trip/' + docID);
    } catch (error) {
      console.error("Firestore error:", error);
      toast.error("Failed to save trip.");
    }
  };

  return (
    <div className='mt-6 flex flex-col gap-4 px-4 mx-auto max-w-7xl'>
      <div className='flex flex-col w-full'>
        <h2 className='text-3xl font-bold my-2'>Tell us your travel preference</h2>
        <p className='text-slate-700'>Provide basic information</p>
      </div>

      {/* Location Input */}
      <div className='flex flex-col max-w-3xl w-full'>
        <p className='font-bold py-2'>What is your destination?</p>
        <Autocomplete
          className='border-2 border-gray-800 rounded-sm p-2'
          apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
          onPlaceSelected={(place) => {
            setPlace(place);
            handleInputChange('location', place);
          }}
        />
      </div>

      {/* Days Input */}
      <div className='flex flex-col max-w-3xl w-full'>
        <p className='font-bold py-2'>How many days are you planning?</p>
        <Input
          placeholder='Ex. 3'
          type='number'
          className='border-2 border-gray-800 rounded-sm p-2'
          onChange={(e) => handleInputChange('noOfDays', e.target.value)}
        />
      </div>

      {/* Budget Options */}
      <div className='w-full'>
        <p className='font-bold py-2'>What is your budget?</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {selectBudgetList.map((item, index) => (
            <div
              key={item.title}
              className={`p-4 border-2 rounded-lg cursor-pointer shadow-lg/10 hover:shadow-xl/20 ${formData?.budget === item.title && 'bg-green-50 shadow-xl/20 border-green-900'}`}
              onClick={() => handleInputChange('budget', item.title)}
            >
              <div className='flex items-center justify-between'>
                <p className='text-4xl'>{item.icon}</p>
                <p className='text-sm font-bold text-slate-700'>{item.budgetRange}</p>
              </div>
              <p className='font-bold text-xl'>{item.title}</p>
              <p className='text-sm text-slate-700'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Traveller Options */}
      <div className='w-full'>
        <p className='font-bold py-2'>Who are you travelling with?</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {selectTravelsList.map((item, index) => (
            <div
              key={item.people}
              className={`p-4 border-2 rounded-lg cursor-pointer shadow-lg/10 hover:shadow-xl/20 ${formData?.traveller === item.people && 'bg-green-50 shadow-xl/20 border-green-900'}`}
              onClick={() => handleInputChange('traveller', item.people)}
            >
              <div className='flex items-center justify-between'>
                <p className='text-4xl'>{item.icon}</p>
                <p className='text-sm font-bold text-slate-700'>{item.people}</p>
              </div>
              <p className='font-bold text-xl'>{item.title}</p>
              <p className='text-sm text-slate-700'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className='w-full'>
        {loading ? (
          <Button size="sm" disabled>
            <Loader2Icon className="animate-spin mr-2" />
            Please wait
          </Button>
        ) : (
          <Button className="mt-2 w-full" onClick={onGenerateTrip}>
            Generate Trip
          </Button>
        )}
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <div className='flex items-center'>
              <img src="/travellogo.png" alt="travel logo" style={{ width: '35px', height: '35px', marginRight: '10px' }} />
              <span className='text-3xl text-gray-900'>AI Travel</span>
            </div>
            <DialogTitle className="text-lg font-bold mt-6">Sign In With Google</DialogTitle>
            <DialogDescription>Sign in securely with Firebase Google Auth.</DialogDescription>
          </DialogHeader>

          <Button className='w-full mt-6' onClick={loginWithFirebase}>
            <FcGoogle className="mr-2" /> Sign In With Google
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;
