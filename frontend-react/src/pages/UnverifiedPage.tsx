import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'
import React from 'react'

const UnverifiedPage = () => {
  return (
    <>
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Verify your email!</AlertTitle>
            <AlertDescription>
                We have a sent an email to - to verify your email address and activate your account.
                
                 Click here if you did not receive an emaul or would like to change the email address you signedup with
            </AlertDescription>
        </Alert>

    </>
  )
}

export default UnverifiedPage