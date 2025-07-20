'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function VoiceAssistant() {
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef<any>(null)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition =
                (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition

            if (!SpeechRecognition) {
                alert('Your browser does not support Speech Recognition.')
                return
            }

            const recognition = new SpeechRecognition()
            recognition.lang = 'en-US'
            recognition.interimResults = false
            recognition.continuous = false

            recognition.onstart = () => setIsListening(true)
            recognition.onend = () => setIsListening(false)

            recognition.onresult = (event: any) => {
                const text = event.results[0][0].transcript.toLowerCase()
                handleVoiceCommand(text)
            }

            recognitionRef.current = recognition
        }
    }, [])

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop()
        } else {
            recognitionRef.current?.start()
        }
    }

    const handleVoiceCommand = (command: string) => {
        let reply = ''

        if (command.includes('yoga')) {
            reply = 'Opening yoga dashboard.'
            router.push('/yoga')
        } else if (command.includes('sleep')) {
            reply = 'Showing sleep analyzer.'
            router.push('/sleep-analyzer')
        } else if (command.includes('meditation')) {
            reply = 'Launching meditation tutorials.'
            router.push('/meditation')
        } else if (command.includes('skin')) {
            reply = 'Opening skin condition checker.'
            router.push('/skin-analyzer')
        } else if (command.includes('reminder')) {
            reply = 'Opening your medication reminders.'
            router.push('/medication-reminder')
        } else {
            reply = 'Sorry, I didn’t understand that.'
        }

        speak(reply)
    }

    const speak = (text: string) => {
        const synth = window.speechSynthesis
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        synth.speak(utterance)
    }

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <button
                onClick={toggleListening}
                className={`cursor-pointer flex items-center justify-center p-4 rounded-full shadow-md transition-all duration-300
                ${isListening ? 'bg-gray-800' : 'bg-gray-500'} text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white`}
            >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
        </div>
    )
}
