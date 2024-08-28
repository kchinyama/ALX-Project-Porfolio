'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"


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
            ('isJoiningConference')
        }
        className='bg-blue-1'
        />
        <HomeCard 
        img='/icons/recordings.svg'
        title='View Recordings'
        description='Previous Conferences'
        handleClick={() => setMeetingState
            ('isJoiningConference')
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

        <MeetingModel
        isOpen={meetingState === 'isInstantConference'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Conference"
        className='text-center'
        buttonText='Start Conference'
        handleClick={createConference} 
        />
    </section>
  )
}

export default MeetingTypeList