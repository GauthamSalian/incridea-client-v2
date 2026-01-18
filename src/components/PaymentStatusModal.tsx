import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { Check, X, Loader2 } from 'lucide-react'
import { verifyPayment } from '../api/registration'

interface PaymentStatusModalProps {
  isOpen: boolean
  onClose: () => void
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  pid?: string | null
  onVerificationResult?: (result: { success: boolean; pid?: string }) => void
}

const SlotMachineText = ({ 
  text, 
  duration = 2000, 
  isActive 
}: { 
  text: string
  duration?: number
  isActive: boolean
}) => {
  const [displayText, setDisplayText] = useState(text.split('').map(() => '0'))
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  useEffect(() => {
    if (!isActive) return

    const startTime = Date.now()
    const textArray = text.split('')
    
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime
      const progress = Math.min(elapsedTime / duration, 1) // 0 to 1
      
      const newDisplayText = textArray.map((targetChar, index) => {
        // Calculate the "lock time" for this specific character
        // We want characters to lock sequentially from left to right
        const charLockThreshold = (index + 1) / textArray.length
        
        if (progress >= charLockThreshold) {
          return targetChar
        }
        
        // Random character while spinning
        return characters[Math.floor(Math.random() * characters.length)]
      })

      setDisplayText(newDisplayText)

      if (progress === 1) {
        clearInterval(interval)
      }
    }, 50) // Update every 50ms

    return () => clearInterval(interval)
  }, [text, isActive, duration])

  return (
    <div className="flex gap-1 justify-center">
      {displayText.map((char: string, index: number) => (
        <div 
          key={index} 
          className="relative overflow-hidden w-8 h-12 flex items-center justify-center bg-slate-800 border-2 border-slate-700 rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
        >
          {/* Gradient overlay for "glass" effect */}
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
          
          <span className="font-mono text-2xl font-bold text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
            {char}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function PaymentStatusModal({
  isOpen,
  onClose,
  status,
  pid,
  onVerificationResult,
}: PaymentStatusModalProps) {
  // Use a ref to prevent double verification if component re-renders
  const verificationAttempted = useRef(false)

  const [processingMessage, setProcessingMessage] = useState('Verifying Payment...')
  
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>

    if (isOpen && status === 'PENDING') {
      const pollStatus = async () => {
        try {
          const verificationResponse = await verifyPayment()
          
          if (verificationResponse.status === 'success' && verificationResponse.pid) {
             onVerificationResult?.({ success: true, pid: verificationResponse.pid })
             return true // Stop polling
          } else if (verificationResponse.status === 'failed') {
             onVerificationResult?.({ success: false }) 
             return true
          } else {
             // Update message based on step
             const step = verificationResponse.processingStep
             if (step === 'GENERATING_RECEIPT') setProcessingMessage('Generating Payment Receipt...')
             else if (step?.startsWith('GENERATING_RECEIPT_RETRY')) setProcessingMessage('Retrying Receipt Generation...')
             else if (step === 'SAVING_RECEIPT') setProcessingMessage('Saving Receipt to Profile...')
             else if (step === 'GENERATING_PID') setProcessingMessage('Generating your Secret PID...')
             else setProcessingMessage('Verifying Payment Details...')
             
             return false // Continue polling
          }
        } catch (error) {
          console.error(error)
          return false
        }
      }

      // Initial check
      pollStatus()
      
      // Poll every 1s
      intervalId = setInterval(async () => {
        const stop = await pollStatus()
        if (stop) clearInterval(intervalId)
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [isOpen, status, onVerificationResult])

  // Reset ref when modal closes
  useEffect(() => {
    if (!isOpen) {
      verificationAttempted.current = false
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && status === 'SUCCESS') {
      const end = Date.now() + 3 * 1000

      const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

      ;(function frame() {
        if (!isOpen) return
        
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      })()
    }
  }, [isOpen, status])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {
        // Prevent closing while verifying
        if (status !== 'PENDING') onClose()
      }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  {status === 'PENDING' && (
                    <div className="rounded-full bg-slate-800 p-3">
                      <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                    </div>
                  )}

                  {status === 'SUCCESS' && (
                    <div className="rounded-full bg-green-500/10 p-3 ring-1 ring-green-500/50">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                  )}

                  {status === 'FAILED' && (
                    <div className="rounded-full bg-red-500/10 p-3 ring-1 ring-red-500/50">
                      <X className="h-8 w-8 text-red-500" />
                    </div>
                  )}

                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    {status === 'PENDING' && processingMessage}
                    {status === 'SUCCESS' && 'Welcome to Incridea!'}
                    {status === 'FAILED' && 'Payment Verification Failed'}
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-slate-400">
                      {status === 'PENDING' &&
                        'Please do not close this window while we set up your profile.'}
                      {status === 'SUCCESS' && (
                        <div className="flex flex-col items-center">
                          Congratulations! You have successfully registered.
                          <div className="mt-1 mb-2">Your PID is:</div>
                          <div className="mt-3">
                            <SlotMachineText 
                              text={pid || 'UNKNOWN'} 
                              isActive={true} 
                            />
                          </div>
                        </div>
                      )}
                      {status === 'FAILED' &&
                        'Your payment might have failed or is still pending. If money was deducted, please wait for a few minutes or contact support.'}
                    </p>
                  </div>

                  <div className="mt-4 w-full">
                    <button
                      type="button"
                      disabled={status === 'PENDING'}
                      className="inline-flex w-full justify-center rounded-lg border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={onClose}
                    >
                      {status === 'SUCCESS' ? 'Continue' : 'Close'}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
