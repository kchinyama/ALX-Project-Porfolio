'use client'

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React from 'react'

const Table = ({ title, description }: { title: string; 
  description: string }) => (
  <div className='flex flex-col items-start gap-2
  xl:flex-row'>
    <h1 className='text-base font-medium
    text-sky-1 lg:text-xl xl:min-w-32'>{title}:</h1>
    <h1 className='truncate text-sm font-bold
    max-sm:max-w-[320px] lg:text-xl'>{description}</h1>
  </div>
)

const PersonalMeetingRoom = () => {
  const { user } = useUser();
  const meetingID = user?.id

  const meetingLink = `${process.env.
    NEXT_PUBLIC_BASE_URL}/meeting/${meetingID}?
    personal=true`

  const client = useStreamVideoClient();

  const router = useRouter();

  const { call } = useGetCallById(meetingID!);

  const startConferenceRoom = async () => {
    if(!client || !user) return;
  
    if(!call) {
      const newCall = client.call('default', meetingID!)

      await newCall.getOrCreate({
        data: {
            starts_at: new Date().toISOString(),
        }
    })
  }
  router.push(`/meeting/${meetingID}?personal=true`)
}

  const { toast } = useToast();

  return (
    <section className='flex size-full flex-col gap-10
    text-white'>
      <h1 className='text-3xl font-bold'>
        Personal Conference Room
      </h1>

      <div className='flex w-full flex-col gap-8
      xl:max-w-[900px]'>
        <Table title='Topic' 
        description={`${user?.username}'s conference room`} />

        <Table title='Conference Meeting ID' 
        description={meetingID!} />

        <Table title='Invite Link' 
        description={meetingLink} />
      </div>

      <div className='flex gap-5'>
        <Button className='bg-blue-700' onClick={startConferenceRoom}>
            Start Conference
        </Button>
        <Button className='bg-dark-2' onClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({
            title: "Link Copied",
          });
        }}>
            Copy Invitation
        </Button>
      </div>

    </section>
  )
}


export default PersonalMeetingRoom