import React,{useEffect,useState} from 'react'
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import {AiOutlineEdit} from 'react-icons/ai';
import {BsInfoCircle} from 'react-icons/bs';
import {MdOutlineAddBox,MdOutlineDelete} from 'react-icons/md';

const HomeSaveMe = () => {
    const [saveMes,setSaveMes]=useState([]);
    const[loading,setLoading]=useState(false);
    useEffect(()=>{
        setLoading(true);
        axios.get('http://localhost:5555/saveMes').then((response)=>{
            setSaveMes(response.data.data);
            setLoading(false);
        }).catch((error)=>{
            console.log(error);
            setLoading(false);
        });
    },[]);

  return (
    <div className='p-4'>
        <div className="flex justify-between items-center">
            <h1 className='text-3xl my-8'>SaveMe List</h1>
            <Link to='/saveMes/create'>
                <MdOutlineAddBox className='text-sky-800 text-4xl'/>
            </Link>
        </div>
        {loading ?(
            <Spinner/>
        ):(
            <table className='w-full border-separate border-spacing-2'>
                <thead>
                    <tr>
                        <th className='border border-slate-600 rounded-md'></th>
                        <th className='border border-slate-600 rounded-md'></th>
                        <th className='border border-slate-600 rounded-md max-md:hidden'>
                            Contact
                        </th>
                        <th className='border border-slate-600 rounded-md max-md:hidden'>
                            Location
                        </th>
                        <th className='border border-slate-600 rounded-md'>Operations</th>
                    </tr> 
                </thead> 
                <tbody>
                    {saveMes.map((saveMe,index)=>(
                        <tr key={saveMe._id} className='h-8'>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {index+1}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                {saveMe.name}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                                {saveMe.contact}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                                {saveMe.location}
                            </td>
                            <td className='border border-slate-700 rounded-md text-center'>
                                <div className='flex justify-center gap-x-4'>
                                    <Link to={`/saveMes/details/${saveMe._id}`}>
                                        <BsInfoCircle className='text-2xl text-green-800'/>
                                    </Link>
                                    <Link to={`/saveMes/edit/${saveMe._id}`}>
                                        <AiOutlineEdit className='text-2xl text-yellow-600'/>
                                    </Link>
                                    <Link to={`/saveMes/delete/${saveMe._id}`}>
                                        <MdOutlineDelete className='text-2xl text-red-600'/>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
  )
}

export default Home