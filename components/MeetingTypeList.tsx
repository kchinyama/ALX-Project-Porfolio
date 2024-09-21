'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input'


const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] = 
    useState<'isScheduledConference' | 'isJoiningConference' | 
    'isInstantConference' | undefined>()

    const { user } = useUser();
    const client = useStreamVideoClient();

    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    })
    const [callDetails, setCallDetails] = useState<Call>();
    const { toast } = useToast()

    const createConference = async () => {
        if(!client || !user) return;

        try {
            if(!values.dateTime) {
                toast({title: "Please select a date and time",})
                return;
            }
            const id = crypto.randomUUID();
            const call = client.call('default', id)

            if(!call) throw new Error('Failure to generate a conference call');


            const startsAt = values.dateTime.toISOString() ||
            new Date(Date.now()).toISOString();

            const description = values.description ||
            'Instant Conference';

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })

            setCallDetails(call);

            if(!values.description) {
                router.push(`/meeting/${call.id}`)
            }

            toast({title: "Conference successfully generated",})

        } catch (error) {
            console.log(error);
            toast({
                title: "Sorry, Conference Failed to be created",
              })
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`


  return (
    <section className='grid grid-cols-1 gap-5
    md:grid-cols-2 xl:grid-cols-4'>

        <HomeCard 
        img='/icons/add-meeting.svg'
        title='New Conference'
        description='Start a New Conference'
        handleClick={() => setMeetingState
            ('isInstantConference')
        }
        className='bg-orange-1'
        />
        <HomeCard 
        img='/icons/schedule.svg'
        title='Plan Conference'
        description='Plan Your Conference'
        handleClick={() => setMeetingState
            ('isScheduledConference')
        }
        className='bg-blue-1'
        />
        <HomeCard 
        img='/icons/recordings.svg'
        title='View Recordings'
        description='Previous Conferences'
        handleClick={() => router.push(`/recordings`)
        }
        className='bg-purple-1'
        />
        <HomeCard 
        img='/icons/join-meeting.svg'
        title='Join Conference'
        description='Join via Link'
        handleClick={() => setMeetingState('isJoiningConference')
        }
        className='bg-red-1'
        />

        {!callDetails ? (
          <MeetingModel
            isOpen={meetingState === 'isScheduledConference'}
            onClose={() => setMeetingState(undefined)}
            title='Schedule a Conference'
            handleClick={createConference}
           >
            <div className='flex flex-col gap-2.5'>
                <label className='text-base text-normal leading-[22px]
                text-sky-2'>Add a Conference Description</label>
                <Textarea className='border-none bg-dark-2
                focus-visible:ring-0 focus-visible:ring-offset-0'
                onChange={(e) => {
                    setValues({...values, description: e.target.value})
                }} />
            </div>
            <div className='flex w-full flex-col gap-2.5'>
            <label className='text-base text-normal leading-[22px]
                text-sky-2'>Select Date and Time</label>
                <ReactDatePicker 
                selected={values.dateTime}
                onChange={(date) => setValues({...values, dateTime: date! })}
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={15}
                timeCaption='time'
                dateFormat='MMMM d, yyyy h:mm aa'
                className='w-full rounded bg-dark-2 p-2
                focus:outline-none'/>          
            </div>

            </MeetingModel>
        ) : (

            <MeetingModel
            isOpen={meetingState === 'isScheduledConference'}
            onClose={() => setMeetingState(undefined)}
            title='Conference Created Successfully'
            className='text-center'
            handleClick={() => {
                navigator.clipboard.writeText(meetingLink);
                toast({ title: 'Link Copied'})
            }}
            image='/icons/checked.svg'
            buttonIcon='/icons/copy.svg'
            buttonText='Copy Conference Link'
            />
        )}

        <MeetingModel
        isOpen={meetingState === 'isInstantConference'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Conference"
        className='text-center'
        buttonText='Start Conference'
        handleClick={createConference} 
        />

        <MeetingModel
        isOpen={meetingState === 'isJoiningConference'}
        onClose={() => setMeetingState(undefined)}
        title="Paste/Type in the Conference Link"
        className='text-center'
        buttonText='Join Conference'
        handleClick={() => router.push(values.link)} 
        >
            <Input
            placeholder='Meeting Link'
            className='border-none bg-dark-2 focus-visible:ring-offset-0
            focus-visible: ring-0'
            onChange={(e) => setValues({ ...values, link:
                e.target.value
            })}
            />
        </MeetingModel>

    </section>
  )
}

export default MeetingTypeList