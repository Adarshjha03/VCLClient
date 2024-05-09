import React from 'react';
import { heroImg } from '../assets';
import  {AiOutlineSearch} from 'react-icons/ai'

const Hero = () => {
  return (
    <div className='w-full bg-transparent py-24'>
        <div className='md:max-w-[1480px] m-auto grid md:grid-cols-2 max-w-[600px]  px-4 md:px-0'>
            
            <div className='flex flex-col justify-start gap-4'>
                <p className='py-2 text-2xl text-white font-medium'>START TO SUCCESS</p>
                <h1 className='py-2 text-5xl  text-white font-semibold'>Access To <span className='text-yellow-100'>Virtual Labs</span> And <span  className='text-yellow-100'>300+</span> Problems
                   on  Cybersecurity Topics.
                </h1>
                
                <form className='bg-white border m-10 max-w-[500px] p-4 input-box-shadow rounded-md flex justify-between'>
                    <input 
                        className='bg-white'
                        type="text"
                        placeholder='What do want to learn?'
                    />
                    <button>
                        <AiOutlineSearch 
                            size={20}
                            className="icon"
                            style={{color:'#000'}}

                        />

                    </button>
                </form>
            </div>
            
          



        </div>
        

    </div>
  )
}

export default Hero