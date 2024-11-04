import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/relatedDoctors";


const Appointment = () => {

  const { docId } = useParams();
  const { doctors, currenySymbol } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  

  const [ docInfo, setDocInfo ] = useState(null);
  const [ doctorSlot, setDoctorSlot ] = useState([]);
  const [ slotIndex, setSlotIndex ] = useState(0);
  const [ slotTime, setSlotTime ] = useState('');



  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo);
        
  }

  const getAvailableSlot = async () => {
    setDoctorSlot([]);


    //  Getting Current Data
    const today = new Date();

    for (let i = 0 ; i < 7; i++) {
      // Getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate()+i)

      // Setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)

      endTime.setHours(21,0,0,0);

        // Setting Hoirs
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      }  else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
    

    let timeSlots = [];
      
    while(currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})

      // Add slot to Array
      timeSlots.push({
        datetime: new Date(currentDate),
        time: formattedTime
      })

      // Increment Current Time by 30 minutes
      currentDate.setMinutes(currentDate.getMinutes() + 30)
    }  

    setDoctorSlot(prev => ([...prev, timeSlots]))
  }


  }








  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId])
  
  useEffect(() => {
    getAvailableSlot();
  }, [docInfo])

  useEffect(() => {
    console.log(doctorSlot);
    
  }, [doctorSlot])



  return docInfo && (
    <div>
        {/* -------- Doctor Details --------- */}
        <div className="flex flex-xol sm:flex-row gap-4">
          <div>
            <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
          </div>

          <div className="flex-1  border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* -------- Doctor Info : name, degree and experience  --------- */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">{docInfo.name} <img className="w-5" src={assets.verified_icon} alt="" /></p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
            </div>

            {/* -------- Book Appointment Button --------- */}
            <div >
              <p className="flex items-center gap-1 text-sm font-medium mt-3 text-gray-900">About <img className="w-3" src={assets.info_icon} alt="" /></p>
              <p className="text-sm text-gray-500 max-e-[700px] mt-1">{docInfo.about}</p>
            </div>
            <p className="text-gray-500 font-medium mt-4">Appointment Fee: <span className="text-gray-900">{currenySymbol}{docInfo.fees}</span></p>
          </div>
        </div>

        {/* Booking Timeframe */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slot</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {
              doctorSlot.length && doctorSlot.map((item, index) => (
                <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-24 rounded-[25%] cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>

          
          <div className="flex items-center gap-3 mt-4 w-full overflow-x-scroll">
            {
              doctorSlot.length && doctorSlot[slotIndex].map((item, index)=> (
                <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shirnk- px-8 py-2 cursor-pointer rounded-full ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                  {item.time.toLowerCase()}
                </p>
        
              ))
            }
          </div>
          <button className="bg-primary text-white text-sm px-14 py-3 rounded-full my-6">Book an appointment</button>
        </div>

        {/* ------ Listing Related Doctors ------------ */}
      
        <RelatedDoctors docId={docId} speciality = {docInfo.speciality}/>






    </div>
  )
}


export default Appointment