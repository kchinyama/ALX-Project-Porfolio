import { cn } from '@/lib/utils'
import { CallControls, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react'


type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'


const MeetingRoom = () => {
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left')

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />

            case 'speaker-right':
                return <SpeakerLayout
                    participantsBarPosition='left' />

            default:
                return <SpeakerLayout
                    participantsBarPosition='right' />
        }
    }

    const [showParticpants, setShowParticipants] = useState(false)

    return (
        <section className='relative h-screen w-full
    overflow-hidden pt-4 text-white'>
            <div className='relative flex size-full
    items-center justify-center'>
                <div className='flex size-full max-w-[1000px]
        items-center'>
                    <CallLayout />
                </div>
                <div className={cn('h-[calc(100vh-86px)] hidden ml-2',
                    { 'show-block': showParticpants })}>
                    <CallParticipantsList onClose={() =>
                        setShowParticipants(false)
                    } />

                </div>
            </div>
            <div className='fixed bottom-0 flex w-full items-center
    justify-center gap-5'>
                <CallControls />

                <DropdownMenu>

                    <div className='flex items-center'>
                    <DropdownMenuTrigger
                    className='cursor-pointer rounded-2xl
                    bg-[#1a2128] px-4 py-2 hover: bg-[#4c535b]'
                    >
                        <LayoutList 
                        size={20}
                        className='text-white'
                        />
                    </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent className='border-dark-1
                    bg-dark-1 text-white'>
                        {['Grid', 'Speaker-Right', 
                        'Speaker-Left'].map((item, index) => (
                            <div key={index}>
                                <DropdownMenuItem
                                className='cursor-pointer'
                                onClick={() => {
                                    setLayout(item.toLowerCase() as
                                CallLayoutType)
                                }}>
                                    {item}
                                </DropdownMenuItem>
                            </div>
                        ))}
                        <DropdownMenuSeparator
                        className='border-dark-1' />
                    </DropdownMenuContent>
                </DropdownMenu>

                <CallStatsButton />
                <button onClick={() => setShowParticipants
                    ((prev) => !prev)
                }>
                    <div className='cursor-pointer rounded
                    bg-[#1a2128] px-4 py-2 hover: bg-[#4c535b]'>
                        <Users size={20} className='text-white'></Users>
                    </div>
                </button>

            </div>
        </section>
    )
}

export default MeetingRoom