import React, { useEffect, useState } from 'react'
import Autocomplete from 'react-google-autocomplete'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";

import { createChatInstance } from '@/config/AIModel'
import { selectBudgetList, selectTravelsList, USER_PROMPT } from '@/constants/options'
import { Loader2Icon } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useNavigate } from 'react-router'

const CreateTrip = () => {
    const [place, setPlace] = useState()
    const [formData, setFormData] = useState({
        budget: "",
        location: null,
        noOfDays: 0,
        traveller: ""
    });
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const navigate=useNavigate();

    const handleInputChange=(name,value)=>{
        setFormData({
            ...formData,
            [name]:value
        })
    }

    // useEffect(() => {
    //     console.log(formData);
    // }, [formData])

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
    
    const login=useGoogleLogin({
        onSuccess:(response)=>getUserProfile(response),
        onError:(error)=>console.log(error),
    })

    const onGenerateTrip = async ()=>{
        const user=localStorage.getItem('user')
        // console.log(user);
        if(!user){
            // console.log('unable to find the user');
            setOpenDialog(true)
            return;
        }

        if(!formData.location || !formData.noOfDays || !formData.budget || !formData.traveller){
            toast.error("Fill all the fields")
            return;
        }
        if(formData?.noOfDays>5){
            toast.error("Trip should be less than 5 days")
            return;
        }

        setLoading(true)

        const FINAL_PROMPT = USER_PROMPT
        .replace(/{location}/g, formData.location.formatted_address)
        .replace(/{noOfDays}/g, formData.noOfDays)
        .replace(/{budget}/g, formData.budget)
        .replace(/{traveller}/g, formData.traveller);

        console.log(formData);
        try {
            const chat = await createChatInstance();
            const result = await chat.sendMessage({
                message:FINAL_PROMPT,
            });

            const response = await result.text;

            // console.log("AI Response:", response);
            // toast.success("Trip generated successfully!");
            
            let parsedTripPlan;
            try {
                parsedTripPlan = JSON.parse(response);
                await saveToDatabase(parsedTripPlan)
                // setTripData(parsedTripPlan); // Store the parsed data
                toast.success("Trip generated successfully!");
                console.log("Parsed Trip Plan:", parsedTripPlan);
            } catch (error) {
                console.error("Error parsing JSON response:", error);
                toast.error("Failed to parse trip plan from AI. Please try again.");
            }
        } catch (error) {
            console.error("Error generating trip:", error);
            toast.error("Failed to generate trip.");
        } finally {
            setLoading(false)
        }
    }

    const saveToDatabase = async (TripData) =>{
        const user = JSON.parse(localStorage.getItem('user'))
        const docID= Date.now().toString()

        const normalizedFormData = normalizeFormData(formData);

        try {
            await setDoc(doc(db, "AITrips", docID), {
                userSelection: normalizedFormData,
                tripData: TripData,
                userEmail: user?.email,
                id: docID,
            });
            toast.success("Trip saved to database!");
            navigate('/view-trip/'+docID)
        } catch (error) {
            console.error("Error saving to Firestore:", error);
            toast.error("Error saving trip. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const getUserProfile = async (tokenInfo)=>{
        try {
            const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
            {
                headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'application/json',
                },
            }
            );
            // console.log(res.data);
            localStorage.setItem('user', JSON.stringify(res.data))
            setOpenDialog(false)
            onGenerateTrip();
        } catch (error) {
            console.error('Error in getUserProfile:', error);
        }
    }

    return (
        <div className='mt-6 flex flex-col gap-4 mx-auto max-w-7xl'>
            <div className='flex flex-col max-w-3xl'>
                <h2 className='text-3xl font-bold my-2'>Tell us your travel preference</h2>
                <p className='text-slate-700'>Provide with basic information</p>
            </div>  

            <div className='flex flex-col max-w-3xl'>
                <p className='font-bold py-2'>What is your destination?</p>
                <Autocomplete
                    className='border-2 border-gray-800 rounded-sm p-2'
                    apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                    onPlaceSelected={(place)=>{setPlace(place); handleInputChange('location', place)}}
                />
                {/* {
                    console.log("place selected is: ", place)
                    } */}
            </div>
            <div className='flex flex-col max-w-3xl'>
                <p className='font-bold py-2'>How many days are you planning?</p>
                <Input 
                    placeholder={'Ex.3'} 
                    type="number" 
                    className="border-2 border-gray-800 rounded-sm p-2"
                    onChange={(e)=>handleInputChange('noOfDays', e.target.value)}
                />
            </div>
            <div>
                <p className='font-bold py-2'>What is your budget?</p>
                <div className='grid grid-cols-3 gap-5'>
                    {selectBudgetList.map((item,index)=>(
                        <div 
                            key={index} 
                            className={`p-4 border-2 rounded-lg cursor-pointer shadow-lg/10 hover:shadow-xl/20 ${formData?.budget==item.title && 'bg-green-50 shadow-xl/20 border-green-900'}`}
                            onClick={()=>handleInputChange('budget',item.title)}>

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
            <div>
                <p className='font-bold py-2'>What is your budget?</p>
                <div className='grid grid-cols-4 gap-5'>
                    {selectTravelsList.map((item,index)=>(
                        <div 
                            key={index} 
                            className={`p-4 border-2 rounded-lg cursor-pointer shadow-lg/10 hover:shadow-xl/20 ${formData?.traveller==item.people && 'bg-green-50 shadow-xl/20 border-green-900'}`}
                            onClick={()=>handleInputChange('traveller',item.people)}>
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
            {loading ? <Button size="sm" disabled>
                            <Loader2Icon className="animate-spin" />
                            Please wait
                        </Button> : 
                        <Button className="mt-2" onClick={onGenerateTrip}>Generate Trip</Button>}

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <div className='flex items-center'>
                            <img
                            src="/travellogo.png"
                            alt="travel logo"
                            style={{ width: '35px', height: '35px', marginRight: '10px' }}
                            />
                            <span className='text-3xl text-gray-900'>AI Travel</span>
                        </div>

                        <DialogTitle className="text-lg font-bold mt-6">
                            Sign In With Google
                        </DialogTitle>

                        <DialogDescription>
                            Sign in securely with Google OAuth.
                        </DialogDescription>
                    </DialogHeader>

                    <Button className='w-full mt-6' onClick={login}>
                        <FcGoogle className="mr-2" /> Sign In With Google
                    </Button>
                </DialogContent>
            </Dialog>
            
        </div>

    )
}

export default CreateTrip